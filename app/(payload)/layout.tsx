import { RootLayout } from '@payloadcms/next/layouts'
import configPromise from '@payload-config'
import { importMap } from './importMap'
import { serverFunction } from './admin-actions'
import '@payloadcms/next/css'
import '@/lib/payload/css/admin-theme.css'
import '@/lib/payload/css/custom-editor.css'

type Args = {
  children: React.ReactNode
}

/**
 * Layout do grupo de rotas (payload)
 * Este layout é aplicado a todas as páginas do Payload CMS (admin, API, GraphQL)
 * Usa o RootLayout oficial do Payload para garantir compatibilidade total
 */
export default async function PayloadLayout({ children }: Args) {
  try {
    const config = await configPromise

    if (!config) {
      throw new Error('Payload config não pôde ser carregada. Verifique se o banco de dados está acessível e se payload.config.ts está correto.')
    }

    if (!importMap) {
      throw new Error('importMap não encontrado. Verifique a importação em app/(payload)/layout.tsx.')
    }

    if (!serverFunction) {
      throw new Error('serverFunction não encontrada em ./admin-actions.ts.')
    }

    if (!RootLayout) {
      throw new Error('RootLayout do @payloadcms/next/layouts não foi importado corretamente.')
    }

    return (
      <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
        {children}
      </RootLayout>
    )
  } catch (error) {
    console.error('[PayloadLayout Error]:', error)
    return (
      <div style={{ padding: '40px', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h1 style={{ color: '#ef4444' }}>⚠️ Erro Interno no Admin</h1>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>
          Não foi possível inicializar a estrutura do painel administrativo.
        </p>
        <pre style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', textAlign: 'left', overflow: 'auto', display: 'inline-block', maxWidth: '100%' }}>
          {error instanceof Error ? error.message : String(error)}
        </pre>
        <div style={{ marginTop: '20px' }}>
          <a href="/" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Voltar para o site</a>
        </div>
      </div>
    )
  }
}




