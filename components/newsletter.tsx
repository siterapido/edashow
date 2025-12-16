import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Newsletter() {
  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-orange-900" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">Fique por dentro de tudo com nossa newsletter</h2>
          <p className="text-gray-300 mb-6">Receba notícias e conteúdos diretamente no seu email</p>
          <div className="flex gap-3">
            <Input type="email" placeholder="Digite seu e-mail" className="bg-white flex-1" />
            <Button className="bg-[#FF6F00] text-white hover:bg-[#E66300] font-semibold px-8">CADASTRAR</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
