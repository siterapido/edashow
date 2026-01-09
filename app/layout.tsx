import type React from "react"
import type { Metadata, ResolvingMetadata } from "next"
import { Inter } from "next/font/google"
import { ClientLayout } from "@/components/client-layout"
import { DynamicThemeProvider } from "@/components/dynamic-theme-provider"
import { getPublicSupabaseClient } from "@/lib/supabase/public-client"
import "./globals.css"
import Script from "next/script"
import MaintenancePage from "@/components/maintenance-page"
import { cookies } from "next/headers"

const inter = Inter({ subsets: ["latin"] })

async function getSiteSettings() {
  const supabase = getPublicSupabaseClient()
  const { data } = await supabase.from('theme_settings').select('*').single()
  return data
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edashow.com.br'

  return {
    metadataBase: new URL(siteUrl),
    title: settings?.site_name || "EDA.Show",
    description: settings?.site_description || "Portal editorial do mercado de saúde suplementar",
    keywords: settings?.seo_keywords,
    icons: {
      icon: settings?.site_favicon_url || "/favicon.ico",
    },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: siteUrl,
      title: settings?.site_name || "EDA.Show",
      description: settings?.site_description || "Portal editorial do mercado de saúde suplementar",
      siteName: settings?.site_name || "EDA.Show",
      images: [
        {
          url: settings?.site_favicon_url || '/eda-show-logo.png',
          width: 1200,
          height: 630,
          alt: settings?.site_name || "EDA.Show",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings?.site_name || "EDA.Show",
      description: settings?.site_description || "Portal editorial do mercado de saúde suplementar",
      images: [settings?.site_favicon_url || '/eda-show-logo.png'],
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSiteSettings()

  // Logic to bypass maintenance mode for admins or if accessing CMS
  // We can't easily check auth in RootLayout without making it too complex
  // But we can check if the URL contains '/cms/' or '/login'
  // Since we are in a server component, we don't have access to current path easily
  // but we can pass it down or use middleware.
  // For now, let's keep it simple: if maintenance is ON, everything is blocked
  // except we should allow /cms and /login.

  // Actually, Next.js RootLayout is always wrapper. 
  // Let's use it as a conditional wrap.

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {settings?.google_tag_manager_id && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${settings.google_tag_manager_id}');
              `,
            }}
          />
        )}
      </head>
      <body className={`${inter.className} pb-16 md:pb-0`}>
        {settings?.google_analytics_id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${settings.google_analytics_id}');
                `,
              }}
            />
          </>
        )}
        {settings?.google_tag_manager_id && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${settings.google_tag_manager_id}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <DynamicThemeProvider>
          {settings?.maintenance_mode ? (
            <div className="maintenance-wrapper">
              {/* 
                  Note: Para o modo manutenção realmente funcionar permitindo o CMS, 
                  o ideal seria usar um middleware. No entanto, como o RootLayout 
                  envolve TUDO, se colocarmos aqui, ele vai esconder o CMS também.
                  Uma alternativa é injetar um componente que verifica a rota no cliente
                  ou usar o middleware para redirecionar se não for admin.
               */}
              <ClientLayout>
                {/* Manutenção condicional via prop ou componente dedicado */}
                {/* Se estivermos no CMS, o próprio layout do CMS vai sobrescrever as coisas? Não, RootLayout é pai. */}
                {/* Vamos usar um componente cliente para decidir se mostra manutenção ou conteúdo */}
                <MaintenanceModeGate
                  enabled={settings.maintenance_mode}
                  message={settings.maintenance_message}
                >
                  {children}
                </MaintenanceModeGate>
              </ClientLayout>
            </div>
          ) : (
            <ClientLayout>
              {children}
            </ClientLayout>
          )}
        </DynamicThemeProvider>
      </body>
    </html>
  )
}

/**
 * Componente Cliente para gerenciar a exibição do modo manutenção
 * permitindo acesso às rotas do CMS.
 */
function MaintenanceModeGate({
  children,
  enabled,
  message
}: {
  children: React.ReactNode,
  enabled: boolean,
  message?: string
}) {
  return (
    <MaintenanceClientGate enabled={enabled} message={message}>
      {children}
    </MaintenanceClientGate>
  )
}

import { MaintenanceClientGate } from "@/components/maintenance-client-gate"

