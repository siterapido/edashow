import { getPosts, getImageUrl } from '@/lib/payload/api'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const metadata = {
  title: 'Todos os Posts | EdaShow',
  description: 'Confira todas as notícias e artigos do EdaShow',
}

export default async function PostsPage() {
  const posts = await getPosts({ 
    limit: 50, 
    status: 'published',
    revalidate: 60 
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Todas as Notícias</h1>
          <p className="text-xl text-muted-foreground">
            Fique por dentro de tudo que acontece no setor de saúde
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhum post publicado ainda.
            </p>
            <p className="text-sm text-muted-foreground">
              Acesse <Link href="/admin" className="text-primary hover:underline">/admin</Link> para criar seu primeiro post.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <Link href={`/posts/${post.slug}`} key={post.id}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                  {post.featuredImage ? (
                    <div className="relative h-48 w-full">
                      <Image
                        src={getImageUrl(post.featuredImage, 'card')}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-gray-400">Notícia</span>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        {post.category === 'news' && 'Notícias'}
                        {post.category === 'analysis' && 'Análises'}
                        {post.category === 'interviews' && 'Entrevistas'}
                        {post.category === 'opinion' && 'Opinião'}
                      </span>
                      {post.featured && (
                        <span className="text-yellow-500">⭐</span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    {post.publishedDate && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={post.publishedDate}>
                          {format(new Date(post.publishedDate), 'dd/MM/yyyy', { locale: ptBR })}
                        </time>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}










