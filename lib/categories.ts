/**
 * Mapeamento e utilitários para categorias do blog
 */

export type CategoryValue = 'news' | 'analysis' | 'interviews' | 'opinion'

export interface CategoryInfo {
  value: CategoryValue
  slug: string
  label: string
  description: string
  color?: string
}

export const categoryMap: Record<CategoryValue, CategoryInfo> = {
  'news': {
    value: 'news',
    slug: 'noticias',
    label: 'Notícias',
    description: 'Fique por dentro das principais notícias do setor de saúde',
    color: '#0284C7'
  },
  'analysis': {
    value: 'analysis',
    slug: 'analises',
    label: 'Análises',
    description: 'Análises profundas sobre tendências e mercado',
    color: '#059669'
  },
  'interviews': {
    value: 'interviews',
    slug: 'entrevistas',
    label: 'Entrevistas',
    description: 'Conversas exclusivas com líderes do setor',
    color: '#DC2626'
  },
  'opinion': {
    value: 'opinion',
    slug: 'opiniao',
    label: 'Opinião',
    description: 'Artigos de opinião e editoriais',
    color: '#7C3AED'
  }
}

/**
 * Obtém informações de uma categoria pelo valor
 */
export function getCategoryInfo(category: CategoryValue): CategoryInfo {
  return categoryMap[category]
}

/**
 * Obtém informações de uma categoria pelo slug
 */
export function getCategoryBySlug(slug: string): CategoryInfo | null {
  const entry = Object.values(categoryMap).find(cat => cat.slug === slug)
  return entry || null
}

/**
 * Obtém todas as categorias
 */
export function getAllCategories(): CategoryInfo[] {
  return Object.values(categoryMap)
}








