import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * API route para login no Payload CMS (CUSTOM)
 * 
 * NOTA: Este é um endpoint de login customizado. O login padrão do Payload CMS
 * está disponível em /admin e é recomendado para uso no painel administrativo.
 * 
 * Este endpoint pode ser usado para integrações customizadas ou fluxos específicos
 * que não usam o admin padrão do Payload.
 * 
 * Gerencia cookies automaticamente
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Fazer login usando Local API
    const { user, token } = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })

    if (!user || !token) {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Criar resposta com cookie
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    })

    // Definir cookie de sessão do Payload
    // O Payload CMS usa 'payload-token' como nome do cookie
    response.cookies.set('payload-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })

    return response
  } catch (error: any) {
    console.error('Erro no login:', error)
    
    // Tratar erros específicos
    if (error.message?.includes('Invalid credentials') || error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: error.message || 'Erro ao fazer login' },
      { status: 500 }
    )
  }
}
