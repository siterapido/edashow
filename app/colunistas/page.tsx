import { getColumnists } from "@/lib/supabase/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Nossos Colunistas | EdaShow",
    description: "Conheça os especialistas e autores que contribuem com o EdaShow. Colunistas renomados trazem análises e opiniões sobre o setor de saúde.",
    openGraph: {
        title: "Nossos Colunistas | EdaShow",
        description: "Conheça os especialistas e autores que contribuem com o EdaShow.",
    },
}

export default async function ColunistasPage() {
    const columnists = await getColumnists({ limit: 50 })

    return (
        <div className="min-h-screen bg-white">
            <main className="container mx-auto px-4 py-8">
                {/* Navegação */}
                <div className="mb-8">
                    <Link href="/">
                        <Button variant="ghost" className="gap-2 text-slate-600 hover:text-slate-900">
                            <ArrowLeft className="h-4 w-4" />
                            Voltar para Home
                        </Button>
                    </Link>
                </div>

                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Nossos <span className="text-primary">Colunistas</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Conheça os especialistas que contribuem com análises, opiniões e conteúdos exclusivos para o EdaShow.
                    </p>
                </header>

                {/* Grid de Colunistas */}
                {columnists.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 rounded-xl">
                        <p className="text-slate-500 text-lg">Nenhum colunista cadastrado ainda.</p>
                        <p className="text-slate-400 text-sm mt-2">
                            Novos colunistas serão exibidos aqui em breve.
                        </p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {columnists.map((columnist: any) => (
                            <Link
                                key={columnist.id}
                                href={`/columnists/${columnist.slug}`}
                                className="block group h-full"
                            >
                                <Card className="p-6 h-full flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 border-slate-100 hover:border-primary/30 bg-white group-hover:-translate-y-1">
                                    <div className="mb-4">
                                        <Avatar className="w-24 h-24 border-4 border-slate-50 shadow-inner group-hover:border-primary/20 transition-colors">
                                            {columnist.avatar_url && (
                                                <AvatarImage
                                                    src={columnist.avatar_url}
                                                    alt={columnist.name}
                                                />
                                            )}
                                            <AvatarFallback className="bg-slate-100 text-slate-400 text-2xl font-bold">
                                                {columnist.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-primary transition-colors">
                                        {columnist.name}
                                    </h3>

                                    <p className="text-sm text-slate-500 font-medium line-clamp-2 min-h-[2.5em] mb-4">
                                        {columnist.role || columnist.bio || 'Colunista Convidado'}
                                    </p>

                                    <div className="mt-auto pt-2">
                                        <span className="text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                            Ver artigos →
                                        </span>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}
