import { HeroSection } from "@/components/hero-section"
import { SponsorCarousel } from "@/components/sponsor-carousel"
import { EditorialBlock, CardType } from "@/components/editorial-block"
import { Footer } from "@/components/footer"
import { Newsletter } from "@/components/newsletter"
import { Events } from "@/components/events"
import { LatestNews } from "@/components/latest-news"
import BannerDisplay from "@/components/BannerDisplay"
import { getPosts, getSponsors, getImageUrl, getEvents } from "@/lib/supabase/api"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

// Função auxiliar para converter posts do Supabase para cards do EditorialBlock
function postsToCards(posts: any[]): Array<{
  type: CardType
  title: string
  excerpt?: string
  image: string
  category: string
  author?: string
  date?: string
  featured?: boolean
  slug?: string
}> {
  return posts.map((post) => {
    const cardType: CardType = post.category?.slug === 'opiniao' ? 'opinion' :
      post.category?.slug === 'analise' ? 'article' : 'news'

    return {
      type: cardType,
      title: post.title,
      excerpt: post.excerpt || '',
      image: post.cover_image_url || (post.featured_image ? post.featured_image.url : '/placeholder.jpg'),
      category: post.category?.name || 'Notícias',
      author: post.author?.name,
      date: post.published_at
        ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true, locale: ptBR })
        : undefined,
      featured: post.featured_home,
      slug: post.slug,
    }
  })
}

export default async function HomePage() {
  // Buscar posts publicados do Supabase
  const allPosts = await getPosts({
    limit: 20,
    status: 'published'
  })

  // Buscar posts em destaque para o Hero Section
  const featuredPosts = await getPosts({
    limit: 4,
    status: 'published',
    featured: true
  })

  // Se não houver posts em destaque, usar os mais recentes
  const heroPosts = featuredPosts.length > 0
    ? featuredPosts
    : allPosts.slice(0, 4)

  // Buscar patrocinadores
  const sponsors = await getSponsors({
    active: true
  })

  // Buscar eventos
  const events = await getEvents({
    limit: 3,
    status: 'upcoming'
  })



  // Separar posts por categoria
  const politicaPosts = allPosts
    .filter((post: any) =>
      post.category?.slug === 'politica' ||
      post.tags?.some((tag: string) =>
        tag.toLowerCase().includes('política') ||
        tag.toLowerCase().includes('regulação') ||
        tag.toLowerCase().includes('ans')
      )
    )
    .slice(0, 4)

  const tecnologiaPosts = allPosts
    .filter((post: any) =>
      post.category?.slug === 'tecnologia' ||
      post.tags?.some((tag: string) =>
        tag.toLowerCase().includes('tecnologia') ||
        tag.toLowerCase().includes('inovação') ||
        tag.toLowerCase().includes('digital')
      )
    )
    .slice(0, 4)

  // Sempre usar posts do banco quando disponíveis, mesmo que sejam poucos
  const politicaPostIds = new Set(politicaPosts.map((p: any) => p.id))
  const tecnologiaPostIds = new Set(tecnologiaPosts.map((p: any) => p.id))

  const politicaCards = politicaPosts.length > 0
    ? postsToCards(politicaPosts.length >= 4 ? politicaPosts : [...politicaPosts, ...allPosts.filter((p: any) => !politicaPostIds.has(p.id))].slice(0, 4))
    : allPosts.length > 0
      ? postsToCards(allPosts.slice(0, 4))
      : []

  const tecnologiaCards = tecnologiaPosts.length > 0
    ? postsToCards(tecnologiaPosts.length >= 4 ? tecnologiaPosts : [...tecnologiaPosts, ...allPosts.filter((p: any) => !tecnologiaPostIds.has(p.id))].slice(0, 4))
    : allPosts.length > 0
      ? postsToCards(allPosts.slice(4, 8))
      : []

  // Dados fallback caso não haja posts
  const fallbackPoliticaCards = [
    {
      type: "news" as CardType,
      title: "ANS define novas regras para portabilidade de carências",
      excerpt: "Medida visa facilitar a troca de planos para beneficiários em todo o país a partir do próximo mês.",
      image: "/regulatory-agency-logo.jpg",
      category: "Regulação",
      date: "Há 4 horas",
      slug: "ans-define-novas-regras-para-portabilidade-de-carencias"
    },
    {
      type: "news" as CardType,
      title: "Ministério da Saúde anuncia investimento recorde no SUS",
      excerpt: "Recursos serão destinados à digitalização e modernização de hospitais públicos.",
      image: "/modern-healthcare-building.jpg",
      category: "Governo",
      date: "Há 6 horas",
      slug: "ministerio-da-saude-anuncia-investimento-recorde-no-sus"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroSection posts={heroPosts} />

        {/* Banner Hero - Topo da Home */}
        <BannerDisplay location="home_hero" className="container mx-auto px-4 py-6" />

        <SponsorCarousel sponsors={sponsors} />
        <LatestNews initialPosts={allPosts.slice(0, 8)} />

        {/* Sempre usar posts do banco quando disponíveis, fallback apenas se não houver posts */}
        {allPosts.length > 0 ? (
          <>
            {politicaCards.length > 0 && (
              <EditorialBlock
                title="Política e Regulação"
                subtitle="Acompanhe as decisões que impactam o setor"
                ctaText="Ver cobertura completa"
                ctaLink="/posts"
                cards={politicaCards}
              />
            )}
            {tecnologiaCards.length > 0 && (
              <EditorialBlock
                title="Tecnologia e Inovação"
                subtitle="O futuro da saúde digital"
                ctaText="Explorar tecnologia"
                ctaLink="/posts"
                cards={tecnologiaCards}
              />
            )}
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-slate-500">Nenhum post encontrado no momento.</p>
          </div>
        )}

        <Events initialEvents={events} />

        {/* Banner Rodapé - Antes do Footer */}
        <BannerDisplay location="home_footer" className="container mx-auto px-4 py-6" />

        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}

