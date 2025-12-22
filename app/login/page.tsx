'use client'

/**
 * Página de Login Customizada
 * 
 * NOTA: Esta é uma página de login customizada. O login padrão do Payload CMS
 * está disponível em /admin e é recomendado para uso no painel administrativo.
 * 
 * Esta página é mantida para casos onde é necessário um fluxo de login
 * customizado fora do admin padrão do Payload.
 */

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/logo'
import { login, type AuthError } from '@/lib/actions/auth'

export default function LoginPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<AuthError | null>(null)

  async function handleSubmit(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    setErrors(null)

    startTransition(async () => {
      const result = await login({ email, password })

      if ('errors' in result) {
        setErrors(result)
      }
      // Se o login for bem-sucedido, o redirect será feito pela Server Action
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header com Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Área Administrativa</h1>
          <p className="text-gray-600">Acesse o painel de administração do EDA.Show</p>
        </div>

        {/* Card do Formulário */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">Fazer Login</CardTitle>
            <CardDescription className="text-center">
              Digite suas credenciais para continuar
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              {/* Campo Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@edashow.com"
                    required
                    disabled={isPending}
                    className="pl-10 h-11"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    required
                    disabled={isPending}
                    className="pl-10 pr-10 h-11"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isPending}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Mensagens de Erro */}
              {errors && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                  <div className="text-sm text-red-700">
                    <p className="font-medium">{errors.message}</p>
                    {errors.errors && errors.errors.length > 0 && (
                      <ul className="mt-1 list-disc list-inside">
                        {errors.errors.map((error, index) => (
                          <li key={index}>{error.message}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* Botão de Login */}
              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Entrando...
                  </div>
                ) : (
                  'Entrar no Sistema'
                )}
              </Button>
            </form>

            {/* Links auxiliares */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Primeira vez aqui?{' '}
                  <Link href="/setup" className="text-primary hover:underline font-medium">
                    Criar primeiro administrador
                  </Link>
                </p>
                <p className="text-sm text-gray-600">
                  Esqueceu sua senha?{' '}
                  <a href="mailto:adm.edashow@gmail.com" className="text-primary hover:underline font-medium">
                    Entre em contato
                  </a>
                </p>
                <p className="text-xs text-gray-500">
                  Acesso restrito apenas para administradores autorizados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logo no rodapé */}
        <div className="text-center mt-8">
          <Logo imageClassName="h-8 w-auto mx-auto opacity-60" />
        </div>
      </div>
    </div>
  )
}
