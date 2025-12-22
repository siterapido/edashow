import slugify from 'slugify'

/**
 * Gera um slug a partir de um título
 * @param title - Título do post
 * @returns Slug gerado e normalizado
 */
export function generateSlug(title: string): string {
  if (!title) return ''
  
  return slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
    locale: 'pt',
  })
}

/**
 * Valida se um slug é único
 * @param slug - Slug a ser validado
 * @param existingSlugs - Array de slugs existentes
 * @returns Slug único (pode ter sufixo numérico se necessário)
 */
export function ensureUniqueSlug(slug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(slug)) {
    return slug
  }

  let counter = 1
  let uniqueSlug = `${slug}-${counter}`
  
  while (existingSlugs.includes(uniqueSlug)) {
    counter++
    uniqueSlug = `${slug}-${counter}`
  }
  
  return uniqueSlug
}








