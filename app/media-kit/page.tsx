import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { InstitutionalSection } from "@/components/institutional-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Users,
  TrendingUp,
  BarChart3,
  Eye,
  MousePointerClick,
  FileText,
  Image as ImageIcon,
  Award
} from "lucide-react";

export const metadata: Metadata = {
  title: "Media Kit | EDA Show",
  description: "Acesse dados demográficos, métricas de audiência, especificações técnicas e materiais de marca do EDA Show.",
  openGraph: {
    title: "Media Kit",
    description: "Dados e materiais para anunciantes e parceiros",
    type: "website",
  },
};

export default function MediaKitPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Media Kit
          </h1>
          <p className="text-xl text-muted-foreground">
            Dados, métricas e materiais para anunciantes e parceiros
          </p>
        </header>

        {/* Visão Geral da Audiência */}
        <InstitutionalSection title="Visão Geral da Audiência">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Eye className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">1,3M+</div>
                <p className="text-sm text-muted-foreground">Visualizações Mensais</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">18</div>
                <p className="text-sm text-muted-foreground">Anos de Experiência</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Award className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">#1</div>
                <p className="text-sm text-muted-foreground">Maior Comunicador do Setor</p>
              </CardContent>
            </Card>
          </div>
        </InstitutionalSection>

        {/* Dados Demográficos */}
        <InstitutionalSection title="Dados Demográficos e Comportamentais">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Perfil Demográfico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Geração Y (Millennials)</h4>
                    <p className="text-sm text-muted-foreground">Entre 25 e 40 anos</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Classe Social</h4>
                    <p className="text-sm text-muted-foreground">Classe B</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Renda Média</h4>
                    <p className="text-sm text-muted-foreground">R$ 12.120,01 a R$ 22.240,00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Perfil Profissional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Profissionais do setor</span>
                      <span className="text-sm font-semibold">Principal</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Corretores</span>
                      <span className="text-sm font-semibold">Alto</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Empresários</span>
                      <span className="text-sm font-semibold">Alto</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Empresas do setor</span>
                      <span className="text-sm font-semibold">Alto</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-3">Atuação Geográfica</h4>
                <p className="text-muted-foreground">
                  Atuação nacional em todo o Brasil, conectando empresas, corretores e profissionais
                  de todas as regiões do país.
                </p>
              </CardContent>
            </Card>
          </div>
        </InstitutionalSection>

        {/* Alcance e Engajamento */}
        <InstitutionalSection title="Alcance e Diferenciais">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Métricas Principais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Visualizações mensais</span>
                  <span className="text-lg font-semibold">1,3M+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Anos de experiência</span>
                  <span className="text-lg font-semibold">18 anos</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Posicionamento</span>
                  <span className="text-lg font-semibold">#1 do setor</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Alcance</span>
                  <span className="text-lg font-semibold">Nacional</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diferenciais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Credibilidade</span>
                  <span className="text-lg font-semibold">Alta autoridade</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Conexão estratégica</span>
                  <span className="text-lg font-semibold">Direta</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Conteúdo</span>
                  <span className="text-lg font-semibold">Profissional e estratégico</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Resultados</span>
                  <span className="text-lg font-semibold">Reais e mensuráveis</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </InstitutionalSection>

        {/* Formatos Publicitários */}
        <InstitutionalSection title="Formatos Publicitários - Especificações Técnicas">
          <div className="overflow-x-auto mt-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Formato</th>
                  <th className="text-left p-4 font-semibold">Dimensões</th>
                  <th className="text-left p-4 font-semibold">Peso Máximo</th>
                  <th className="text-left p-4 font-semibold">Formato</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">Banner Topo</td>
                  <td className="p-4">728 x 90 px</td>
                  <td className="p-4">150 KB</td>
                  <td className="p-4">JPG, PNG, GIF</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Banner Lateral</td>
                  <td className="p-4">300 x 250 px</td>
                  <td className="p-4">100 KB</td>
                  <td className="p-4">JPG, PNG, GIF</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Banner Rodapé</td>
                  <td className="p-4">728 x 90 px</td>
                  <td className="p-4">150 KB</td>
                  <td className="p-4">JPG, PNG, GIF</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Banner Mobile</td>
                  <td className="p-4">320 x 480 px</td>
                  <td className="p-4">200 KB</td>
                  <td className="p-4">JPG, PNG</td>
                </tr>
                <tr>
                  <td className="p-4">Newsletter</td>
                  <td className="p-4">600 x 200 px</td>
                  <td className="p-4">100 KB</td>
                  <td className="p-4">JPG, PNG</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            * Todos os banners devem ser otimizados para web e compatíveis com dispositivos móveis.
            ** Formatos animados (GIF) são aceitos apenas para banners desktop.
          </p>
        </InstitutionalSection>

        {/* Downloads */}
        <InstitutionalSection title="Materiais para Download">
          <p className="text-lg leading-relaxed mb-6">
            Acesse nossos materiais de marca, logos e apresentações para usar em suas
            campanhas e propostas comerciais.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <ImageIcon className="w-6 h-6 text-primary" />
                  <CardTitle>Logos e Identidade Visual</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Logos em diferentes formatos e variações de cor, incluindo versões
                  para fundo claro e escuro.
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Logos (ZIP)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-6 h-6 text-primary" />
                  <CardTitle>Apresentação Comercial</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Apresentação completa com dados atualizados, formatos publicitários
                  e informações sobre nossa audiência.
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Apresentação (PDF)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  <CardTitle>Dados e Métricas Detalhadas</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Planilha completa com métricas detalhadas, dados demográficos e
                  análises de audiência atualizadas mensalmente.
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Dados (XLSX)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-6 h-6 text-primary" />
                  <CardTitle>Guidelines de Marca</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Manual completo com diretrizes de uso da marca, paleta de cores,
                  tipografia e exemplos de aplicação.
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Guidelines (PDF)
                </Button>
              </CardContent>
            </Card>
          </div>
        </InstitutionalSection>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                Precisa de mais informações?
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Nossa equipe comercial está pronta para ajudar você a criar a campanha
                ideal para sua marca.
              </p>
              <Button asChild size="lg" className="min-h-[48px]">
                <a href="mailto:adm.edashow@gmail.com">
                  Entre em Contato
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}











