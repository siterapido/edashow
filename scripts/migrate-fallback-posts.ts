/**
 * Script para migrar posts fallback com imagens para o banco de dados PayloadCMS
 * 
 * Executa: pnpm tsx scripts/migrate-fallback-posts.ts
 * Ou: ts-node --esm scripts/migrate-fallback-posts.ts
 * 
 * IMPORTANTE: O servidor Next.js deve estar rodando (pnpm dev) para que
 * as imagens possam ser acessadas via URL local.
 * 
 * Requer variáveis de ambiente:
 * - PAYLOAD_SERVER_URL ou NEXT_PUBLIC_SERVER_URL (padrão: http://localhost:3000)
 * - PAYLOAD_ADMIN_EMAIL (padrão: admin@example.com)
 * - PAYLOAD_ADMIN_PASSWORD (padrão: password)
 * - Ou PAYLOAD_API_TOKEN
 */

import { fallbackPosts, fallbackPostsFull } from '../lib/fallback-data'
import * as fs from 'fs'
import * as path from 'path'

const PAYLOAD_SERVER_URL = process.env.PAYLOAD_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * Autentica no Payload CMS
 */
async function authenticate(): Promise<string> {
  const PAYLOAD_API_TOKEN = process.env.PAYLOAD_API_TOKEN || ''
  
  if (PAYLOAD_API_TOKEN) {
    return PAYLOAD_API_TOKEN
  }

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

  const data = await response.json()
  return data.token
}

/**
 * Busca ou cria uma categoria
 */
async function findOrCreateCategory(
  name: string,
  slug?: string
): Promise<string | null> {
  try {
    const token = await authenticate()
    const categorySlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Buscar categoria existente
    const searchResponse = await fetch(
      `${PAYLOAD_SERVER_URL}/api/categories?where[slug][equals]=${categorySlug}&limit=1`,
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

    // Criar nova categoria
    const createResponse = await fetch(`${PAYLOAD_SERVER_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        slug: categorySlug,
        active: true,
      }),
    })

    if (!createResponse.ok) {
      const errorText = await createResponse.text()
      console.error(`Erro ao criar categoria "${name}": ${createResponse.status} ${createResponse.statusText}`)
      console.error(`Resposta: ${errorText}`)
      throw new Error(`Falha ao criar categoria: ${createResponse.statusText} - ${errorText}`)
    }

    const category = await createResponse.json()
    return category.id
  } catch (error: any) {
    console.error(`Erro ao buscar/criar categoria "${name}":`, error?.message || error)
    return null
  }
}

/**
 * Busca ou cria um colunista por nome
 */
async function findOrCreateColumnist(
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
 * Faz upload de uma imagem local para o PayloadCMS
 */
async function uploadLocalImage(
  localPath: string,
  alt?: string,
  caption?: string
): Promise<string | null> {
  try {
    const fullPath = path.join(process.cwd(), 'public', localPath)
    
    if (!fs.existsSync(fullPath)) {
      console.error(`Arquivo não encontrado: ${fullPath}`)
      return null
    }

    const fileBuffer = fs.readFileSync(fullPath)
    const filename = path.basename(localPath)
    const ext = path.extname(filename).toLowerCase()
    
    let mimeType = 'image/jpeg'
    if (ext === '.png') mimeType = 'image/png'
    else if (ext === '.webp') mimeType = 'image/webp'
    else if (ext === '.gif') mimeType = 'image/gif'

    const token = await authenticate()
    
    // Criar FormData usando a API nativa do Node.js 18+
    const formData = new FormData()
    // Criar um Blob a partir do buffer
    const blob = new Blob([fileBuffer], { type: mimeType })
    formData.append('file', blob, filename)
    if (alt) formData.append('alt', alt)
    if (caption) formData.append('caption', caption)

    const uploadResponse = await fetch(`${PAYLOAD_SERVER_URL}/api/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Não definir Content-Type, deixar o fetch definir automaticamente com boundary
      },
      body: formData,
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error(`  Erro no upload (${uploadResponse.status}): ${errorText.substring(0, 200)}`)
      throw new Error(`Falha no upload: ${uploadResponse.statusText} - ${errorText.substring(0, 200)}`)
    }

    const media = await uploadResponse.json()
    return media.id || media.doc?.id
  } catch (error: any) {
    console.error(`  Erro ao fazer upload de ${localPath}:`, error?.message || error)
    return null
  }
}

/**
 * Cria ou atualiza um post no Payload CMS
 */
async function upsertPost(data: {
  title: string
  slug: string
  excerpt?: string
  content: any // Lexical JSON
  category: string // ID da categoria
  featuredImage?: string // ID da mídia
  tags?: Array<{ tag: string }>
  author?: string // ID do colunista
  status?: 'draft' | 'published' | 'archived'
  publishedDate?: string
  featured?: boolean
}): Promise<any | null> {
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

    let existingPost: any | null = null
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

    const post = await response.json()
    return post
  } catch (error) {
    console.error(`Erro ao criar/atualizar post "${data.title}":`, error)
    return null
  }
}

/**
 * Mapeia categoria fallback para nome de categoria
 */
function mapCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'news': 'Notícias',
    'analysis': 'Análises',
    'interviews': 'Entrevistas',
    'opinion': 'Opinião',
  }
  return categoryMap[category] || 'Notícias'
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Iniciando migração de posts fallback com imagens...\n')

  try {
    // Autenticar
    console.log('🔐 Autenticando no PayloadCMS...')
    await authenticate()
    console.log('✅ Autenticação realizada com sucesso\n')

    // Filtrar apenas posts fallback com imagens
    const postsWithImages = fallbackPosts.filter(post => post.featuredImage)
    
    console.log(`📊 Encontrados ${postsWithImages.length} posts fallback com imagens\n`)

    // Criar categorias necessárias
    const categories = new Set(postsWithImages.map(p => mapCategory(p.category)))
    console.log('📁 Criando/buscando categorias...')
    console.log(`  Categorias necessárias: ${Array.from(categories).join(', ')}`)
    const categoryMap: Record<string, string> = {}
    for (const categoryName of categories) {
      try {
        const categoryId = await findOrCreateCategory(categoryName)
        if (categoryId) {
          categoryMap[categoryName] = categoryId
          console.log(`  ✅ Categoria "${categoryName}" (ID: ${categoryId})`)
        } else {
          console.log(`  ⚠️  Falha ao criar/buscar categoria "${categoryName}"`)
        }
      } catch (error) {
        console.error(`  ❌ Erro ao criar categoria "${categoryName}":`, error)
      }
    }
    console.log('')

    // Criar colunistas necessários
    console.log('👤 Criando/buscando colunistas...')
    const columnistMap: Record<string, string> = {}
    const authorNames = new Set<string>()
    
    // Extrair nomes de autores dos posts completos
    for (const slug in fallbackPostsFull) {
      const post = fallbackPostsFull[slug]
      if (post.author?.name) {
        authorNames.add(post.author.name)
      }
    }
    
    for (const authorName of authorNames) {
      const columnistId = await findOrCreateColumnist(authorName)
      if (columnistId) {
        columnistMap[authorName] = columnistId
        console.log(`  ✅ Colunista "${authorName}" (ID: ${columnistId})`)
      }
    }
    console.log('')

    // Processar cada post
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < postsWithImages.length; i++) {
      const fallbackPost = postsWithImages[i]
      const fullPost = fallbackPostsFull[fallbackPost.slug]
      
      if (!fullPost) {
        console.log(`⚠️  Post completo não encontrado para slug: ${fallbackPost.slug}`)
        errorCount++
        continue
      }

      console.log(`📝 Processando post ${i + 1}/${postsWithImages.length}: "${fallbackPost.title}"`)

      try {
        // Fazer upload da imagem
        let imageId: string | null = null
        if (fallbackPost.featuredImage) {
          console.log(`  📸 Fazendo upload da imagem: ${fallbackPost.featuredImage}`)
          imageId = await uploadLocalImage(
            fallbackPost.featuredImage,
            fallbackPost.title,
            `Imagem destacada de ${fallbackPost.title}`
          )
          if (imageId) {
            console.log(`  ✅ Imagem enviada com sucesso (ID: ${imageId})`)
          } else {
            console.log(`  ⚠️  Falha no upload da imagem, continuando sem imagem`)
          }
        }

        // Buscar categoria
        const categoryName = mapCategory(fallbackPost.category)
        const categoryId = categoryMap[categoryName]
        if (!categoryId) {
          throw new Error(`Categoria "${categoryName}" não encontrada`)
        }

        // Buscar autor se existir
        let authorId: string | undefined
        if (fullPost.author?.name) {
          authorId = columnistMap[fullPost.author.name]
        }

        // Extrair tags se existirem
        const tags = fullPost.tags?.map((tag: any) => ({ tag: typeof tag === 'string' ? tag : tag.tag })) || []

        // Criar post
        const result = await upsertPost({
          title: fallbackPost.title,
          slug: fallbackPost.slug,
          excerpt: fallbackPost.excerpt || fullPost.excerpt,
          content: fullPost.content || {
            root: {
              children: [
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: fallbackPost.excerpt || '',
                      type: 'text',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  type: 'paragraph',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'root',
              version: 1,
            },
          },
          category: categoryId,
          featuredImage: imageId || undefined,
          tags: tags.length > 0 ? tags : undefined,
          author: authorId,
          status: 'published',
          publishedDate: fallbackPost.publishedDate || fullPost.publishedDate,
          featured: fallbackPost.featured || fullPost.featured || false,
        })

        if (result) {
          const postId = result.id || result.doc?.id || 'N/A'
          const postSlug = result.slug || result.doc?.slug || 'N/A'
          console.log(`  ✅ Post criado/atualizado com sucesso! (ID: ${postId}, Slug: ${postSlug})\n`)
          successCount++
        } else {
          console.log(`  ❌ Falha ao criar post\n`)
          errorCount++
        }
      } catch (error) {
        console.error(`  ❌ Erro ao processar post:`, error)
        errorCount++
        console.log('')
      }
    }

    console.log('✨ Processo concluído!')
    console.log(`\n📊 Resumo:`)
    console.log(`   - Posts processados: ${postsWithImages.length}`)
    console.log(`   - Sucesso: ${successCount}`)
    console.log(`   - Erros: ${errorCount}`)
    console.log(`\n🎉 Migração finalizada!`)
  } catch (error) {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  }
}

// Executar
main().catch(console.error)
