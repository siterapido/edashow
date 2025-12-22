import { RootLayout } from '@payloadcms/next/layouts'
import configPromise from '@payload-config'
import { importMap } from '@/app/admin.backup/importMap'
import { serverFunction } from './admin-actions'
import '@payloadcms/next/css'
import '../admin.backup/admin-theme.css'
import '../admin.backup/posts/custom.css'

type Args = {
  children: React.ReactNode
}

/**
 * Layout do grupo de rotas (payload)
 * Este layout é aplicado a todas as páginas do Payload CMS (admin, API, GraphQL)
 * Usa o RootLayout oficial do Payload para garantir compatibilidade total
 */
export default async function PayloadLayout({ children }: Args) {
  const config = await configPromise

  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}

