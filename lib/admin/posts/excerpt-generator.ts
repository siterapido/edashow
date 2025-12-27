/**
 * Extrai texto puro de conteúdo rich text (Lexical JSON)
 * Remove tags HTML e formatação
 */
function extractPlainText(content: any): string {
  if (!content) return ''
  
  if (typeof content === 'string') {
    // Remove tags HTML se houver
    return content.replace(/<[^>]*>/g, '').trim()
  }
  
  if (typeof content === 'object') {
    // Se for objeto Lexical, extrair texto recursivamente
    let text = ''
    
    if (content.root) {
      text = extractTextFromLexicalNode(content.root)
    } else if (Array.isArray(content)) {
      text = content.map(node => extractTextFromLexicalNode(node)).join(' ')
    } else if (content.children) {
      text = extractTextFromLexicalNode(content)
    }
    
    return text.trim()
  }
  
  return ''
}

/**
 * Extrai texto de um nó Lexical recursivamente
 */
function extractTextFromLexicalNode(node: any): string {
  if (!node) return ''
  
  if (typeof node === 'string') {
    return node
  }
  
  if (node.text) {
    return node.text
  }
  
  if (node.children && Array.isArray(node.children)) {
    return node.children.map((child: any) => extractTextFromLexicalNode(child)).join(' ')
  }
  
  return ''
}

/**
 * Gera um excerpt a partir do conteúdo
 * @param content - Conteúdo rich text (Lexical JSON ou string)
 * @param maxLength - Comprimento máximo do excerpt (padrão: 150)
 * @returns Excerpt gerado
 */
export function generateExcerpt(content: any, maxLength: number = 150): string {
  const plainText = extractPlainText(content)
  
  if (!plainText) return ''
  
  // Remove espaços múltiplos e quebras de linha
  const cleaned = plainText.replace(/\s+/g, ' ').trim()
  
  if (cleaned.length <= maxLength) {
    return cleaned
  }
  
  // Encontra o último espaço antes do limite para não cortar palavras
  const truncated = cleaned.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...'
  }
  
  return truncated + '...'
}












