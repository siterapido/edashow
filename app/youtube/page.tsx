import { getPublicYouTubeVideos } from '@/lib/actions/cms-youtube'
import { Footer } from '@/components/footer'
import { YouTubePageClient } from './YouTubePageClient'

export const metadata = {
    title: 'YouTube | EDA Show',
    description: 'Assista aos últimos vídeos do canal EdaShow no YouTube. Conteúdo exclusivo sobre saúde suplementar, mercado e inovação.'
}

// Força renderização dinâmica para evitar erros de serialização durante build
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 3600 // Revalidate every hour

export default async function YouTubePage() {
    const { channel, videos } = await getPublicYouTubeVideos(12)

    if (!channel) {
        return (
            <div className="min-h-screen bg-white">
                <main className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Canal do YouTube
                    </h1>
                    <p className="text-gray-500">
                        O canal do YouTube ainda não foi configurado.
                    </p>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <YouTubePageClient channel={channel} videos={videos} />
            <Footer />
        </div>
    )
}
