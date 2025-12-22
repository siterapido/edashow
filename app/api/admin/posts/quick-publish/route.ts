import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { validatePostFields } from '../../../../../lib/admin/posts/validation-helpers'

/**
 * API para publicação rápida de posts
 * Valida campos obrigatórios e publica imediatamente
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
    
    // Validar campos obrigatórios
    const validation = validatePostFields({
      title: body.title,
      slug: body.slug,
      content: body.content,
      category: body.category,
    })
    
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: 'Campos obrigatórios não preenchidos',
          errors: validation.errors,
        },
        { status: 400 }
      )
    }
    
    const { id, ...postData } = body
    
    // Preparar dados para publicação
    const publishData = {
      ...postData,
      status: 'published',
      publishedDate: postData.publishedDate || new Date().toISOString(),
    }
    
    // Se tiver ID, atualizar post existente
    if (id) {
      try {
        const updated = await payload.update({
          collection: 'posts',
          id,
          data: publishData,
        })
        
        return NextResponse.json({
          success: true,
          published: true,
          message: 'Post publicado com sucesso!',
          data: updated,
        })
      } catch (error: any) {
        console.error('Erro ao publicar post:', error)
        return NextResponse.json(
          { error: 'Erro ao publicar post', message: error.message },
          { status: 500 }
        )
      }
    } else {
      // Criar novo post e publicar
      try {
        const created = await payload.create({
          collection: 'posts',
          data: publishData,
        })
        
        return NextResponse.json({
          success: true,
          published: true,
          message: 'Post criado e publicado com sucesso!',
          data: created,
        })
      } catch (error: any) {
        console.error('Erro ao criar e publicar post:', error)
        return NextResponse.json(
          { error: 'Erro ao criar e publicar post', message: error.message },
          { status: 500 }
        )
      }
    }
  } catch (error: any) {
    console.error('Erro na publicação rápida:', error)
    return NextResponse.json(
      { error: 'Erro na publicação rápida', message: error.message },
      { status: 500 }
    )
  }
}











