import { redirect } from 'next/navigation'

/**
 * Página de Login
 * 
 * Redireciona para o login padrão do Payload CMS para garantir que todo o fluxo
 * de autenticação, cookies e permissões administrativas sejam processados corretamente.
 */
export default function LoginPage() {
  redirect('/admin/login')
}




