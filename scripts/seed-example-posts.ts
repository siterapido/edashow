/**
 * Script para criar posts de exemplo no PayloadCMS
 * 
 * Executa: pnpm seed:posts
 * Ou: ts-node --esm scripts/seed-example-posts.ts
 * 
 * IMPORTANTE: O servidor Next.js deve estar rodando (pnpm dev) para que
 * as imagens possam ser acessadas via URL local.
 * 
 * Requer variáveis de ambiente:
 * - PAYLOAD_SERVER_URL ou NEXT_PUBLIC_SERVER_URL (padrão: http://localhost:3000)
 * - PAYLOAD_ADMIN_EMAIL (padrão: admin@example.com)
 * - PAYLOAD_ADMIN_PASSWORD (padrão: password)
 * - Ou PAYLOAD_API_TOKEN
 */

import { uploadMedia, upsertPost } from '../lib/payload/client'
import * as fs from 'fs'
import * as path from 'path'

// Importar tipos globais do Node.js 18+
declare global {
  var FormData: typeof globalThis.FormData
  var Blob: typeof globalThis.Blob
}

const PAYLOAD_SERVER_URL = process.env.PAYLOAD_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * Cria conteúdo Lexical JSON básico a partir de texto
 */
function createLexicalContent(text: string): any {
  const paragraphs = text.split('\n\n').filter(p => p.trim())
  
  return {
    root: {
      children: paragraphs.map((paragraph, index) => ({
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: paragraph.trim(),
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

/**
 * Faz upload de uma imagem local para o PayloadCMS
 */
async function uploadLocalImage(
  localPath: string,
  alt?: string,
  caption?: string
): Promise<string | null> {
  try {
    const fullPath = path.join(process.cwd(), 'public', localPath)
    
    if (!fs.existsSync(fullPath)) {
      console.error(`Arquivo não encontrado: ${fullPath}`)
      return null
    }

    const fileBuffer = fs.readFileSync(fullPath)
    const filename = path.basename(localPath)
    const ext = path.extname(filename).toLowerCase()
    
    let mimeType = 'image/jpeg'
    if (ext === '.png') mimeType = 'image/png'
    else if (ext === '.webp') mimeType = 'image/webp'
    else if (ext === '.gif') mimeType = 'image/gif'

    const token = await authenticate()
    
    // Usar FormData nativo do Node.js 18+
    const formData = new FormData()
    const blob = new Blob([fileBuffer], { type: mimeType })
    formData.append('file', blob, filename)
    if (alt) formData.append('alt', alt)
    if (caption) formData.append('caption', caption)

    const uploadResponse = await fetch(`${PAYLOAD_SERVER_URL}/api/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      throw new Error(`Falha no upload: ${uploadResponse.statusText} - ${errorText}`)
    }

    const media = await uploadResponse.json()
    return media.id
  } catch (error) {
    console.error(`Erro ao fazer upload de ${localPath}:`, error)
    return null
  }
}

/**
 * Autentica no Payload CMS
 */
async function authenticate(): Promise<string> {
  const PAYLOAD_API_TOKEN = process.env.PAYLOAD_API_TOKEN || ''
  
  if (PAYLOAD_API_TOKEN) {
    return PAYLOAD_API_TOKEN
  }

  const email = process.env.PAYLOAD_ADMIN_EMAIL || 'admin@example.com'
  const password = process.env.PAYLOAD_ADMIN_PASSWORD || 'password'
  
  const response = await fetch(`${PAYLOAD_SERVER_URL}/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  if (!response.ok) {
    throw new Error(`Falha na autenticação: ${response.statusText}`)
  }

  const data = await response.json()
  return data.token
}

/**
 * Posts de exemplo a serem criados
 */
const examplePosts = [
  // Política e Regulação
  {
    title: 'ANS define novas regras para portabilidade de carências',
    slug: 'ans-novas-regras-portabilidade-carencias',
    excerpt: 'Medida visa facilitar a troca de planos para beneficiários em todo o país a partir do próximo mês.',
    category: 'news' as const,
    tags: ['Regulação', 'ANS', 'Portabilidade'],
    image: '/regulatory-agency-logo.jpg',
    imageAlt: 'Logo da ANS - Agência Nacional de Saúde Suplementar',
    content: `A Agência Nacional de Saúde Suplementar (ANS) anunciou nesta semana novas diretrizes para facilitar a portabilidade de carências entre planos de saúde. A medida, que entra em vigor no próximo mês, representa um avanço significativo na proteção dos beneficiários.

A portabilidade de carências permite que um beneficiário mude de plano de saúde sem perder o tempo já cumprido de carência para procedimentos específicos. Até então, essa transferência era limitada e burocrática, dificultando a mobilidade dos consumidores no mercado de saúde suplementar.

**Principais mudanças:**

As novas regras estabelecem que:
- O tempo de carência já cumprido será automaticamente reconhecido pelo novo plano
- O processo de transferência será simplificado, com prazo máximo de 15 dias úteis
- A ANS criará um sistema unificado para rastreamento das carências
- Beneficiários poderão consultar seu histórico de carências através de um portal online

**Impacto no mercado:**

Especialistas avaliam que a medida deve aumentar a concorrência entre operadoras, já que os consumidores terão mais facilidade para trocar de plano. Isso pode resultar em melhorias na qualidade dos serviços oferecidos e em preços mais competitivos.

A expectativa é que mais de 2 milhões de beneficiários sejam impactados positivamente pela nova regulamentação nos primeiros 12 meses de vigência.`,
  },
  {
    title: 'Ministério da Saúde anuncia investimento recorde no SUS',
    slug: 'ministerio-saude-investimento-recorde-sus',
    excerpt: 'Recursos serão destinados à digitalização e modernização de hospitais públicos.',
    category: 'news' as const,
    tags: ['Governo', 'SUS', 'Investimento'],
    image: '/modern-healthcare-building.jpg',
    imageAlt: 'Hospital público moderno',
    content: `O Ministério da Saúde anunciou nesta terça-feira o maior investimento da história do Sistema Único de Saúde (SUS), com destinação de R$ 50 bilhões para modernização e digitalização da rede pública de saúde.

O pacote de investimentos, batizado de "SUS Digital 2026", prevê recursos para infraestrutura tecnológica, equipamentos médicos de última geração e capacitação de profissionais de saúde em todo o país.

**Distribuição dos recursos:**

Os investimentos serão distribuídos em três eixos principais:
- Digitalização: R$ 20 bilhões para sistemas de prontuário eletrônico, telemedicina e integração de dados
- Infraestrutura: R$ 20 bilhões para reforma e construção de unidades de saúde
- Equipamentos: R$ 10 bilhões para aquisição de aparelhos médicos e de diagnóstico

**Prioridades regionais:**

O ministério estabeleceu critérios de distribuição que priorizam regiões com menor cobertura de saúde, especialmente o Norte e Nordeste. Municípios com população acima de 100 mil habitantes receberão recursos prioritários para implementação de sistemas digitais integrados.

**Expectativas:**

A expectativa é que, até 2026, 80% das unidades de saúde do SUS estejam completamente digitalizadas, permitindo melhor rastreamento de pacientes, redução de filas e otimização de recursos. O projeto também prevê a criação de uma rede nacional de telemedicina, conectando especialistas de grandes centros com profissionais de cidades menores.`,
  },
  {
    title: 'Novas diretrizes para planos de saúde coletivos em 2026',
    slug: 'novas-diretrizes-planos-coletivos-2026',
    excerpt: 'Entenda o que muda para empresas e beneficiários com a nova resolução normativa.',
    category: 'news' as const,
    tags: ['Mercado', 'Planos Coletivos', 'Regulação'],
    image: '/business-man-professional.jpg',
    imageAlt: 'Executivo em reunião de negócios',
    content: `A Agência Nacional de Saúde Suplementar (ANS) publicou nesta quarta-feira a Resolução Normativa 500/2025, que estabelece novas diretrizes para planos de saúde coletivos empresariais. As mudanças entram em vigor em janeiro de 2026 e afetam tanto empresas quanto seus colaboradores.

A nova regulamentação visa aumentar a transparência nas negociações entre empresas e operadoras, além de garantir mais proteção aos beneficiários de planos coletivos.

**Principais mudanças:**

1. **Transparência de preços**: Operadoras deverão divulgar claramente os valores praticados e os critérios de reajuste anual
2. **Proteção ao beneficiário**: Empresas não poderão mais reduzir cobertura sem aviso prévio de 90 dias
3. **Portabilidade facilitada**: Funcionários que saírem da empresa terão direito a migração facilitada para plano individual
4. **Reajuste anual**: Limites mais rígidos para aumentos de mensalidade, com necessidade de justificativa técnica

**Impacto para empresas:**

As empresas terão que se adaptar às novas regras de transparência, mas ganham mais segurança jurídica nas negociações. A ANS espera que isso resulte em contratos mais claros e menos conflitos entre partes.

**Impacto para beneficiários:**

Os trabalhadores terão mais garantias de continuidade de cobertura e transparência sobre os custos. A portabilidade facilitada também oferece mais opções para quem muda de emprego.

**Próximos passos:**

Operadoras e empresas têm até dezembro de 2025 para se adequar às novas normas. A ANS disponibilizará um guia completo de implementação nas próximas semanas.`,
  },
  {
    title: 'Judicialização da saúde: novos precedentes do STJ',
    slug: 'judicializacao-saude-precedentes-stj',
    excerpt: 'Decisões recentes trazem mais segurança jurídica para operadoras e usuários.',
    category: 'news' as const,
    tags: ['Jurídico', 'STJ', 'Judicialização'],
    image: '/ans-building-court.jpg',
    imageAlt: 'Tribunal de Justiça',
    content: `O Superior Tribunal de Justiça (STJ) estabeleceu novos precedentes importantes sobre judicialização da saúde em decisões recentes, trazendo mais clareza jurídica para operadoras de planos de saúde e beneficiários.

As decisões tratam de temas sensíveis como cobertura de tratamentos experimentais, medicamentos de alto custo e procedimentos não previstos no rol da ANS.

**Principais precedentes:**

1. **Tratamentos experimentais**: O STJ decidiu que operadoras não são obrigadas a cobrir tratamentos ainda em fase experimental, exceto quando não houver alternativa terapêutica comprovada e houver recomendação médica fundamentada.

2. **Medicamentos de alto custo**: O tribunal estabeleceu que a cobertura de medicamentos de alto custo deve seguir critérios objetivos, considerando a comprovação científica de eficácia e a existência de alternativas terapêuticas.

3. **Procedimentos fora do rol**: Decisões recentes têm sido mais restritivas quanto à cobertura de procedimentos não previstos no rol da ANS, exigindo comprovação técnica mais rigorosa.

**Impacto no mercado:**

As decisões trazem mais previsibilidade para as operadoras, que poderão planejar melhor seus custos. Por outro lado, beneficiários terão critérios mais claros sobre o que podem ou não exigir judicialmente.

**Análise jurídica:**

Especialistas em direito da saúde avaliam que os precedentes equilibram melhor os interesses das partes, reduzindo litígios desnecessários mas mantendo a proteção aos beneficiários em casos legítimos. A expectativa é que isso reduza o volume de ações judiciais relacionadas à saúde suplementar nos próximos anos.`,
  },
  // Tecnologia e Inovação
  {
    title: 'IA Generativa revoluciona triagem em prontos-socorros',
    slug: 'ia-generativa-triagem-prontos-socorros',
    excerpt: 'Hospitais de SP reportam redução de 30% no tempo de espera com novo sistema.',
    category: 'analysis' as const,
    tags: ['Inovação', 'IA', 'Tecnologia'],
    image: '/smartphone-health-app.jpg',
    imageAlt: 'Aplicativo de saúde em smartphone',
    content: `Hospitais públicos e privados de São Paulo estão implementando sistemas de inteligência artificial generativa para otimizar a triagem de pacientes em prontos-socorros, com resultados impressionantes nos primeiros meses de uso.

O sistema utiliza algoritmos de processamento de linguagem natural para analisar sintomas descritos pelos pacientes e sugerir prioridades de atendimento, reduzindo significativamente o tempo de espera.

**Como funciona:**

O sistema funciona em três etapas:
1. O paciente descreve seus sintomas através de uma interface conversacional
2. A IA analisa as informações e cruza com histórico médico quando disponível
3. O sistema sugere uma classificação de risco, que é validada por um profissional de saúde

**Resultados obtidos:**

Hospitais que implementaram a solução reportam:
- Redução de 30% no tempo médio de espera
- Aumento de 25% na precisão da triagem inicial
- Melhor distribuição de pacientes por nível de urgência
- Redução de 15% em casos de agravamento durante a espera

**Desafios e considerações:**

Apesar dos resultados positivos, especialistas alertam para a necessidade de supervisão humana constante. A IA serve como ferramenta de apoio, mas a decisão final sempre deve ser do profissional de saúde.

Questões de privacidade e segurança de dados também são fundamentais. Os sistemas precisam garantir que informações sensíveis dos pacientes sejam protegidas adequadamente.

**Futuro da tecnologia:**

A expectativa é que, nos próximos anos, sistemas similares sejam expandidos para outras áreas da saúde, como diagnóstico por imagem e prescrição de medicamentos. A tecnologia tem potencial para revolucionar a eficiência do sistema de saúde brasileiro.`,
  },
  {
    title: 'Telemedicina atinge marca de 10 milhões de atendimentos',
    slug: 'telemedicina-10-milhoes-atendimentos',
    excerpt: 'Crescimento de 45% no último ano consolida modalidade no país.',
    category: 'news' as const,
    tags: ['Digital', 'Telemedicina', 'Inovação'],
    image: '/business-executive-professional.jpg',
    imageAlt: 'Profissional em videoconferência médica',
    content: `A telemedicina brasileira alcançou um marco histórico: 10 milhões de atendimentos realizados através de plataformas digitais, consolidando-se como uma modalidade essencial do sistema de saúde nacional.

O crescimento de 45% no último ano reflete a maturidade da tecnologia e a aceitação crescente tanto por parte dos profissionais quanto dos pacientes.

**Distribuição por especialidade:**

As especialidades mais procuradas na telemedicina são:
- Clínica geral: 35% dos atendimentos
- Psicologia: 20% dos atendimentos
- Pediatria: 15% dos atendimentos
- Cardiologia: 10% dos atendimentos
- Outras especialidades: 20% dos atendimentos

**Vantagens comprovadas:**

Estudos mostram que a telemedicina oferece:
- Redução de custos para pacientes e operadoras
- Maior acessibilidade, especialmente em áreas rurais
- Economia de tempo com deslocamentos
- Continuidade de cuidados durante períodos de isolamento

**Desafios regulatórios:**

Apesar do crescimento, ainda há desafios regulatórios a serem superados. A regulamentação definitiva da telemedicina no Brasil ainda está em discussão, com necessidade de definir padrões de qualidade, segurança de dados e reembolso por operadoras.

**Tendências futuras:**

Especialistas preveem que a telemedicina continuará crescendo, especialmente com a integração de tecnologias como inteligência artificial para diagnóstico auxiliar e dispositivos IoT para monitoramento remoto de pacientes. A expectativa é que, até 2027, 30% de todos os atendimentos ambulatoriais sejam realizados via telemedicina.`,
  },
  {
    title: 'Wearables e monitoramento remoto de pacientes crônicos',
    slug: 'wearables-monitoramento-remoto-pacientes-cronicos',
    excerpt: 'Dispositivos conectados reduzem internações em até 25%, aponta estudo.',
    category: 'analysis' as const,
    tags: ['Tecnologia', 'Wearables', 'Monitoramento'],
    image: '/conference-healthcare-panel.jpg',
    imageAlt: 'Dispositivos wearables de saúde',
    content: `Um estudo realizado por pesquisadores brasileiros comprovou que o uso de dispositivos wearables e sistemas de monitoramento remoto pode reduzir internações hospitalares de pacientes crônicos em até 25%, representando uma economia significativa para o sistema de saúde.

A pesquisa acompanhou mais de 5.000 pacientes com condições crônicas como diabetes, hipertensão e insuficiência cardíaca durante 18 meses.

**Tecnologias utilizadas:**

Os pacientes foram monitorados através de:
- Smartwatches com sensores de frequência cardíaca e atividade física
- Monitores de glicose contínuos para diabéticos
- Balanças inteligentes que medem composição corporal
- Aplicativos móveis para registro de sintomas e medicações

**Resultados do estudo:**

Os principais resultados observados foram:
- Redução de 25% nas internações hospitalares
- Diminuição de 30% nas visitas de emergência
- Melhora de 20% na adesão ao tratamento
- Redução de 15% nos custos totais de saúde por paciente

**Como funciona:**

Os dispositivos coletam dados continuamente e os transmitem para uma plataforma centralizada. Algoritmos de inteligência artificial analisam os padrões e identificam sinais de alerta precocemente. Quando detectado um risco, o sistema notifica automaticamente a equipe médica responsável.

**Benefícios para pacientes:**

Além da redução de internações, os pacientes relatam:
- Maior sensação de segurança e controle sobre sua condição
- Melhor compreensão de como seu comportamento afeta a saúde
- Acesso mais rápido a intervenções médicas quando necessário

**Desafios de implementação:**

Apesar dos benefícios, há desafios para implementação em larga escala:
- Custo inicial dos dispositivos
- Necessidade de treinamento de pacientes e profissionais
- Questões de privacidade e segurança de dados
- Necessidade de infraestrutura tecnológica adequada

**Futuro do monitoramento remoto:**

A expectativa é que, nos próximos anos, os dispositivos se tornem mais acessíveis e integrados aos sistemas de saúde, permitindo monitoramento contínuo de milhões de pacientes crônicos no Brasil.`,
  },
  {
    title: 'Blockchain na gestão de prontuários eletrônicos',
    slug: 'blockchain-gestao-prontuarios-eletronicos',
    excerpt: 'Segurança e interoperabilidade são os principais benefícios da tecnologia.',
    category: 'analysis' as const,
    tags: ['Segurança', 'Blockchain', 'Tecnologia'],
    image: '/modern-building-ans.jpg',
    imageAlt: 'Tecnologia blockchain em saúde',
    content: `Hospitais e clínicas brasileiras começam a adotar tecnologia blockchain para gestão de prontuários eletrônicos, buscando maior segurança, interoperabilidade e controle de acesso aos dados médicos.

A tecnologia, conhecida por sua aplicação em criptomoedas, está encontrando um novo campo de aplicação na área da saúde, com potencial para revolucionar como informações médicas são armazenadas e compartilhadas.

**Como funciona:**

No sistema baseado em blockchain:
- Cada registro médico é criptografado e armazenado em blocos imutáveis
- Múltiplas cópias são distribuídas em uma rede descentralizada
- Acesso aos dados requer autorização explícita do paciente
- Todas as alterações são registradas de forma permanente e auditável

**Principais benefícios:**

1. **Segurança**: A tecnologia blockchain oferece proteção contra violações de dados através de criptografia avançada e distribuição de informações
2. **Interoperabilidade**: Diferentes sistemas de saúde podem compartilhar dados de forma segura e padronizada
3. **Rastreabilidade**: Todas as acessos e modificações são registrados permanentemente
4. **Controle do paciente**: Pacientes têm controle total sobre quem acessa seus dados médicos

**Casos de uso práticos:**

Hospitais que implementaram a tecnologia reportam:
- Redução de 90% em tentativas de acesso não autorizado
- Tempo de compartilhamento de prontuários entre instituições reduzido de dias para minutos
- Maior confiança dos pacientes no sistema de saúde digital
- Melhor coordenação de cuidados entre diferentes profissionais

**Desafios técnicos:**

A implementação ainda enfrenta desafios:
- Escalabilidade para grandes volumes de dados
- Necessidade de padronização entre diferentes sistemas
- Custo inicial de implementação
- Necessidade de treinamento de profissionais

**Regulamentação:**

A tecnologia ainda está em fase inicial de regulamentação no Brasil. A ANS e o Ministério da Saúde estão acompanhando projetos piloto para definir diretrizes que garantam segurança e privacidade dos pacientes.

**Futuro:**

Especialistas preveem que, nos próximos 5 anos, a blockchain se tornará padrão para gestão de prontuários eletrônicos em grandes redes de saúde, permitindo um sistema nacional integrado e seguro de informações médicas.`,
  },
]

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Iniciando criação de posts de exemplo...\n')

  try {
    // Autenticar
    console.log('🔐 Autenticando no PayloadCMS...')
    await authenticate()
    console.log('✅ Autenticação realizada com sucesso\n')

    // Criar cada post
    for (let i = 0; i < examplePosts.length; i++) {
      const post = examplePosts[i]
      console.log(`📝 Criando post ${i + 1}/${examplePosts.length}: "${post.title}"`)

      // Fazer upload da imagem
      let imageId: string | null = null
      if (post.image) {
        console.log(`  📸 Fazendo upload da imagem: ${post.image}`)
        imageId = await uploadLocalImage(post.image, post.imageAlt)
        if (imageId) {
          console.log(`  ✅ Imagem enviada com sucesso (ID: ${imageId})`)
        } else {
          console.log(`  ⚠️  Falha no upload da imagem, continuando sem imagem`)
        }
      }

      // Criar conteúdo Lexical
      const lexicalContent = createLexicalContent(post.content)

      // Calcular data de publicação (últimas 12 horas, distribuídas)
      const hoursAgo = 12 - (i * 1.5) // Distribui ao longo de 12 horas
      const publishedDate = new Date()
      publishedDate.setHours(publishedDate.getHours() - hoursAgo)

      // Criar post
      const result = await upsertPost({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: lexicalContent,
        category: post.category,
        featuredImage: imageId || undefined,
        tags: post.tags.map(tag => ({ tag })),
        status: 'published',
        publishedDate: publishedDate.toISOString(),
        featured: i < 2, // Primeiros 2 posts em destaque
      })

      if (result) {
        console.log(`  ✅ Post criado com sucesso! (ID: ${result.id}, Slug: ${result.slug})\n`)
      } else {
        console.log(`  ❌ Falha ao criar post\n`)
      }
    }

    console.log('✨ Processo concluído!')
    console.log(`\n📊 Resumo:`)
    console.log(`   - Posts processados: ${examplePosts.length}`)
    console.log(`   - Acesse: ${PAYLOAD_SERVER_URL}/posts`)
    console.log(`   - Admin: ${PAYLOAD_SERVER_URL}/admin`)
  } catch (error) {
    console.error('❌ Erro durante a execução:', error)
    process.exit(1)
  }
}

// Executar
main()












