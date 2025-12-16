import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-[300px_1fr_300px] gap-6">
        <Card className="border-4 border-[#FF6F00] p-8 flex flex-col items-center justify-center bg-white">
          <div className="text-center">
            <div className="text-6xl mb-4 text-[#FF6F00] font-bold">EDA</div>
            <p className="text-sm text-gray-600 font-semibold">.Show Partner</p>
          </div>
        </Card>

        <Card className="relative overflow-hidden group cursor-pointer">
          <img src="/placeholder.svg?height=400&width=600" alt="Article" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <span className="inline-block bg-[#FF6F00] text-white text-xs px-3 py-1 rounded-full mb-3">Notícias</span>
            <h2 className="text-2xl font-bold mb-2">
              Setor de saúde suplementar cresce em 2025 e projeta expansão nacional para 2026
            </h2>
            <p className="text-sm text-gray-200">
              O mercado de saúde suplementar alcançou resultados expressivos em 2025, ampliando sua presença e
              consolidando...
            </p>
          </div>
        </Card>

        <div>
          <h3 className="text-xl font-bold mb-4">Colunas</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
              <Avatar>
                <AvatarFallback>CS</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-gray-500 mb-1">por Carlos Silva</p>
                <h4 className="text-sm font-semibold">Promoção Financeira</h4>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-4">
              <Avatar>
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-gray-500 mb-1">por Maria Castro</p>
                <h4 className="text-sm font-semibold">Desafios do marketing digital na saúde</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
