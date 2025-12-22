import { HeroSection } from "@/components/hero-section"
import { SponsorCarousel } from "@/components/sponsor-carousel"
import { EditorialBlock, CardType } from "@/components/editorial-block"
import { Footer } from "@/components/footer"
import { Newsletter } from "@/components/newsletter"
import { Events } from "@/components/events"
import { LatestNews } from "@/components/latest-news"
import { getPosts, getSponsors, getImageUrl } from "@/lib/payload/api"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

// Função auxiliar para converter posts do Payload para cards do EditorialBlock
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
    const categoryMap: Record<string, string> = {
      news: 'Notícias',
      analysis: 'Análises',
      interviews: 'Entrevistas',
      opinion: 'Opinião',
    }

    const cardType: CardType = post.category === 'opinion' ? 'opinion' :
      post.category === 'analysis' ? 'article' : 'news'

    return {
      type: cardType,
      title: post.title,
      excerpt: post.excerpt || '',
      image: post.featuredImage ? getImageUrl(post.featuredImage, 'card') : '/placeholder.jpg',
      category: categoryMap[post.category] || 'Notícias',
      author: post.author?.name,
      date: post.publishedDate
        ? formatDistanceToNow(new Date(post.publishedDate), { addSuffix: true, locale: ptBR })
        : undefined,
      featured: post.featured,
      slug: post.slug,
    }
  })
}

export default async function HomePage() {
  // Buscar posts publicados do Payload CMS
  const allPosts = await getPosts({
    limit: 20,
    status: 'published',
    revalidate: 60
  })

  // Buscar posts em destaque para o Hero Section
  const featuredPosts = await getPosts({
    limit: 4,
    status: 'published',
    featured: true,
    revalidate: 60
  })

  // Se não houver posts em destaque, usar os mais recentes
  const heroPosts = featuredPosts.length > 0
    ? featuredPosts
    : allPosts.slice(0, 4)

  // Buscar patrocinadores
  const sponsors = await getSponsors({
    active: true,
    revalidate: 3600 // Cache por 1 hora
  })

  // Separar posts por categoria
  const politicaPosts = allPosts
    .filter((post: any) =>
      post.category === 'news' ||
      post.tags?.some((tag: any) =>
        tag.tag?.toLowerCase().includes('política') ||
        tag.tag?.toLowerCase().includes('regulação') ||
        tag.tag?.toLowerCase().includes('ans')
      )
    )
    .slice(0, 4)

  const tecnologiaPosts = allPosts
    .filter((post: any) =>
      post.category === 'analysis' ||
      post.tags?.some((tag: any) =>
        tag.tag?.toLowerCase().includes('tecnologia') ||
        tag.tag?.toLowerCase().includes('inovação') ||
        tag.tag?.toLowerCase().includes('digital')
      )
    )
    .slice(0, 4)

  // Sempre usar posts do banco quando disponíveis, mesmo que sejam poucos
  // Se não houver posts filtrados suficientes, usar os mais recentes do banco
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
    },
    {
      type: "news" as CardType,
      title: "Novas diretrizes para planos de saúde coletivos em 2026",
      excerpt: "Entenda o que muda para empresas e beneficiários com a nova resolução normativa.",
      image: "/business-man-professional.jpg",
      category: "Mercado",
      date: "Há 8 horas",
      slug: "novas-diretrizes-para-planos-de-saude-coletivos-em-2026"
    },
    {
      type: "news" as CardType,
      title: "Judicialização da saúde: novos precedentes do STJ",
      excerpt: "Decisões recentes trazem mais segurança jurídica para operadoras e usuários.",
      image: "/ans-building-court.jpg",
      category: "Jurídico",
      date: "Há 12 horas",
      slug: "judicializacao-da-saude-novos-precedentes-do-stj"
    }
  ]

  const fallbackTecnologiaCards = [
    {
      type: "news" as CardType,
      title: "IA Generativa revoluciona triagem em prontos-socorros",
      excerpt: "Hospitais de SP reportam redução de 30% no tempo de espera com novo sistema.",
      image: "/smartphone-health-app.jpg",
      category: "Inovação",
      date: "Há 2 horas",
      slug: "ia-generativa-revoluciona-triagem-em-prontos-socorros"
    },
    {
      type: "news" as CardType,
      title: "Telemedicina atinge marca de 10 milhões de atendimentos",
      excerpt: "Crescimento de 45% no último ano consolida modalidade no país.",
      image: "/business-executive-professional.jpg",
      category: "Digital",
      date: "Há 5 horas",
      slug: "telemedicina-atinge-marca-de-10-milhoes-de-atendimentos"
    },
    {
      type: "news" as CardType,
      title: "Wearables e monitoramento remoto de pacientes crônicos",
      excerpt: "Dispositivos conectados reduzem internações em até 25%, aponta estudo.",
      image: "/conference-healthcare-panel.jpg",
      category: "Tecnologia",
      date: "Há 1 dia",
      slug: "wearables-e-monitoramento-remoto-de-pacientes-cronicos"
    },
    {
      type: "news" as CardType,
      title: "Blockchain na gestão de prontuários eletrônicos",
      excerpt: "Segurança e interoperabilidade são os principais benefícios da tecnologia.",
      image: "/modern-building-ans.jpg",
      category: "Segurança",
      date: "Há 2 dias",
      slug: "blockchain-na-gestao-de-prontuarios-eletronicos"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroSection posts={heroPosts} />
        <SponsorCarousel sponsors={sponsors} />
        <LatestNews />

        {/* Sempre usar posts do banco quando disponíveis, fallback apenas se não houver posts */}
        {allPosts.length > 0 ? (
          <>
            {politicaCards.length > 0 && (
              <EditorialBlock
                title="Política e Regulação"
                subtitle="Acompanhe as decisões que impactam o setor"
                ctaText="Ver cobertura completa"
                ctaLink="/posts"
                cards={politicaCards.map(card => ({
                  ...card,
                  title: card.title,
                }))}
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
          <>
            <EditorialBlock
              title="Política e Regulação"
              subtitle="Acompanhe as decisões que impactam o setor"
              ctaText="Ver cobertura completa"
              ctaLink="/posts"
              cards={fallbackPoliticaCards}
            />
            <EditorialBlock
              title="Tecnologia e Inovação"
              subtitle="O futuro da saúde digital"
              ctaText="Explorar tecnologia"
              ctaLink="/posts"
              cards={fallbackTecnologiaCards}
            />
          </>
        )}

        <Events />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
