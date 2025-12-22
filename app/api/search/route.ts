import { NextResponse } from 'next/server'
import { getPosts } from '@/lib/payload/api'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
        return NextResponse.json({ docs: [] })
    }

    try {
        // Busca posts que contenham o termo no título ou resumo
        // O getPosts já tem suporte a busca se adicionarmos os parâmetros certos
        // Como getPosts é flexível, vamos usá-lo ou chamar a API diretamente

        const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

        const response = await fetch(
            `${API_URL}/api/posts?where[or][0][title][contains]=${query}&where[or][1][excerpt][contains]=${query}&limit=20&status=published`,
            {
                next: { revalidate: 60 },
            }
        )

        if (!response.ok) {
            throw new Error('Falha ao buscar posts')
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Erro na API de busca:', error)
        return NextResponse.json({ error: 'Erro ao processar busca' }, { status: 500 })
    }
}
