import { getPosts } from '@/lib/payload/api'
import { CategoryHero } from '@/components/category-hero'
import { CategoryPostsGrid } from '@/components/category-posts-grid'
import { CategorySidebar } from '@/components/category-sidebar'
import { Footer } from '@/components/footer'
import { getCategoryInfo } from '@/lib/categories'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notícias | EdaShow',
  description: 'Fique por dentro das principais notícias do setor de saúde',
}

export default async function NoticiasPage() {
  const category = 'news'
  const categoryInfo = getCategoryInfo(category)

  // Buscar post em destaque da categoria
  const featuredPosts = await getPosts({ 
    limit: 1,
    category,
    featured: true,
    status: 'published',
    revalidate: 60 
  })

  // Buscar todos os posts da categoria
  const allPosts = await getPosts({ 
    limit: 50,
    category,
    status: 'published',
    revalidate: 60 
  })

  // Post em destaque (primeiro featured ou primeiro post)
  const featuredPost = featuredPosts.length > 0 ? featuredPosts[0] : allPosts[0]

  // Posts para o grid (excluindo o featured)
  const gridPosts = featuredPost ? allPosts.filter(p => p.id !== featuredPost.id) : allPosts

  // Posts populares (usando featured como proxy)
  const popularPosts = allPosts.filter(p => p.featured).slice(0, 5)

  // Posts relacionados (mesma categoria, diferentes do featured)
  const relatedPosts = gridPosts.slice(0, 3)

  // Extrair tags únicas
  const allTags = allPosts
    .flatMap(post => post.tags || [])
    .map(tag => tag.tag)
    .filter((tag, index, self) => self.indexOf(tag) === index)
    .slice(0, 10)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {featuredPost && (
        <CategoryHero category={category} featuredPost={featuredPost} />
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Grid de Posts */}
          <div className="lg:col-span-3">
            <header className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Todas as {categoryInfo.label}
              </h2>
              <p className="text-lg text-muted-foreground">
                {categoryInfo.description}
              </p>
            </header>

            <CategoryPostsGrid 
              posts={gridPosts} 
              category={category}
              excludePostId={featuredPost?.id}
            />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <CategorySidebar
              category={category}
              popularPosts={popularPosts}
              relatedPosts={relatedPosts}
              tags={allTags}
            />
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  )
}








