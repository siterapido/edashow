import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { InstitutionalSection } from "@/components/institutional-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Target,
  Users,
  TrendingUp,
  Award,
  Newspaper,
  BarChart3,
  Eye,
  Heart
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre o EDA Show | EDA Show",
  description: "Conheça a história, missão e valores do EDA Show, o maior comunicador da área de saúde suplementar no Brasil, conectando pessoas, histórias e empresas há 18 anos.",
  openGraph: {
    title: "Sobre o EDA Show",
    description: "O maior comunicador da área de saúde suplementar no Brasil",
    type: "website",
  },
};

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Sobre o EDA Show
          </h1>
          <p className="text-xl text-muted-foreground">
            Conectando pessoas, histórias e empresas por meio de comunicação estratégica
          </p>
        </header>

        {/* Sobre o Eda */}
        <InstitutionalSection title="Quem é o Eda">
          <p className="text-lg leading-relaxed mb-4">
            EDA SHOW é Edson Eda Show, comunicador, palestrante e criador de projetos que conectam o mercado de planos de saúde e seguros em todo o Brasil.
            Reconhecido pela linguagem simples, direta e verdadeira, o Eda Show dá voz aos corretores, valoriza histórias reais e fortalece conexões que geram negócios.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            Criador de projetos como Jogo das Águias, EDA pelo Brasil, Águia-Visita, Circuito das Águias e do método Comunicação & Oratória – Corretor Faixa Preta, ele une comunicação, motivação, esporte e propósito.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            Com coberturas exclusivas de grandes eventos, entrevistas com líderes do mercado e conteúdos que inspiram, o Eda Show tem um só objetivo:
            conectar pessoas, fortalecer o corretor e fazer o mercado voar mais alto.
          </p>
          <p className="text-lg leading-relaxed font-bold mt-6">
            Águia anda com águia.<br />
            E aqui, só o impossível interessa.
          </p>
        </InstitutionalSection>

        {/* História e Missão */}
        <InstitutionalSection title="Nossa História">
          <p className="text-lg leading-relaxed mb-4">
            O EDA Show é um projeto de comunicação que conecta pessoas, histórias e empresas
            por meio de entrevistas estratégicas, informação qualificada sobre o mercado de
            planos de saúde e seguros, e ações sociais e institucionais. Com 18 anos de
            experiência no setor, somos reconhecidos como o maior comunicador da área de
            saúde suplementar no Brasil.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            O projeto atua com leveza, verdade e propósito, fortalecendo relacionamentos,
            alavancando marcas e conectando o mercado de forma humana e estratégica em todo
            o país. Acreditamos que a comunicação estratégica é fundamental para aproximar
            empresas, corretores, investidores e profissionais do setor.
          </p>
        </InstitutionalSection>

        {/* Missão */}
        <InstitutionalSection title="Nossa Missão">
          <p className="text-lg leading-relaxed mb-4">
            O EDA.Show existe para dar visibilidade, credibilidade e autoridade a empresas
            e profissionais do mercado de saúde suplementar, conectando marcas, corretores
            e soluções de forma clara, estratégica e humana, em todo o Brasil.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            Aproximamos empresas, corretores, investidores e profissionais do setor através
            de entrevistas estratégicas, informação qualificada e ações que fortalecem
            relacionamentos e alavancam marcas.
          </p>
        </InstitutionalSection>

        {/* Valores */}
        <InstitutionalSection title="Nossos Valores">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-6 h-6 text-primary" />
                  <CardTitle>Leveza</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Acreditamos que comunicação estratégica pode ser leve e acessível,
                  mantendo profissionalismo e qualidade em cada interação.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6 text-primary" />
                  <CardTitle>Verdade</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Compromisso com transparência, honestidade e informação qualificada
                  em todas as nossas ações e comunicações.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <CardTitle>Propósito</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cada ação tem um propósito claro: fortalecer relacionamentos,
                  alavancar marcas e conectar o mercado de forma estratégica.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-primary" />
                  <CardTitle>Conexão Humana</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Conectamos pessoas, histórias e empresas de forma humana e estratégica,
                  valorizando relacionamentos genuínos e duradouros.
                </p>
              </CardContent>
            </Card>
          </div>
        </InstitutionalSection>

        {/* Números e Impacto */}
        <InstitutionalSection title="Números e Impacto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Eye className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">1,3M+</div>
                <p className="text-sm text-muted-foreground">Visualizações Mensais</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">18</div>
                <p className="text-sm text-muted-foreground">Anos de Experiência</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Award className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">#1</div>
                <p className="text-sm text-muted-foreground">Maior Comunicador do Setor</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">100%</div>
                <p className="text-sm text-muted-foreground">Atuação Nacional</p>
              </CardContent>
            </Card>
          </div>
        </InstitutionalSection>

        {/* Equipe Editorial */}
        <InstitutionalSection title="Nossa Atuação">
          <p className="text-lg leading-relaxed mb-6">
            O EDA.Show atua como um projeto de comunicação estratégica, oferecendo
            entrevistas com profissionais, empresários, corretores e especialistas em
            saúde suplementar, tecnologia, softwares e inovação no setor. Nossa cobertura
            inclui feiras, encontros corporativos, lançamentos de produtos e ações
            promocionais.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            Através do projeto "Águia Visita", visitamos empresas apresentando sua estrutura
            física e organizacional, cultura, setores e funcionamento operacional. Com o
            "EDA pelo Brasil", percorremos cidades e estados mostrando o mercado local de
            saúde suplementar, estrutura das corretoras e diferenciais regionais.
          </p>
          <p className="text-lg leading-relaxed">
            Também oferecemos palestras, treinamentos em comunicação e oratória, além de
            parcerias comerciais que conectam empresas e corretores em nível nacional,
            sempre com foco em entregar marca e autoridade.
          </p>
        </InstitutionalSection>

        {/* Diferenciais */}
        <InstitutionalSection title="Nossos Diferenciais">
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Award className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Maior Comunicador do Setor</h3>
                    <p className="text-muted-foreground">Reconhecido como o maior comunicador da área de saúde suplementar no Brasil, com alta credibilidade e autoridade no mercado.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <TrendingUp className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Conexão Estratégica</h3>
                    <p className="text-muted-foreground">Conexão direta entre empresas, corretores e especialistas, fortalecendo relacionamentos e alavancando marcas de forma estratégica.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Newspaper className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Conteúdo Profissional e Estratégico</h3>
                    <p className="text-muted-foreground">Conteúdos profissionais, leves e estratégicos que entregam informação qualificada e resultados reais para nossos parceiros.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </InstitutionalSection>
      </div>
      <Footer />
    </div>
  );
}












