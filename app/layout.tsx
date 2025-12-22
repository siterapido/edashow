import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClientLayout } from "@/components/client-layout"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EDA.Show - Hub de Comunicação e Eventos do Mercado de Saúde Suplementar",
  description:
    "Portal editorial com notícias, colunas, eventos e conteúdo multimídia do setor de saúde suplementar no Brasil",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} pb-16 md:pb-0`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
