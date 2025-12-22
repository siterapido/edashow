/**
 * Valida e garante que todas as variáveis de ambiente críticas estejam configuradas
 * 
 * Este arquivo deve ser importado no início da aplicação para garantir que
 * todas as variáveis necessárias estejam presentes antes de inicializar o Payload CMS
 */

interface EnvironmentConfig {
  // Banco de Dados
  DATABASE_URI: string
  
  // Payload CMS
  PAYLOAD_SECRET: string
  NEXT_PUBLIC_SERVER_URL: string
  
  // Supabase Storage
  SUPABASE_ENDPOINT: string
  SUPABASE_REGION: string
  SUPABASE_BUCKET: string
  SUPABASE_ACCESS_KEY_ID: string
  SUPABASE_SECRET_ACCESS_KEY: string
}

interface ValidationResult {
  isValid: boolean
  missingVars: string[]
  invalidVars: { name: string; reason: string }[]
}

/**
 * Lista de variáveis de ambiente obrigatórias
 */
const REQUIRED_ENV_VARS: (keyof EnvironmentConfig)[] = [
  'DATABASE_URI',
  'PAYLOAD_SECRET',
  'NEXT_PUBLIC_SERVER_URL',
  'SUPABASE_ENDPOINT',
  'SUPABASE_REGION',
  'SUPABASE_BUCKET',
  'SUPABASE_ACCESS_KEY_ID',
  'SUPABASE_SECRET_ACCESS_KEY',
]

/**
 * Valida uma variável de ambiente específica
 */
function validateEnvVar(name: keyof EnvironmentConfig, value: string | undefined): { valid: boolean; reason?: string } {
  if (!value || value.trim() === '') {
    return { valid: false, reason: 'Variável não definida ou vazia' }
  }

  // Validações específicas
  switch (name) {
    case 'PAYLOAD_SECRET':
      if (value.length < 32) {
        return { valid: false, reason: 'PAYLOAD_SECRET deve ter pelo menos 32 caracteres' }
      }
      break
      
    case 'DATABASE_URI':
      if (!value.startsWith('postgresql://') && !value.startsWith('postgres://')) {
        return { valid: false, reason: 'DATABASE_URI deve começar com postgresql:// ou postgres://' }
      }
      break
      
    case 'NEXT_PUBLIC_SERVER_URL':
      try {
        new URL(value)
      } catch {
        return { valid: false, reason: 'NEXT_PUBLIC_SERVER_URL deve ser uma URL válida' }
      }
      break
      
    case 'SUPABASE_ENDPOINT':
      try {
        new URL(value)
      } catch {
        return { valid: false, reason: 'SUPABASE_ENDPOINT deve ser uma URL válida' }
      }
      break
  }

  return { valid: true }
}

/**
 * Valida todas as variáveis de ambiente necessárias
 */
export function validateEnvironment(): ValidationResult {
  const missingVars: string[] = []
  const invalidVars: { name: string; reason: string }[] = []

  for (const varName of REQUIRED_ENV_VARS) {
    const value = process.env[varName]
    const validation = validateEnvVar(varName, value)

    if (!validation.valid) {
      if (!value || value.trim() === '') {
        missingVars.push(varName)
      } else {
        invalidVars.push({ name: varName, reason: validation.reason || 'Inválida' })
      }
    }
  }

  return {
    isValid: missingVars.length === 0 && invalidVars.length === 0,
    missingVars,
    invalidVars,
  }
}

/**
 * Exibe erros de validação de forma formatada
 */
export function displayValidationErrors(result: ValidationResult): void {
  console.error('\n' + '='.repeat(80))
  console.error('❌ ERRO: Variáveis de ambiente não configuradas corretamente')
  console.error('='.repeat(80))

  if (result.missingVars.length > 0) {
    console.error('\n📋 Variáveis ausentes:')
    result.missingVars.forEach((varName) => {
      console.error(`   ❌ ${varName}`)
    })
  }

  if (result.invalidVars.length > 0) {
    console.error('\n⚠️  Variáveis inválidas:')
    result.invalidVars.forEach(({ name, reason }) => {
      console.error(`   ❌ ${name}: ${reason}`)
    })
  }

  console.error('\n💡 Para corrigir:')
  console.error('   1. Copie o arquivo .env.example para .env')
  console.error('   2. Preencha todas as variáveis necessárias')
  console.error('   3. Reinicie o servidor de desenvolvimento')
  console.error('\n' + '='.repeat(80) + '\n')
}

/**
 * Valida e exibe erros se necessário
 * Retorna true se válido, false caso contrário
 */
export function ensureEnvironment(): boolean {
  const result = validateEnvironment()

  if (!result.isValid) {
    displayValidationErrors(result)
    return false
  }

  return true
}

/**
 * Obtém uma variável de ambiente com valor padrão
 */
export function getEnvVar(name: keyof EnvironmentConfig, defaultValue?: string): string {
  const value = process.env[name]
  
  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw new Error(`Variável de ambiente ${name} não está definida`)
  }
  
  return value
}

/**
 * Exporta as variáveis de ambiente tipadas
 */
export const env = {
  DATABASE_URI: process.env.DATABASE_URI || '',
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || '',
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  SUPABASE_ENDPOINT: process.env.SUPABASE_ENDPOINT || '',
  SUPABASE_REGION: process.env.SUPABASE_REGION || 'us-east-1',
  SUPABASE_BUCKET: process.env.SUPABASE_BUCKET || '',
  SUPABASE_ACCESS_KEY_ID: process.env.SUPABASE_ACCESS_KEY_ID || '',
  SUPABASE_SECRET_ACCESS_KEY: process.env.SUPABASE_SECRET_ACCESS_KEY || '',
} as const
