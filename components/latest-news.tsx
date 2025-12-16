import { Card } from "@/components/ui/card"

const latestNews = [
  {
    id: 1,
    title: "Usisaúde Seguro cresceu em 2025 e projeta expansão nacional em 2026 sob liderança de Ricardo Rodrigues",
    description:
      "A Usisaúde alcançou resultados expressivos em 2025, ampliando sua presença no mercado e consolidando...",
    date: "Há 1 dia",
  },
  {
    id: 2,
    title: "Odont reforça protagonismo no Nordeste",
    description: "A Odont, maior cooperativa de Odontologia em número de cooperados (mais de 15mil), anunciou...",
    date: "Há 2 dias",
  },
  {
    id: 3,
    title: "STF publica acórdão com regras para judicialização da cobertura fora do rol da ANS",
    description: "Todas as ações judiciais envolvendo cobertura de tratamentos que não estejam no rol...",
    date: "Há 3 dias",
  },
  {
    id: 4,
    title: "Reajuste médio dos planos de saúde foi de 11,15%; veja aumento das principais operadoras",
    description:
      "Em 2024, o reajuste médio dos planos de saúde individuais registrou aumento que varia por operadora, saiba mais...",
    date: "Há 4 dias",
  },
]

export function LatestNews() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Últimas Notícias</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {latestNews.map((item) => (
            <Card key={item.id} className="flex gap-4 p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-32 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded flex-shrink-0 flex items-center justify-center">
                <span className="text-gray-400 text-xs">Notícia</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                <span className="text-xs text-gray-500">{item.date}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
