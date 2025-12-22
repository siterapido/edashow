'use client'

import { useEffect, useState } from 'react'
import { Check, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AutoSaveIndicatorProps {
  isSaving?: boolean
  lastSaved?: Date | null
  hasChanges?: boolean
}

export function AutoSaveIndicator({ 
  isSaving = false, 
  lastSaved = null,
  hasChanges = false 
}: AutoSaveIndicatorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)

    if (seconds < 10) return 'agora'
    if (seconds < 60) return `${seconds}s atrás`
    if (minutes < 60) return `${minutes}min atrás`
    
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {isSaving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Salvando...</span>
        </>
      ) : lastSaved ? (
        <>
          <Check className="h-4 w-4 text-green-600" />
          <span>
            Salvo {formatTime(lastSaved)}
          </span>
        </>
      ) : hasChanges ? (
        <>
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <span>Não salvo</span>
        </>
      ) : null}
    </div>
  )
}








