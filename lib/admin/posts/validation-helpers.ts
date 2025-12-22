/**
 * Validação de título
 */
export function validateTitle(title: string): { valid: boolean; message?: string } {
  if (!title || title.trim().length === 0) {
    return { valid: false, message: 'Título é obrigatório' }
  }

  if (title.length < 10) {
    return { valid: false, message: 'Título deve ter pelo menos 10 caracteres' }
  }

  if (title.length > 200) {
    return { valid: false, message: 'Título deve ter no máximo 200 caracteres' }
  }

  return { valid: true }
}

/**
 * Validação de excerpt
 */
export function validateExcerpt(excerpt: string): { valid: boolean; message?: string } {
  if (!excerpt || excerpt.trim().length === 0) {
    return { valid: true } // Excerpt é opcional
  }

  if (excerpt.length < 50) {
    return { valid: false, message: 'Excerpt deve ter pelo menos 50 caracteres' }
  }

  if (excerpt.length > 300) {
    return { valid: false, message: 'Excerpt deve ter no máximo 300 caracteres' }
  }

  return { valid: true }
}

/**
 * Validação de slug
 */
export function validateSlug(slug: string): { valid: boolean; message?: string } {
  if (!slug || slug.trim().length === 0) {
    return { valid: false, message: 'Slug é obrigatório' }
  }

  // Slug deve conter apenas letras minúsculas, números e hífens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

  if (!slugRegex.test(slug)) {
    return { valid: false, message: 'Slug deve conter apenas letras minúsculas, números e hífens' }
  }

  return { valid: true }
}

/**
 * Valida campos obrigatórios de um post
 */
export function validatePostFields(data: {
  title?: string
  slug?: string
  content?: any
  category?: string
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  const titleValidation = validateTitle(data.title || '')
  if (!titleValidation.valid) {
    errors.push(titleValidation.message || 'Título inválido')
  }

  const slugValidation = validateSlug(data.slug || '')
  if (!slugValidation.valid) {
    errors.push(slugValidation.message || 'Slug inválido')
  }

  if (!data.content) {
    errors.push('Conteúdo é obrigatório')
  }

  if (!data.category) {
    errors.push('Categoria é obrigatória')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}








