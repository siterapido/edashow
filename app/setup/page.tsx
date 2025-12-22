'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail, User, Shield, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/logo'
import { createFirstAdmin, hasAdmin, type SetupError } from '@/lib/actions/setup'

export default function SetupPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isChecking, setIsChecking] = useState(true)
  const [adminExists, setAdminExists] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<SetupError | null>(null)
  const [success, setSuccess] = useState(false)

  // Verificar se já existe admin ao carregar a página
  useEffect(() => {
    async function checkAdmin() {
      try {
        // Chamar API route para verificar admin
        const response = await fetch('/api/setup/check-admin')
        if (response.ok) {
          const data = await response.json()
          setAdminExists(data.hasAdmin)
          if (data.hasAdmin) {
            // Redirecionar para login após 3 segundos
            setTimeout(() => {
              router.push('/login')
            }, 3000)
          }
        }
      } catch (error) {
        console.error('Erro ao verificar admin:', error)
      } finally {
        setIsChecking(false)
      }
    }
    
    checkAdmin()
  }, [router])

  async function handleSubmit(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    setErrors(null)
    setSuccess(false)

    startTransition(async () => {
      const result = await createFirstAdmin({ email, password, name })

      if ('success' in result && result.success) {
        setSuccess(true)
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setErrors(result)
      }
    })
  }

  // Mostrar loading enquanto verifica
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-600">Verificando sistema...</p>
        </div>
      </div>
    )
  }

  // Se já existe admin, mostrar mensagem e redirecionar
  if (adminExists) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Sistema já configurado</h2>
              <p className="text-gray-600">
                Já existe um administrador no sistema. Você será redirecionado para a página de login...
              </p>
              <Link href="/login">
                <Button className="w-full">Ir para Login</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mostrar formulário de criação
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header com Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Configuração Inicial</h1>
          <p className="text-gray-600">Crie o primeiro usuário administrador do EDA.Show</p>
        </div>

        {/* Card do Formulário */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">Criar Administrador</CardTitle>
            <CardDescription className="text-center">
              Preencha os dados para criar sua conta de administrador
            </CardDescription>
          </CardHeader>

          <CardContent>
            {success ? (
              <div className="text-center space-y-4 py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Administrador criado com sucesso!</h3>
                <p className="text-gray-600">Redirecionando para a página de login...</p>
              </div>
            ) : (
              <form action={handleSubmit} className="space-y-4">
                {/* Campo Nome */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nome Completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="João Silva"
                      required
                      disabled={isPending}
                      className="pl-10 h-11"
                      autoComplete="name"
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
                      placeholder="Mínimo 8 caracteres"
                      required
                      disabled={isPending}
                      className="pl-10 pr-10 h-11"
                      autoComplete="new-password"
                      minLength={8}
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
                  <p className="text-xs text-gray-500">A senha deve ter pelo menos 8 caracteres</p>
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

                {/* Botão de Criar */}
                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Criando administrador...
                    </div>
                  ) : (
                    'Criar Administrador'
                  )}
                </Button>
              </form>
            )}

            {/* Informações */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Este é um processo único. Após criar o administrador, você poderá fazer login normalmente.
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
