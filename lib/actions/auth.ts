'use server'

import { redirect } from 'next/navigation'
import * as cmsAuth from './cms-auth'

/**
 * Mapeamento das funções de auth para usar o novo sistema baseado em Supabase
 */

export type LoginFormData = {
  email: string
  password: string
}

export type AuthResponse = {
  user?: any
  token?: string
}

export type AuthError = {
  message: string
  errors?: Array<{
    message: string
    field?: string
  }>
}

export async function login(formData: LoginFormData): Promise<AuthResponse | AuthError> {
  const result = await cmsAuth.login(formData)
  if ('message' in result) {
    return result as AuthError
  }
  // No caso de sucesso, o login() do cmsAuth já redireciona para /cms/dashboard
  // mas como esta função é usada em outros lugares, podemos retornar o resultado
  return { user: {} }
}

export async function logout(): Promise<void> {
  return await cmsAuth.logout()
}

export async function getCurrentUser() {
  return await cmsAuth.getCurrentUser()
}

export async function isAuthenticated(): Promise<boolean> {
  return await cmsAuth.isAuthenticated()
}

export async function signup(formData: { fullName: string; email: string; password: string }): Promise<AuthResponse | AuthError> {
  // Para signup, podemos implementar usando Supabase se necessário, 
  // ou apenas redirecionar/retornar erro por enquanto
  return {
    message: 'Funcionalidade de cadastro desativada no momento.',
    errors: [{ message: 'Por favor, entre em contato com o administrador.' }]
  }
}



