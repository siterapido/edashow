import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-col leading-none">
              <span className="text-[#FF6F00] font-bold text-2xl uppercase tracking-tight">EDA</span>
              <span className="text-white font-bold text-lg uppercase tracking-tight">.Show</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm">
            <a href="#" className="hover:text-[#FF6F00] transition-colors">
              Home
            </a>
            <a href="#" className="hover:text-[#FF6F00] transition-colors">
              Notícias
            </a>
            <a href="#" className="hover:text-[#FF6F00] transition-colors">
              Eventos
            </a>
            <a href="#" className="hover:text-[#FF6F00] transition-colors">
              Colunas
            </a>
            <a href="#" className="hover:text-[#FF6F00] transition-colors">
              Próximos Eventos
            </a>
            <a href="#" className="hover:text-[#FF6F00] transition-colors">
              Parceiros
            </a>
            <a href="#" className="hover:text-[#FF6F00] transition-colors">
              TV / Conteúdo Multimídia
            </a>
            <a href="#" className="hover:text-[#FF6F00] transition-colors">
              Contato
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Input
                type="search"
                placeholder="Pesquisar"
                className="w-48 bg-white text-black pl-4 pr-10 rounded-full border-0"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
            <Button className="bg-[#FF6F00] hover:bg-[#E66300] text-white rounded-full px-6">
              Comunidade EDA.Show
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
