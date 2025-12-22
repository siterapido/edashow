#!/usr/bin/env tsx

/**
 * Script para verificar se as variáveis de ambiente do Supabase estão configuradas
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

console.log('🔍 Verificando configuração do Supabase...\n')

const checks = [
  {
    name: 'DATABASE_URI',
    value: process.env.DATABASE_URI,
    hasPlaceholder: (value: string) => value?.includes('[SENHA]') || value?.includes('[ID-PROJETO]'),
    description: 'Connection string do PostgreSQL'
  },
  {
    name: 'PAYLOAD_SECRET',
    value: process.env.PAYLOAD_SECRET,
    hasPlaceholder: (value: string) => value === 'gerar-um-secret-forte-aqui',
    description: 'Secret para criptografia do Payload'
  },
  {
    name: 'SUPABASE_ENDPOINT',
    value: process.env.SUPABASE_ENDPOINT,
    hasPlaceholder: (value: string) => value?.includes('[ID-PROJETO]'),
    description: 'Endpoint do Storage do Supabase'
  },
  {
    name: 'SUPABASE_ACCESS_KEY_ID',
    value: process.env.SUPABASE_ACCESS_KEY_ID,
    hasPlaceholder: (value: string) => value === 'sua-access-key',
    description: 'Access Key do Supabase Storage'
  },
  {
    name: 'SUPABASE_SECRET_ACCESS_KEY',
    value: process.env.SUPABASE_SECRET_ACCESS_KEY,
    hasPlaceholder: (value: string) => value === 'sua-secret-key',
    description: 'Secret Key do Supabase Storage'
  }
]

let allConfigured = true

for (const check of checks) {
  const hasValue = !!check.value && check.value.trim() !== ''
  const hasPlaceholder = check.hasPlaceholder(check.value || '')

  if (!hasValue || hasPlaceholder) {
    console.log(`❌ ${check.name}: ${hasPlaceholder ? 'CONTÉM PLACEHOLDER' : 'NÃO CONFIGURADO'}`)
    console.log(`   Descrição: ${check.description}`)
    console.log(`   Valor atual: ${check.value || 'VAZIO'}\n`)
    allConfigured = false
  } else {
    console.log(`✅ ${check.name}: OK`)
  }
}

console.log('')

if (allConfigured) {
  console.log('🎉 Todas as variáveis estão configuradas!')
  console.log('Agora execute: npx tsx scripts/test-db.ts')
} else {
  console.log('⚠️  Configure as variáveis acima no arquivo .env')
  console.log('📖 Leia o arquivo SUPABASE_SETUP.md para instruções detalhadas')
}

console.log('')