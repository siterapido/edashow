import type { ReactNode } from 'react'

/**
 * Renderiza preview de um post usando componentes do frontend
 * Esta função pode ser expandida para usar os componentes reais do frontend
 */
export function renderPostPreview(postData: {
  title: string
  excerpt?: string
  content?: any
  featuredImage?: any
  category?: string
  author?: any
  tags?: any[]
  publishedDate?: string
}): ReactNode {
  // Por enquanto, retorna uma estrutura básica
  // Em produção, você pode importar e usar os componentes reais do frontend
  // como PostCard, LexicalRenderer, etc.
  
  return (
    <div className="post-preview">
      <h1>{postData.title}</h1>
      {postData.excerpt && <p>{postData.excerpt}</p>}
      {postData.content && (
        <div className="content">
          {/* Conteúdo rich text seria renderizado aqui */}
          [Conteúdo rich text]
        </div>
      )}
    </div>
  )
}












