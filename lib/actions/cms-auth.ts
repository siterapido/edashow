'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export interface AuthError {
  message: string
  errors?: Array<{
    message: string
    field?: string
  }>
}

// Cookie name for remember-me preference
const REMEMBER_ME_COOKIE = 'cms_remember_me'

export async function login(formData: { email: string; password: string; rememberMe?: boolean }): Promise<{ success: boolean } | AuthError> {
  const supabase = await createClient()
  const cookieStore = await cookies()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    return {
      message: 'Erro ao fazer login',
      errors: [{ message: error.message }],
    }
  }

  // Save remember-me preference
  const rememberMe = formData.rememberMe ?? true
  cookieStore.set(REMEMBER_ME_COOKIE, rememberMe ? 'true' : 'false', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // If remember me is true, cookie lasts 30 days; otherwise it's a session cookie
    ...(rememberMe ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  })

  // Check if user has admin/editor role
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!roleData || (roleData.role !== 'admin' && roleData.role !== 'editor')) {
      await supabase.auth.signOut()
      cookieStore.delete(REMEMBER_ME_COOKIE)
      return {
        message: 'Acesso negado',
        errors: [{ message: 'Você não tem permissão para acessar o painel' }],
      }
    }
  }

  redirect('/cms/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  const cookieStore = await cookies()

  await supabase.auth.signOut()
  cookieStore.delete(REMEMBER_ME_COOKIE)

  redirect('/cms/login')
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  return {
    id: user.id,
    email: user.email,
    name: profile?.name || user.email?.split('@')[0],
    role: roleData?.role || 'user',
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user && (user.role === 'admin' || user.role === 'editor')
}
