import { getPosts, getEvents, getColumnists, getImageUrl } from '@/lib/payload/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, MapPin } from 'lucide-react'
import Image from 'next/image'

// Imagens de exemplo para eventos
const eventExampleImages = [
  "/conference-healthcare-panel.jpg",
  "/workshop-business-meeting.jpg",
  "/healthcare-launch-event.jpg",
  "/award-ceremony-healthcare.jpg",
  "/corporate-event-celebration.png",
  "/healthcare-award-ceremony.jpg",
  "/odont-award-ceremony.jpg",
]

// Função para garantir que eventos sempre tenham uma imagem de exemplo
function ensureEventImage(event: any, index: number): any {
  if (!event.image) {
    // Usa uma imagem de exemplo baseada no índice do evento
    const imageIndex = index % eventExampleImages.length
    return {
      ...event,
      image: eventExampleImages[imageIndex]
    }
  }
  return event
}

export const dynamic = 'force-dynamic'

export default async function CMSExamplePage() {
  // Buscar dados do PayloadCMS
  const posts = await getPosts({ limit: 6, featured: true })
  const events = await getEvents({ limit: 3 })
  const columnists = await getColumnists({ limit: 4 })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Exemplo de Integração com PayloadCMS
          </h1>
          <p className="text-muted-foreground text-lg">
            Esta página demonstra como buscar e exibir dados do CMS
          </p>
        </div>

        {/* Posts em Destaque */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Posts em Destaque</h2>
          {posts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  Nenhum post encontrado. Acesse{' '}
                  <a href="/admin" className="text-primary hover:underline">
                    /admin
                  </a>{' '}
                  para criar seu primeiro post.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: any) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {post.featuredImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={getImageUrl(post.featuredImage, 'card')}
                        alt={post.featuredImage.alt || post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                        {post.category}
                      </span>
                      {post.publishedDate && (
                        <span>
                          {new Date(post.publishedDate).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    {post.excerpt && (
                      <CardDescription className="line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>
                  {post.author && (
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={getImageUrl(post.author.photo, 'thumbnail')}
                            alt={post.author.name}
                          />
                          <AvatarFallback>
                            {post.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <p className="font-medium">{post.author.name}</p>
                          {post.author.role && (
                            <p className="text-muted-foreground text-xs">
                              {post.author.role}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Eventos Próximos */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Próximos Eventos</h2>
          {events.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  Nenhum evento encontrado. Acesse{' '}
                  <a href="/admin" className="text-primary hover:underline">
                    /admin
                  </a>{' '}
                  para criar seu primeiro evento.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event: any, index: number) => {
                // Garante que sempre há uma imagem de exemplo
                const eventWithImage = ensureEventImage(event, index)
                const imageUrl = typeof eventWithImage.image === 'string' 
                  ? eventWithImage.image 
                  : getImageUrl(eventWithImage.image, 'card')
                
                return (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 w-full">
                    <Image
                      src={imageUrl}
                      alt={typeof eventWithImage.image === 'object' && eventWithImage.image?.alt ? eventWithImage.image.alt : event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                    <CardDescription className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(event.startDate).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.eventType && (
                        <span className="inline-block px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                          {event.eventType === 'in-person'
                            ? 'Presencial'
                            : event.eventType === 'online'
                            ? 'Online'
                            : 'Híbrido'}
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                </Card>
                )
              })}
            </div>
          )}
        </section>

        {/* Colunistas */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Nossos Colunistas</h2>
          {columnists.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  Nenhum colunista encontrado. Acesse{' '}
                  <a href="/admin" className="text-primary hover:underline">
                    /admin
                  </a>{' '}
                  para adicionar colunistas.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {columnists.map((columnist: any) => (
                <Card key={columnist.id} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={getImageUrl(columnist.photo, 'thumbnail')}
                          alt={columnist.name}
                        />
                        <AvatarFallback className="text-2xl">
                          {columnist.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle className="text-lg">{columnist.name}</CardTitle>
                    {columnist.role && (
                      <CardDescription>{columnist.role}</CardDescription>
                    )}
                  </CardHeader>
                  {columnist.bio && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {columnist.bio}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Instruções */}
        <section>
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Como usar o PayloadCMS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Acesse o painel admin</h3>
                <p className="text-muted-foreground">
                  Visite{' '}
                  <a
                    href="/admin"
                    className="text-primary hover:underline font-medium"
                  >
                    /admin
                  </a>{' '}
                  para acessar o painel de administração do CMS.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Crie seu primeiro usuário</h3>
                <p className="text-muted-foreground">
                  Na primeira vez, você será solicitado a criar um usuário administrador.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Adicione conteúdo</h3>
                <p className="text-muted-foreground">
                  Crie posts, eventos, colunistas e configure as opções do site.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">4. Veja a documentação</h3>
                <p className="text-muted-foreground">
                  Leia o arquivo{' '}
                  <code className="bg-muted px-2 py-1 rounded">PAYLOAD_README.md</code>{' '}
                  para mais informações sobre como usar o CMS.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}













