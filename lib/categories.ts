/**
 * Mapeamento e utilitários para categorias do blog
 */

// Categoria pode ser qualquer string do CMS ou uma das hardcoded
export type CategoryValue = string

export interface CategoryInfo {
  value: string
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
 * Obtém informações de uma categoria pelo valor (slug ou ID)
 */
export function getCategoryInfo(category: string): CategoryInfo {
  const info = categoryMap[category as any]

  if (info) return info

  // Fallback para categorias dinâmicas do CMS se não estiverem no mapa redefinido
  return {
    value: category,
    slug: category,
    label: category.charAt(0) ? category.charAt(0).toUpperCase() + category.slice(1) : 'Categoria',
    description: '',
    color: '#64748b' // Slate-500 default
  }
}

/**
 * Obtém todas as categorias (agora do CMS se disponível)
 */
export async function getAllCategoriesFromCMS(): Promise<CategoryInfo[]> {
  try {
    const { getCategories } = await import('./payload/api')
    const cmsCategories = await getCategories()

    if (cmsCategories && cmsCategories.length > 0) {
      return cmsCategories.map((cat: any) => ({
        value: cat.slug,
        slug: cat.slug,
        label: cat.name,
        description: cat.description || '',
        color: cat.color
      }))
    }
  } catch (error) {
    console.warn('[Categories] Falha ao carregar categorias do CMS, usando local:', error)
  }

  return Object.values(categoryMap)
}

/**
 * Versão síncrona mantendo compatibilidade onde necessário
 */
export function getAllCategories(): CategoryInfo[] {
  return Object.values(categoryMap)
}











