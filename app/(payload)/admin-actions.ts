'use server'

import configPromise from '@payload-config'

/**
 * Server function para o Payload CMS
 * Esta função é usada pelo RootLayout para executar ações no servidor
 * 
 * @param args - Argumentos passados pelo Payload CMS
 * @returns Resultado da ação
 */
export async function serverFunction(args: any) {
  const config = await configPromise
  
  // O Payload CMS usa esta função para executar ações server-side
  // A implementação específica depende do que o Payload precisa fazer
  // Por padrão, apenas retornamos a config resolvida
  
  return {
    config,
    ...args,
  }
}
