'use client'

import React, { useEffect, useState } from 'react'
import {
    FileText,
    Calendar,
    Megaphone,
    Mail,
    ArrowUpRight,
    TrendingUp,
    Clock,
    ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function CMSDashboard() {
    const [stats, setStats] = useState({
        posts: 0,
        events: 0,
        sponsors: 0,
        subscribers: 0
    })
    const [recentPosts, setRecentPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            const supabase = createClient()

            const [
                { count: postsCount },
                { count: eventsCount },
                { count: sponsorsCount },
                { count: subscribersCount },
                { data: latestPosts }
            ] = await Promise.all([
                supabase.from('posts').select('*', { count: 'exact', head: true }),
                supabase.from('events').select('*', { count: 'exact', head: true }),
                supabase.from('sponsors').select('*', { count: 'exact', head: true }),
                supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
                supabase.from('posts').select('id, title, status, created_at, slug').order('created_at', { ascending: false }).limit(5)
            ])

            setStats({
                posts: postsCount || 0,
                events: eventsCount || 0,
                sponsors: sponsorsCount || 0,
                subscribers: subscribersCount || 0
            })
            setRecentPosts(latestPosts || [])
            setLoading(false)
        }

        fetchStats()
    }, [])

    const statCards = [
        { label: 'Total de Posts', value: stats.posts, icon: FileText, color: 'text-orange-400', bg: 'bg-orange-400/10' },
        { label: 'Eventos', value: stats.events, icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { label: 'Patrocinadores', value: stats.sponsors, icon: Megaphone, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { label: 'Assinantes', value: stats.subscribers, icon: Mail, color: 'text-green-500', bg: 'bg-green-500/10' },
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Bem-vindo ao Dashboard</h1>
                <p className="text-gray-500 mt-2">Aqui está o que está acontecendo no seu site hoje.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <Card key={i} className="bg-white border-gray-200 shadow-sm group hover:border-orange-400 transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className={cn("p-2 rounded-lg", stat.bg)}>
                                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                                </div>
                                <TrendingUp className="w-4 h-4 text-gray-300" />
                            </div>
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-bold mt-1 tracking-tight text-gray-900">
                                        {loading ? <div className="h-9 w-12 bg-gray-100 animate-pulse rounded" /> : stat.value}
                                    </h3>
                                    <span className="text-xs text-green-500 font-medium">+0%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Posts List */}
                <Card className="lg:col-span-2 bg-white border-gray-200 shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-gray-100 bg-gray-50/50 flex flex-row items-center justify-between py-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-500" />
                            <CardTitle className="text-lg font-bold text-gray-900">Posts Recentes</CardTitle>
                        </div>
                        <Link href="/cms/posts" className="text-xs text-orange-600 hover:text-orange-500 font-semibold flex items-center gap-1 transition-colors">
                            Ver todos <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="p-4 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded animate-pulse" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-1/2 bg-gray-100 animate-pulse rounded" />
                                            <div className="h-3 w-1/4 bg-gray-100 animate-pulse rounded" />
                                        </div>
                                    </div>
                                ))
                            ) : recentPosts.length > 0 ? (
                                recentPosts.map((post) => (
                                    <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs font-bold">
                                                {post.title.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{post.title}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={cn(
                                                        "text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider",
                                                        post.status === 'published' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                                    )}>
                                                        {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-medium">
                                                        {new Date(post.created_at).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link href={`/cms/posts/${post.id}`} className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-900" />
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-400 italic">Nenhum post encontrado.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions / System Info */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-orange-400 to-orange-600 border-none shadow-md text-white">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-bold">Precisando de ajuda?</h3>
                            <p className="text-orange-50 text-sm mt-2 leading-relaxed">Confira a documentação do sistema ou entre em contato com o suporte técnico.</p>
                            <Button className="mt-4 w-full bg-white text-orange-600 hover:bg-orange-50 font-bold border-none">
                                Documentação
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader className="p-4 border-b border-gray-100">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400">Status do Sistema</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-medium">Banco de Dados</span>
                                <span className="flex items-center gap-1.5 text-xs text-green-600 font-bold">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Operacional
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-medium">Storage</span>
                                <span className="flex items-center gap-1.5 text-xs text-green-600 font-bold">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Operacional
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-medium">Versão</span>
                                <span className="text-xs text-gray-400 font-mono">v2.3.0-stable</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
