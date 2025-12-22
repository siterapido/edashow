export interface ThemeSettings {
    themeColors?: {
        primary?: string
        primaryForeground?: string
        secondary?: string
        secondaryForeground?: string
        background?: string
        foreground?: string
        card?: string
        cardForeground?: string
        muted?: string
        mutedForeground?: string
        otherColors?: {
            border?: string
            ring?: string
            destructive?: string
            destructiveForeground?: string
        }
        darkModeColors?: {
            darkBackground?: string
            darkForeground?: string
            darkCard?: string
            darkCardForeground?: string
        }
    }
    typography?: {
        fontFamily?: string
        headingFontFamily?: string
        borderRadius?: string
    }
}

/**
 * Converte cores para o formato HSL aceito pelo Shadcn/UI se necessário,
 * ou retorna o valor original se já for compatível.
 * Nota: Shadcn usa H S L (espaçados) em variáveis CSS.
 */
function hexToHSLVariables(hex: string): string {
    if (!hex || !hex.startsWith('#')) return hex

    let r = 0, g = 0, b = 0
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16)
        g = parseInt(hex[2] + hex[2], 16)
        b = parseInt(hex[3] + hex[3], 16)
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16)
        g = parseInt(hex.substring(3, 5), 16)
        b = parseInt(hex.substring(5, 7), 16)
    }

    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break
            case g: h = (b - r) / d + 2; break
            case b: h = (r - g) / d + 4; break
        }
        h /= 6
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

export function generateCSSVariables(settings: ThemeSettings): string {
    if (!settings) return ''

    const { themeColors: colors, typography } = settings
    let css = ':root {\n'

    if (colors) {
        if (colors.primary) css += `  --primary: ${hexToHSLVariables(colors.primary)};\n`
        if (colors.primaryForeground) css += `  --primary-foreground: ${hexToHSLVariables(colors.primaryForeground)};\n`
        if (colors.secondary) css += `  --secondary: ${hexToHSLVariables(colors.secondary)};\n`
        if (colors.secondaryForeground) css += `  --secondary-foreground: ${hexToHSLVariables(colors.secondaryForeground)};\n`
        if (colors.background) css += `  --background: ${hexToHSLVariables(colors.background)};\n`
        if (colors.foreground) css += `  --foreground: ${hexToHSLVariables(colors.foreground)};\n`
        if (colors.card) css += `  --card: ${hexToHSLVariables(colors.card)};\n`
        if (colors.cardForeground) css += `  --card-foreground: ${hexToHSLVariables(colors.cardForeground)};\n`
        if (colors.muted) css += `  --muted: ${hexToHSLVariables(colors.muted)};\n`
        if (colors.mutedForeground) css += `  --muted-foreground: ${hexToHSLVariables(colors.mutedForeground)};\n`

        if (colors.otherColors) {
            if (colors.otherColors.border) css += `  --border: ${hexToHSLVariables(colors.otherColors.border)};\n`
            if (colors.otherColors.ring) css += `  --ring: ${hexToHSLVariables(colors.otherColors.ring)};\n`
            if (colors.otherColors.destructive) css += `  --destructive: ${hexToHSLVariables(colors.otherColors.destructive)};\n`
            if (colors.otherColors.destructiveForeground) css += `  --destructive-foreground: ${hexToHSLVariables(colors.otherColors.destructiveForeground)};\n`
        }
    }

    if (typography?.borderRadius) {
        css += `  --radius: ${typography.borderRadius};\n`
    }

    css += '}\n'

    // Dark Mode
    if (colors?.darkModeColors) {
        css += '.dark {\n'
        if (colors.darkModeColors.darkBackground) css += `  --background: ${hexToHSLVariables(colors.darkModeColors.darkBackground)};\n`
        if (colors.darkModeColors.darkForeground) css += `  --foreground: ${hexToHSLVariables(colors.darkModeColors.darkForeground)};\n`
        if (colors.darkModeColors.darkCard) css += `  --card: ${hexToHSLVariables(colors.darkModeColors.darkCard)};\n`
        if (colors.darkModeColors.darkCardForeground) css += `  --card-foreground: ${hexToHSLVariables(colors.darkModeColors.darkCardForeground)};\n`
        css += '}\n'
    }

    return css
}
