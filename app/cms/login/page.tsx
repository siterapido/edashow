'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/logo'
import { login } from '@/lib/actions/cms-auth'

export default function CMSLoginPage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [showPassword, setShowPassword] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        setErrorMsg(null)

        startTransition(async () => {
            const result = await login({ email, password })

            if (result && 'message' in result) {
                setErrorMsg(result.message)
            } else {
                router.push('/cms/dashboard')
            }
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4 ring-4 ring-orange-100">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">EDAShow CMS</h1>
                    <p className="text-gray-500 font-medium">Painel de Administração</p>
                </div>

                <Card className="shadow-xl border-gray-200 bg-white text-gray-900">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-xl text-center">Acessar Sistema</CardTitle>
                        <CardDescription className="text-center text-gray-400">
                            Digite suas credenciais administrativas
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form action={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-bold text-gray-600 uppercase tracking-wider text-[10px]">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="admin@edashow.com.br"
                                        required
                                        disabled={isPending}
                                        className="pl-10 h-11 bg-gray-50 border-gray-100 text-gray-900 placeholder:text-gray-400 focus:ring-orange-500 focus:bg-white transition-all"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-bold text-gray-600 uppercase tracking-wider text-[10px]">
                                    Senha
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        required
                                        disabled={isPending}
                                        className="pl-10 pr-10 h-11 bg-gray-50 border-gray-100 text-gray-900 placeholder:text-gray-400 focus:ring-orange-500 focus:bg-white transition-all"
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

                            {errorMsg && (
                                <div className="p-3 rounded-md bg-red-50 border border-red-100 text-sm text-red-600">
                                    {errorMsg}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 bg-orange-500 hover:bg-orange-400 text-white font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Autenticando...
                                    </div>
                                ) : (
                                    'Entrar no Painel'
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <Link href="/" className="text-sm text-gray-400 hover:text-orange-500 font-medium transition-colors">
                                ← Voltar para o site
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
