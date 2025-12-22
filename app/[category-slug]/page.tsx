import { getPosts, getCategoryBySlug } from '@/lib/payload/api'
import { CategoryHero } from '@/components/category-hero'
import { CategoryPostsGrid } from '@/components/category-posts-grid'
import { CategorySidebar } from '@/components/category-sidebar'
import { Footer } from '@/components/footer'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface CategoryPageProps {
    params: Promise<{
        'category-slug': string
    }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { 'category-slug': slug } = await params
    const category = await getCategoryBySlug(slug)

    if (!category) {
        return {
            title: 'Categoria não encontrada',
        }
    }

    return {
        title: `${category.name} | EdaShow`,
        description: category.description || `Veja todas as publicações em ${category.name}`,
    }
}

export default async function DynamicCategoryPage({ params }: CategoryPageProps) {
    const { 'category-slug': slug } = await params
    const category = await getCategoryBySlug(slug)

    if (!category) {
        notFound()
    }

    // Buscar todos os posts da categoria usando o ID do relacionamento
    const allPosts = await getPosts({
        limit: 50,
        category: category.id,
        status: 'published',
        revalidate: 60
    })

    // Buscar post em destaque específico da categoria se disponível, senão usa o mais recente featured
    const featuredPost = allPosts.find((p: any) => p.featured) || allPosts[0]

    // Posts para o grid (excluindo o featured)
    const gridPosts = featuredPost ? allPosts.filter((p: any) => p.id !== featuredPost.id) : allPosts

    // Posts populares (usando featured como proxy)
    const popularPosts = allPosts.filter((p: any) => p.featured).slice(0, 5)

    // Posts relacionados (mesma categoria, diferentes do featured)
    const relatedPosts = gridPosts.slice(0, 3)

    // Extrair tags únicas
    const allTags = allPosts
        .flatMap((post: any) => post.tags || [])
        .map((tag: any) => tag.tag)
        .filter((tag: any, index: number, self: any[]) => self.indexOf(tag) === index)
        .slice(0, 10)

    // Converter CMS Category para o formato esperado pelos componentes se necessário
    // Os componentes atuais parecem esperar o 'slug' (CategoryValue) das categorias hardcoded
    // Mas vamos tentar passar o slug dinâmico
    const categoryValue = category.slug

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            {featuredPost && (
                <CategoryHero category={categoryValue} featuredPost={featuredPost} />
            )}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Grid de Posts */}
                    <div className="lg:col-span-3">
                        <header className="mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold mb-2">
                                Todas as {category.name}
                            </h2>
                            {category.description && (
                                <p className="text-lg text-muted-foreground">
                                    {category.description}
                                </p>
                            )}
                        </header>

                        <CategoryPostsGrid
                            posts={gridPosts}
                            category={categoryValue}
                            excludePostId={featuredPost?.id}
                        />
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <CategorySidebar
                            category={categoryValue}
                            popularPosts={popularPosts}
                            relatedPosts={relatedPosts}
                            tags={allTags}
                        />
                    </aside>
                </div>
            </div>
        </div>
    )
}
