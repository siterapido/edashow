"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PostCard } from '@/components/post-card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Loader2, Search as SearchIcon } from 'lucide-react'

function SearchResultsContent() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q')
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function performSearch() {
            if (!query) {
                setResults([])
                setLoading(false)
                return
            }

            setLoading(true)
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
                if (response.ok) {
                    const data = await response.json()
                    setResults(data.docs || [])
                }
            } catch (error) {
                console.error('Erro ao buscar:', error)
            } finally {
                setLoading(false)
            }
        }

        performSearch()
    }, [query])

    return (
        <div className="container mx-auto px-4 py-12">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <SearchIcon className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl font-bold">Resultados da Busca</h1>
                </div>
                <p className="text-lg text-muted-foreground">
                    {query ? `Mostrando resultados para "${query}"` : 'Digite um termo para pesquisar'}
                </p>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                    <p className="text-muted-foreground">Buscando conteúdos...</p>
                </div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {results.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xl text-slate-500 mb-2">Nenhum resultado encontrado.</p>
                    <p className="text-slate-400">Tente buscar por termos diferentes ou confira as categorias.</p>
                </div>
            )}
        </div>
    )
}

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-background">
            <Suspense fallback={<div>Carregando...</div>}>
                <SearchResultsContent />
            </Suspense>
            <Footer />
        </div>
    )
}
