import { Card, CardContent } from "@/components/ui/card"

const newsItems = [
  {
    id: 1,
    tag: "Notícias",
    title: "Cooperativa reforça protagonismo no setor",
    description: "A maior cooperativa de saúde em número de cooperados anuncia expansão para novas regiões do país...",
  },
  {
    id: 2,
    tag: "Regulação",
    title: "STF publica acórdão com regras para judicialização da cobertura",
    description: "Todas as ações judiciais envolvendo tema devem seguir novas diretrizes...",
  },
  {
    id: 3,
    tag: "Mercado",
    title: "Reajuste médio dos planos de saúde será de 11,15%",
    description: "Confira as principais operadoras e seus respectivos aumentos que entram em vigor...",
  },
  {
    id: 4,
    tag: "Destaque",
    title: "Operadora é destaque na premiação dos mais influentes",
    description: "A lista lançada no último dia 17 de dezembro traz lideranças do setor...",
  },
  {
    id: 5,
    tag: "Regulação",
    title: "Susep prepara ajuste que pode ampliar alcance da regulação",
    description: "O objetivo regulatório da Superintendência de Seguros Privados deverá...",
  },
  {
    id: 6,
    tag: "Eventos",
    title: "Grande evento do setor terá atrações especiais",
    description: "Conhecida por investir no bem-estar de sua equipe, a empresa promove celebração...",
  },
]

export function NewsGrid() {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Principais Notícias</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Imagem</span>
              </div>
              <span className="absolute top-3 left-3 bg-[#FF6F00] text-white text-xs font-bold px-3 py-1 rounded">
                {item.tag}
              </span>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
