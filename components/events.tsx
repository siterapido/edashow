import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

const events = [
  {
    id: 1,
    date: { day: "23", month: "JAN" },
    title: "Conec 2025 reúne mais de 200 profissionais no painel",
    description: "Big D Ofertou! O maior evento de 2025 será de 23 a 25 de Maio",
    dateTime: "23-01-2025 | 08h00 - 21:26-2025",
    location: "Motiva Eventos - São Paulo",
  },
  {
    id: 2,
    date: { day: "02", month: "ABR" },
    title: "WORKSHOP HM - SECURITY E CONEXÃO SAÚDE - PROJETO...",
    dateTime: "02-04-2025 | 08h00 - 06-06-2025 | 9:30",
    location: "Poa Park Business",
  },
  {
    id: 3,
    date: { day: "04", month: "ABR" },
    title: "Lançamento MedSênior - Recife",
    dateTime: "04-04-2025 | 08h00 - 04-26-2025 | 00:00",
    location: "Lançamento",
  },
]

export function Events() {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Próximos eventos</h2>

      <div className="flex gap-4 mb-8 justify-center">
        <select className="border rounded px-4 py-2 text-sm">
          <option>Palestrante + Expo</option>
        </select>
        <select className="border rounded px-4 py-2 text-sm">
          <option>Choose an Event Category</option>
        </select>
        <select className="border rounded px-4 py-2 text-sm">
          <option>Choose an Event Type</option>
        </select>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Eventos</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            ◀
          </Button>
          <Button variant="outline" size="sm">
            ▶
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span className="text-blue-400 text-sm">Evento</span>
              </div>
              <div className="absolute top-3 left-3 bg-white text-center p-2 rounded shadow">
                <div className="text-2xl font-bold text-blue-600">{event.date.day}</div>
                <div className="text-xs uppercase">{event.date.month}</div>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-base mb-3 line-clamp-2">{event.title}</h3>
              {event.description && <p className="text-sm text-gray-600 mb-3">{event.description}</p>}
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{event.dateTime}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{event.location}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 text-sm bg-transparent">
                Lançamento
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" className="uppercase text-sm bg-transparent">
          Carregar Mais Eventos
        </Button>
      </div>
    </section>
  )
}
