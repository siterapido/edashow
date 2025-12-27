'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Search, RefreshCw, FileText, Calendar, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function CMSPostsPage() {
    const router = useRouter()
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    const fetchPosts = async () => {
        setLoading(true)
        const supabase = createClient()

        let query = supabase
            .from('posts')
            .select('*, categories(name)')
            .order('created_at', { ascending: false })

        if (statusFilter !== 'all') {
            query = query.eq('status', statusFilter)
        }

        const { data, error } = await query

        if (error) {
            console.error('Erro ao buscar posts:', error)
        } else {
            setPosts(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchPosts()
    }, [statusFilter])

    // Filter posts by search query
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Posts</h1>
                    <p className="text-gray-500 text-sm mt-1">Gerencie todos os artigos e notícias do site.</p>
                </div>
                <Button
                    onClick={() => router.push('/cms/posts/new')}
                    className="bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2 shadow-lg"
                >
                    <Plus className="w-4 h-4" /> Novo Post
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar por título..."
                        className="pl-10 bg-gray-50 border-gray-100 text-gray-900 focus:bg-white transition-colors"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="flex-1 sm:flex-none bg-gray-50 border border-gray-100 text-gray-700 text-sm rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors"
                    >
                        <option value="all">Todos</option>
                        <option value="published">Publicados</option>
                        <option value="draft">Rascunhos</option>
                    </select>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => fetchPosts()}
                        className="border-gray-100 hover:bg-gray-100 text-gray-400 flex-shrink-0"
                    >
                        <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                    </Button>
                </div>
            </div>

            {/* Posts List */}
            {loading ? (
                <div className="space-y-3">
                    {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                    <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-400">Nenhum post encontrado</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {searchQuery ? 'Tente outra busca ou ' : ''}
                        <button
                            onClick={() => router.push('/cms/posts/new')}
                            className="text-orange-500 hover:text-orange-400"
                        >
                            crie um novo post
                        </button>
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredPosts.map((post) => (
                        <PostCard key={post.id} post={post} onClick={() => router.push(`/cms/posts/${post.id}`)} />
                    ))}
                </div>
            )}

            {/* Mobile FAB */}
            <Button
                onClick={() => router.push('/cms/posts/new')}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-400 text-white shadow-xl shadow-orange-500/30 sm:hidden z-50"
            >
                <Plus className="w-6 h-6" />
            </Button>
        </div>
    )
}

// Post Card Component
function PostCard({ post, onClick }: { post: any; onClick: () => void }) {
    const formattedDate = post.published_at
        ? new Date(post.published_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
        : null

    return (
        <button
            onClick={onClick}
            className="w-full text-left bg-white rounded-xl p-4 border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all group"
        >
            <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    {post.cover_image_url ? (
                        <img
                            src={post.cover_image_url}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <FileText className="w-6 h-6" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                            {post.title}
                        </h3>
                        <Edit3 className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors flex-shrink-0 mt-1" />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        {/* Status Badge */}
                        <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                            post.status === 'published'
                                ? "bg-green-50 text-green-600 border border-green-100"
                                : "bg-gray-100 text-gray-500 border border-gray-200"
                        )}>
                            {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                        </span>

                        {/* Category */}
                        {post.categories?.name && (
                            <span className="text-xs text-gray-500">
                                {post.categories.name}
                            </span>
                        )}

                        {/* Date */}
                        {formattedDate && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formattedDate}
                            </span>
                        )}
                    </div>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-1 hidden sm:block">
                            {post.excerpt}
                        </p>
                    )}
                </div>
            </div>
        </button>
    )
}
