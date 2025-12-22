"use client"

import { useEffect, useState } from "react"
import { generateCSSVariables, ThemeSettings } from "@/lib/theme"

export function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
    const [cssVars, setCssVars] = useState<string>("")

    useEffect(() => {
        async function fetchTheme() {
            try {
                const response = await fetch('/api/globals/site-settings')
                if (response.ok) {
                    const settings = await response.json()
                    const generated = generateCSSVariables(settings as ThemeSettings)
                    setCssVars(generated)
                }
            } catch (error) {
                console.error('Error fetching theme settings:', error)
            }
        }

        fetchTheme()
    }, [])

    return (
        <>
            {cssVars && (
                <style dangerouslySetInnerHTML={{ __html: cssVars }} />
            )}
            {children}
        </>
    )
}
