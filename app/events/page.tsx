import { getEvents } from '@/lib/supabase/api'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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
  if (!event.image_url) {
    // Usa uma imagem de exemplo baseada no índice do evento
    const imageIndex = index % eventExampleImages.length
    return {
      ...event,
      image_url: eventExampleImages[imageIndex]
    }
  }
  return event
}

export const metadata = {
  title: 'Todos os Eventos | EdaShow',
  description: 'Confira todos os eventos do setor de saúde',
}

export default async function EventsPage() {
  const events = await getEvents({
    limit: 50,
    status: 'upcoming'
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Todos os Eventos</h1>
          <p className="text-xl text-muted-foreground">
            Participe dos principais eventos do setor de saúde
          </p>
        </header>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhum evento próximo no momento.
            </p>
            <p className="text-sm text-muted-foreground">
              Acesse <Link href="/cms" className="text-primary hover:underline">o CMS</Link> para criar eventos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: any, index: number) => {
              const eventDate = new Date(event.event_date || event.date)

              if (isNaN(eventDate.getTime())) {
                console.error(`Invalid date for event: ${event.id}`)
                return null
              }

              const day = format(eventDate, 'dd')
              const month = format(eventDate, 'MMM', { locale: ptBR }).toUpperCase()

              // Garante que sempre há uma imagem de exemplo
              const eventWithImage = ensureEventImage(event, index)
              const imageUrl = event.cover_image_url || eventWithImage.image_url

              return (
                <div key={event.id}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all h-full flex flex-col group">
                    <div className="relative">
                      <div className="relative w-full h-48">
                        <Image
                          src={imageUrl}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute top-3 left-3 bg-white text-center p-2 rounded-lg shadow-md border-2 border-primary/30">
                        <div className="text-2xl font-bold text-primary">{day}</div>
                        <div className="text-xs uppercase font-semibold text-gray-600">{month}</div>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-2">
                        {event.status === 'upcoming' && (
                          <Badge className="bg-green-500 text-white">
                            Próximo
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>

                      <div className="space-y-2 text-xs text-gray-600 mb-4 flex-1">
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                          <span>
                            {format(eventDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                            <span className="line-clamp-2">{event.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button asChild variant="outline" className="flex-1 text-sm bg-primary/5 hover:bg-primary hover:text-white border-primary/20 transition-colors">
                          <Link href={`/events/${event.slug}`}>
                            Ver Detalhes
                          </Link>
                        </Button>
                        {event.registration_url && (
                          <Button asChild className="flex-1 text-sm font-bold shadow-md shadow-primary/20">
                            <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                              Inscrever-se
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

