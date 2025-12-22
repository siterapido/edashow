"use client";

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getEvents, getImageUrl } from "@/lib/payload/api"
import { fallbackEvents } from "@/lib/fallback-data"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion } from "framer-motion"
import { container, fadeIn } from "@/lib/motion"
import { useEffect, useState } from "react"

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

interface EventsProps {
  initialEvents?: any[]
}

export function Events({ initialEvents = [] }: EventsProps) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (initialEvents.length > 0) {
      setEvents(initialEvents.map((event: any, index: number) => ensureEventImage(event, index)));
    } else {
      const fetchData = async () => {
        try {
          let data = await getEvents({
            limit: 3,
            status: 'upcoming',
            revalidate: 60
          });

          if (!data || data.length === 0) {
            data = fallbackEvents.slice(0, 3);
          } else {
            data = data.map((event: any, index: number) => ensureEventImage(event, index));
          }

          setEvents(data);
        } catch (e) {
          setEvents(fallbackEvents.slice(0, 3));
        }
      };
      fetchData();
    }
  }, [initialEvents]);

  return (
    <section className="w-full bg-gradient-to-r from-orange-500 to-amber-500 py-12 md:py-16">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="container mx-auto px-4"
      >
        <motion.h2 variants={fadeIn("up")} className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-white">
          Próximos eventos
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {events.map((event: any, index: number) => {
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/b23be4e3-a03c-4cb5-9aae-575cd428f4b6', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'components/events.tsx:108', message: 'Rendering event card', data: { eventId: event.id, eventTitle: event.title, eventSlug: event.slug, hasImage: !!event.image, imageType: typeof event.image, index }, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'B' }) }).catch(() => { });
            // #endregion
            const eventDate = new Date(event.startDate)
            const day = format(eventDate, 'dd')
            const month = format(eventDate, 'MMM', { locale: ptBR }).toUpperCase()

            // Garante que sempre há uma imagem de exemplo
            const eventWithImage = ensureEventImage(event, index)
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/b23be4e3-a03c-4cb5-9aae-575cd428f4b6', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'components/events.tsx:117', message: 'After ensureEventImage call', data: { originalImage: event.image, processedImage: eventWithImage.image, imageType: typeof eventWithImage.image }, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'B' }) }).catch(() => { });
            // #endregion
            const imageUrl = typeof eventWithImage.image === 'string'
              ? eventWithImage.image
              : getImageUrl(eventWithImage.image, 'card')
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/b23be4e3-a03c-4cb5-9aae-575cd428f4b6', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'components/events.tsx:123', message: 'Final imageUrl computed', data: { imageUrl, eventSlug: event.slug }, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'B' }) }).catch(() => { });
            // #endregion

            return (
              <motion.div
                key={event.id}
                variants={fadeIn("up", index * 0.1 + 0.2)}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link href={`/events/${event.slug}`} className="block h-full">
                  <Card className="overflow-hidden bg-white hover:shadow-2xl transition-all h-full flex flex-col border-0 shadow-lg group/card pt-0">
                    {/* Borda infinita apenas ao redor da imagem */}
                    <div className="relative p-[3px] rounded-t-xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-conic animate-[spin_3s_linear_infinite] opacity-80"></div>
                      <div className="relative w-full h-48 md:h-52 overflow-hidden rounded-t-xl bg-white">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          className="w-full h-full relative"
                        >
                          <Image
                            src={imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      </div>
                      <div className="absolute top-3 left-3 bg-white text-center p-1.5 px-2.5 rounded-lg shadow-md border-l-4 border-orange-500 z-10">
                        <div className="text-xl font-bold text-gray-900 leading-none mb-1">{day}</div>
                        <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider leading-none">{month}</div>
                      </div>
                    </div>
                    <CardContent className="p-4 md:p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-base md:text-lg mb-2 line-clamp-2 group-hover/card:text-orange-600 transition-colors text-gray-900">{event.title}</h3>

                      {event.description && (
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1 leading-relaxed">
                          {typeof event.description === 'string'
                            ? event.description
                            : 'Confira os detalhes do evento'}
                        </p>
                      )}

                      <div className="space-y-2 text-xs text-gray-500 mt-auto pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-full bg-orange-50 text-orange-500">
                            <Calendar className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium text-sm">
                            {format(eventDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            {event.endDate && ` - ${format(new Date(event.endDate), 'dd/MM/yyyy', { locale: ptBR })}`}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-full bg-orange-50 text-orange-500">
                              <MapPin className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-medium text-sm truncate">{event.location}</span>
                          </div>
                        )}
                      </div>

                      <Button
                        className="w-full mt-5 h-10 md:h-auto text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 shadow-sm transition-all duration-300 uppercase tracking-wide min-h-[44px]"
                        onClick={(e) => {
                          // #region agent log
                          fetch('http://127.0.0.1:7243/ingest/b23be4e3-a03c-4cb5-9aae-575cd428f4b6', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'components/events.tsx:184', message: 'Button clicked', data: { hasRegistrationUrl: !!event.registrationUrl, registrationUrl: event.registrationUrl, eventSlug: event.slug }, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'C' }) }).catch(() => { });
                          // #endregion
                          if (event.registrationUrl) {
                            e.preventDefault()
                            // #region agent log
                            fetch('http://127.0.0.1:7243/ingest/b23be4e3-a03c-4cb5-9aae-575cd428f4b6', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'components/events.tsx:189', message: 'Opening registration URL', data: { url: event.registrationUrl }, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'C' }) }).catch(() => { });
                            // #endregion
                            window.open(event.registrationUrl, '_blank')
                          }
                        }}
                      >
                        {event.registrationUrl ? 'Inscrever-se' : 'Ver Detalhes'}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
