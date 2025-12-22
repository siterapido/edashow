import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, Facebook, Linkedin, Share2, Twitter } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

export default function ArticlePage({ params }: { params: { slug: string } }) {
  // Mock Data based on the slug (in a real app, fetch from Payload CMS)
  const article = {
    title: "Setor de saúde suplementar cresce em 2025 e projeta expansão nacional para 2026",
    subtitle: "O mercado de saúde suplementar alcançou resultados expressivos em 2025, ampliando sua presença e consolidando novas tecnologias no atendimento ao beneficiário.",
    category: "Mercado",
    author: {
      name: "Ricardo Rodrigues",
      role: "Editor Chefe",
      image: "/placeholder-user.jpg"
    },
    date: "16 de Dezembro de 2025",
    readTime: "5 min de leitura",
    image: "/placeholder.jpg",
    content: `
      <p class="lead">O setor de saúde suplementar no Brasil demonstrou uma resiliência notável em 2025, superando as expectativas de crescimento e estabelecendo novos patamares para a qualidade do serviço prestado aos beneficiários.</p>
      
      <p>Com um aumento de <strong>12% no número de beneficiários</strong> em comparação com o ano anterior, as operadoras de planos de saúde investiram pesadamente em digitalização e medicina preventiva. A telemedicina, que se consolidou durante a pandemia, agora representa uma fatia significativa dos atendimentos primários, reduzindo custos e aumentando a agilidade no diagnóstico.</p>

      <h2>Inovação Tecnológica como Motor de Crescimento</h2>
      <p>O uso de Inteligência Artificial para triagem e auditoria de contas médicas foi um dos grandes destaques. "Estamos vivendo uma revolução silenciosa, onde a eficiência operacional se traduz diretamente em sustentabilidade para o setor", afirma Ana Souza, analista de mercado da XP Investimentos.</p>
      
      <blockquote>
        "A saúde suplementar não é apenas sobre tratar doenças, é sobre gerir saúde de forma inteligente e preditiva."
      </blockquote>

      <h3>Perspectivas para 2026</h3>
      <p>Para o próximo ano, a expectativa é que a integração de dados entre prestadores e operadoras se torne ainda mais fluida, permitindo uma jornada do paciente sem atritos. A Agência Nacional de Saúde Suplementar (ANS) também sinalizou novas diretrizes para incentivar modelos de remuneração baseados em valor (Value-Based Healthcare).</p>

      <ul>
        <li>Expansão da rede credenciada em regiões Norte e Nordeste.</li>
        <li>Novos produtos focados em saúde mental e bem-estar corporativo.</li>
        <li>Investimento em hospitais próprios e verticalização do atendimento.</li>
      </ul>

      <p>O cenário é otimista, mas exige cautela. A inflação médica continua sendo um desafio global, e o equilíbrio entre sinistralidade e reajustes será fundamental para a manutenção da carteira de clientes.</p>
    `
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/20">
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Home
          </Link>
        </div>

        <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Article Header */}
          <header className="p-6 md:p-10 pb-0">
            <div className="flex items-center gap-3 mb-6">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 text-sm font-semibold">
                {article.category}
              </Badge>
              <span className="text-slate-400 text-sm flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {article.date}
              </span>
              <span className="text-slate-400 text-sm flex items-center gap-1">
                <Clock className="w-3 h-3" /> {article.readTime}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
              {article.title}
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              {article.subtitle}
            </p>

            <div className="flex items-center justify-between border-t border-b border-slate-100 py-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                  <AvatarImage src={article.author.image} />
                  <AvatarFallback>RR</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-slate-900">{article.author.name}</p>
                  <p className="text-sm text-slate-500">{article.author.role}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full hover:text-[#1877F2] hover:bg-[#1877F2]/10 hover:border-[#1877F2]/20">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/20">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/20">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full hover:text-primary hover:bg-primary/10 hover:border-primary/20">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="p-6 md:p-10 py-8">
            <figure className="relative rounded-xl overflow-hidden shadow-lg">
              <img 
                src={article.image} 
                alt="Featured" 
                className="w-full h-[400px] object-cover"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-3 text-center backdrop-blur-sm">
                Foto: Divulgação / EDA Press
              </figcaption>
            </figure>
          </div>

          {/* Article Content */}
          <div className="px-6 md:px-10 pb-12">
            <div 
              className="prose prose-lg prose-slate max-w-none 
              prose-headings:font-bold prose-headings:text-slate-900 
              prose-p:text-slate-600 prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-primary prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:text-slate-700 prose-blockquote:not-italic
              prose-strong:text-slate-900
              prose-li:text-slate-600"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>

        {/* Related News */}
        <section className="max-w-4xl mx-auto mt-16">
          <h3 className="text-2xl font-bold text-slate-800 mb-8 border-l-4 border-primary pl-4">
            Leia Também
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
             {[1, 2].map((i) => (
               <Card key={i} className="group cursor-pointer hover:shadow-lg transition-all border-none shadow-sm bg-white">
                 <div className="flex gap-4 p-4">
                   <div className="w-32 h-24 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                     <img src="/placeholder.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                   </div>
                   <div>
                     <Badge variant="secondary" className="mb-2 text-xs">Regulação</Badge>
                     <h4 className="font-bold text-slate-800 leading-tight group-hover:text-primary transition-colors">
                       Novas regras da ANS impactam diretamente o consumidor final em 2026
                     </h4>
                   </div>
                 </div>
               </Card>
             ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}










