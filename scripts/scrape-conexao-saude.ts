#!/usr/bin/env ts-node

/**
 * Script para raspar notícias do site Conexão Saúde e importar para o Payload CMS
 * 
 * Uso:
 *   PAYLOAD_SERVER_URL=http://localhost:3000 PAYLOAD_API_TOKEN=token pnpm ts-node scripts/scrape-conexao-saude.ts
 * 
 * Variáveis de ambiente:
 *   PAYLOAD_SERVER_URL - URL do servidor Payload (padrão: http://localhost:3000)
 *   PAYLOAD_API_TOKEN - Token de autenticação (opcional, pode usar PAYLOAD_ADMIN_EMAIL e PAYLOAD_ADMIN_PASSWORD)
 *   PAYLOAD_ADMIN_EMAIL - Email do admin (padrão: admin@example.com)
 *   PAYLOAD_ADMIN_PASSWORD - Senha do admin (padrão: password)
 *   LIMIT - Limite de notícias para importar (padrão: 10)
 *   DELAY_MS - Delay entre requisições em ms (padrão: 1000)
 */

import * as cheerio from 'cheerio'
import slugify from 'slugify'
import { uploadMedia, upsertPost, findOrCreateColumnist } from '../lib/payload/client'

const CONEXAO_SAUDE_URL = 'https://conexaosaudebr.com.br'
const LIMIT = parseInt(process.env.LIMIT || '10')
const DELAY_MS = parseInt(process.env.DELAY_MS || '1000')

interface NewsItem {
  title: string
  url: string
  excerpt?: string
  imageUrl?: string
  date?: string
  author?: string
  category?: string
}

/**
 * Aguarda um tempo determinado
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Baixa e parseia o HTML de uma URL
 */
async function fetchHTML(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    return await response.text()
  } catch (error) {
    console.error(`Erro ao baixar ${url}:`, error)
    throw error
  }
}

/**
 * Extrai notícias da página inicial do Conexão Saúde
 */
async function scrapeHomePage(): Promise<NewsItem[]> {
  console.log('📥 Baixando página inicial...')
  const html = await fetchHTML(CONEXAO_SAUDE_URL)
  const $ = cheerio.load(html)
  
  const newsItems: NewsItem[] = []
  
  // Tentar diferentes seletores baseados na estrutura do site
  // Seletores comuns para sites WordPress/notícias
  const selectors = [
    'article',
    '.post',
    '.news-item',
    '.entry',
    '[class*="post"]',
    '[class*="news"]',
    '[class*="article"]',
  ]
  
  let found = false
  
  for (const selector of selectors) {
    $(selector).each((_, element) => {
      if (newsItems.length >= LIMIT) return false
      
      const $el = $(element)
      
      // Tentar encontrar título e link
      const titleEl = $el.find('h1, h2, h3, h4, .title, [class*="title"]').first()
      const linkEl = $el.find('a').first()
      
      if (titleEl.length === 0 && linkEl.length === 0) return
      
      const title = titleEl.text().trim() || linkEl.text().trim()
      const href = linkEl.attr('href') || $el.find('a').attr('href')
      
      if (!title || !href) return
      
      // Construir URL completa
      const url = href.startsWith('http') ? href : new URL(href, CONEXAO_SAUDE_URL).toString()
      
      // Tentar encontrar imagem
      const imgEl = $el.find('img').first()
      const imageUrl = imgEl.attr('src') || imgEl.attr('data-src')
      const fullImageUrl = imageUrl 
        ? (imageUrl.startsWith('http') ? imageUrl : new URL(imageUrl, CONEXAO_SAUDE_URL).toString())
        : undefined
      
      // Tentar encontrar resumo/excerpt
      const excerpt = $el.find('.excerpt, .summary, p').first().text().trim().substring(0, 200)
      
      // Tentar encontrar data
      const dateText = $el.find('time, .date, [class*="date"]').first().text().trim()
      
      // Tentar encontrar autor
      const authorText = $el.find('.author, [class*="author"]').first().text().trim()
      
      if (title && url) {
        newsItems.push({
          title,
          url,
          excerpt: excerpt || undefined,
          imageUrl: fullImageUrl,
          date: dateText || undefined,
          author: authorText || undefined,
        })
        found = true
      }
    })
    
    if (found) break
  }
  
  // Se não encontrou com seletores específicos, tentar buscar por links de notícias
  if (newsItems.length === 0) {
    console.log('⚠️  Seletores padrão não funcionaram, tentando busca alternativa...')
    
    // Buscar links que parecem ser de notícias
    $('a').each((_, element) => {
      if (newsItems.length >= LIMIT) return false
      
      const $link = $(element)
      const href = $link.attr('href')
      const text = $link.text().trim()
      
      if (!href || !text || text.length < 20) return
      
      // Filtrar links que não são de notícias
      if (href.includes('#') || href.includes('mailto:') || href.includes('javascript:')) return
      if (href.includes('/tag/') || href.includes('/category/') || href.includes('/author/')) return
      
      const url = href.startsWith('http') ? href : new URL(href, CONEXAO_SAUDE_URL).toString()
      
      // Buscar imagem próxima ao link
      const $parent = $link.parent()
      const imgEl = $parent.find('img').first() || $link.siblings('img').first()
      const imageUrl = imgEl.attr('src') || imgEl.attr('data-src')
      const fullImageUrl = imageUrl 
        ? (imageUrl.startsWith('http') ? imageUrl : new URL(imageUrl, CONEXAO_SAUDE_URL).toString())
        : undefined
      
      newsItems.push({
        title: text,
        url,
        imageUrl: fullImageUrl,
      })
    })
  }
  
  console.log(`✅ Encontradas ${newsItems.length} notícias`)
  return newsItems.slice(0, LIMIT)
}

/**
 * Extrai conteúdo completo de uma página de notícia
 */
async function scrapeNewsPage(url: string): Promise<{
  title: string
  content: string
  excerpt?: string
  imageUrl?: string
  date?: string
  author?: string
}> {
  await delay(DELAY_MS) // Respeitar o site
  
  console.log(`  📄 Baixando: ${url}`)
  const html = await fetchHTML(url)
  const $ = cheerio.load(html)
  
  // Tentar encontrar título
  const title = $('h1').first().text().trim() || 
                $('.entry-title, .post-title, [class*="title"]').first().text().trim() ||
                $('title').text().trim()
  
  // Tentar encontrar conteúdo principal
  const contentSelectors = [
    '.entry-content',
    '.post-content',
    '.article-content',
    'article .content',
    '[class*="content"]',
    'main article',
    '.post-body',
  ]
  
  let content = ''
  for (const selector of contentSelectors) {
    const $content = $(selector).first()
    if ($content.length > 0) {
      // Remover scripts, styles e elementos indesejados
      $content.find('script, style, .ad, .advertisement, .ads').remove()
      content = $content.html() || $content.text()
      if (content.length > 100) break
    }
  }
  
  // Se não encontrou conteúdo específico, pegar o primeiro article ou main
  if (!content || content.length < 100) {
    const $main = $('main, article').first()
    $main.find('script, style, .ad, .advertisement, .ads').remove()
    content = $main.html() || $main.text()
  }
  
  // Tentar encontrar imagem destacada
  const imageSelectors = [
    '.featured-image img',
    '.post-thumbnail img',
    'article img',
    '.entry-image img',
    '[class*="featured"] img',
  ]
  
  let imageUrl: string | undefined
  for (const selector of imageSelectors) {
    const $img = $(selector).first()
    const src = $img.attr('src') || $img.attr('data-src')
    if (src) {
      imageUrl = src.startsWith('http') ? src : new URL(src, url).toString()
      break
    }
  }
  
  // Tentar encontrar resumo/excerpt
  const excerpt = $('.excerpt, .summary, meta[property="og:description"]').first().text().trim() ||
                  $('meta[name="description"]').attr('content')
  
  // Tentar encontrar data
  const date = $('time').attr('datetime') || 
               $('time').text().trim() ||
               $('.date, [class*="date"]').first().text().trim()
  
  // Tentar encontrar autor
  const author = $('.author, [class*="author"]').first().text().trim() ||
                 $('meta[name="author"]').attr('content')
  
  return {
    title: title || 'Sem título',
    content: content || '',
    excerpt,
    imageUrl,
    date,
    author,
  }
}

/**
 * Converte HTML para formato Lexical (simplificado)
 */
function htmlToLexical(html: string): any {
  // Estrutura básica do Lexical
  return {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
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
  }
}

/**
 * Processa e importa uma notícia
 */
async function importNews(newsItem: NewsItem): Promise<void> {
  try {
    console.log(`\n📰 Processando: ${newsItem.title}`)
    
    // Buscar conteúdo completo se necessário
    let fullContent: NewsItem & { content?: string } = newsItem
    if (!newsItem.excerpt || newsItem.excerpt.length < 50) {
      try {
        const scraped = await scrapeNewsPage(newsItem.url)
        fullContent = {
          ...newsItem,
          ...scraped,
        }
      } catch (error) {
        console.warn(`  ⚠️  Erro ao buscar conteúdo completo: ${error}`)
      }
    }
    
    // Gerar slug único baseado na URL
    const urlPath = new URL(fullContent.url).pathname
    const slug = slugify(urlPath.split('/').filter(Boolean).pop() || fullContent.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    })
    
    // Upload de imagem se houver
    let mediaId: string | undefined
    if (fullContent.imageUrl) {
      console.log(`  🖼️  Fazendo upload da imagem...`)
      const media = await uploadMedia(
        fullContent.imageUrl,
        fullContent.title,
        `Imagem de ${fullContent.title}`
      )
      if (media) {
        mediaId = media.id
        console.log(`  ✅ Imagem enviada: ${media.filename}`)
      }
    }
    
    // Buscar ou criar colunista se houver autor
    let authorId: string | undefined
    if (fullContent.author) {
      console.log(`  👤 Buscando/criando colunista: ${fullContent.author}`)
      const columnistId = await findOrCreateColumnist(fullContent.author)
      authorId = columnistId || undefined
      if (authorId) {
        console.log(`  ✅ Colunista encontrado/criado`)
      }
    }
    
    // Converter conteúdo para Lexical
    const content = fullContent.content || fullContent.excerpt || ''
    const lexicalContent = htmlToLexical(content)
    
    // Criar ou atualizar post
    console.log(`  💾 Salvando no Payload CMS...`)
    const post = await upsertPost({
      title: fullContent.title,
      slug,
      excerpt: fullContent.excerpt || fullContent.title.substring(0, 200),
      content: lexicalContent,
      category: 'news', // Padrão para notícias importadas
      featuredImage: mediaId,
      author: authorId,
      status: 'published',
      publishedDate: fullContent.date ? new Date(fullContent.date).toISOString() : new Date().toISOString(),
      sourceUrl: fullContent.url,
    })
    
    if (post) {
      console.log(`  ✅ Post criado/atualizado: ${post.slug}`)
    } else {
      console.error(`  ❌ Falha ao salvar post`)
    }
    
  } catch (error) {
    console.error(`  ❌ Erro ao processar notícia:`, error)
  }
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Iniciando raspagem do Conexão Saúde\n')
  console.log(`📊 Configuração:`)
  console.log(`   - Limite: ${LIMIT} notícias`)
  console.log(`   - Delay: ${DELAY_MS}ms entre requisições`)
  console.log(`   - URL: ${CONEXAO_SAUDE_URL}\n`)
  
  try {
    // Raspar página inicial
    const newsItems = await scrapeHomePage()
    
    if (newsItems.length === 0) {
      console.log('❌ Nenhuma notícia encontrada')
      return
    }
    
    // Processar cada notícia
    for (let i = 0; i < newsItems.length; i++) {
      const item = newsItems[i]
      console.log(`\n[${i + 1}/${newsItems.length}]`)
      await importNews(item)
      
      // Delay entre itens (exceto o último)
      if (i < newsItems.length - 1) {
        await delay(DELAY_MS)
      }
    }
    
    console.log(`\n✅ Processo concluído! ${newsItems.length} notícias processadas.`)
    
  } catch (error) {
    console.error('\n❌ Erro fatal:', error)
    process.exit(1)
  }
}

// Executar
if (require.main === module) {
  main()
}













