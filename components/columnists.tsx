import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Columnists() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Colunas</h2>
        <div className="flex justify-center gap-12">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback>JC</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-gray-600">Por João Carlos</p>
              <h3 className="font-semibold">Promoção Financeira</h3>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-gray-600">Por Maria Castro</p>
              <h3 className="font-semibold">Desafios do marketing digital na saúde</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
