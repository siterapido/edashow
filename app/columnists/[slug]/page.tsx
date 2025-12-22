import { getColumnists, getColumnistBySlug, getPosts, getImageUrl } from '@/lib/payload/api'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

// Força renderização dinâmica para evitar erros de serialização durante build
export const dynamic = 'force-dynamic'
export const dynamicParams = true

interface ColumnistPageProps {
  params: {
    slug: string
  }
}

// Gerar páginas estáticas para colunistas existentes
export async function generateStaticParams() {
  const columnists = await getColumnists({ limit: 100 })
  
  return columnists.map((columnist: any) => ({
    slug: columnist.slug,
  }))
}

// Metadados da página
export async function generateMetadata({ params }: ColumnistPageProps) {
  const columnist = await getColumnistBySlug(params.slug)
  
  if (!columnist) {
    return {
      title: 'Colunista não encontrado',
    }
  }
  
  return {
    title: `${columnist.name} | EdaShow`,
    description: columnist.bio || `Confira os artigos de ${columnist.name}`,
    openGraph: {
      title: columnist.name,
      description: columnist.bio,
      images: columnist.photo ? [getImageUrl(columnist.photo)] : [],
    },
  }
}

export default async function ColumnistPage({ params }: ColumnistPageProps) {
  const columnist = await getColumnistBySlug(params.slug)
  
  if (!columnist) {
    notFound()
  }

  // Buscar posts do colunista
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  let columnistPosts = []
  
  try {
    const response = await fetch(
      `${API_URL}/api/posts?where[author][equals]=${columnist.id}&where[status][equals]=published&limit=20`,
      { next: { revalidate: 60 } }
    )
    if (response.ok) {
      const data = await response.json()
      columnistPosts = data.docs || []
    }
  } catch (error) {
    console.error('Error fetching columnist posts:', error)
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Botão Voltar */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header do Colunista */}
        <header className="mb-12 text-center">
          <Avatar className="h-32 w-32 mx-auto mb-6">
            {columnist.photo && (
              <AvatarImage 
                src={getImageUrl(columnist.photo)} 
                alt={columnist.name} 
              />
            )}
            <AvatarFallback className="text-4xl">
              {columnist.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{columnist.name}</h1>
          
          {columnist.role && (
            <p className="text-xl text-muted-foreground mb-6">{columnist.role}</p>
          )}
          
          {columnist.bio && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {columnist.bio}
            </p>
          )}
          
          {/* Redes Sociais */}
          {columnist.social && (
            <div className="flex justify-center gap-4 mt-6">
              {columnist.social.twitter && (
                <a 
                  href={columnist.social.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Twitter
                </a>
              )}
              {columnist.social.linkedin && (
                <a 
                  href={columnist.social.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {columnist.social.instagram && (
                <a 
                  href={columnist.social.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Instagram
                </a>
              )}
            </div>
          )}
        </header>

        {/* Artigos do Colunista */}
        <section>
          <h2 className="text-3xl font-bold mb-6">
            Artigos de {columnist.name.split(' ')[0]}
          </h2>
          
          {columnistPosts.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-lg">
              <p className="text-muted-foreground">
                Nenhum artigo publicado ainda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {columnistPosts.map((post: any) => (
                <Link href={`/posts/${post.slug}`} key={post.id}>
                  <Card className="p-4 hover:shadow-lg transition-shadow h-full">
                    {post.featuredImage && (
                      <div className="relative h-40 w-full mb-4 rounded overflow-hidden">
                        <Image
                          src={getImageUrl(post.featuredImage, 'card')}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}










