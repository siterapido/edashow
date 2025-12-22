'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * NOTA: Estas são Server Actions para autenticação customizada.
 * 
 * O login padrão do Payload CMS está disponível em /admin e é recomendado
 * para uso no painel administrativo. Estas funções são mantidas para casos
 * onde é necessário um fluxo de login customizado fora do admin padrão.
 */

export interface LoginFormData {
  email: string
  password: string
}

export interface AuthResponse {
  user?: any
  token?: string
}

export interface AuthError {
  message: string
  errors?: Array<{
    message: string
    field?: string
  }>
}

/**
 * Server Action para fazer login no Payload CMS
 * Usa Local API do Payload e define cookies manualmente
 */
export async function login(formData: LoginFormData): Promise<AuthResponse | AuthError> {
  try {
    const payload = await getPayload({ config })

    const { user, token, exp } = await payload.login({
      collection: 'users',
      data: {
        email: formData.email,
        password: formData.password,
      },
    })

    if (!user || !token) {
      return {
        message: 'Credenciais inválidas',
        errors: [{ message: 'Email ou senha incorretos' }],
      }
    }

    // Definir cookie de sessão do Payload
    // O Payload CMS usa 'payload-token' como nome padrão do cookie
    const cookieStore = await cookies()
    cookieStore.set('payload-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: exp ? new Date(exp * 1000) : undefined,
    })

    // Redirecionar para o admin após login bem-sucedido
    redirect('/admin')
  } catch (error: any) {
    if (error.digest?.includes('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Erro no login:', error)
    
    // Tratar erros específicos do Payload
    if (error.message?.includes('Invalid credentials') || 
        error.message?.includes('Unauthorized') ||
        error.message?.includes('not found')) {
      return {
        message: 'Credenciais inválidas',
        errors: [{ message: 'Email ou senha incorretos' }],
      }
    }

    return {
      message: error.message || 'Erro ao fazer login',
      errors: [{ message: error.message || 'Erro desconhecido' }],
    }
  }
}

/**
 * Server Action para fazer logout
 */
export async function logout(): Promise<void> {
  try {
    const cookieStore = cookies()

    // Remover cookie de sessão do Payload
    cookieStore.delete('payload-token')
    
    // O Payload CMS gerencia logout automaticamente quando o cookie é removido
  } catch (error: any) {
    if (error.digest?.includes('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Erro no logout:', error)
  }
  
  redirect('/login')
}

/**
 * Verificar se o usuário está autenticado e obter dados
 */
export async function getCurrentUser() {
  try {
    const payload = await getPayload({ config })
    const cookieStore = await cookies()

    // Criar headers com cookies para verificação de autenticação
    const cookieHeader = cookieStore.getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ')
    
    const { user } = await payload.auth({ 
      headers: { 
        cookie: cookieHeader 
      } as any 
    })
    
    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name || user.email?.split('@')[0],
      role: user.role || 'user',
    }
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error)
    return null
  }
}

/**
 * Verificar se o usuário tem uma role específica
 */
export async function hasRole(role: string): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === role
}

/**
 * Verificar se o usuário está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user
}
