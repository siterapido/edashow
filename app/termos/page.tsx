import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { InstitutionalSection } from "@/components/institutional-section";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso | EDA Show",
  description: "Termos e condições de uso do portal EDA Show. Leia antes de utilizar nossos serviços.",
  openGraph: {
    title: "Termos de Uso",
    description: "Termos e condições de uso do EDA Show",
    type: "website",
  },
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Termos de Uso
          </h1>
          <p className="text-xl text-muted-foreground">
            Última atualização: 17 de dezembro de 2025
          </p>
        </header>

        {/* Índice */}
        <Card className="mb-12">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Índice</h2>
            <nav className="space-y-2">
              <Link href="#aceitacao" className="block text-primary hover:underline">
                1. Aceitação dos Termos
              </Link>
              <Link href="#uso-site" className="block text-primary hover:underline">
                2. Uso do Site e Conteúdo
              </Link>
              <Link href="#propriedade" className="block text-primary hover:underline">
                3. Propriedade Intelectual
              </Link>
              <Link href="#responsabilidades" className="block text-primary hover:underline">
                4. Responsabilidades do Usuário
              </Link>
              <Link href="#limitacoes" className="block text-primary hover:underline">
                5. Limitações de Responsabilidade
              </Link>
              <Link href="#modificacoes" className="block text-primary hover:underline">
                6. Modificações dos Termos
              </Link>
              <Link href="#lei-aplicavel" className="block text-primary hover:underline">
                7. Lei Aplicável e Foro
              </Link>
              <Link href="#contato" className="block text-primary hover:underline">
                8. Contato
              </Link>
            </nav>
          </CardContent>
        </Card>

        {/* Aceitação */}
        <InstitutionalSection id="aceitacao" title="1. Aceitação dos Termos">
          <p className="text-lg leading-relaxed mb-4">
            Estes Termos de Uso ("Termos") regem o uso do site EDA Show 
            (www.edashow.com.br) e todos os serviços oferecidos através dele. 
            Ao acessar e utilizar nosso site, você concorda em cumprir e estar 
            vinculado a estes Termos.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            Se você não concorda com qualquer parte destes Termos, não deve utilizar 
            nosso site ou serviços. Recomendamos que leia estes Termos cuidadosamente 
            antes de utilizar nossos serviços.
          </p>
          <p className="text-lg leading-relaxed">
            Estes Termos constituem um acordo legal entre você e o EDA Show. Ao utilizar 
            nosso site, você confirma que tem capacidade legal para celebrar este acordo 
            e que leu, entendeu e concorda com todos os termos aqui estabelecidos.
          </p>
        </InstitutionalSection>

        {/* Uso do Site */}
        <InstitutionalSection id="uso-site" title="2. Uso do Site e Conteúdo">
          <h3 className="text-xl font-semibold mt-6 mb-3">2.1. Licença de Uso</h3>
          <p className="text-lg leading-relaxed mb-4">
            Concedemos a você uma licença limitada, não exclusiva, não transferível e 
            revogável para acessar e utilizar nosso site para fins pessoais e não 
            comerciais, sujeito ao cumprimento destes Termos.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.2. Uso Permitido</h3>
          <p className="text-lg leading-relaxed mb-4">Você pode:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Acessar e visualizar conteúdo disponível publicamente</li>
            <li>Compartilhar links para nossos artigos em redes sociais</li>
            <li>Fazer referência ao nosso conteúdo com atribuição adequada</li>
            <li>Assinar nossa newsletter e participar de eventos</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.3. Uso Proibido</h3>
          <p className="text-lg leading-relaxed mb-4">Você não pode:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Reproduzir, distribuir ou modificar nosso conteúdo sem autorização</li>
            <li>Usar nosso conteúdo para fins comerciais sem licença</li>
            <li>Tentar acessar áreas restritas ou sistemas do site</li>
            <li>Interferir no funcionamento do site ou violar medidas de segurança</li>
            <li>Usar bots, scrapers ou ferramentas automatizadas para coletar dados</li>
            <li>Publicar conteúdo ofensivo, difamatório ou ilegal</li>
            <li>Fazer engenharia reversa ou tentar extrair código-fonte</li>
            <li>Usar o site de forma que viole leis aplicáveis</li>
          </ul>
        </InstitutionalSection>

        {/* Propriedade Intelectual */}
        <InstitutionalSection id="propriedade" title="3. Propriedade Intelectual">
          <p className="text-lg leading-relaxed mb-4">
            Todo o conteúdo disponível no site EDA Show, incluindo mas não limitado a 
            textos, gráficos, logos, ícones, imagens, áudios, vídeos, software e 
            compilações de dados, é propriedade do EDA Show ou de seus licenciadores e 
            está protegido por leis de direitos autorais, marcas registradas e outras 
            leis de propriedade intelectual.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">3.1. Direitos Reservados</h3>
          <p className="text-lg leading-relaxed mb-4">
            Todos os direitos não expressamente concedidos nestes Termos são reservados. 
            Você reconhece que não adquire nenhum direito de propriedade sobre o conteúdo 
            ao acessar o site.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">3.2. Marcas Registradas</h3>
          <p className="text-lg leading-relaxed mb-4">
            "EDA Show" e logos relacionados são marcas registradas ou marcas comerciais 
            do EDA Show. Você não pode usar essas marcas sem nossa autorização prévia 
            por escrito.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">3.3. Conteúdo de Terceiros</h3>
          <p className="text-lg leading-relaxed">
            Alguns conteúdos podem ser de propriedade de terceiros e são usados com 
            permissão. Respeitamos os direitos de propriedade intelectual de terceiros 
            e esperamos que nossos usuários façam o mesmo.
          </p>
        </InstitutionalSection>

        {/* Responsabilidades */}
        <InstitutionalSection id="responsabilidades" title="4. Responsabilidades do Usuário">
          <h3 className="text-xl font-semibold mt-6 mb-3">4.1. Conta e Segurança</h3>
          <p className="text-lg leading-relaxed mb-4">
            Se você criar uma conta em nosso site, é responsável por manter a 
            confidencialidade de suas credenciais e por todas as atividades que ocorram 
            sob sua conta. Você deve notificar-nos imediatamente sobre qualquer uso não 
            autorizado.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">4.2. Conteúdo do Usuário</h3>
          <p className="text-lg leading-relaxed mb-4">
            Ao enviar comentários, sugestões ou outros conteúdos, você concede ao EDA 
            Show uma licença não exclusiva, mundial, livre de royalties para usar, 
            modificar, publicar e distribuir esse conteúdo.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            Você garante que possui todos os direitos necessários sobre o conteúdo 
            enviado e que ele não viola direitos de terceiros ou leis aplicáveis.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">4.3. Conduta</h3>
          <p className="text-lg leading-relaxed">
            Você concorda em usar nosso site de forma responsável e respeitosa, não 
            publicando conteúdo ofensivo, difamatório, ilegal ou que viole direitos de 
            terceiros.
          </p>
        </InstitutionalSection>

        {/* Limitações */}
        <InstitutionalSection id="limitacoes" title="5. Limitações de Responsabilidade">
          <h3 className="text-xl font-semibold mt-6 mb-3">5.1. Disponibilidade do Site</h3>
          <p className="text-lg leading-relaxed mb-4">
            Embora nos esforcemos para manter o site disponível, não garantimos acesso 
            ininterrupto ou livre de erros. O site pode estar temporariamente indisponível 
            devido a manutenção, atualizações ou circunstâncias fora de nosso controle.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">5.2. Precisão do Conteúdo</h3>
          <p className="text-lg leading-relaxed mb-4">
            Embora nos esforcemos para fornecer informações precisas e atualizadas, não 
            garantimos a precisão, completude ou atualidade de todo o conteúdo. O conteúdo 
            é fornecido "como está" para fins informativos.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">5.3. Links para Sites de Terceiros</h3>
          <p className="text-lg leading-relaxed mb-4">
            Nosso site pode conter links para sites de terceiros. Não somos responsáveis 
            pelo conteúdo, políticas de privacidade ou práticas desses sites externos. 
            O acesso a sites de terceiros é por sua conta e risco.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">5.4. Limitação de Danos</h3>
          <p className="text-lg leading-relaxed">
            Na máxima extensão permitida por lei, o EDA Show não será responsável por 
            danos diretos, indiretos, incidentais, especiais ou consequenciais resultantes 
            do uso ou incapacidade de usar nosso site ou serviços.
          </p>
        </InstitutionalSection>

        {/* Modificações */}
        <InstitutionalSection id="modificacoes" title="6. Modificações dos Termos">
          <p className="text-lg leading-relaxed mb-4">
            Reservamo-nos o direito de modificar estes Termos a qualquer momento. 
            Alterações significativas serão comunicadas através de nosso site ou por 
            e-mail. A data da última atualização está indicada no topo desta página.
          </p>
          <p className="text-lg leading-relaxed">
            O uso continuado de nosso site após as modificações constitui aceitação dos 
            Termos atualizados. Se você não concordar com as alterações, deve cessar 
            o uso do site.
          </p>
        </InstitutionalSection>

        {/* Lei Aplicável */}
        <InstitutionalSection id="lei-aplicavel" title="7. Lei Aplicável e Foro">
          <p className="text-lg leading-relaxed mb-4">
            Estes Termos são regidos pelas leis da República Federativa do Brasil, 
            especialmente a Lei nº 12.965/2014 (Marco Civil da Internet) e a Lei Geral 
            de Proteção de Dados (LGPD).
          </p>
          <p className="text-lg leading-relaxed">
            Qualquer disputa relacionada a estes Termos será resolvida no foro da 
            Comarca de São Paulo, Estado de São Paulo, renunciando as partes a qualquer 
            outro, por mais privilegiado que seja.
          </p>
        </InstitutionalSection>

        {/* Contato */}
        <InstitutionalSection id="contato" title="8. Contato">
          <p className="text-lg leading-relaxed mb-4">
            Para questões relacionadas a estes Termos de Uso, entre em contato conosco:
          </p>
          <Card className="mt-6">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-2">
                <strong>E-mail:</strong>{" "}
                <Link href="mailto:contato@edashow.com.br" className="text-primary hover:underline">
                  contato@edashow.com.br
                </Link>
              </p>
              <p className="text-muted-foreground">
                <strong>Endereço:</strong> São Paulo, SP - Brasil
              </p>
            </CardContent>
          </Card>
        </InstitutionalSection>

        {/* Link para Privacidade */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Estes termos devem ser lidos em conjunto com nossa{" "}
            <Link href="/privacidade" className="text-primary hover:underline">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}












