'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Eye, Loader2 } from 'lucide-react'

interface PostPreviewProps {
  postData: {
    title?: string
    slug?: string
    excerpt?: string
    content?: any
    featuredImage?: any
    category?: string
    author?: any
    tags?: any[]
    publishedDate?: string
    status?: string
  }
  postId?: string
}

export function PostPreview({ postData, postId }: PostPreviewProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [previewData, setPreviewData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePreview = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/admin/posts/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...postData,
          id: postId,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar preview')
      }

      const result = await response.json()
      setPreviewData(result.data)
      setOpen(true)
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar preview')
      console.error('Erro no preview:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handlePreview}
        disabled={loading || !postData.title}
        className="gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando...
          </>
        ) : (
          <>
            <Eye className="h-4 w-4" />
            Preview
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview do Post</DialogTitle>
          </DialogHeader>
          
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}

          {previewData && (
            <div className="space-y-6">
              {/* Título */}
              <h1 className="text-3xl font-bold">{previewData.title}</h1>

              {/* Excerpt */}
              {previewData.excerpt && (
                <p className="text-lg text-muted-foreground">{previewData.excerpt}</p>
              )}

              {/* Meta informações */}
              <div className="flex gap-4 text-sm text-muted-foreground">
                {previewData.category && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                    {previewData.category === 'news' && 'Notícias'}
                    {previewData.category === 'analysis' && 'Análises'}
                    {previewData.category === 'interviews' && 'Entrevistas'}
                    {previewData.category === 'opinion' && 'Opinião'}
                  </span>
                )}
                {previewData.publishedDate && (
                  <span>
                    {new Date(previewData.publishedDate).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>

              {/* Imagem destacada */}
              {previewData.featuredImage && (
                <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
                  {typeof previewData.featuredImage === 'object' && previewData.featuredImage.url ? (
                    <img
                      src={previewData.featuredImage.url}
                      alt={previewData.featuredImage.alt || previewData.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Imagem destacada
                    </div>
                  )}
                </div>
              )}

              {/* Conteúdo */}
              <div className="prose max-w-none">
                {previewData.content ? (
                  <div className="text-sm text-muted-foreground">
                    [Conteúdo rich text será renderizado aqui]
                  </div>
                ) : (
                  <p className="text-muted-foreground">Sem conteúdo ainda</p>
                )}
              </div>

              {/* Tags */}
              {previewData.tags && previewData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {previewData.tags.map((tag: any, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-muted rounded text-sm"
                    >
                      {tag.tag || tag}
                    </span>
                  ))}
                </div>
              )}

              {/* URL de preview */}
              {previewData.previewUrl && (
                <div className="pt-4 border-t">
                  <a
                    href={previewData.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Ver no site →
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}












