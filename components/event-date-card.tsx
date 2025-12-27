import { Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card } from '@/components/ui/card'

interface EventDateCardProps {
  startDate: string
  endDate?: string
  className?: string
}

export function EventDateCard({ startDate, endDate, className }: EventDateCardProps) {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : null
  
  const day = format(start, 'dd')
  const month = format(start, 'MMM', { locale: ptBR }).toUpperCase()
  const year = format(start, 'yyyy')
  const time = format(start, 'HH:mm', { locale: ptBR })
  
  const isSameDay = end && format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')
  const endTime = end ? format(end, 'HH:mm', { locale: ptBR }) : null

  return (
    <Card className={`p-6 bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50 border-2 border-orange-300 shadow-lg ${className}`}>
      <div className="flex items-start gap-4">
        {/* Calendário Visual */}
        <div className="shrink-0 text-center bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg p-4 shadow-lg border-2 border-orange-600">
          <div className="text-3xl font-bold text-white mb-1">{day}</div>
          <div className="text-xs font-semibold text-white/90 uppercase tracking-wider">{month}</div>
          <div className="text-xs text-white/80 mt-1">{year}</div>
        </div>

        {/* Informações de Data e Hora */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-orange-600" />
            <h3 className="font-bold text-lg text-orange-900">Data e Horário</h3>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-700">
                {format(start, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <p className="text-sm text-orange-800 font-medium">
                {time}
                {endTime && (
                  <>
                    {isSameDay ? (
                      ` - ${endTime}`
                    ) : (
                      ` até ${format(end!, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`
                    )}
                  </>
                )}
              </p>
            </div>

            {end && !isSameDay && (
              <p className="text-xs text-orange-700 mt-2 font-medium">
                Duração: {Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))} dia(s)
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}













