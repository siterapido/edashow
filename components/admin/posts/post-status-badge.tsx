'use client'

import { Badge } from '@/components/ui/badge'
import { Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface PostStatusBadgeProps {
  status: 'draft' | 'published' | 'archived'
  publishedDate?: string | Date | null
}

export function PostStatusBadge({ status, publishedDate }: PostStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'published':
        return {
          label: 'Publicado',
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        }
      case 'archived':
        return {
          label: 'Arquivado',
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        }
      case 'draft':
      default:
        const isScheduled = publishedDate && new Date(publishedDate) > new Date()
        return {
          label: isScheduled ? 'Agendado' : 'Rascunho',
          variant: 'outline' as const,
          className: isScheduled
            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        }
    }
  }

  const config = getStatusConfig()
  const date = publishedDate ? new Date(publishedDate) : null
  const isScheduled = status === 'draft' && date && date > new Date()

  return (
    <div className="flex items-center gap-2">
      <Badge className={config.className}>
        {config.label}
      </Badge>

      {date && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          {isScheduled ? (
            <>
              <Clock className="h-3 w-3" />
              <span>
                {format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </>
          ) : status === 'published' ? (
            <>
              <Calendar className="h-3 w-3" />
              <span>
                {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}












