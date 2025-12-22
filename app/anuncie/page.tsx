import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { InstitutionalSection } from "@/components/institutional-section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Megaphone,
  Users,
  TrendingUp,
  Mail,
  BarChart3,
  Target,
  CheckCircle2,
  ArrowRight,
  Award
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Anuncie Conosco | EDA Show",
  description: "Alcance os principais líderes e profissionais do setor de saúde suplementar. Conheça nossos formatos publicitários e oportunidades de parceria.",
  openGraph: {
    title: "Anuncie Conosco",
    description: "Alcance os principais líderes do setor de saúde suplementar",
    type: "website",
  },
};

export default function AnunciePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Anuncie Conosco
          </h1>
          <p className="text-xl text-muted-foreground">
            Alcance os principais líderes e profissionais do setor de saúde suplementar
          </p>
        </header>

        {/* Por que anunciar */}
        <InstitutionalSection title="Por que Anunciar no EDA Show">
          <p className="text-lg leading-relaxed mb-6">
            O EDA Show é reconhecido como o maior comunicador da área de saúde suplementar
            no Brasil, com mais de 1,3 milhão de visualizações mensais. Conectamos empresas,
            corretores, investidores e profissionais do setor através de comunicação estratégica,
            oferecendo visibilidade nacional, autoridade e credibilidade para sua marca.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">1,3M+</div>
                <p className="text-sm text-muted-foreground">Visualizações Mensais</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Target className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">18</div>
                <p className="text-sm text-muted-foreground">Anos de Experiência</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Award className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">#1</div>
                <p className="text-sm text-muted-foreground">Maior Comunicador do Setor</p>
              </CardContent>
            </Card>
          </div>
        </InstitutionalSection>

        {/* Serviços Disponíveis */}
        <InstitutionalSection title="Nossos Serviços">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Megaphone className="w-6 h-6 text-primary" />
                  <CardTitle>Podcast EDA.Show</CardTitle>
                </div>
                <CardDescription>
                  Entrevistas estratégicas com profissionais, empresários, corretores e especialistas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Entrevistas com profissionais, empresários, corretores, especialistas em saúde
                  suplementar, tecnologia, softwares e inovação no setor. Cada entrevista constrói
                  autoridade e fortalece sua marca.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  <CardTitle>Cobertura de Eventos</CardTitle>
                </div>
                <CardDescription>
                  Feiras, encontros corporativos, lançamentos e ações promocionais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cobertura completa de feiras, encontros corporativos, lançamentos de produtos,
                  campanhas e ações promocionais. Damos visibilidade aos principais eventos do setor.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-primary" />
                  <CardTitle>Águia Visita – EDA.Show na Sua Empresa</CardTitle>
                </div>
                <CardDescription>
                  Visita institucional apresentando estrutura e cultura da empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Visita institucional apresentando estrutura física e organizacional, cultura da
                  empresa, setores e responsáveis, funcionamento operacional. Posiciona a marca
                  com clareza, transparência e autoridade.
                </p>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Apresentação da estrutura física e organizacional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Mostra da cultura e valores da empresa</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6 text-primary" />
                  <CardTitle>EDA pelo Brasil</CardTitle>
                </div>
                <CardDescription>
                  Projeto itinerante percorrendo cidades e estados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Projeto itinerante que percorre cidades e estados mostrando o mercado local de
                  saúde suplementar, estrutura das corretoras, diferenciais regionais e principais
                  hospitais.
                </p>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Análise do mercado local</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Destaque para diferenciais regionais</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-6 h-6 text-primary" />
                  <CardTitle>Publicidade e Mídia</CardTitle>
                </div>
                <CardDescription>
                  Chamadas, anúncios e divulgações estratégicas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Chamadas, anúncios e divulgações estratégicas dentro do EDA Show, garantindo
                  visibilidade nacional para sua marca.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <CardTitle>Parcerias Comerciais</CardTitle>
                </div>
                <CardDescription>
                  Planos mensais para patrocinadores com divulgação contínua
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Divulgação semanal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Comerciais da empresa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Cobertura de eventos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Resultados reais e mensuráveis</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-primary" />
                  <CardTitle>Palestras, Comunicação e Oratória</CardTitle>
                </div>
                <CardDescription>
                  Treinamentos e apresentações para construção de autoridade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Comunicação estratégica</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Construção de autoridade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Resultados profissionais</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-6 h-6 text-primary" />
                  <CardTitle>Entrega de Marca e Autoridade</CardTitle>
                </div>
                <CardDescription>
                  Conexão estratégica entre empresas e corretores em nível nacional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Conexão estratégica entre empresas e corretores em nível nacional, fortalecendo
                  relacionamentos e alavancando marcas de forma humana e estratégica.
                </p>
              </CardContent>
            </Card>
          </div>
        </InstitutionalSection>

        {/* Benefícios */}
        <InstitutionalSection title="Benefícios para Sua Marca">
          <p className="text-lg leading-relaxed mb-6">
            Ao anunciar no EDA.Show, sua marca conquista benefícios estratégicos que fortalecem
            sua posição no mercado de saúde suplementar:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3">Visibilidade e Autoridade</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Visibilidade nacional em todo o Brasil</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Autoridade e credibilidade no setor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Posicionamento como referência do mercado</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3">Conexão Estratégica</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Conexão direta com corretores e empresas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Comunicação estratégica e profissional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Fortalecimento da marca no mercado</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </InstitutionalSection>

        {/* Público-Alvo */}
        <InstitutionalSection title="Nosso Público-Alvo">
          <p className="text-lg leading-relaxed mb-6">
            Conectamos profissionais, corretores, empresários e empresas do setor de saúde
            suplementar, com foco em:
          </p>
          <div className="space-y-4 mt-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Perfil Demográfico</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Geração Y (Millennials): entre 25 e 40 anos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Classe B</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Renda média: R$ 12.120,01 a R$ 22.240,00</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Perfil Profissional</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Profissionais do setor de saúde suplementar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Corretores e empresários</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Empresas e investidores do setor</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </InstitutionalSection>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                Pronto para começar?
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Entre em contato com nossa equipe comercial e descubra como podemos
                ajudar sua marca a alcançar os principais líderes do setor.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="min-h-[48px]">
                  <Link href="mailto:adm.edashow@gmail.com">
                    <Mail className="w-5 h-5 mr-2" />
                    adm.edashow@gmail.com
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="min-h-[48px]">
                  <Link href="/media-kit">
                    Baixar Media Kit
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}










