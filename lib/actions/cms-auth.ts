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

export async function login(formData: { email: string; password: string }): Promise<{ success: boolean } | AuthError> {
  const supabase = await createClient()

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

  // Check if user has CMS access role
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    const cmsRoles = ['admin', 'editor', 'author', 'columnist', 'contributor']
    if (!roleData || !cmsRoles.includes(roleData.role)) {
      await supabase.auth.signOut()
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
  await supabase.auth.signOut()
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
    ...profile
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  const cmsRoles = ['admin', 'editor', 'author', 'columnist', 'contributor']
  return !!user && cmsRoles.includes(user.role)
}

