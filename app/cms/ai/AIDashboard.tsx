'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
    Sparkles,
    Wand2,
    FileText,
    ImageIcon,
    Mail,
    Target,
    TrendingUp,
    Clock,
    Zap,
    ArrowRight,
    DollarSign,
    BarChart3,
    Calendar,
    RefreshCw,
    ExternalLink,
    Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AIPostWizard } from '@/components/cms/AIPostWizard'
import {
    Dialog,
    DialogContent
} from '@/components/ui/dialog'

interface AIDashboardProps {
    stats: {
        totalGenerations: number
        totalTokens: number
        totalCost: number
        scheduledCount: number
    }
    recentGenerations: Array<{
        id: string
        type: string
        created_at: string
        tokens_used: number
        model_used: string
    }>
    scheduledPosts: Array<{
        id: string
        scheduled_for: string
        posts: { id: string; title: string; slug: string; cover_image_url?: string } | null
    }>
    recentPosts: Array<{
        id: string
        title: string
        slug: string
        status: string
        created_at: string
        cover_image_url?: string
    }>
}

export function AIDashboard({
    stats,
    recentGenerations,
    scheduledPosts,
    recentPosts
}: AIDashboardProps) {
    const [wizardOpen, setWizardOpen] = useState(false)

    const quickActions = [
        {
            icon: Wand2,
            label: 'Gerar Post',
            description: 'Criar post completo com IA',
            color: 'from-orange-500 to-amber-500',
            onClick: () => setWizardOpen(true)
        },
        {
            icon: RefreshCw,
            label: 'Reescrever',
            description: 'Adaptar conteúdo externo',
            color: 'from-blue-500 to-cyan-500',
            href: '/cms/ai/rewrite'
        },
        {
            icon: Mail,
            label: 'Newsletter',
            description: 'Gerar newsletter automática',
            color: 'from-purple-500 to-pink-500',
            href: '/cms/newsletter/new'
        },
        {
            icon: ImageIcon,
            label: 'Buscar Imagens',
            description: 'Pexels & Unsplash',
            color: 'from-green-500 to-emerald-500',
            href: '/cms/ai/generate'
        }
    ]

    const typeLabels: Record<string, string> = {
        post: 'Post',
        rewrite: 'Reescrita',
        newsletter: 'Newsletter',
        keywords: 'Keywords',
        seo: 'SEO'
    }

    return (
        <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="w-7 h-7 text-orange-500" />
                        AI Studio
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Ferramentas de inteligência artificial para criação de conteúdo
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/cms/ai/settings">
                        <Button variant="outline">Configurações</Button>
                    </Link>
                    <Button onClick={() => setWizardOpen(true)} className="gap-2 bg-orange-500 hover:bg-orange-600">
                        <Plus className="w-4 h-4" />
                        Novo Post com IA
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white border rounded-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">Gerações</span>
                        <BarChart3 className="w-4 h-4 text-orange-500" />
                    </div>
                    <p className="text-2xl font-bold mt-1">{stats.totalGenerations}</p>
                    <p className="text-xs text-gray-400">Últimos 30 dias</p>
                </div>

                <div className="p-4 bg-white border rounded-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">Tokens</span>
                        <Zap className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold mt-1">
                        {stats.totalTokens > 1000
                            ? `${(stats.totalTokens / 1000).toFixed(1)}k`
                            : stats.totalTokens}
                    </p>
                    <p className="text-xs text-gray-400">Consumidos</p>
                </div>

                <div className="p-4 bg-white border rounded-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">Custo</span>
                        <DollarSign className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold mt-1">${stats.totalCost.toFixed(4)}</p>
                    <p className="text-xs text-gray-400">Este mês</p>
                </div>

                <div className="p-4 bg-white border rounded-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">Agendados</span>
                        <Calendar className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold mt-1">{stats.scheduledCount}</p>
                    <p className="text-xs text-gray-400">Posts pendentes</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, i) => {
                        const Icon = action.icon
                        const content = (
                            <div className="group p-4 bg-white border rounded-xl hover:shadow-md transition-all cursor-pointer">
                                <div className={cn(
                                    'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3',
                                    action.color
                                )}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold group-hover:text-orange-600 transition-colors">
                                    {action.label}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                            </div>
                        )

                        if (action.onClick) {
                            return (
                                <button key={i} onClick={action.onClick} className="text-left">
                                    {content}
                                </button>
                            )
                        }

                        return (
                            <Link key={i} href={action.href || '#'}>
                                {content}
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Two Columns */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Generations */}
                <div className="bg-white border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            Gerações Recentes
                        </h2>
                        <Link href="/cms/ai/history" className="text-sm text-orange-600 hover:underline">
                            Ver tudo
                        </Link>
                    </div>

                    {recentGenerations.length > 0 ? (
                        <div className="space-y-3">
                            {recentGenerations.slice(0, 5).map((gen) => (
                                <div
                                    key={gen.id}
                                    className="flex items-center justify-between py-2 border-b last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold',
                                            gen.type === 'post' && 'bg-orange-100 text-orange-600',
                                            gen.type === 'rewrite' && 'bg-blue-100 text-blue-600',
                                            gen.type === 'newsletter' && 'bg-purple-100 text-purple-600',
                                            gen.type === 'keywords' && 'bg-green-100 text-green-600',
                                            gen.type === 'seo' && 'bg-amber-100 text-amber-600'
                                        )}>
                                            {typeLabels[gen.type]?.[0] || 'AI'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {typeLabels[gen.type] || gen.type}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(gen.created_at).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {gen.tokens_used?.toLocaleString()} tokens
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Nenhuma geração ainda</p>
                        </div>
                    )}
                </div>

                {/* Scheduled Posts */}
                <div className="bg-white border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            Posts Agendados
                        </h2>
                        <Link href="/cms/posts?filter=scheduled" className="text-sm text-orange-600 hover:underline">
                            Ver tudo
                        </Link>
                    </div>

                    {scheduledPosts.length > 0 ? (
                        <div className="space-y-3">
                            {scheduledPosts.map((sp) => (
                                <div
                                    key={sp.id}
                                    className="flex items-center gap-3 py-2 border-b last:border-0"
                                >
                                    {sp.posts?.cover_image_url ? (
                                        <img
                                            src={sp.posts.cover_image_url}
                                            alt=""
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-gray-400" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {sp.posts?.title || 'Post'}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(sp.scheduled_for).toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <Link href={`/cms/posts/${sp.posts?.id}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Nenhum post agendado</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white border rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Posts Recentes
                    </h2>
                    <Link href="/cms/posts" className="text-sm text-orange-600 hover:underline">
                        Ver todos
                    </Link>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {recentPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/cms/posts/${post.id}`}
                            className="group block"
                        >
                            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-2">
                                {post.cover_image_url ? (
                                    <img
                                        src={post.cover_image_url}
                                        alt=""
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FileText className="w-8 h-8 text-gray-300" />
                                    </div>
                                )}
                            </div>
                            <h3 className="text-sm font-medium line-clamp-2 group-hover:text-orange-600 transition-colors">
                                {post.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={cn(
                                    'px-1.5 py-0.5 rounded text-[10px] font-medium',
                                    post.status === 'published'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                )}>
                                    {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* AI Wizard Dialog */}
            <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
                    <AIPostWizard
                        categories={[]} // Will be fetched by the wizard
                        onClose={() => setWizardOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
