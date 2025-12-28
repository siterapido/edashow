import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true })
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true })

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/\s/g, '')

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function ensureAdminRole(email: string) {
    console.log(`🔍 Verificando role de admin para: ${email}...`)

    // Get user by email
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers()

    if (getUserError) {
        console.error('  ❌ Erro ao buscar usuários:', getUserError)
        return
    }

    const user = users.find(u => u.email === email)

    if (!user) {
        console.error(`  ❌ Usuário ${email} não encontrado`)
        return
    }

    console.log(`  ✅ Usuário encontrado: ${user.id}`)

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

    if (roleError && roleError.code !== 'PGRST116') { // PGRST116 = not found
        console.error('  ❌ Erro ao verificar role:', roleError)
        return
    }

    if (roleData && roleData.role === 'admin') {
        console.log('  ✅ Usuário já possui role de admin!')
        return
    }

    // Insert or update the admin role
    const { error: upsertError } = await supabase
        .from('user_roles')
        .upsert({
            user_id: user.id,
            role: 'admin'
        }, {
            onConflict: 'user_id'
        })

    if (upsertError) {
        console.error('  ❌ Erro ao atribuir role de admin:', upsertError)
        return
    }

    console.log('  ✅ Role de admin atribuída com sucesso!')

    // Update profile to ensure it exists
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            email: user.email,
            name: user.email?.split('@')[0] || 'Admin',
            is_public: false
        }, {
            onConflict: 'id'
        })

    if (profileError) {
        console.error('  ⚠️  Aviso ao atualizar perfil:', profileError)
    } else {
        console.log('  ✅ Perfil atualizado!')
    }
}

const email = process.argv[2] || 'admin@edashow.com.br'
ensureAdminRole(email)
