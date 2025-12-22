/**
 * Cliente autenticado para operações administrativas no Payload CMS
 * Usado para scripts de importação e migração de dados
 */

const PAYLOAD_SERVER_URL = process.env.PAYLOAD_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const PAYLOAD_API_TOKEN = process.env.PAYLOAD_API_TOKEN || ''

interface PayloadAuthResponse {
  token: string
  user: {
    id: string
    email: string
  }
}

interface PayloadMediaResponse {
  id: string
  url: string
  filename: string
  mimeType: string
  filesize: number
  width?: number
  height?: number
  sizes?: Record<string, {
    url: string
    width: number
    height: number
  }>
}

interface PayloadPostResponse {
  id: string
  title: string
  slug: string
  [key: string]: any
}

/**
 * Autentica no Payload CMS usando credenciais de admin
 */
async function authenticate(): Promise<string> {
  if (!PAYLOAD_API_TOKEN) {
    // Tentar autenticar com email/senha se não houver token
    const email = process.env.PAYLOAD_ADMIN_EMAIL || 'admin@example.com'
    const password = process.env.PAYLOAD_ADMIN_PASSWORD || 'password'

    const response = await fetch(`${PAYLOAD_SERVER_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    if (!response.ok) {
      throw new Error(`Falha na autenticação: ${response.statusText}`)
    }

    const data: PayloadAuthResponse = await response.json()
    return data.token
  }

  return PAYLOAD_API_TOKEN
}

/**
 * Faz upload de uma imagem para o Payload CMS
 */
export async function uploadMedia(
  imageUrl: string,
  alt?: string,
  caption?: string
): Promise<PayloadMediaResponse | null> {
  try {
    const token = await authenticate()

    // Baixar a imagem
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Falha ao baixar imagem: ${imageResponse.statusText}`)
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'
    const filename = imageUrl.split('/').pop()?.split('?')[0] || 'image.jpg'

    // Criar FormData para upload
    const formData = new FormData()
    const blob = new Blob([imageBuffer], { type: contentType })
    formData.append('file', blob, filename)
    if (alt) formData.append('alt', alt)
    if (caption) formData.append('caption', caption)

    // Fazer upload
    const uploadResponse = await fetch(`${PAYLOAD_SERVER_URL}/api/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      throw new Error(`Falha no upload: ${uploadResponse.statusText} - ${errorText}`)
    }

    const media: PayloadMediaResponse = await uploadResponse.json()
    return media
  } catch (error) {
    console.error(`Erro ao fazer upload de mídia de ${imageUrl}:`, error)
    return null
  }
}

/**
 * Cria ou atualiza um post no Payload CMS
 */
export async function upsertPost(data: {
  title: string
  slug: string
  excerpt?: string
  content: any // Lexical JSON
  category: 'news' | 'analysis' | 'interviews' | 'opinion'
  featuredImage?: string // ID da mídia
  tags?: Array<{ tag: string }>
  author?: string // ID do colunista
  status?: 'draft' | 'published' | 'archived'
  publishedDate?: string
  featured?: boolean
  sourceUrl?: string
}): Promise<PayloadPostResponse | null> {
  try {
    const token = await authenticate()

    // Verificar se o post já existe
    const checkResponse = await fetch(
      `${PAYLOAD_SERVER_URL}/api/posts?where[slug][equals]=${data.slug}&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    let existingPost: PayloadPostResponse | null = null
    if (checkResponse.ok) {
      const checkData = await checkResponse.json()
      existingPost = checkData.docs?.[0] || null
    }

    const payload: any = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || '',
      content: data.content,
      category: data.category,
      status: data.status || 'published',
      featured: data.featured || false,
    }

    if (data.featuredImage) {
      payload.featuredImage = data.featuredImage
    }

    if (data.tags && data.tags.length > 0) {
      payload.tags = data.tags
    }

    if (data.author) {
      payload.author = data.author
    }

    if (data.publishedDate) {
      payload.publishedDate = data.publishedDate
    }

    if (data.sourceUrl) {
      payload.sourceUrl = data.sourceUrl
    }

    let response: Response
    if (existingPost) {
      // Atualizar post existente
      response = await fetch(`${PAYLOAD_SERVER_URL}/api/posts/${existingPost.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    } else {
      // Criar novo post
      response = await fetch(`${PAYLOAD_SERVER_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Falha ao salvar post: ${response.statusText} - ${errorText}`)
    }

    const post: PayloadPostResponse = await response.json()
    return post
  } catch (error) {
    console.error(`Erro ao criar/atualizar post "${data.title}":`, error)
    return null
  }
}

/**
 * Busca ou cria um colunista por nome
 */
export async function findOrCreateColumnist(
  name: string,
  slug?: string
): Promise<string | null> {
  try {
    const token = await authenticate()
    const columnistSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Buscar colunista existente
    const searchResponse = await fetch(
      `${PAYLOAD_SERVER_URL}/api/columnists?where[slug][equals]=${columnistSlug}&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    if (searchResponse.ok) {
      const searchData = await searchResponse.json()
      if (searchData.docs && searchData.docs.length > 0) {
        return searchData.docs[0].id
      }
    }

    // Criar novo colunista
    const createResponse = await fetch(`${PAYLOAD_SERVER_URL}/api/columnists`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        slug: columnistSlug,
      }),
    })

    if (!createResponse.ok) {
      const errorText = await createResponse.text()
      throw new Error(`Falha ao criar colunista: ${createResponse.statusText} - ${errorText}`)
    }

    const columnist = await createResponse.json()
    return columnist.id
  } catch (error) {
    console.error(`Erro ao buscar/criar colunista "${name}":`, error)
    return null
  }
}

/**
 * Cria ou atualiza um patrocinador
 */
export async function upsertSponsor(data: {
  name: string
  logo: string // ID da mídia
  website?: string
  active?: boolean
}): Promise<any | null> {
  try {
    const token = await authenticate()

    const searchResponse = await fetch(
      `${PAYLOAD_SERVER_URL}/api/sponsors?where[name][equals]=${encodeURIComponent(data.name)}&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    let existing: any = null
    if (searchResponse.ok) {
      const searchData = await searchResponse.json()
      existing = searchData.docs?.[0] || null
    }

    const payload = {
      name: data.name,
      logo: data.logo,
      website: data.website || '',
      active: data.active ?? true,
    }

    let response: Response
    if (existing) {
      response = await fetch(`${PAYLOAD_SERVER_URL}/api/sponsors/${existing.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    } else {
      response = await fetch(`${PAYLOAD_SERVER_URL}/api/sponsors`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    }

    if (!response.ok) throw new Error(response.statusText)
    return await response.json()
  } catch (error) {
    console.error(`Erro ao salvar patrocinador ${data.name}:`, error)
    return null
  }
}

/**
 * Cria ou atualiza um evento
 */
export async function upsertEvent(data: {
  title: string
  slug: string
  startDate: string
  [key: string]: any
}): Promise<any | null> {
  try {
    const token = await authenticate()

    const searchResponse = await fetch(
      `${PAYLOAD_SERVER_URL}/api/events?where[slug][equals]=${data.slug}&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    let existing: any = null
    if (searchResponse.ok) {
      const searchData = await searchResponse.json()
      existing = searchData.docs?.[0] || null
    }

    const payload = { ...data }

    let response: Response
    if (existing) {
      response = await fetch(`${PAYLOAD_SERVER_URL}/api/events/${existing.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    } else {
      response = await fetch(`${PAYLOAD_SERVER_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    }

    if (!response.ok) throw new Error(response.statusText)
    return await response.json()
  } catch (error) {
    console.error(`Erro ao salvar evento ${data.title}:`, error)
    return null
  }
}













