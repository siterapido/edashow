import type { CollectionBeforeChangeHook, CollectionAfterChangeHook, CollectionBeforeValidateHook } from 'payload'
import { generateSlug } from '../../lib/admin/posts/slug-generator'
import { generateExcerpt } from '../../lib/admin/posts/excerpt-generator'
import { validatePostFields } from '../../lib/admin/posts/validation-helpers'

/**
 * Hook executado antes de salvar/atualizar um post
 * Auto-gera slug e excerpt se não fornecidos
 */
export const beforeChange: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  // Auto-gerar slug a partir do título se não fornecido
  if (data.title && (!data.slug || data.slug.trim() === '')) {
    data.slug = generateSlug(data.title)
    
    // Verificar se slug já existe (apenas em operações de criação)
    if (operation === 'create') {
      try {
        const existingPosts = await req.payload.find({
          collection: 'posts',
          where: {
            slug: {
              equals: data.slug,
            },
          },
          limit: 1,
        })
        
        if (existingPosts.docs.length > 0) {
          // Adicionar sufixo numérico se slug já existe
          let counter = 1
          let uniqueSlug = `${data.slug}-${counter}`
          
          while (true) {
            const check = await req.payload.find({
              collection: 'posts',
              where: {
                slug: {
                  equals: uniqueSlug,
                },
              },
              limit: 1,
            })
            
            if (check.docs.length === 0) {
              data.slug = uniqueSlug
              break
            }
            
            counter++
            uniqueSlug = `${data.slug}-${counter}`
          }
        }
      } catch (error) {
        // Se houver erro na verificação, continuar com o slug gerado
        console.error('Erro ao verificar slug único:', error)
      }
    }
  }
  
  // Auto-gerar excerpt a partir do conteúdo se não fornecido
  if (data.content && (!data.excerpt || data.excerpt.trim() === '')) {
    data.excerpt = generateExcerpt(data.content)
  }
  
  // Normalizar tags (remover espaços, converter para lowercase)
  if (data.tags && Array.isArray(data.tags)) {
    data.tags = data.tags.map((tag: any) => {
      if (typeof tag === 'string') {
        return { tag: tag.trim().toLowerCase() }
      }
      if (tag.tag) {
        return { tag: tag.tag.trim().toLowerCase() }
      }
      return tag
    }).filter((tag: any) => tag.tag && tag.tag.length > 0)
  }
  
  // Validar que posts publicados têm publishedDate
  if (data.status === 'published' && !data.publishedDate) {
    data.publishedDate = new Date().toISOString()
  }
  
  // Se publishedDate está no futuro e status é draft, manter como draft (será publicado automaticamente)
  if (data.publishedDate && data.status === 'draft') {
    const publishedDate = new Date(data.publishedDate)
    const now = new Date()
    
    if (publishedDate > now) {
      // Post está agendado, manter como draft
      // O schedule manager irá publicar quando chegar a hora
    } else {
      // Data já passou, pode publicar imediatamente se status for draft
      if (!data.status || data.status === 'draft') {
        data.status = 'published'
      }
    }
  }
  
  return data
}

/**
 * Hook executado após salvar/atualizar um post
 * Implementa auto-save e agendamento
 */
export const afterChange: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  // Log de alterações (pode ser expandido para auditoria)
  if (operation === 'update') {
    // Aqui podemos adicionar lógica de log de alterações se necessário
  }
  
  // O auto-save é gerenciado pelo componente no frontend
  // Este hook apenas garante que os dados estão salvos
  
  return doc
}

/**
 * Hook executado antes da validação
 * Valida campos obrigatórios e formatos
 */
export const beforeValidate: CollectionBeforeValidateHook = async ({ data }) => {
  const validation = validatePostFields({
    title: data.title,
    slug: data.slug,
    content: data.content,
    category: data.category,
  })
  
  if (!validation.valid) {
    throw new Error(validation.errors.join(', '))
  }
  
  // Validações adicionais
  if (data.title && data.title.length < 10) {
    throw new Error('Título deve ter pelo menos 10 caracteres')
  }
  
  if (data.excerpt && data.excerpt.length > 0) {
    if (data.excerpt.length < 50) {
      throw new Error('Excerpt deve ter pelo menos 50 caracteres')
    }
    if (data.excerpt.length > 300) {
      throw new Error('Excerpt deve ter no máximo 300 caracteres')
    }
  }
  
  return data
}








