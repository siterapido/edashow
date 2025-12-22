import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generateSlug, ensureUniqueSlug } from '../../../../../lib/admin/posts/slug-generator'

/**
 * API para gerar slug a partir do título
 * Verifica se slug já existe e sugere alternativas
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
    
    const { title, excludeId } = body
    
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      )
    }
    
    // Gerar slug
    const slug = generateSlug(title)
    
    // Verificar se slug já existe
    try {
      const where: any = {
        slug: {
          equals: slug,
        },
      }
      
      // Excluir o próprio post se estiver editando
      if (excludeId) {
        where.id = {
          not_equals: excludeId,
        }
      }
      
      const existingPosts = await payload.find({
        collection: 'posts',
        where,
        limit: 1,
      })
      
      if (existingPosts.docs.length > 0) {
        // Buscar todos os slugs similares para gerar sufixo único
        const similarSlugs = await payload.find({
          collection: 'posts',
          where: {
            slug: {
              contains: slug,
            },
          },
          limit: 100,
        })
        
        const existingSlugs = similarSlugs.docs.map((doc: any) => doc.slug)
        const uniqueSlug = ensureUniqueSlug(slug, existingSlugs)
        
        return NextResponse.json({
          success: true,
          slug: uniqueSlug,
          original: slug,
          isUnique: false,
          message: `Slug "${slug}" já existe. Sugestão: "${uniqueSlug}"`,
        })
      }
      
      return NextResponse.json({
        success: true,
        slug,
        isUnique: true,
      })
    } catch (error: any) {
      console.error('Erro ao verificar slug:', error)
      // Retornar slug gerado mesmo se houver erro na verificação
      return NextResponse.json({
        success: true,
        slug,
        isUnique: null,
        warning: 'Não foi possível verificar unicidade do slug',
      })
    }
  } catch (error: any) {
    console.error('Erro ao gerar slug:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar slug', message: error.message },
      { status: 500 }
    )
  }
}











