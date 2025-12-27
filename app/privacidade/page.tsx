import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { InstitutionalSection } from "@/components/institutional-section";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade | EDA Show",
  description: "Conheça como o EDA Show coleta, usa e protege seus dados pessoais em conformidade com a LGPD.",
  openGraph: {
    title: "Política de Privacidade",
    description: "Nossa política de privacidade e proteção de dados",
    type: "website",
  },
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Política de Privacidade
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
              <Link href="#introducao" className="block text-primary hover:underline">
                1. Introdução e Compromisso
              </Link>
              <Link href="#dados-coletados" className="block text-primary hover:underline">
                2. Dados Coletados
              </Link>
              <Link href="#uso-dados" className="block text-primary hover:underline">
                3. Como Usamos os Dados
              </Link>
              <Link href="#compartilhamento" className="block text-primary hover:underline">
                4. Compartilhamento de Informações
              </Link>
              <Link href="#cookies" className="block text-primary hover:underline">
                5. Cookies e Tecnologias de Rastreamento
              </Link>
              <Link href="#direitos" className="block text-primary hover:underline">
                6. Direitos do Usuário (LGPD)
              </Link>
              <Link href="#seguranca" className="block text-primary hover:underline">
                7. Segurança dos Dados
              </Link>
              <Link href="#contato" className="block text-primary hover:underline">
                8. Contato e DPO
              </Link>
              <Link href="#atualizacoes" className="block text-primary hover:underline">
                9. Atualizações da Política
              </Link>
            </nav>
          </CardContent>
        </Card>

        {/* Introdução */}
        <InstitutionalSection id="introducao" title="1. Introdução e Compromisso com a Privacidade">
          <p className="text-lg leading-relaxed mb-4">
            O EDA Show ("nós", "nosso" ou "empresa") está comprometido com a proteção 
            da privacidade e dos dados pessoais de nossos usuários. Esta Política de 
            Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas 
            informações pessoais em conformidade com a Lei Geral de Proteção de Dados 
            (LGPD - Lei nº 13.709/2018).
          </p>
          <p className="text-lg leading-relaxed">
            Ao utilizar nosso site e serviços, você concorda com as práticas descritas 
            nesta política. Recomendamos que leia este documento com atenção para 
            entender como tratamos seus dados pessoais.
          </p>
        </InstitutionalSection>

        {/* Dados Coletados */}
        <InstitutionalSection id="dados-coletados" title="2. Dados Coletados">
          <p className="text-lg leading-relaxed mb-4">
            Coletamos diferentes tipos de informações quando você utiliza nossos serviços:
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">2.1. Dados Fornecidos por Você</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Nome completo</li>
            <li>Endereço de e-mail</li>
            <li>Informações de contato (telefone, empresa, cargo)</li>
            <li>Dados de cadastro em eventos e webinars</li>
            <li>Comentários e interações em nosso conteúdo</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.2. Dados Coletados Automaticamente</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Endereço IP</li>
            <li>Informações do navegador e dispositivo</li>
            <li>Dados de navegação e comportamento no site</li>
            <li>Cookies e tecnologias similares</li>
            <li>Localização geográfica aproximada</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.3. Dados de Terceiros</h3>
          <p className="text-lg leading-relaxed">
            Podemos receber informações sobre você de parceiros e provedores de serviços, 
            como plataformas de análise e redes sociais, quando você interage com nosso 
            conteúdo nessas plataformas.
          </p>
        </InstitutionalSection>

        {/* Como Usamos os Dados */}
        <InstitutionalSection id="uso-dados" title="3. Como Usamos os Dados">
          <p className="text-lg leading-relaxed mb-4">
            Utilizamos seus dados pessoais para as seguintes finalidades:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Fornecer e melhorar nossos serviços editoriais</li>
            <li>Enviar newsletters e comunicações relevantes</li>
            <li>Personalizar conteúdo e recomendações</li>
            <li>Processar inscrições em eventos e webinars</li>
            <li>Analisar uso do site e comportamento dos usuários</li>
            <li>Responder a solicitações e suporte ao cliente</li>
            <li>Cumprir obrigações legais e regulatórias</li>
            <li>Prevenir fraudes e garantir segurança</li>
            <li>Realizar pesquisas e análises de mercado</li>
          </ul>
          <p className="text-lg leading-relaxed mt-4">
            Todos os tratamentos de dados são realizados com base em fundamentos legais 
            previstos na LGPD, como consentimento, execução de contrato, cumprimento de 
            obrigação legal e legítimo interesse.
          </p>
        </InstitutionalSection>

        {/* Compartilhamento */}
        <InstitutionalSection id="compartilhamento" title="4. Compartilhamento de Informações">
          <p className="text-lg leading-relaxed mb-4">
            Podemos compartilhar seus dados pessoais nas seguintes situações:
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">4.1. Prestadores de Serviços</h3>
          <p className="text-lg leading-relaxed mb-4">
            Compartilhamos dados com empresas que nos auxiliam na operação do site e 
            prestação de serviços, como hospedagem, análise de dados, processamento de 
            pagamentos e envio de e-mails. Esses parceiros são contratualmente obrigados 
            a proteger seus dados.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.2. Obrigações Legais</h3>
          <p className="text-lg leading-relaxed mb-4">
            Podemos divulgar informações quando exigido por lei, ordem judicial ou 
            processo legal, ou para proteger nossos direitos e segurança.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.3. Transferências de Negócio</h3>
          <p className="text-lg leading-relaxed">
            Em caso de fusão, aquisição ou venda de ativos, seus dados podem ser 
            transferidos como parte da transação, sempre respeitando esta política.
          </p>
        </InstitutionalSection>

        {/* Cookies */}
        <InstitutionalSection id="cookies" title="5. Cookies e Tecnologias de Rastreamento">
          <p className="text-lg leading-relaxed mb-4">
            Utilizamos cookies e tecnologias similares para melhorar sua experiência, 
            analisar o uso do site e personalizar conteúdo. Os cookies são pequenos 
            arquivos de texto armazenados em seu dispositivo.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">Tipos de Cookies Utilizados:</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Cookies Essenciais:</strong> Necessários para o funcionamento do site</li>
            <li><strong>Cookies de Análise:</strong> Coletam informações sobre uso do site</li>
            <li><strong>Cookies de Marketing:</strong> Usados para personalizar anúncios</li>
            <li><strong>Cookies de Preferências:</strong> Lembram suas escolhas e configurações</li>
          </ul>
          <p className="text-lg leading-relaxed mt-4">
            Você pode gerenciar suas preferências de cookies através das configurações 
            do seu navegador. Note que desabilitar cookies pode afetar a funcionalidade 
            do site.
          </p>
        </InstitutionalSection>

        {/* Direitos do Usuário */}
        <InstitutionalSection id="direitos" title="6. Direitos do Usuário (LGPD)">
          <p className="text-lg leading-relaxed mb-4">
            Conforme a LGPD, você possui os seguintes direitos em relação aos seus 
            dados pessoais:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Confirmação e Acesso:</strong> Saber se tratamos seus dados e acessá-los</li>
            <li><strong>Correção:</strong> Solicitar correção de dados incompletos ou desatualizados</li>
            <li><strong>Anonimização, Bloqueio ou Eliminação:</strong> Solicitar remoção de dados desnecessários</li>
            <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
            <li><strong>Eliminação:</strong> Solicitar exclusão de dados tratados com consentimento</li>
            <li><strong>Revogação de Consentimento:</strong> Retirar consentimento a qualquer momento</li>
            <li><strong>Informação:</strong> Obter informações sobre compartilhamento de dados</li>
            <li><strong>Oposição:</strong> Opor-se ao tratamento de dados em certas situações</li>
          </ul>
          <p className="text-lg leading-relaxed mt-4">
            Para exercer seus direitos, entre em contato conosco através do e-mail 
            <Link href="mailto:privacidade@edashow.com.br" className="text-primary hover:underline mx-1">
              privacidade@edashow.com.br
            </Link>
            ou utilize nosso canal de atendimento.
          </p>
        </InstitutionalSection>

        {/* Segurança */}
        <InstitutionalSection id="seguranca" title="7. Segurança dos Dados">
          <p className="text-lg leading-relaxed mb-4">
            Implementamos medidas técnicas e organizacionais adequadas para proteger 
            seus dados pessoais contra acesso não autorizado, alteração, divulgação ou 
            destruição, incluindo:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Criptografia de dados em trânsito e em repouso</li>
            <li>Controles de acesso e autenticação</li>
            <li>Monitoramento regular de segurança</li>
            <li>Backups regulares</li>
            <li>Treinamento de equipe em proteção de dados</li>
          </ul>
          <p className="text-lg leading-relaxed mt-4">
            Apesar de nossos esforços, nenhum método de transmissão ou armazenamento 
            é 100% seguro. Não podemos garantir segurança absoluta, mas nos 
            comprometemos a notificar você em caso de violação de dados que possa 
            afetá-lo.
          </p>
        </InstitutionalSection>

        {/* Contato */}
        <InstitutionalSection id="contato" title="8. Contato e DPO">
          <p className="text-lg leading-relaxed mb-4">
            Para questões relacionadas a esta Política de Privacidade ou para exercer 
            seus direitos, entre em contato:
          </p>
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-3">Encarregado de Proteção de Dados (DPO)</h3>
              <p className="text-muted-foreground mb-2">
                <strong>E-mail:</strong>{" "}
                <Link href="mailto:dpo@edashow.com.br" className="text-primary hover:underline">
                  dpo@edashow.com.br
                </Link>
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>E-mail Geral:</strong>{" "}
                <Link href="mailto:privacidade@edashow.com.br" className="text-primary hover:underline">
                  privacidade@edashow.com.br
                </Link>
              </p>
              <p className="text-muted-foreground">
                <strong>Endereço:</strong> São Paulo, SP - Brasil
              </p>
            </CardContent>
          </Card>
        </InstitutionalSection>

        {/* Atualizações */}
        <InstitutionalSection id="atualizacoes" title="9. Atualizações da Política">
          <p className="text-lg leading-relaxed mb-4">
            Podemos atualizar esta Política de Privacidade periodicamente para refletir 
            mudanças em nossas práticas ou por razões legais, operacionais ou 
            regulatórias. A data da última atualização está indicada no topo desta página.
          </p>
          <p className="text-lg leading-relaxed">
            Recomendamos que você revise esta política regularmente. Alterações 
            significativas serão comunicadas através de nosso site ou por e-mail. 
            O uso continuado de nossos serviços após as alterações constitui 
            aceitação da política atualizada.
          </p>
        </InstitutionalSection>

        {/* Link para Termos */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Esta política deve ser lida em conjunto com nossos{" "}
            <Link href="/termos" className="text-primary hover:underline">
              Termos de Uso
            </Link>
            .
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}












