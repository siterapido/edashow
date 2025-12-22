import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * API para verificar e publicar posts agendados
 * Busca posts com publishedDate <= agora e status "draft"
 * Atualiza status para "published"
 */
export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Verificar autenticação
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    const now = new Date().toISOString()
    
    // Buscar posts agendados que devem ser publicados
    const scheduledPosts = await payload.find({
      collection: 'posts',
      where: {
        and: [
          {
            status: {
              equals: 'draft',
            },
          },
          {
            publishedDate: {
              less_than_equal: now,
            },
          },
        ],
      },
      limit: 100,
    })
    
    const published: any[] = []
    const errors: any[] = []
    
    // Publicar cada post agendado
    for (const post of scheduledPosts.docs) {
      try {
        const updated = await payload.update({
          collection: 'posts',
          id: post.id,
          data: {
            status: 'published',
          },
        })
        
        published.push({
          id: post.id,
          title: post.title,
          publishedDate: post.publishedDate,
        })
      } catch (error: any) {
        errors.push({
          id: post.id,
          title: post.title,
          error: error.message,
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      checked: scheduledPosts.docs.length,
      published: published.length,
      errors: errors.length,
      publishedPosts: published,
      errorsList: errors,
    })
  } catch (error: any) {
    console.error('Erro ao verificar posts agendados:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar posts agendados', message: error.message },
      { status: 500 }
    )
  }
}








