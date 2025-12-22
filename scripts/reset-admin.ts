import { getPayload } from 'payload'
import config from '@payload-config'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(__dirname, '../.env') })

async function resetAdmin() {
  try {
    console.log('🔧 Inicializando Payload CMS...')
    const payload = await getPayload({ config })

    // 1. Listar todos os usuários
    console.log('\n📋 Listando usuários existentes...')
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1000,
    })

    console.log(`   Encontrados ${existingUsers.docs.length} usuário(s)`)

    // 2. Deletar todos os usuários
    if (existingUsers.docs.length > 0) {
      console.log('\n🗑️  Deletando usuários existentes...')
      for (const user of existingUsers.docs) {
        try {
          await payload.delete({
            collection: 'users',
            id: user.id,
          })
          console.log(`   ✓ Deletado: ${user.email} (ID: ${user.id})`)
        } catch (error: any) {
          console.error(`   ✗ Erro ao deletar ${user.email}:`, error.message)
        }
      }
    }

    // 3. Criar novo admin
    console.log('\n👤 Criando novo usuário admin...')
    const newAdmin = await payload.create({
      collection: 'users',
      data: {
        email: 'marckexpert1@gmail.com',
        password: '@Admin2026',
        name: 'Admin',
        role: 'admin',
      },
    })

    console.log('\n✅ Admin criado com sucesso!')
    console.log(`   Email: ${newAdmin.email}`)
    console.log(`   ID: ${newAdmin.id}`)
    console.log(`   Role: ${newAdmin.role}`)
    console.log('\n🎉 Processo concluído!')
    
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Erro ao resetar admin:', error)
    console.error('   Detalhes:', error.message)
    process.exit(1)
  }
}

resetAdmin()
