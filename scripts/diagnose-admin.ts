/**
 * Script de Diagnóstico do Painel Admin
 * 
 * Execute este script para verificar se o painel admin do Payload CMS
 * está configurado corretamente.
 * 
 * Uso: tsx scripts/diagnose-admin.ts
 */

import { config } from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Carregar variáveis de ambiente
config()

interface DiagnosticResult {
  category: string
  checks: Array<{
    name: string
    status: 'ok' | 'warning' | 'error'
    message: string
  }>
}

const results: DiagnosticResult[] = []

/**
 * Verifica variáveis de ambiente
 */
function checkEnvironmentVariables(): DiagnosticResult {
  const checks: DiagnosticResult['checks'] = []

  // DATABASE_URI
  if (!process.env.DATABASE_URI) {
    checks.push({
      name: 'DATABASE_URI',
      status: 'error',
      message: 'Variável DATABASE_URI não está definida',
    })
  } else if (!process.env.DATABASE_URI.startsWith('postgresql://')) {
    checks.push({
      name: 'DATABASE_URI',
      status: 'warning',
      message: 'DATABASE_URI pode estar em formato inválido (deve começar com postgresql://)',
    })
  } else {
    checks.push({
      name: 'DATABASE_URI',
      status: 'ok',
      message: 'Configurado corretamente',
    })
  }

  // PAYLOAD_SECRET
  if (!process.env.PAYLOAD_SECRET) {
    checks.push({
      name: 'PAYLOAD_SECRET',
      status: 'error',
      message: 'Variável PAYLOAD_SECRET não está definida',
    })
  } else if (process.env.PAYLOAD_SECRET.length < 32) {
    checks.push({
      name: 'PAYLOAD_SECRET',
      status: 'error',
      message: `PAYLOAD_SECRET muito curto (${process.env.PAYLOAD_SECRET.length} caracteres, mínimo 32)`,
    })
  } else {
    checks.push({
      name: 'PAYLOAD_SECRET',
      status: 'ok',
      message: 'Configurado corretamente',
    })
  }

  // NEXT_PUBLIC_SERVER_URL
  if (!process.env.NEXT_PUBLIC_SERVER_URL) {
    checks.push({
      name: 'NEXT_PUBLIC_SERVER_URL',
      status: 'warning',
      message: 'NEXT_PUBLIC_SERVER_URL não definido (usando padrão)',
    })
  } else {
    try {
      new URL(process.env.NEXT_PUBLIC_SERVER_URL)
      checks.push({
        name: 'NEXT_PUBLIC_SERVER_URL',
        status: 'ok',
        message: 'Configurado corretamente',
      })
    } catch {
      checks.push({
        name: 'NEXT_PUBLIC_SERVER_URL',
        status: 'error',
        message: 'NEXT_PUBLIC_SERVER_URL não é uma URL válida',
      })
    }
  }

  // Supabase Storage
  const supabaseVars = [
    'SUPABASE_ENDPOINT',
    'SUPABASE_BUCKET',
    'SUPABASE_ACCESS_KEY_ID',
    'SUPABASE_SECRET_ACCESS_KEY',
  ]

  supabaseVars.forEach((varName) => {
    if (!process.env[varName]) {
      checks.push({
        name: varName,
        status: 'error',
        message: `${varName} não está definido`,
      })
    } else {
      checks.push({
        name: varName,
        status: 'ok',
        message: 'Configurado',
      })
    }
  })

  return {
    category: 'Variáveis de Ambiente',
    checks,
  }
}

/**
 * Verifica estrutura de arquivos
 */
function checkFileStructure(): DiagnosticResult {
  const checks: DiagnosticResult['checks'] = []

  const requiredFiles = [
    { path: 'payload.config.ts', name: 'Configuração do Payload' },
    { path: 'app/(payload)/admin/[[...segments]]/page.tsx', name: 'Página Admin' },
    { path: 'app/(payload)/layout.tsx', name: 'Layout Payload' },
    { path: 'next.config.mjs', name: 'Configuração do Next.js' },
    { path: 'tsconfig.json', name: 'Configuração TypeScript' },
  ]

  requiredFiles.forEach(({ path: filePath, name }) => {
    const fullPath = path.join(process.cwd(), filePath)
    if (fs.existsSync(fullPath)) {
      checks.push({
        name,
        status: 'ok',
        message: `Arquivo existe: ${filePath}`,
      })
    } else {
      checks.push({
        name,
        status: 'error',
        message: `Arquivo não encontrado: ${filePath}`,
      })
    }
  })

  return {
    category: 'Estrutura de Arquivos',
    checks,
  }
}

/**
 * Verifica configuração do TypeScript
 */
function checkTypeScriptConfig(): DiagnosticResult {
  const checks: DiagnosticResult['checks'] = []

  try {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json')
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'))

    // Verificar alias @payload-config
    if (
      tsconfig.compilerOptions?.paths?.['@payload-config'] &&
      tsconfig.compilerOptions.paths['@payload-config'].includes('./payload.config.ts')
    ) {
      checks.push({
        name: 'Alias @payload-config',
        status: 'ok',
        message: 'Configurado corretamente',
      })
    } else {
      checks.push({
        name: 'Alias @payload-config',
        status: 'error',
        message: 'Alias @payload-config não está configurado em tsconfig.json',
      })
    }

    // Verificar moduleResolution
    if (tsconfig.compilerOptions?.moduleResolution === 'bundler') {
      checks.push({
        name: 'Module Resolution',
        status: 'ok',
        message: 'Usando "bundler" (recomendado)',
      })
    } else {
      checks.push({
        name: 'Module Resolution',
        status: 'warning',
        message: `Usando "${tsconfig.compilerOptions?.moduleResolution}" (recomendado: "bundler")`,
      })
    }
  } catch (error) {
    checks.push({
      name: 'Leitura do tsconfig.json',
      status: 'error',
      message: `Erro ao ler tsconfig.json: ${error}`,
    })
  }

  return {
    category: 'Configuração TypeScript',
    checks,
  }
}

/**
 * Verifica dependências instaladas
 */
function checkDependencies(): DiagnosticResult {
  const checks: DiagnosticResult['checks'] = []

  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

    const requiredDeps = {
      payload: '^3.69.0',
      '@payloadcms/next': '^3.69.0',
      '@payloadcms/db-postgres': '^3.69.0',
      '@payloadcms/richtext-lexical': '^3.69.0',
      '@payloadcms/storage-s3': '^3.69.0',
      next: '15.5.9',
    }

    Object.entries(requiredDeps).forEach(([pkg, version]) => {
      const installedVersion = packageJson.dependencies?.[pkg]
      if (!installedVersion) {
        checks.push({
          name: pkg,
          status: 'error',
          message: `Pacote ${pkg} não está instalado`,
        })
      } else {
        checks.push({
          name: pkg,
          status: 'ok',
          message: `Instalado: ${installedVersion}`,
        })
      }
    })
  } catch (error) {
    checks.push({
      name: 'Leitura do package.json',
      status: 'error',
      message: `Erro ao ler package.json: ${error}`,
    })
  }

  return {
    category: 'Dependências',
    checks,
  }
}

/**
 * Exibe os resultados do diagnóstico
 */
function displayResults(results: DiagnosticResult[]): void {
  console.log('\n' + '='.repeat(80))
  console.log('🔍 DIAGNÓSTICO DO PAINEL ADMIN - PAYLOAD CMS')
  console.log('='.repeat(80) + '\n')

  let hasErrors = false
  let hasWarnings = false

  results.forEach((result) => {
    console.log(`\n📋 ${result.category}`)
    console.log('-'.repeat(80))

    result.checks.forEach((check) => {
      let icon = '✅'
      if (check.status === 'warning') {
        icon = '⚠️ '
        hasWarnings = true
      } else if (check.status === 'error') {
        icon = '❌'
        hasErrors = true
      }

      console.log(`${icon} ${check.name}: ${check.message}`)
    })
  })

  console.log('\n' + '='.repeat(80))
  
  if (hasErrors) {
    console.log('❌ Diagnóstico concluído com ERROS')
    console.log('   Por favor, corrija os erros acima antes de iniciar o servidor.')
  } else if (hasWarnings) {
    console.log('⚠️  Diagnóstico concluído com avisos')
    console.log('   O sistema pode funcionar, mas verifique os avisos acima.')
  } else {
    console.log('✅ Diagnóstico concluído com SUCESSO')
    console.log('   Todas as verificações passaram. O painel admin deve funcionar corretamente.')
  }
  
  console.log('='.repeat(80) + '\n')
}

/**
 * Executa o diagnóstico
 */
async function runDiagnostics(): Promise<void> {
  console.log('Executando diagnóstico...\n')

  results.push(checkEnvironmentVariables())
  results.push(checkFileStructure())
  results.push(checkTypeScriptConfig())
  results.push(checkDependencies())

  displayResults(results)
}

// Executar diagnóstico
runDiagnostics().catch((error) => {
  console.error('❌ Erro ao executar diagnóstico:', error)
  process.exit(1)
})




