import configPromise from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import type { Metadata } from 'next'

type Args = {
  params: Promise<{
    segments?: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

/**
 * Gera os metadados da página admin do Payload CMS
 * Esta função é chamada pelo Next.js para gerar os metadados da página
 */
export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  try {
    return await generatePageMetadata({ config: configPromise, params, searchParams })
  } catch (error) {
    console.error('[Admin Page] Error generating metadata:', error)
    // Retorna metadados padrão em caso de erro
    return {
      title: 'Admin - Payload CMS',
      description: 'Painel administrativo',
    }
  }
}

/**
 * Página principal do painel administrativo do Payload CMS
 * Esta página renderiza toda a interface admin do Payload
 */
const Page = async ({ params, searchParams }: Args) => {
  try {
    // Aguardar a resolução do configPromise
    const resolvedConfig = await configPromise
    
    // Validar se a configuração foi carregada corretamente
    if (!resolvedConfig) {
      throw new Error('Payload config não foi carregada corretamente')
    }

    // Renderizar a página admin do Payload com a configuração
    return <RootPage config={resolvedConfig} params={params} searchParams={searchParams} />
  } catch (error) {
    console.error('[Admin Page] Fatal error loading admin panel:', error)
    
    // Retornar uma página de erro amigável ao usuário
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#dc2626' }}>
          ⚠️ Erro ao carregar painel administrativo
        </h1>
        <p style={{ marginBottom: '8px', color: '#64748b' }}>
          Não foi possível inicializar o Payload CMS.
        </p>
        <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '600px' }}>
          Verifique se as variáveis de ambiente estão configuradas corretamente (DATABASE_URI, PAYLOAD_SECRET).
        </p>
        {process.env.NODE_ENV === 'development' && (
          <details style={{ marginTop: '20px', textAlign: 'left', maxWidth: '600px' }}>
            <summary style={{ cursor: 'pointer', color: '#64748b', marginBottom: '8px' }}>
              Detalhes do erro (apenas em desenvolvimento)
            </summary>
            <pre style={{ 
              background: '#f1f5f9', 
              padding: '12px', 
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '12px',
              color: '#1e293b'
            }}>
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </details>
        )}
      </div>
    )
  }
}

export default Page
