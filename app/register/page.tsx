'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/logo'
import { signup, type AuthError } from '@/lib/actions/auth'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<AuthError | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    setErrors(null)

    startTransition(async () => {
      const result = await signup({ fullName, email, password })

      if (result && 'errors' in result) {
        setErrors(result)
      } else {
        setSuccess(true)
      }
    })
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 text-center p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <ShieldCheck className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl mb-4">Cadastro Realizado!</CardTitle>
            <CardDescription className="text-base mb-8">
              Enviamos um e-mail de confirmação para você. Por favor, verifique sua caixa de entrada para ativar sua conta.
            </CardDescription>
            <Button asChild className="w-full">
              <Link href="/login">Ir para Login</Link>
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header com Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Criar Conta</h1>
          <p className="text-gray-600">Junte-se ao EDA.Show e comece a colaborar</p>
        </div>

        {/* Card do Formulário */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">Cadastro</CardTitle>
            <CardDescription className="text-center">
              Preencha os dados abaixo para se registrar
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              {/* Campo Nome Completo */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Nome Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Seu nome completo"
                    required
                    disabled={isPending}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

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
                    placeholder="seu@email.com"
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
                    placeholder="Crie uma senha forte"
                    required
                    disabled={isPending}
                    className="pl-10 pr-10 h-11"
                    autoComplete="new-password"
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

              {/* Botão de Registro */}
              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Criando conta...
                  </div>
                ) : (
                  'Criar minha conta'
                )}
              </Button>
            </form>

            {/* Links auxiliares */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Já tem uma conta?{' '}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    Fazer login
                  </Link>
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



