import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { InstitutionalSection } from "@/components/institutional-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Users,
  TrendingUp,
  Mail,
  Briefcase,
  Coffee,
  Calendar,
  DollarSign,
  GraduationCap,
  Home,
  Stethoscope,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trabalhe Conosco | EDA Show",
  description: "Junte-se à equipe do EDA Show. Conheça nossa cultura, benefícios e oportunidades de carreira no setor de comunicação e saúde.",
  openGraph: {
    title: "Trabalhe Conosco",
    description: "Oportunidades de carreira no EDA Show",
    type: "website",
  },
};

export default function TrabalheConoscoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Trabalhe Conosco
          </h1>
          <p className="text-xl text-muted-foreground">
            Faça parte da equipe que está transformando o jornalismo de saúde suplementar
          </p>
        </header>

        {/* Cultura */}
        <InstitutionalSection title="Nossa Cultura e Ambiente de Trabalho">
          <p className="text-lg leading-relaxed mb-6">
            No EDA Show, acreditamos que pessoas são o nosso maior ativo. O projeto atua com
            leveza, verdade e propósito, fortalecendo relacionamentos e conectando o mercado
            de forma humana e estratégica. Criamos um ambiente de trabalho colaborativo onde
            cada membro da equipe tem a oportunidade de crescer profissionalmente e fazer a
            diferença no setor de saúde suplementar.
          </p>
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
                  Acreditamos que comunicação estratégica pode ser leve e acessível, mantendo
                  profissionalismo e qualidade em cada interação, criando um ambiente de
                  trabalho descontraído e acolhedor.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-primary" />
                  <CardTitle>Verdade</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Compromisso com transparência, honestidade e informação qualificada em todas
                  as nossas ações. Valorizamos a comunicação clara e verdadeira com nossa equipe,
                  parceiros e toda a comunidade do setor.
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
                  Cada ação tem um propósito claro: fortalecer relacionamentos, alavancar marcas
                  e conectar o mercado de forma estratégica. Trabalhamos com propósito, acreditando
                  no impacto positivo da comunicação estratégica.
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
                  valorizando relacionamentos genuínos e duradouros. Valorizamos o trabalho em
                  equipe e o aprendizado contínuo.
                </p>
              </CardContent>
            </Card>
          </div>
        </InstitutionalSection>

        {/* Benefícios */}
        <InstitutionalSection title="Benefícios Oferecidos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-6 h-6 text-primary" />
                  <CardTitle>Remuneração Competitiva</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Salários competitivos de mercado com revisões periódicas baseadas em
                  desempenho e crescimento da empresa.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  <CardTitle>Flexibilidade</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Modelo híbrido de trabalho com flexibilidade de horários e possibilidade
                  de trabalho remoto.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <GraduationCap className="w-6 h-6 text-primary" />
                  <CardTitle>Desenvolvimento Profissional</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Acesso a cursos, treinamentos, eventos do setor e programas de
                  mentoria para crescimento contínuo.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Coffee className="w-6 h-6 text-primary" />
                  <CardTitle>Ambiente Descontraído</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ambiente de trabalho descontraído e acolhedor, com momentos de
                  integração e bem-estar da equipe.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Briefcase className="w-6 h-6 text-primary" />
                  <CardTitle>Plano de Saúde</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Plano de saúde empresarial com cobertura completa para você e seus
                  dependentes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Home className="w-6 h-6 text-primary" />
                  <CardTitle>Vale Alimentação</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vale alimentação e refeição para garantir seu bem-estar no dia a dia.
                </p>
              </CardContent>
            </Card>
          </div>
        </InstitutionalSection>

        {/* Áreas de Atuação */}
        <InstitutionalSection title="Áreas de Atuação">
          <p className="text-lg leading-relaxed mb-6">
            Buscamos profissionais talentosos e apaixonados em diversas áreas:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Jornalismo e Redação</h3>
                <p className="text-muted-foreground">
                  Jornalistas especializados em saúde, economia e tecnologia com
                  experiência em produção de conteúdo digital.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Edição e Curadoria</h3>
                <p className="text-muted-foreground">
                  Editores com visão estratégica para curadoria de conteúdo e
                  desenvolvimento de pautas relevantes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Design e UX/UI</h3>
                <p className="text-muted-foreground">
                  Designers criativos para criação de identidades visuais, layouts
                  e experiências digitais envolventes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Desenvolvimento</h3>
                <p className="text-muted-foreground">
                  Desenvolvedores full-stack para manutenção e evolução de nossas
                  plataformas digitais.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Marketing e Comunicação</h3>
                <p className="text-muted-foreground">
                  Profissionais de marketing digital, SEO, mídias sociais e comunicação
                  estratégica.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Comercial</h3>
                <p className="text-muted-foreground">
                  Executivos comerciais para desenvolvimento de parcerias e relacionamento
                  com anunciantes.
                </p>
              </CardContent>
            </Card>
          </div>
        </InstitutionalSection>

        {/* Processo Seletivo */}
        <InstitutionalSection title="Processo Seletivo">
          <p className="text-lg leading-relaxed mb-6">
            Nosso processo seletivo é transparente e focado em encontrar o melhor fit
            entre candidato e empresa:
          </p>
          <div className="space-y-4 mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Envio de Currículo</h3>
                    <p className="text-muted-foreground">
                      Envie seu currículo e carta de apresentação através do nosso
                      formulário ou e-mail.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Análise de Perfil</h3>
                    <p className="text-muted-foreground">
                      Nossa equipe analisa seu perfil e experiência para identificar
                      compatibilidade com as vagas disponíveis.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Entrevistas</h3>
                    <p className="text-muted-foreground">
                      Entrevistas com recrutadores e gestores da área para conhecer
                      melhor suas habilidades e expectativas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Teste Prático</h3>
                    <p className="text-muted-foreground">
                      Dependendo da vaga, pode haver um teste prático para avaliar
                      suas habilidades técnicas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">5</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Proposta e Integração</h3>
                    <p className="text-muted-foreground">
                      Apresentação da proposta e, em caso de aceite, início do processo
                      de integração à equipe.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </InstitutionalSection>

        {/* Vagas Abertas */}
        <InstitutionalSection title="Vagas Abertas">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-8 pb-8 text-center">
              <Briefcase className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                Estamos sempre em busca de talentos
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Mesmo que não haja vagas abertas no momento, aceitamos candidaturas
                espontâneas. Envie seu currículo e fique em nosso banco de talentos
                para futuras oportunidades.
              </p>
            </CardContent>
          </Card>
        </InstitutionalSection>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                Pronto para fazer parte da equipe?
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Envie seu currículo e carta de apresentação para nossa equipe de RH.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="min-h-[48px]">
                  <Link href="mailto:adm.edashow@gmail.com">
                    <Mail className="w-5 h-5 mr-2" />
                    adm.edashow@gmail.com
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="min-h-[48px]">
                  <Link href="/sobre">
                    Conheça mais sobre nós
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











