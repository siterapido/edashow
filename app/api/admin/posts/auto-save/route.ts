import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * API para auto-save de rascunhos
 * Salva automaticamente sem alterar o status
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
    
    const { id, ...postData } = body
    
    // Se tiver ID, atualizar post existente
    if (id) {
      try {
        const updated = await payload.update({
          collection: 'posts',
          id,
          data: {
            ...postData,
            // Manter status como draft se não especificado
            status: postData.status || 'draft',
          },
        })
        
        return NextResponse.json({
          success: true,
          saved: true,
          timestamp: new Date().toISOString(),
          data: updated,
        })
      } catch (error: any) {
        console.error('Erro ao salvar rascunho:', error)
        return NextResponse.json(
          { error: 'Erro ao salvar rascunho', message: error.message },
          { status: 500 }
        )
      }
    } else {
      // Criar novo post como rascunho
      try {
        const created = await payload.create({
          collection: 'posts',
          data: {
            ...postData,
            status: 'draft',
          },
        })
        
        return NextResponse.json({
          success: true,
          saved: true,
          timestamp: new Date().toISOString(),
          data: created,
        })
      } catch (error: any) {
        console.error('Erro ao criar rascunho:', error)
        return NextResponse.json(
          { error: 'Erro ao criar rascunho', message: error.message },
          { status: 500 }
        )
      }
    }
  } catch (error: any) {
    console.error('Erro no auto-save:', error)
    return NextResponse.json(
      { error: 'Erro no auto-save', message: error.message },
      { status: 500 }
    )
  }
}








