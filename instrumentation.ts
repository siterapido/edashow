/**
 * Arquivo de instrumentação do Next.js
 * 
 * Este arquivo é executado quando o servidor Next.js é iniciado (tanto em dev quanto em produção)
 * Use-o para:
 * - Validar variáveis de ambiente
 * - Inicializar serviços
 * - Configurar monitoramento
 * 
 * Documentação: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

import { ensureEnvironment } from './lib/validate-env'

/**
 * Esta função é chamada quando o servidor Next.js inicia
 * Ela valida se todas as variáveis de ambiente críticas estão configuradas
 */
export async function register() {
  // Apenas valida variáveis de ambiente no servidor
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const isValid = ensureEnvironment()

    if (!isValid && process.env.NODE_ENV === 'production') {
      // Em produção, interrompe o servidor se as variáveis não estiverem configuradas
      console.error('❌ Servidor não pode iniciar devido a variáveis de ambiente faltando')
      process.exit(1)
    } else if (!isValid) {
      // Em desenvolvimento, apenas avisa
      console.warn('⚠️  Servidor iniciando com variáveis de ambiente faltando')
      console.warn('⚠️  Algumas funcionalidades podem não funcionar corretamente')
    } else {
      console.log('✅ Todas as variáveis de ambiente estão configuradas corretamente')
    }
  }
}
