import { NextResponse } from 'next/server'
import { getPublicSupabaseClient } from '@/lib/supabase/public-client'

export async function GET() {
    try {
        const supabase = getPublicSupabaseClient()
        const { data: theme, error } = await supabase
            .from('theme_settings')
            .select('*')
            .single()

        if (error) {
            console.warn('[API Site Settings] Theme settings not found in Supabase:', error)
            return NextResponse.json({
                themeColors: {
                    primary: '#FF6F00', // Default orange
                    background: '#ffffff',
                    foreground: '#0f172a',
                }
            })
        }

        return NextResponse.json({
            themeColors: {
                primary: theme.light_primary,
                background: theme.light_background,
                foreground: theme.light_foreground,
                darkModeColors: {
                    darkBackground: theme.dark_background,
                    darkForeground: theme.dark_foreground,
                }
            },
            typography: {
                borderRadius: '0.5rem'
            },
            socialMedia: theme.social_media || {}
        })
    } catch (error) {
        console.error('[API Site Settings] Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
