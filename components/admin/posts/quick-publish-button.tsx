'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'

interface QuickPublishButtonProps {
  postData: {
    title?: string
    slug?: string
    excerpt?: string
    content?: any
    category?: string
    author?: any
    tags?: any[]
    publishedDate?: string
    status?: string
  }
  postId?: string
  onPublished?: () => void
}

export function QuickPublishButton({ postData, postId, onPublished }: QuickPublishButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePublish = async () => {
    // Validação básica
    if (!postData.title || postData.title.trim().length < 10) {
      toast.error('Título deve ter pelo menos 10 caracteres')
      return
    }

    if (!postData.content) {
      toast.error('Conteúdo é obrigatório')
      return
    }

    if (!postData.category) {
      toast.error('Categoria é obrigatória')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/posts/quick-publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...postData,
          id: postId,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao publicar')
      }

      toast.success(result.message || 'Post publicado com sucesso!')
      
      if (onPublished) {
        onPublished()
      }

      // Recarregar a página após 1 segundo para mostrar o post publicado
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error: any) {
      console.error('Erro ao publicar:', error)
      toast.error(error.message || 'Erro ao publicar post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      onClick={handlePublish}
      disabled={loading || !postData.title || !postData.content || !postData.category}
      className="gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Publicando...
        </>
      ) : (
        <>
          <Send className="h-4 w-4" />
          Publicar Agora
        </>
      )}
    </Button>
  )
}












