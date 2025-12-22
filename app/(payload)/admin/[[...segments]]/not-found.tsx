import configPromise from '@payload-config'
import { NotFoundPage, generatePageMetadata } from '@payloadcms/next/views'
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
 * Gera os metadados da página 404 do admin
 */
export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  try {
    return await generatePageMetadata({ config: configPromise, params, searchParams })
  } catch (error) {
    console.error('[Admin Not Found] Error generating metadata:', error)
    return {
      title: 'Página não encontrada - Admin',
      description: 'A página solicitada não foi encontrada',
    }
  }
}

/**
 * Página 404 customizada para o painel administrativo
 */
const NotFound = async ({ params, searchParams }: Args) => {
  try {
    const resolvedConfig = await configPromise

    if (!resolvedConfig) {
      throw new Error('Payload config não foi carregada')
    }

    return <NotFoundPage config={resolvedConfig} params={params} searchParams={searchParams} />
  } catch (error) {
    console.error('[Admin Not Found] Error loading not found page:', error)
    
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
        <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>404</h1>
        <p style={{ fontSize: '18px', color: '#64748b' }}>
          Página não encontrada
        </p>
      </div>
    )
  }
}

export default NotFound
