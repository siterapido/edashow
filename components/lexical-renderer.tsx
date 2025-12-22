/**
 * Componente para renderizar conteúdo Lexical de forma básica
 * Extrai texto dos nós Lexical e renderiza com formatação HTML simples
 */

import React from 'react'

interface LexicalNode {
  type: string
  text?: string
  format?: number
  children?: LexicalNode[]
  [key: string]: any
}

interface LexicalContent {
  root?: {
    children?: LexicalNode[]
  }
}

/**
 * Extrai texto de um nó Lexical recursivamente
 */
function extractText(node: LexicalNode): string {
  if (node.text) {
    return node.text
  }
  
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractText).join('')
  }
  
  return ''
}

/**
 * Renderiza um nó Lexical como HTML
 */
function renderNode(node: LexicalNode, index: number = 0): React.ReactNode {
  const text = extractText(node)
  const format = node.format || 0
  
  // Verificar formatação (bits: 1=bold, 2=italic, 4=strikethrough, 8=underline)
  const isBold = (format & 1) !== 0
  const isItalic = (format & 2) !== 0
  
  let content: React.ReactNode = text
  
  if (isBold && isItalic) {
    content = <strong><em>{text}</em></strong>
  } else if (isBold) {
    content = <strong>{text}</strong>
  } else if (isItalic) {
    content = <em>{text}</em>
  }
  
  // Renderizar baseado no tipo do nó
  switch (node.type) {
    case 'heading':
      const level = node.tag || 'h2'
      const HeadingTag = level as keyof JSX.IntrinsicElements
      return (
        <HeadingTag key={index} className="font-bold mt-6 mb-4">
          {node.children?.map((child, i) => renderNode(child, i))}
        </HeadingTag>
      )
    
    case 'list':
      const ListTag = node.listType === 'bullet' ? 'ul' : 'ol'
      return (
        <ListTag key={index} className="list-disc list-inside my-4 space-y-2">
          {node.children?.map((child, i) => (
            <li key={i}>{renderNode(child, i)}</li>
          ))}
        </ListTag>
      )
    
    case 'listitem':
      return (
        <span key={index}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </span>
      )
    
    case 'paragraph':
      return (
        <p key={index} className="mb-4 leading-relaxed">
          {node.children?.map((child, i) => renderNode(child, i))}
        </p>
      )
    
    case 'text':
      return <span key={index}>{content}</span>
    
    case 'linebreak':
      return <br key={index} />
    
    default:
      // Para outros tipos, renderizar filhos se existirem
      if (node.children && Array.isArray(node.children)) {
        return (
          <div key={index}>
            {node.children.map((child, i) => renderNode(child, i))}
          </div>
        )
      }
      return <span key={index}>{content}</span>
  }
}

interface LexicalRendererProps {
  content: LexicalContent | any
}

/**
 * Componente principal para renderizar conteúdo Lexical
 */
export function LexicalRenderer({ content }: LexicalRendererProps) {
  if (!content) {
    return null
  }
  
  // Se for string, renderizar como HTML simples
  if (typeof content === 'string') {
    return (
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }
  
  // Extrair nós filhos do root
  const root = content.root || content
  const children = root.children || []
  
  if (children.length === 0) {
    return null
  }
  
  return (
    <div className="prose prose-lg max-w-none 
      prose-headings:font-bold prose-headings:text-foreground prose-headings:mt-8 prose-headings:mb-4
      prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
      prose-strong:text-foreground prose-strong:font-semibold
      prose-em:text-muted-foreground
      prose-ul:list-disc prose-ul:ml-6 prose-ul:my-4
      prose-ol:list-decimal prose-ol:ml-6 prose-ol:my-4
      prose-li:my-2">
      {children.map((node: LexicalNode, index: number) => renderNode(node, index))}
    </div>
  )
}












