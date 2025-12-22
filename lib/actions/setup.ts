'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export interface SetupFormData {
  email: string
  password: string
  name: string
}

export interface SetupError {
  message: string
  errors?: Array<{
    message: string
    field?: string
  }>
}

/**
 * Verifica se já existe um usuário admin no sistema
 */
export async function hasAdmin(): Promise<boolean> {
  try {
    const payload = await getPayload({ config })
    
    const result = await payload.find({
      collection: 'users',
      where: {
        role: {
          equals: 'admin',
        },
      },
      limit: 1,
    })
    
    return result.docs.length > 0
  } catch (error) {
    console.error('Erro ao verificar admin:', error)
    return false
  }
}

/**
 * Cria o primeiro usuário administrador
 */
export async function createFirstAdmin(
  formData: SetupFormData
): Promise<{ success: true } | SetupError> {
  try {
    const payload = await getPayload({ config })
    
    // Verificar se já existe admin
    const adminExists = await hasAdmin()
    if (adminExists) {
      return {
        message: 'Já existe um administrador no sistema. Use a página de login.',
        errors: [{ message: 'Admin já existe' }],
      }
    }
    
    // Validar dados
    if (!formData.email || !formData.password || !formData.name) {
      return {
        message: 'Todos os campos são obrigatórios',
        errors: [{ message: 'Preencha todos os campos' }],
      }
    }
    
    if (formData.password.length < 8) {
      return {
        message: 'A senha deve ter pelo menos 8 caracteres',
        errors: [{ message: 'Senha muito curta', field: 'password' }],
      }
    }
    
    // Criar usuário admin no Payload CMS
    const user = await payload.create({
      collection: 'users',
      data: {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: 'admin',
      },
    })
    
    if (!user) {
      return {
        message: 'Erro ao criar usuário administrador no Payload',
        errors: [{ message: 'Falha na criação' }],
      }
    }
    
    return { success: true }
  } catch (error: any) {
    console.error('Erro ao criar admin:', error)
    
    // Tratar erros específicos
    if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
      return {
        message: 'Este email já está em uso',
        errors: [{ message: 'Email duplicado', field: 'email' }],
      }
    }
    
    return {
      message: error.message || 'Erro ao criar usuário administrador',
      errors: [{ message: error.message || 'Erro desconhecido' }],
    }
  }
}
