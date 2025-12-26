"use client";

import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps as NextThemesProviderProps } from "next-themes";

interface ThemeColors {
  // Cores principais
  primary?: string;
  primaryForeground?: string;
  secondary?: string;
  secondaryForeground?: string;
  accent?: string;
  accentForeground?: string;

  // Cores de fundo
  background?: string;
  foreground?: string;
  card?: string;
  cardForeground?: string;
  muted?: string;
  mutedForeground?: string;

  // Outras cores
  border?: string;
  ring?: string;
  destructive?: string;
  destructiveForeground?: string;

  // Modo escuro
  darkBackground?: string;
  darkForeground?: string;
  darkCard?: string;
  darkCardForeground?: string;
}

interface Typography {
  fontFamily?: string;
  headingFontFamily?: string;
  borderRadius?: string;
}

interface SiteSettings {
  themeColors?: ThemeColors;
  backgroundColors?: ThemeColors;
  otherColors?: ThemeColors;
  darkModeColors?: ThemeColors;
  typography?: Typography;
}

/**
 * CustomThemeProvider - Aplica cores e configurações visuais do CMS dinamicamente
 * 
 * Este componente busca as configurações do site no CMS e aplica as cores
 * customizadas usando CSS variables. Funciona tanto no modo claro quanto escuro.
 */
function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTheme() {
      try {
        const response = await fetch('/api/globals/site-settings');

        if (!response.ok) {
          console.warn('[Theme] Não foi possível carregar as configurações do site');
          setIsLoading(false);
          return;
        }

        const settings: SiteSettings = await response.json();

        // Aplicar cores do tema
        applyThemeColors(settings);

        // Aplicar tipografia
        applyTypography(settings.typography);

        setIsLoading(false);
      } catch (error) {
        console.warn('[Theme] Erro ao carregar tema:', error);
        setIsLoading(false);
      }
    }

    loadTheme();
  }, []);

  return <>{children}</>;
}

/**
 * ThemeProvider - Combina next-themes com customização do CMS
 * 
 * Wrapper que integra o ThemeProvider do next-themes (para dark mode)
 * com nossas customizações de cores do CMS.
 */
export function ThemeProvider({ children, ...props }: NextThemesProviderProps) {
  return (
    <NextThemesProvider {...props} forcedTheme="light">
      <CustomThemeProvider>
        {children}
      </CustomThemeProvider>
    </NextThemesProvider>
  );
}

/**
 * Aplica as cores do tema usando CSS variables
 */
function applyThemeColors(settings: SiteSettings) {
  const root = document.documentElement;

  // Combinar todas as cores em um único objeto
  const colors = {
    ...settings.themeColors,
    ...settings.backgroundColors,
    ...settings.otherColors,
  };

  // Aplicar cores do tema claro
  if (colors.primary) root.style.setProperty('--primary', colors.primary);
  if (colors.primaryForeground) root.style.setProperty('--primary-foreground', colors.primaryForeground);
  if (colors.secondary) root.style.setProperty('--secondary', colors.secondary);
  if (colors.secondaryForeground) root.style.setProperty('--secondary-foreground', colors.secondaryForeground);
  if (colors.accent) root.style.setProperty('--accent', colors.accent);
  if (colors.accentForeground) root.style.setProperty('--accent-foreground', colors.accentForeground);

  if (colors.background) root.style.setProperty('--background', colors.background);
  if (colors.foreground) root.style.setProperty('--foreground', colors.foreground);
  if (colors.card) root.style.setProperty('--card', colors.card);
  if (colors.cardForeground) root.style.setProperty('--card-foreground', colors.cardForeground);
  if (colors.muted) root.style.setProperty('--muted', colors.muted);
  if (colors.mutedForeground) root.style.setProperty('--muted-foreground', colors.mutedForeground);

  if (colors.border) root.style.setProperty('--border', colors.border);
  if (colors.ring) root.style.setProperty('--ring', colors.ring);
  if (colors.destructive) root.style.setProperty('--destructive', colors.destructive);
  if (colors.destructiveForeground) root.style.setProperty('--destructive-foreground', colors.destructiveForeground);

  // Aplicar cores para a sidebar também
  if (colors.primary) {
    root.style.setProperty('--sidebar-primary', colors.primary);
    root.style.setProperty('--sidebar-ring', colors.primary);
  }
  if (colors.primaryForeground) {
    root.style.setProperty('--sidebar-primary-foreground', colors.primaryForeground);
  }
}

/**
 * Aplica configurações de tipografia
 */
function applyTypography(typography?: Typography) {
  if (!typography) return;

  const root = document.documentElement;

  if (typography.borderRadius) {
    root.style.setProperty('--radius', typography.borderRadius);
  }

  // Aplicar fontes (seria necessário carregar as fontes do Google Fonts dinamicamente)
  // Por enquanto, vamos apenas documentar as opções disponíveis
  if (typography.fontFamily && typography.fontFamily !== 'inter') {
    console.log('[Theme] Fonte personalizada selecionada:', typography.fontFamily);
    // TODO: Implementar carregamento dinâmico de fontes do Google Fonts
  }
}
