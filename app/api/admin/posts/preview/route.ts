import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * API para gerar preview de um post
 * Suporta preview de posts não salvos ainda
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await req.json()
    
    // Verificar autenticação
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    // Dados do post (pode ser um post não salvo ainda)
    const postData = {
      title: body.title || 'Sem título',
      slug: body.slug || 'preview',
      excerpt: body.excerpt || '',
      content: body.content || {},
      featuredImage: body.featuredImage || null,
      category: body.category || 'news',
      author: body.author || null,
      tags: body.tags || [],
      publishedDate: body.publishedDate || new Date().toISOString(),
      status: body.status || 'draft',
    }
    
    // Buscar autor se fornecido
    let authorData = null
    if (postData.author) {
      try {
        const author = await payload.findByID({
          collection: 'columnists',
          id: typeof postData.author === 'string' ? postData.author : postData.author.id,
        })
        authorData = author
      } catch (error) {
        // Autor não encontrado, continuar sem autor
      }
    }
    
    // Buscar imagem destacada se fornecida
    let featuredImageData = null
    if (postData.featuredImage) {
      try {
        const image = await payload.findByID({
          collection: 'media',
          id: typeof postData.featuredImage === 'string' ? postData.featuredImage : postData.featuredImage.id,
        })
        featuredImageData = image
      } catch (error) {
        // Imagem não encontrada, continuar sem imagem
      }
    }
    
    // Retornar dados formatados para preview
    return NextResponse.json({
      success: true,
      data: {
        ...postData,
        author: authorData,
        featuredImage: featuredImageData,
        previewUrl: `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/posts/${postData.slug}`,
      },
    })
  } catch (error: any) {
    console.error('Erro ao gerar preview:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar preview', message: error.message },
      { status: 500 }
    )
  }
}








