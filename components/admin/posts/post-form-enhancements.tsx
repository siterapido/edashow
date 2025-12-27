'use client'

import { useEffect, useState } from 'react'
import { Info, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostFormEnhancementsProps {
  title?: string
  excerpt?: string
  slug?: string
  onSlugGenerate?: (slug: string) => void
  onExcerptGenerate?: (excerpt: string) => void
}

export function PostFormEnhancements({
  title,
  excerpt,
  slug,
  onSlugGenerate,
  onExcerptGenerate,
}: PostFormEnhancementsProps) {
  const [titleLength, setTitleLength] = useState(0)
  const [excerptLength, setExcerptLength] = useState(0)
  const [seoScore, setSeoScore] = useState(0)

  useEffect(() => {
    if (title) {
      setTitleLength(title.length)
    } else {
      setTitleLength(0)
    }
  }, [title])

  useEffect(() => {
    if (excerpt) {
      setExcerptLength(excerpt.length)
    } else {
      setExcerptLength(0)
    }
  }, [excerpt])

  useEffect(() => {
    let score = 0
    
    // Título entre 10-100 caracteres
    if (titleLength >= 10 && titleLength <= 100) {
      score += 40
    } else if (titleLength > 0) {
      score += 20
    }

    // Excerpt entre 50-300 caracteres
    if (excerptLength >= 50 && excerptLength <= 300) {
      score += 40
    } else if (excerptLength > 0) {
      score += 20
    }

    // Slug presente
    if (slug && slug.length > 0) {
      score += 20
    }

    setSeoScore(score)
  }, [titleLength, excerptLength, slug])

  const handleGenerateSlug = async () => {
    if (!title || title.trim().length === 0) {
      return
    }

    try {
      const response = await fetch('/api/admin/posts/generate-slug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      })

      const result = await response.json()

      if (result.success && result.slug && onSlugGenerate) {
        onSlugGenerate(result.slug)
      }
    } catch (error) {
      console.error('Erro ao gerar slug:', error)
    }
  }

  const handleGenerateExcerpt = async () => {
    // Este seria chamado quando o conteúdo mudar
    // Por enquanto, apenas uma função placeholder
    if (onExcerptGenerate) {
      // A geração de excerpt acontece automaticamente no hook
      // Mas podemos adicionar um botão manual aqui se necessário
    }
  }

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Info className="h-4 w-4" />
        Informações e SEO
      </h3>

      {/* Contador de caracteres do título */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Título</span>
          <span className={cn(
            "font-medium",
            titleLength < 10 && "text-destructive",
            titleLength >= 10 && titleLength <= 100 && "text-green-600",
            titleLength > 100 && "text-yellow-600"
          )}>
            {titleLength} / 100
          </span>
        </div>
        {titleLength > 0 && titleLength < 10 && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Mínimo de 10 caracteres
          </p>
        )}
        {titleLength > 100 && (
          <p className="text-xs text-yellow-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Ideal: máximo 100 caracteres
          </p>
        )}
      </div>

      {/* Contador de caracteres do excerpt */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Resumo</span>
          <span className={cn(
            "font-medium",
            excerptLength > 0 && excerptLength < 50 && "text-yellow-600",
            excerptLength >= 50 && excerptLength <= 300 && "text-green-600",
            excerptLength > 300 && "text-destructive"
          )}>
            {excerptLength} / 300
          </span>
        </div>
        {excerptLength > 0 && excerptLength < 50 && (
          <p className="text-xs text-yellow-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Ideal: mínimo 50 caracteres
          </p>
        )}
        {excerptLength > 300 && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Máximo de 300 caracteres
          </p>
        )}
      </div>

      {/* Slug */}
      {slug && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">URL</span>
            <code className="text-xs bg-background px-2 py-1 rounded">
              /posts/{slug}
            </code>
          </div>
        </div>
      )}

      {/* Score de SEO */}
      <div className="pt-2 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Score SEO</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all",
                  seoScore >= 80 && "bg-green-600",
                  seoScore >= 50 && seoScore < 80 && "bg-yellow-600",
                  seoScore < 50 && "bg-red-600"
                )}
                style={{ width: `${seoScore}%` }}
              />
            </div>
            <span className={cn(
              "font-medium text-xs",
              seoScore >= 80 && "text-green-600",
              seoScore >= 50 && seoScore < 80 && "text-yellow-600",
              seoScore < 50 && "text-red-600"
            )}>
              {seoScore}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}












