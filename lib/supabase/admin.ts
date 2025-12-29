import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
    // Remove whitespace/newlines from service role key to avoid "invalid header value" errors
    const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/\s/g, '')

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )
}
