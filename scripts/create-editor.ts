import { getPayload } from 'payload'
import config from '@payload-config'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(__dirname, '../.env') })

async function createEditor() {
    try {
        console.log('🔧 Inicializando Payload CMS...')
        const payload = await getPayload({ config })

        const email = 'admin@edashow.com.br'
        const password = '@Admin2026'
        const role = 'editor'
        const name = 'Editor EdaShow'

        // 1. Verificar se o usuário já existe
        console.log(`\n🔍 Verificando se o usuário ${email} já existe...`)
        const existingUsers = await payload.find({
            collection: 'users',
            where: {
                email: {
                    equals: email,
                },
            },
        })

        if (existingUsers.docs.length > 0) {
            console.log(`\n⚠️  O usuário ${email} já existe. Atualizando senha e dados...`)
            const user = existingUsers.docs[0]
            await payload.update({
                collection: 'users',
                id: user.id,
                data: {
                    password,
                    name,
                    role,
                },
            })
            console.log(`\n✅ Usuário ${email} atualizado com sucesso!`)
        } else {
            // 2. Criar novo editor
            console.log(`\n👤 Criando novo usuário ${role}...`)
            const newEditor = await payload.create({
                collection: 'users',
                data: {
                    email,
                    password,
                    name,
                    role,
                },
            })

            console.log(`\n✅ Usuário ${role} criado com sucesso!`)
            console.log(`   Email: ${newEditor.email}`)
            console.log(`   ID: ${newEditor.id}`)
            console.log(`   Role: ${newEditor.role}`)
        }

        console.log('\n🎉 Processo concluído!')
        process.exit(0)
    } catch (error: any) {
        console.error('\n❌ Erro ao criar usuário editor:', error)
        if (error.data) {
            console.error('   Dados do erro:', JSON.stringify(error.data, null, 2))
        }
        process.exit(1)
    }
}

createEditor()
