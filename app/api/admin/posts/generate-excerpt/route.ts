import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generateExcerpt } from '../../../../../lib/admin/posts/excerpt-generator'

/**
 * API para gerar excerpt a partir do conteúdo
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
    
    const { content, maxLength } = body
    
    if (!content) {
      return NextResponse.json(
        { error: 'Conteúdo é obrigatório' },
        { status: 400 }
      )
    }
    
    // Gerar excerpt
    const excerpt = generateExcerpt(content, maxLength || 150)
    
    return NextResponse.json({
      success: true,
      excerpt,
      length: excerpt.length,
    })
  } catch (error: any) {
    console.error('Erro ao gerar excerpt:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar excerpt', message: error.message },
      { status: 500 }
    )
  }
}











