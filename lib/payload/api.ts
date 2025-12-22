/**
 * Funções auxiliares para buscar dados do PayloadCMS
 * Com sistema de fallback resiliente quando o CMS não está disponível
 */

import {
  getFallbackPosts,
  getFallbackPostBySlug,
  getFallbackEvents,
  getFallbackColumnists,
  getFallbackSponsors,
} from '@/lib/fallback-data'

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// Verifica se o CMS está habilitado (padrão: true)
// Pode ser desabilitado definindo CMS_ENABLED=false no .env
const CMS_ENABLED = process.env.CMS_ENABLED !== 'false'

interface FetchOptions {
  revalidate?: number
  tags?: string[]
}

/**
 * Busca posts do CMS
 * Retorna dados de fallback se o CMS não estiver disponível
 */
export async function getPosts(options: {
  limit?: number
  status?: 'draft' | 'published' | 'archived'
  category?: string
  featured?: boolean
  revalidate?: number
} = {}) {
  // Se CMS desabilitado, retorna fallback imediatamente
  if (!CMS_ENABLED) {
    console.warn('[CMS] CMS desabilitado, usando dados de fallback')
    return getFallbackPosts(options)
  }

  const {
    limit = 10,
    status = 'published',
    category,
    featured,
    revalidate = 60,
  } = options

  const params = new URLSearchParams({
    limit: limit.toString(),
    'where[status][equals]': status,
    sort: '-publishedDate',
    depth: '2', // Popular relacionamentos (featuredImage, author, category)
  })

  if (category) {
    params.append('where[category][equals]', category)
  }

  if (featured !== undefined) {
    params.append('where[featured][equals]', featured.toString())
  }

  try {
    const response = await fetch(`${API_URL}/api/posts?${params.toString()}`, {
      next: { revalidate },
    })

    if (!response.ok) {
      console.warn(`[CMS] Erro ao buscar posts (${response.status}): ${response.statusText}, usando fallback`)
      return getFallbackPosts(options)
    }

    const data = await response.json()
    const posts = data.docs || []

    // Se não houver posts do CMS, usa fallback
    if (posts.length === 0) {
      console.warn('[CMS] Nenhum post encontrado, usando dados de fallback')
      return getFallbackPosts(options)
    }

    return posts
  } catch (error) {
    console.warn('[CMS] Erro ao buscar posts do CMS, usando dados de fallback:', error instanceof Error ? error.message : 'Erro desconhecido')
    return getFallbackPosts(options)
  }
}

/**
 * Busca um post específico por slug
 * Retorna dados de fallback se o CMS não estiver disponível
 */
export async function getPostBySlug(slug: string, revalidate = 60) {
  // Se CMS desabilitado, retorna fallback imediatamente
  if (!CMS_ENABLED) {
    console.warn('[CMS] CMS desabilitado, usando dados de fallback')
    return getFallbackPostBySlug(slug)
  }

  try {
    const response = await fetch(
      `${API_URL}/api/posts?where[slug][equals]=${slug}&limit=1&depth=2`,
      {
        next: { revalidate },
      }
    )

    if (!response.ok) {
      console.warn(`[CMS] Erro ao buscar post por slug (${response.status}): ${response.statusText}, usando fallback`)
      return getFallbackPostBySlug(slug)
    }

    const data = await response.json()
    const post = data.docs?.[0] || null

    // Se não encontrar no CMS, tenta fallback
    if (!post) {
      console.warn(`[CMS] Post não encontrado no CMS (slug: ${slug}), tentando fallback`)
      return getFallbackPostBySlug(slug)
    }

    return post
  } catch (error) {
    console.warn(`[CMS] Erro ao buscar post do CMS (slug: ${slug}), usando fallback:`, error instanceof Error ? error.message : 'Erro desconhecido')
    return getFallbackPostBySlug(slug)
  }
}

/**
 * Busca eventos do CMS
 * Retorna dados de fallback se o CMS não estiver disponível
 */
export async function getEvents(options: {
  limit?: number
  status?: 'upcoming' | 'ongoing' | 'finished' | 'cancelled'
  revalidate?: number
} = {}) {
  // Se CMS desabilitado, retorna fallback imediatamente
  if (!CMS_ENABLED) {
    console.warn('[CMS] CMS desabilitado, usando dados de fallback')
    return getFallbackEvents(options)
  }

  const { limit = 10, status = 'upcoming', revalidate = 60 } = options

  const params = new URLSearchParams({
    limit: limit.toString(),
    'where[status][equals]': status,
    sort: 'startDate',
  })

  try {
    const response = await fetch(`${API_URL}/api/events?${params.toString()}`, {
      next: { revalidate },
    })

    if (!response.ok) {
      console.warn(`[CMS] Erro ao buscar eventos (${response.status}): ${response.statusText}, usando fallback`)
      return getFallbackEvents(options)
    }

    const data = await response.json()
    const events = data.docs || []

    // Se não houver eventos do CMS, usa fallback
    if (events.length === 0) {
      console.warn('[CMS] Nenhum evento encontrado, usando dados de fallback')
      return getFallbackEvents(options)
    }

    return events
  } catch (error) {
    console.warn('[CMS] Erro ao buscar eventos do CMS, usando dados de fallback:', error instanceof Error ? error.message : 'Erro desconhecido')
    return getFallbackEvents(options)
  }
}

/**
 * Busca colunistas do CMS
 * Retorna dados de fallback se o CMS não estiver disponível
 */
export async function getColumnists(options: {
  limit?: number
  revalidate?: number
} = {}) {
  // Se CMS desabilitado, retorna fallback imediatamente
  if (!CMS_ENABLED) {
    console.warn('[CMS] CMS desabilitado, usando dados de fallback')
    return getFallbackColumnists(options)
  }

  const { limit = 10, revalidate = 60 } = options

  const params = new URLSearchParams({
    limit: limit.toString(),
  })

  try {
    const response = await fetch(
      `${API_URL}/api/columnists?${params.toString()}`,
      {
        next: { revalidate },
      }
    )

    if (!response.ok) {
      console.warn(`[CMS] Erro ao buscar colunistas (${response.status}): ${response.statusText}, usando fallback`)
      return getFallbackColumnists(options)
    }

    const data = await response.json()
    const columnists = data.docs || []

    // Se não houver colunistas do CMS, usa fallback
    if (columnists.length === 0) {
      console.warn('[CMS] Nenhum colunista encontrado, usando dados de fallback')
      return getFallbackColumnists(options)
    }

    return columnists
  } catch (error) {
    console.warn('[CMS] Erro ao buscar colunistas do CMS, usando dados de fallback:', error instanceof Error ? error.message : 'Erro desconhecido')
    return getFallbackColumnists(options)
  }
}

/**
 * Busca um colunista específico por slug
 * Retorna dados de fallback se o CMS não estiver disponível
 */
export async function getColumnistBySlug(slug: string, revalidate = 60) {
  // Se CMS desabilitado, retorna null (não há fallback para colunista específico)
  if (!CMS_ENABLED) {
    console.warn('[CMS] CMS desabilitado, retornando null para colunista específico')
    return null
  }

  try {
    const response = await fetch(
      `${API_URL}/api/columnists?where[slug][equals]=${slug}&limit=1`,
      {
        next: { revalidate },
      }
    )

    if (!response.ok) {
      console.warn(`[CMS] Erro ao buscar colunista por slug (${response.status}): ${response.statusText}`)
      return null
    }

    const data = await response.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.warn(`[CMS] Erro ao buscar colunista do CMS (slug: ${slug}):`, error instanceof Error ? error.message : 'Erro desconhecido')
    return null
  }
}

/**
 * Busca patrocinadores do CMS
 * Retorna dados de fallback se o CMS não estiver disponível
 */
export async function getSponsors(options: {
  limit?: number
  active?: boolean
  revalidate?: number
} = {}) {
  // Se CMS desabilitado, retorna fallback imediatamente
  if (!CMS_ENABLED) {
    console.warn('[CMS] CMS desabilitado, usando dados de fallback')
    return getFallbackSponsors(options)
  }

  const { limit = 100, active = true, revalidate = 60 } = options

  const params = new URLSearchParams({
    limit: limit.toString(),
    'where[active][equals]': active.toString(),
    sort: 'name',
  })

  try {
    const response = await fetch(`${API_URL}/api/sponsors?${params.toString()}`, {
      next: { revalidate },
    })

    if (!response.ok) {
      console.warn(`[CMS] Erro ao buscar patrocinadores (${response.status}): ${response.statusText}, usando fallback`)
      return getFallbackSponsors(options)
    }

    const data = await response.json()
    const sponsors = data.docs || []

    // Se não houver patrocinadores do CMS, usa fallback
    if (sponsors.length === 0) {
      console.warn('[CMS] Nenhum patrocinador encontrado, usando dados de fallback')
      return getFallbackSponsors(options)
    }

    return sponsors
  } catch (error) {
    console.warn('[CMS] Erro ao buscar patrocinadores do CMS, usando dados de fallback:', error instanceof Error ? error.message : 'Erro desconhecido')
    return getFallbackSponsors(options)
  }
}

/**
 * Busca configurações do site (Global)
 */
export async function getSiteSettings(revalidate = 3600) {
  try {
    const response = await fetch(`${API_URL}/api/globals/site-settings`, {
      next: { revalidate },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch site settings: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

/**
 * Busca apenas as configurações de tema (cores, logos, tipografia)
 * Útil para uso no ThemeProvider
 */
export async function getThemeSettings(revalidate = 3600) {
  try {
    const settings = await getSiteSettings(revalidate)
    
    if (!settings) return null

    return {
      logo: settings.logo,
      logoDark: settings.logoDark,
      logoWhite: settings.logoWhite,
      favicon: settings.favicon,
      themeColors: settings.themeColors,
      backgroundColors: settings.backgroundColors,
      otherColors: settings.otherColors,
      darkModeColors: settings.darkModeColors,
      typography: settings.typography,
    }
  } catch (error) {
    console.error('Error fetching theme settings:', error)
    return null
  }
}

/**
 * Busca configurações do header (Global)
 */
export async function getHeader(revalidate = 3600) {
  try {
    const response = await fetch(`${API_URL}/api/globals/header`, {
      next: { revalidate },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch header: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching header:', error)
    return null
  }
}

/**
 * Busca configurações do footer (Global)
 */
export async function getFooter(revalidate = 3600) {
  try {
    const response = await fetch(`${API_URL}/api/globals/footer`, {
      next: { revalidate },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch footer: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching footer:', error)
    return null
  }
}

/**
 * Busca mídia por ID
 */
export async function getMediaById(id: string, revalidate = 3600) {
  try {
    const response = await fetch(`${API_URL}/api/media/${id}`, {
      next: { revalidate },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching media:', error)
    return null
  }
}

/**
 * Helper para obter URL de imagem
 * Suporta objetos Media populados do PayloadCMS com depth=2
 * Lida com diferentes estruturas: string (ID), objeto Media completo, ou relacionamento populado
 */
export function getImageUrl(media: any, size?: string): string {
  if (!media) return '/placeholder.jpg'

  // Se for string (ID ou URL)
  if (typeof media === 'string') {
    if (media.startsWith('/') || media.startsWith('http')) {
      return media
    }
    // Se for apenas um ID, retornar endpoint da API
    return `${API_URL}/api/media/${media}`
  }

  // Se o objeto tiver uma propriedade 'doc' (relacionamento populado com depth)
  // PayloadCMS pode retornar { doc: { ... } } quando populado
  const mediaObj = media.doc || media

  // Verificar se é um objeto válido
  if (typeof mediaObj !== 'object' || mediaObj === null) {
    return '/placeholder.jpg'
  }

  // Tentar obter URL do tamanho específico primeiro (se size foi especificado)
  if (size && mediaObj.sizes?.[size]?.url) {
    const sizeUrl = mediaObj.sizes[size].url
    // URLs absolutas já incluem protocolo e domínio
    if (sizeUrl.startsWith('http://') || sizeUrl.startsWith('https://')) {
      return sizeUrl
    }
    // URLs relativas precisam do API_URL
    if (sizeUrl.startsWith('/')) {
      return `${API_URL}${sizeUrl}`
    }
    // Se não começar com /, adicionar
    return `${API_URL}/${sizeUrl}`
  }

  // Tentar obter URL padrão (full ou url)
  const defaultUrl = mediaObj.url || mediaObj.full || mediaObj.filename
  
  if (defaultUrl) {
    // URLs absolutas já incluem protocolo e domínio
    if (typeof defaultUrl === 'string' && (defaultUrl.startsWith('http://') || defaultUrl.startsWith('https://'))) {
      return defaultUrl
    }
    // URLs relativas precisam do API_URL
    if (typeof defaultUrl === 'string' && defaultUrl.startsWith('/')) {
      return `${API_URL}${defaultUrl}`
    }
    // Se não começar com /, adicionar
    if (typeof defaultUrl === 'string') {
      return `${API_URL}/${defaultUrl}`
    }
  }

  // Se tiver apenas ID, tentar buscar via API
  if (mediaObj.id) {
    return `${API_URL}/api/media/${mediaObj.id}`
  }

  return '/placeholder.jpg'
}










