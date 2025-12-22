/**
 * Dados de fallback centralizados para quando o CMS não está disponível
 * Este arquivo contém dados estáticos que são usados quando o PayloadCMS não pode ser acessado
 */

// Posts de fallback para listagem
export const fallbackPosts = [
  {
    id: 1,
    title: "Usisaúde Seguro cresceu em 2025 e projeta expansão nacional em 2026 sob liderança de Ricardo Rodrigues",
    excerpt:
      "A Usisaúde alcançou resultados expressivos em 2025, ampliando sua presença no mercado e consolidando...",
    publishedDate: new Date().toISOString(),
    slug: "usisaude-seguro-cresceu-em-2025-e-projeta-expansao-nacional-em-2026",
    featuredImage: "/professional-man-ricardo-rodrigues.jpg",
    category: "news",
    featured: false,
  },
  {
    id: 2,
    title: "Odont reforça protagonismo no Nordeste",
    excerpt: "A Odont, maior cooperativa de Odontologia em número de cooperados (mais de 15mil), anunciou...",
    publishedDate: new Date(Date.now() - 86400000).toISOString(),
    slug: "odont-reforca-protagonismo-no-nordeste",
    featuredImage: "/odont-award-ceremony.jpg",
    category: "news",
    featured: false,
  },
  {
    id: 3,
    title: "STF publica acórdão com regras para judicialização da cobertura fora do rol da ANS",
    excerpt: "Todas as ações judiciais envolvendo cobertura de tratamentos que não estejam no rol...",
    publishedDate: new Date(Date.now() - 172800000).toISOString(),
    slug: "stf-publica-acordao-com-regras-para-judicializacao-da-cobertura-fora-do-rol-da-ans",
    featuredImage: "/ans-building-court.jpg",
    category: "news",
    featured: false,
  },
  {
    id: 4,
    title: "Reajuste médio dos planos de saúde foi de 11,15%; veja aumento das principais operadoras",
    excerpt:
      "Em 2024, o reajuste médio dos planos de saúde individuais registrou aumento que varia por operadora, saiba mais...",
    publishedDate: new Date(Date.now() - 259200000).toISOString(),
    slug: "reajuste-medio-dos-planos-de-saude-foi-de-11-15-veja-aumento-das-principais-operadoras",
    featuredImage: "/healthcare-operators-increase.jpg",
    category: "news",
    featured: false,
  },
  {
    id: 5,
    title: "Telemedicina ganha força com novas regulamentações da ANS",
    excerpt:
      "Novas diretrizes facilitam acesso a consultas remotas e ampliam cobertura para pacientes em todo o país...",
    publishedDate: new Date(Date.now() - 345600000).toISOString(),
    slug: "telemedicina-ganha-forca-com-novas-regulamentacoes-da-ans",
    featuredImage: "/smartphone-health-app.jpg",
    category: "news",
    featured: false,
  },
  {
    id: 6,
    title: "Operadoras investem em tecnologia para reduzir custos administrativos",
    excerpt:
      "Sistemas de gestão integrados e automação de processos prometem economia de até 30% nos custos operacionais...",
    publishedDate: new Date(Date.now() - 432000000).toISOString(),
    slug: "operadoras-investem-em-tecnologia-para-reduzir-custos-administrativos",
    featuredImage: "/modern-healthcare-building.jpg",
    category: "news",
    featured: false,
  },
  {
    id: 7,
    title: "ANS anuncia novas regras para planos odontológicos em 2026",
    excerpt:
      "Mudanças visam aumentar transparência e melhorar qualidade do atendimento odontológico para beneficiários...",
    publishedDate: new Date(Date.now() - 518400000).toISOString(),
    slug: "ans-anuncia-novas-regras-para-planos-odontologicos-em-2026",
    featuredImage: "/business-executive-professional.jpg",
    category: "news",
    featured: false,
  },
  {
    id: 8,
    title: "Setor de saúde suplementar debate futuro do setor em congresso nacional",
    excerpt:
      "Líderes do setor se reúnem para discutir inovações, regulamentações e tendências do mercado de planos de saúde...",
    publishedDate: new Date(Date.now() - 604800000).toISOString(),
    slug: "setor-de-saude-suplementar-debate-futuro-do-setor-em-congresso-nacional",
    featuredImage: "/conference-healthcare-panel.jpg",
    category: "news",
    featured: false,
  },
]

// Posts completos de fallback (com conteúdo rico) para páginas individuais
export const fallbackPostsFull: Record<string, any> = {
  'usisaude-seguro-cresceu-em-2025-e-projeta-expansao-nacional-em-2026': {
    title: 'Usisaúde Seguro cresceu em 2025 e projeta expansão nacional em 2026 sob liderança de Ricardo Rodrigues',
    excerpt: 'A Usisaúde alcançou resultados expressivos em 2025, ampliando sua presença no mercado e consolidando...',
    category: 'news',
    publishedDate: new Date().toISOString(),
    featuredImage: '/professional-man-ricardo-rodrigues.jpg',
    content: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A Usisaúde Seguro demonstrou crescimento significativo em 2025, consolidando sua posição no mercado de saúde suplementar brasileiro. Sob a liderança de Ricardo Rodrigues, CEO da empresa, a operadora registrou expansão de 35% em sua base de beneficiários e aumento de 28% na receita anual, resultados que superam as projeções iniciais do ano.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'O crescimento foi impulsionado por uma estratégia focada em expansão regional e investimentos em tecnologia. A empresa ampliou sua rede credenciada em 40%, especialmente nas regiões Sul e Sudeste, onde concentra a maior parte de suas operações atuais.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 1,
                mode: 'normal',
                style: '',
                text: 'Estratégia de Expansão Nacional',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            type: 'heading',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Para 2026, a Usisaúde Seguro planeja expandir suas operações para todo o território nacional, com foco especial nas regiões Norte e Nordeste, onde ainda possui presença limitada. A estratégia inclui parcerias estratégicas com hospitais e clínicas locais, além de investimentos em infraestrutura própria.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Ricardo Rodrigues destacou que a expansão será feita de forma gradual e sustentável, priorizando a qualidade do atendimento sobre o crescimento acelerado. "Nossa prioridade é garantir que, ao expandir, mantenhamos os altos padrões de qualidade que nossos beneficiários esperam", afirmou o executivo.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 1,
                mode: 'normal',
                style: '',
                text: 'Investimentos em Tecnologia e Inovação',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            type: 'heading',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A empresa também anunciou investimentos de R$ 50 milhões em tecnologia e inovação para 2026. Os recursos serão destinados ao desenvolvimento de plataformas digitais, telemedicina e sistemas de gestão de saúde preventiva. A meta é que 60% dos atendimentos primários sejam realizados via telemedicina até o final de 2026.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Além disso, a Usisaúde está desenvolvendo um programa de inteligência artificial para análise preditiva de riscos à saúde, que permitirá identificar beneficiários com maior probabilidade de desenvolver condições crônicas e oferecer intervenções preventivas.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 1,
                mode: 'normal',
                style: '',
                text: 'Desafios e Oportunidades',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            type: 'heading',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A expansão nacional traz desafios significativos, especialmente em relação à regulamentação e à necessidade de adaptação aos diferentes mercados regionais. No entanto, Rodrigues vê grandes oportunidades, especialmente no mercado de planos coletivos empresariais, que representa uma fatia crescente do setor.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A expectativa é que, com a expansão nacional, a Usisaúde Seguro possa alcançar a marca de 500 mil beneficiários até o final de 2026, consolidando-se como uma das principais operadoras regionais do país e expandindo sua influência para o mercado nacional.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1
      }
    },
    author: {
      name: 'Redação EdaShow',
      role: 'Equipe Editorial'
    }
  },
  'odont-reforca-protagonismo-no-nordeste': {
    title: 'Odont reforça protagonismo no Nordeste',
    excerpt: 'A Odont, maior cooperativa de Odontologia em número de cooperados (mais de 15mil), anunciou...',
    category: 'news',
    publishedDate: new Date(Date.now() - 86400000).toISOString(),
    featuredImage: '/odont-award-ceremony.jpg',
    content: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A Odont, maior cooperativa de Odontologia do Brasil em número de cooperados, com mais de 15 mil profissionais associados, anunciou uma expansão significativa de suas operações na região Nordeste. A iniciativa faz parte de uma estratégia de crescimento que visa consolidar a presença da cooperativa em todo o território nacional.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A expansão no Nordeste representa um investimento de R$ 30 milhões ao longo dos próximos dois anos, com abertura de novas unidades em capitais como Recife, Salvador e Fortaleza. A cooperativa também planeja ampliar sua rede de atendimento em cidades do interior, onde a demanda por serviços odontológicos de qualidade tem crescido significativamente.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 1,
                mode: 'normal',
                style: '',
                text: 'Crescimento Sustentável no Setor Odontológico',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            type: 'heading',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'O setor de planos odontológicos tem registrado crescimento consistente nos últimos anos, impulsionado pela maior conscientização sobre saúde bucal e pela expansão da classe média brasileira. A Odont tem se posicionado como líder neste mercado, oferecendo planos acessíveis e uma ampla rede de profissionais credenciados.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A cooperativa também investiu em tecnologia para melhorar a experiência dos beneficiários, desenvolvendo um aplicativo móvel que permite agendamento de consultas, consulta de rede credenciada e acompanhamento de tratamentos em andamento.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 1,
                mode: 'normal',
                style: '',
                text: 'Impacto Regional e Social',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            type: 'heading',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A expansão da Odont no Nordeste também tem um impacto social significativo, gerando empregos diretos e indiretos na região. A cooperativa estima criar mais de 500 novos postos de trabalho, incluindo profissionais de saúde, administrativos e de suporte.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Além disso, a presença da cooperativa na região contribui para aumentar o acesso a serviços odontológicos de qualidade, especialmente para populações de baixa renda que antes tinham dificuldade para acessar tratamentos especializados.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1
      }
    },
    author: {
      name: 'Redação EdaShow',
      role: 'Equipe Editorial'
    }
  },
  'stf-publica-acordao-com-regras-para-judicializacao-da-cobertura-fora-do-rol-da-ans': {
    title: 'STF publica acórdão com regras para judicialização da cobertura fora do rol da ANS',
    excerpt: 'Todas as ações judiciais envolvendo cobertura de tratamentos que não estejam no rol...',
    category: 'news',
    publishedDate: new Date(Date.now() - 172800000).toISOString(),
    featuredImage: '/ans-building-court.jpg',
    content: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'O Supremo Tribunal Federal (STF) publicou acórdão estabelecendo novas regras para ações judiciais envolvendo cobertura de tratamentos que não estejam no rol da ANS, trazendo mais clareza para o setor.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1
      }
    },
    author: {
      name: 'Redação EdaShow',
      role: 'Equipe Editorial'
    },
    gallery: [
      {
        url: '/professional-man-ricardo-rodrigues.jpg',
        alt: 'Ricardo Rodrigues, CEO da Usisaúde',
        caption: 'Ricardo Rodrigues lidera a expansão da Usisaúde Seguro'
      },
      {
        url: '/modern-healthcare-building.jpg',
        alt: 'Sede da Usisaúde',
        caption: 'Nova sede da empresa em São Paulo'
      },
      {
        url: '/conference-healthcare-panel.jpg',
        alt: 'Evento de saúde',
        caption: 'Participação em eventos do setor'
      }
    ]
  },
  'reajuste-medio-dos-planos-de-saude-foi-de-11-15-veja-aumento-das-principais-operadoras': {
    title: 'Reajuste médio dos planos de saúde foi de 11,15%; veja aumento das principais operadoras',
    excerpt: 'Em 2024, o reajuste médio dos planos de saúde individuais registrou aumento que varia por operadora, saiba mais...',
    category: 'news',
    publishedDate: new Date(Date.now() - 259200000).toISOString(),
    featuredImage: '/healthcare-operators-increase.jpg',
    content: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Em 2024, o reajuste médio dos planos de saúde individuais registrou aumento de 11,15%, segundo dados divulgados pela Agência Nacional de Saúde Suplementar (ANS). O índice representa uma variação significativa entre as diferentes operadoras do mercado, com aumentos que variam de 8% a 15% dependendo da empresa e do tipo de plano contratado.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'O reajuste anual dos planos individuais é determinado pela ANS com base em critérios técnicos que consideram a variação dos custos assistenciais, a inflação médica e outros fatores econômicos relevantes. Este ano, o índice ficou acima da inflação oficial medida pelo IPCA, refletindo a pressão de custos que o setor vem enfrentando.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 1,
                mode: 'normal',
                style: '',
                text: 'Principais Operadoras e Seus Reajustes',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            type: 'heading',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Entre as principais operadoras do país, os reajustes variaram significativamente. A Unimed, maior operadora do Brasil, aplicou reajuste médio de 12,5% em seus planos individuais. A Amil, segunda maior do mercado, registrou aumento de 11,8%, enquanto a Bradesco Saúde aplicou reajuste de 10,9%.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Outras operadoras de grande porte também registraram aumentos acima da média nacional. A SulAmérica aplicou reajuste de 13,2%, a NotreDame Intermédica de 12,1%, e a Hapvida registrou aumento de 11,5%. As variações refletem diferentes estratégias de precificação e perfis de sinistralidade de cada operadora.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 1,
                mode: 'normal',
                style: '',
                text: 'Fatores que Influenciaram o Reajuste',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            type: 'heading',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Vários fatores contribuíram para o reajuste de 11,15% registrado em 2024. A inflação médica, que mede o aumento dos custos com serviços e produtos de saúde, foi um dos principais componentes. Além disso, o aumento da utilização de serviços médicos após a pandemia, especialmente em especialidades como cardiologia e oncologia, também impactou os custos das operadoras.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'O custo com medicamentos de alto valor também exerceu pressão significativa sobre os custos assistenciais. Tratamentos inovadores para doenças raras e câncer, além de procedimentos de alta complexidade, representam uma fatia crescente dos gastos das operadoras.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 1,
                mode: 'normal',
                style: '',
                text: 'Impacto para os Beneficiários',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            type: 'heading',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Para os beneficiários de planos individuais, o reajuste de 11,15% representa um aumento significativo nas mensalidades. Uma pessoa que pagava R$ 500 por mês em 2023, por exemplo, passará a pagar aproximadamente R$ 555,75 em 2024. O impacto é ainda maior para famílias com múltiplos beneficiários.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Especialistas recomendam que os beneficiários avaliem cuidadosamente suas necessidades e comparem diferentes operadoras antes de renovar seus contratos. A portabilidade de carências, regulamentada pela ANS, permite que os consumidores troquem de operadora sem perder o tempo já cumprido de carência, o que pode ser uma alternativa para encontrar planos mais acessíveis.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 1,
                mode: 'normal',
                style: '',
                text: 'Perspectivas para 2025',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            type: 'heading',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Para o próximo ano, a expectativa é que os reajustes continuem pressionados pelos mesmos fatores que impactaram 2024. A ANS já sinalizou que continuará monitorando de perto os custos assistenciais e que pode revisar os critérios de reajuste caso seja necessário para garantir a sustentabilidade do setor.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Operadoras têm investido em programas de prevenção e gestão de saúde para tentar reduzir custos assistenciais a médio e longo prazo. A expectativa é que essas iniciativas, combinadas com maior eficiência operacional, possam ajudar a moderar os reajustes futuros, beneficiando tanto as operadoras quanto os consumidores.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1
      }
    },
    author: {
      name: 'Redação EdaShow',
      role: 'Equipe Editorial'
    },
    gallery: [
      {
        url: '/healthcare-operators-increase.jpg',
        alt: 'Gráfico de reajustes',
        caption: 'Comparativo de reajustes por operadora'
      },
      {
        url: '/ans-building-court.jpg',
        alt: 'Sede da ANS',
        caption: 'ANS regulamenta reajustes anuais'
      },
      {
        url: '/modern-healthcare-building.jpg',
        alt: 'Operadoras de saúde',
        caption: 'Principais operadoras do mercado'
      },
      {
        url: '/business-executive-professional.jpg',
        alt: 'Executivo analisando dados',
        caption: 'Análise de custos assistenciais'
      }
    ]
  },
  'telemedicina-ganha-forca-com-novas-regulamentacoes-da-ans': {
    title: 'Telemedicina ganha força com novas regulamentações da ANS',
    excerpt: 'Novas diretrizes facilitam acesso a consultas remotas e ampliam cobertura para pacientes em todo o país...',
    category: 'news',
    publishedDate: new Date(Date.now() - 345600000).toISOString(),
    featuredImage: '/smartphone-health-app.jpg',
    content: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A ANS publicou novas regulamentações que fortalecem a telemedicina no Brasil. As diretrizes facilitam o acesso a consultas remotas e ampliam a cobertura para pacientes em todo o território nacional.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1
      }
    },
    author: {
      name: 'Redação EdaShow',
      role: 'Equipe Editorial'
    }
  },
  'operadoras-investem-em-tecnologia-para-reduzir-custos-administrativos': {
    title: 'Operadoras investem em tecnologia para reduzir custos administrativos',
    excerpt: 'Sistemas de gestão integrados e automação de processos prometem economia de até 30% nos custos operacionais...',
    category: 'news',
    publishedDate: new Date(Date.now() - 432000000).toISOString(),
    featuredImage: '/modern-healthcare-building.jpg',
    content: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Operadoras de planos de saúde estão investindo pesadamente em tecnologia para reduzir custos administrativos. Sistemas de gestão integrados e automação de processos prometem economia de até 30% nos custos operacionais.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1
      }
    },
    author: {
      name: 'Redação EdaShow',
      role: 'Equipe Editorial'
    }
  },
  'ans-anuncia-novas-regras-para-planos-odontologicos-em-2026': {
    title: 'ANS anuncia novas regras para planos odontológicos em 2026',
    excerpt: 'Mudanças visam aumentar transparência e melhorar qualidade do atendimento odontológico para beneficiários...',
    category: 'news',
    publishedDate: new Date(Date.now() - 518400000).toISOString(),
    featuredImage: '/business-executive-professional.jpg',
    content: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A ANS anunciou novas regras para planos odontológicos que entrarão em vigor em 2026. As mudanças visam aumentar a transparência e melhorar a qualidade do atendimento odontológico para beneficiários.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1
      }
    },
    author: {
      name: 'Redação EdaShow',
      role: 'Equipe Editorial'
    }
  },
  'setor-de-saude-suplementar-debate-futuro-do-setor-em-congresso-nacional': {
    title: 'Setor de saúde suplementar debate futuro do setor em congresso nacional',
    excerpt: 'Líderes do setor se reúnem para discutir inovações, regulamentações e tendências do mercado de planos de saúde...',
    category: 'news',
    publishedDate: new Date(Date.now() - 604800000).toISOString(),
    featuredImage: '/conference-healthcare-panel.jpg',
    content: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Líderes do setor de saúde suplementar se reuniram em congresso nacional para discutir o futuro do setor. O evento abordou inovações, regulamentações e tendências do mercado de planos de saúde.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1
      }
    },
    author: {
      name: 'Redação EdaShow',
      role: 'Equipe Editorial'
    }
  },
  'ans-define-novas-regras-para-portabilidade-de-carencias': {
    title: 'ANS define novas regras para portabilidade de carências',
    excerpt: 'Medida visa facilitar a troca de planos para beneficiários em todo o país a partir do próximo mês.',
    category: 'news',
    publishedDate: new Date().toISOString(),
    featuredImage: '/regulatory-agency-logo.jpg',
    content: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A Agência Nacional de Saúde Suplementar (ANS) publicou novas regras para facilitar a portabilidade de carências entre planos de saúde. A medida beneficia milhões de brasileiros que desejam trocar de operadora sem perder o tempo já cumprido de carência.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1
      }
    },
    author: {
      name: 'Redação EdaShow',
      role: 'Equipe Editorial'
    }
  },
  'ministerio-da-saude-anuncia-investimento-recorde-no-sus': {
    title: 'Ministério da Saúde anuncia investimento recorde no SUS',
    excerpt: 'Recursos serão destinados à digitalização e modernização de hospitais públicos.',
    category: 'news',
    publishedDate: new Date().toISOString(),
    featuredImage: '/modern-healthcare-building.jpg',
    content: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'O Ministério da Saúde anunciou um investimento recorde para modernização do Sistema Único de Saúde (SUS). Os recursos serão destinados principalmente à digitalização e modernização de hospitais públicos em todo o país.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1
      }
    },
    author: {
      name: 'Redação EdaShow',
      role: 'Equipe Editorial'
    }
  },
  'novas-diretrizes-para-planos-de-saude-coletivos-em-2026': {
    title: 'Novas diretrizes para planos de saúde coletivos em 2026',
    excerpt: 'Entenda o que muda para empresas e beneficiários com a nova resolução normativa.',
    category: 'news',
    publishedDate: new Date().toISOString(),
    featuredImage: '/business-man-professional.jpg',
    content: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A ANS publicou novas diretrizes para planos de saúde coletivos que entrarão em vigor em 2026. As mudanças afetam tanto empresas quanto beneficiários, trazendo mais transparência e direitos aos usuários.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1
      }
    },
    author: {
      name: 'Redação EdaShow',
      role: 'Equipe Editorial'
    }
  },
  'judicializacao-da-saude-novos-precedentes-do-stj': {
    title: 'Judicialização da saúde: novos precedentes do STJ',
    excerpt: 'Decisões recentes trazem mais segurança jurídica para operadoras e usuários.',
    category: 'news',
    publishedDate: new Date(Date.now() - 432000000).toISOString(),
    featuredImage: '/ans-building-court.jpg',
    featured: false,
    tags: [
      { tag: 'Judicialização' },
      { tag: 'STJ' },
      { tag: 'Direitos dos Usuários' },
      { tag: 'Jurisprudência' }
    ],
    content: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'O Superior Tribunal de Justiça (STJ) vem consolidando precedentes importantes sobre judicialização da saúde que trazem mais segurança jurídica tanto para operadoras quanto para beneficiários de planos de saúde. As decisões recentes estabelecem critérios mais claros para análise de pedidos de cobertura de tratamentos fora do rol da ANS.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Entre os principais precedentes, destaca-se a necessidade de comprovação técnica e científica da eficácia do tratamento solicitado, além da análise individualizada de cada caso. O STJ tem reforçado que não basta apenas a prescrição médica, mas é necessário demonstrar que o tratamento é adequado e necessário para a condição específica do paciente.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Para operadoras, essas decisões trazem maior previsibilidade sobre quando devem ou não cobrir tratamentos fora do rol. Já para os beneficiários, os precedentes garantem que casos legítimos continuarão sendo cobertos, especialmente quando há comprovação científica robusta e necessidade médica comprovada.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Especialistas do setor avaliam que essas decisões contribuem para reduzir a judicialização desnecessária, ao mesmo tempo em que protegem o direito à saúde dos beneficiários em situações que realmente demandam tratamentos específicos não previstos no rol da ANS.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1
      }
    },
    author: {
      name: 'Ricardo Rodrigues',
      role: 'Editor Chefe',
      bio: 'Especialista em saúde suplementar com mais de 15 anos de experiência no setor.',
      photo: '/professional-man-ricardo-rodrigues.jpg'
    }
  },
  'ia-generativa-revoluciona-triagem-em-prontos-socorros': {
    title: 'IA Generativa revoluciona triagem em prontos-socorros',
    excerpt: 'Hospitais de SP reportam redução de 30% no tempo de espera com novo sistema.',
    category: 'analysis',
    publishedDate: new Date(Date.now() - 144000000).toISOString(),
    featuredImage: '/smartphone-health-app.jpg',
    featured: true,
    tags: [
      { tag: 'Inteligência Artificial' },
      { tag: 'Triagem Médica' },
      { tag: 'Inovação' },
      { tag: 'Eficiência Hospitalar' }
    ],
    content: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Hospitais públicos e privados de São Paulo estão implementando sistemas de inteligência artificial generativa para otimizar o processo de triagem em prontos-socorros, com resultados impressionantes. Os primeiros relatórios indicam redução média de 30% no tempo de espera dos pacientes, além de melhor classificação de prioridade dos casos.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A tecnologia utiliza processamento de linguagem natural para analisar sintomas descritos pelos pacientes e histórico médico disponível, sugerindo classificações de urgência baseadas em protocolos médicos validados. O sistema não substitui a avaliação médica, mas oferece suporte decisório para equipes de enfermagem e médicos plantonistas.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Os resultados preliminares mostram que pacientes com condições realmente urgentes estão sendo atendidos mais rapidamente, enquanto casos menos críticos são direcionados para fluxos adequados sem sobrecarregar a emergência. Isso tem impacto direto na qualidade do atendimento e na satisfação dos pacientes.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A expectativa é que, com a expansão da tecnologia para mais unidades hospitalares, o sistema possa contribuir significativamente para reduzir filas e melhorar a eficiência do atendimento de emergência em todo o país. Operadoras de planos de saúde já demonstram interesse em adotar soluções similares em suas redes credenciadas.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1
      }
    },
    author: {
      name: 'Redação EdaShow',
      role: 'Equipe Editorial',
      bio: 'Equipe de jornalistas especializados em saúde suplementar e regulamentação.'
    }
  },
  'telemedicina-atinge-marca-de-10-milhoes-de-atendimentos': {
    title: 'Telemedicina atinge marca de 10 milhões de atendimentos',
    excerpt: 'Crescimento de 45% no último ano consolida modalidade no país.',
    category: 'news',
    publishedDate: new Date(Date.now() - 216000000).toISOString(),
    featuredImage: '/business-executive-professional.jpg',
    featured: false,
    tags: [
      { tag: 'Telemedicina' },
      { tag: 'Crescimento' },
      { tag: 'Saúde Digital' },
      { tag: 'Acessibilidade' }
    ],
    content: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A telemedicina brasileira alcançou um marco histórico ao registrar mais de 10 milhões de atendimentos realizados através de plataformas digitais no último ano. O crescimento de 45% em relação ao ano anterior consolida a modalidade como uma ferramenta essencial para ampliar o acesso à saúde no país.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'O aumento expressivo foi impulsionado pela regulamentação definitiva da telemedicina pela ANS e pelo Conselho Federal de Medicina, além da crescente aceitação por parte dos pacientes e profissionais de saúde. Consultas de retorno, acompanhamento de condições crônicas e orientações preventivas são as modalidades mais utilizadas.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Operadoras de planos de saúde têm investido pesadamente em infraestrutura de telemedicina, oferecendo consultas 24 horas e reduzindo custos operacionais. Para pacientes em áreas remotas ou com dificuldades de locomoção, a modalidade representa uma revolução no acesso a cuidados médicos de qualidade.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A expectativa é que o crescimento continue acelerado, com projeções de atingir 15 milhões de atendimentos no próximo ano. A consolidação da telemedicina também está impulsionando investimentos em outras tecnologias de saúde digital, como monitoramento remoto e inteligência artificial aplicada à medicina.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1
      }
    },
    author: {
      name: 'Ricardo Rodrigues',
      role: 'Editor Chefe',
      bio: 'Especialista em saúde suplementar com mais de 15 anos de experiência no setor.',
      photo: '/professional-man-ricardo-rodrigues.jpg'
    }
  },
  'wearables-e-monitoramento-remoto-de-pacientes-cronicos': {
    title: 'Wearables e monitoramento remoto de pacientes crônicos',
    excerpt: 'Dispositivos conectados reduzem internações em até 25%, aponta estudo.',
    category: 'analysis',
    publishedDate: new Date(Date.now() - 288000000).toISOString(),
    featuredImage: '/conference-healthcare-panel.jpg',
    featured: false,
    tags: [
      { tag: 'Wearables' },
      { tag: 'Monitoramento Remoto' },
      { tag: 'Doenças Crônicas' },
      { tag: 'IoT' },
      { tag: 'Prevenção' }
    ],
    content: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Dispositivos wearables e sistemas de monitoramento remoto estão transformando o cuidado de pacientes com doenças crônicas, com resultados que impressionam especialistas e operadoras de saúde. Estudo recente conduzido em parceria com grandes operadoras brasileiras aponta redução de até 25% nas internações hospitalares quando pacientes são monitorados continuamente através dessas tecnologias.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Pacientes com diabetes, hipertensão, insuficiência cardíaca e outras condições crônicas estão utilizando smartwatches, sensores de glicose conectados e dispositivos de pressão arterial que transmitem dados em tempo real para equipes médicas. Quando há alterações significativas nos parâmetros monitorados, alertas automáticos são acionados, permitindo intervenção precoce antes que a situação se agrave.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Além da redução de internações, os dados coletados permitem ajustes mais precisos em medicações e protocolos de tratamento, melhorando significativamente a qualidade de vida dos pacientes. Operadoras que implementaram programas de monitoramento remoto reportam também redução de custos operacionais e maior satisfação dos beneficiários.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A tendência é que esses dispositivos se tornem cada vez mais acessíveis e integrados aos planos de saúde, com operadoras oferecendo wearables como parte de programas preventivos. A tecnologia está se tornando uma ferramenta essencial para o futuro da gestão de doenças crônicas, promovendo saúde preventiva e reduzindo a carga sobre o sistema de saúde.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1
      }
    },
    author: {
      name: 'Redação EdaShow',
      role: 'Equipe Editorial',
      bio: 'Equipe de jornalistas especializados em saúde suplementar e regulamentação.'
    }
  },
  'blockchain-na-gestao-de-prontuarios-eletronicos': {
    title: 'Blockchain na gestão de prontuários eletrônicos',
    excerpt: 'Segurança e interoperabilidade são os principais benefícios da tecnologia.',
    category: 'analysis',
    publishedDate: new Date(Date.now() - 360000000).toISOString(),
    featuredImage: '/modern-building-ans.jpg',
    featured: false,
    tags: [
      { tag: 'Blockchain' },
      { tag: 'Prontuário Eletrônico' },
      { tag: 'Segurança de Dados' },
      { tag: 'Interoperabilidade' },
      { tag: 'Tecnologia' }
    ],
    content: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A tecnologia blockchain está sendo adotada por hospitais e operadoras de saúde para gerenciar prontuários eletrônicos com níveis sem precedentes de segurança e interoperabilidade. A implementação permite que informações médicas sejam compartilhadas entre diferentes instituições de forma segura, mantendo a integridade e rastreabilidade dos dados.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Um dos principais benefícios é a eliminação de problemas de interoperabilidade entre sistemas diferentes. Com blockchain, um paciente pode ter seu histórico médico acessível por qualquer profissional autorizado, independentemente da instituição onde foi gerado o registro. Isso elimina a necessidade de repetir exames e consultas, reduzindo custos e melhorando a continuidade do cuidado.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A segurança oferecida pela tecnologia blockchain é especialmente relevante em um contexto onde vazamentos de dados médicos são uma preocupação crescente. Cada registro é criptografado e vinculado a blocos anteriores, tornando praticamente impossível alterar informações sem deixar rastro. Isso garante a integridade dos dados e protege a privacidade dos pacientes.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Pilotos realizados em redes hospitalares brasileiras têm demonstrado resultados promissores, com redução significativa no tempo de acesso a informações médicas e aumento na segurança dos dados. A expectativa é que, nos próximos anos, a tecnologia se torne padrão para gestão de prontuários eletrônicos, especialmente em redes integradas de saúde.',
                type: 'text',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1
      }
    },
    author: {
      name: 'Ricardo Rodrigues',
      role: 'Editor Chefe',
      bio: 'Especialista em saúde suplementar com mais de 15 anos de experiência no setor.',
      photo: '/professional-man-ricardo-rodrigues.jpg'
    }
  }
}

// Eventos de fallback
export const fallbackEvents = [
  {
    id: 1,
    startDate: "2026-05-23T14:00:00",
    endDate: "2026-05-25T18:00:00",
    title: "Conec 2026 reúne mais de 200 profissionais no painel",
    description: "Big D Ofertou! O maior evento de 2026 será de 23 a 25 de Maio. Um encontro imperdível para profissionais do setor de saúde suplementar, com palestras, workshops e networking de alto nível.",
    location: "Motiva Eventos - Av. Paulista, 1578 - São Paulo, SP",
    slug: "conec-2026",
    image: "/conference-healthcare-panel.jpg",
    status: "upcoming",
    eventType: "in-person",
    registrationUrl: "https://example.com/inscricao-conec-2026",
    organizers: [
      {
        name: "Ricardo Rodrigues",
        company: "EdaShow",
        email: "ricardo@edashow.com.br",
        role: "Diretor Executivo",
        photo: "/professional-man-ricardo-rodrigues.jpg",
      },
      {
        name: "Maria Silva",
        company: "Motiva Eventos",
        email: "maria@motivaeventos.com.br",
        role: "Coordenadora de Eventos",
      },
    ],
    sponsors: [
      {
        name: "Unimed",
        logo: "/placeholder-logo.png",
        website: "https://www.unimed.com.br",
        sponsorshipType: "gold",
      },
      {
        name: "Amil",
        logo: "/placeholder-logo.png",
        website: "https://www.amil.com.br",
        sponsorshipType: "gold",
      },
      {
        name: "SulAmérica",
        logo: "/placeholder-logo.png",
        website: "https://www.sulamerica.com.br",
        sponsorshipType: "silver",
      },
      {
        name: "Bradesco Saúde",
        logo: "/placeholder-logo.png",
        website: "https://www.bradescosaude.com.br",
        sponsorshipType: "silver",
      },
      {
        name: "NotreDame Intermédica",
        logo: "/placeholder-logo.png",
        website: "https://www.notredameintermedica.com.br",
        sponsorshipType: "bronze",
      },
    ],
    speakers: [
      {
        name: "Dr. João Santos",
        company: "ANS - Agência Nacional de Saúde Suplementar",
        role: "Diretor de Regulação",
        bio: "Especialista em regulação de saúde suplementar com mais de 20 anos de experiência.",
        talkTitle: "O Futuro da Regulação em Saúde Suplementar",
        photo: "/professional-man.jpg",
      },
      {
        name: "Ana Paula Costa",
        company: "Unimed",
        role: "Diretora de Inovação",
        bio: "Líder em transformação digital no setor de saúde.",
        talkTitle: "Inovação e Tecnologia em Planos de Saúde",
        photo: "/professional-woman-columnist.jpg",
      },
      {
        name: "Carlos Mendes",
        company: "Hospital Sírio-Libanês",
        role: "CEO",
        bio: "Executivo com vasta experiência em gestão hospitalar.",
        talkTitle: "Gestão Hospitalar e Sustentabilidade",
        photo: "/professional-man-in-suit-outdoors.jpg",
      },
    ],
  },
  {
    id: 2,
    startDate: "2026-04-02T09:00:00",
    endDate: "2026-04-02T17:00:00",
    title: "WORKSHOP HM - SECURITY E CONEXÃO SAÚDE - PROJETO...",
    description: "Workshop técnico focado em segurança da informação e integração de sistemas de saúde. Ideal para profissionais de TI e gestores de tecnologia.",
    location: "Poa Park Business - Av. Assis Brasil, 3500 - Porto Alegre, RS",
    slug: "workshop-hm-security",
    image: "/workshop-business-meeting.jpg",
    status: "upcoming",
    eventType: "hybrid",
    registrationUrl: "https://example.com/inscricao-workshop-hm",
    organizers: [
      {
        name: "Roberto Alves",
        company: "HM Security",
        email: "roberto@hmsecurity.com.br",
        role: "Diretor Técnico",
      },
      {
        name: "Patricia Lima",
        company: "Conexão Saúde",
        email: "patricia@conexaosaude.com.br",
        role: "Coordenadora de Projetos",
      },
    ],
    sponsors: [
      {
        name: "Microsoft",
        logo: "/placeholder-logo.png",
        website: "https://www.microsoft.com",
        sponsorshipType: "gold",
      },
      {
        name: "Oracle Health",
        logo: "/placeholder-logo.png",
        website: "https://www.oracle.com",
        sponsorshipType: "silver",
      },
    ],
    speakers: [
      {
        name: "Roberto Alves",
        company: "HM Security",
        role: "Diretor Técnico",
        bio: "Especialista em segurança da informação com foco em saúde.",
        talkTitle: "Segurança de Dados em Sistemas de Saúde",
        photo: "/professional-man.jpg",
      },
      {
        name: "Patricia Lima",
        company: "Conexão Saúde",
        role: "Coordenadora de Projetos",
        bio: "Especialista em integração de sistemas de saúde.",
        talkTitle: "Interoperabilidade entre Sistemas de Saúde",
      },
    ],
  },
  {
    id: 3,
    startDate: "2026-04-04T19:00:00",
    endDate: "2026-04-04T22:00:00",
    title: "Lançamento MedSênior - Recife",
    description: "Evento de lançamento da nova unidade MedSênior em Recife. Celebração com autoridades, parceiros e comunidade local.",
    location: "Hotel Grand Mercure Recife - Av. Boa Viagem, 4070 - Recife, PE",
    slug: "lancamento-medsenior-recife",
    image: "/healthcare-launch-event.jpg",
    status: "upcoming",
    eventType: "in-person",
    registrationUrl: "https://example.com/inscricao-medsenior-recife",
    organizers: [
      {
        name: "Fernanda Oliveira",
        company: "MedSênior",
        email: "fernanda@medsenior.com.br",
        role: "Diretora Regional Nordeste",
        photo: "/professional-woman-diverse.png",
      },
      {
        name: "Lucas Ferreira",
        company: "MedSênior",
        email: "lucas@medsenior.com.br",
        role: "Coordenador de Eventos",
      },
    ],
    sponsors: [
      {
        name: "MedSênior",
        logo: "/placeholder-logo.png",
        website: "https://www.medsenior.com.br",
        sponsorshipType: "gold",
      },
      {
        name: "Prefeitura de Recife",
        logo: "/placeholder-logo.png",
        website: "https://www.recife.pe.gov.br",
        sponsorshipType: "silver",
      },
    ],
    speakers: [
      {
        name: "Fernanda Oliveira",
        company: "MedSênior",
        role: "Diretora Regional Nordeste",
        bio: "Executiva com mais de 15 anos de experiência em saúde suplementar.",
        talkTitle: "MedSênior: Expansão e Compromisso com o Nordeste",
        photo: "/professional-woman-diverse.png",
      },
      {
        name: "Prefeito João da Silva",
        company: "Prefeitura de Recife",
        role: "Prefeito",
        bio: "Líder público comprometido com a saúde da população.",
        talkTitle: "Saúde Pública e Parcerias Estratégicas",
      },
    ],
  },
  {
    id: 4,
    startDate: "2026-06-15T08:00:00",
    endDate: "2026-06-15T18:00:00",
    title: "Congresso Nacional de Saúde Suplementar 2026",
    description: "O maior congresso do setor de saúde suplementar do Brasil. Reúne operadoras, hospitais, clínicas e profissionais para debater o futuro do setor.",
    location: "Centro de Convenções Anhembi - São Paulo, SP",
    slug: "congresso-nacional-saude-suplementar-2026",
    image: "/award-ceremony-healthcare.jpg",
    status: "upcoming",
    eventType: "in-person",
    registrationUrl: "https://example.com/inscricao-congresso-2026",
    organizers: [
      {
        name: "Associação Brasileira de Saúde Suplementar",
        company: "ABSS",
        email: "contato@abss.org.br",
        role: "Organizador Principal",
      },
      {
        name: "Ricardo Rodrigues",
        company: "EdaShow",
        email: "ricardo@edashow.com.br",
        role: "Coordenador de Mídia",
        photo: "/professional-man-ricardo-rodrigues.jpg",
      },
    ],
    sponsors: [
      {
        name: "Unimed",
        logo: "/placeholder-logo.png",
        website: "https://www.unimed.com.br",
        sponsorshipType: "gold",
      },
      {
        name: "Amil",
        logo: "/placeholder-logo.png",
        website: "https://www.amil.com.br",
        sponsorshipType: "gold",
      },
      {
        name: "SulAmérica",
        logo: "/placeholder-logo.png",
        website: "https://www.sulamerica.com.br",
        sponsorshipType: "gold",
      },
      {
        name: "Bradesco Saúde",
        logo: "/placeholder-logo.png",
        website: "https://www.bradescosaude.com.br",
        sponsorshipType: "silver",
      },
      {
        name: "NotreDame Intermédica",
        logo: "/placeholder-logo.png",
        website: "https://www.notredameintermedica.com.br",
        sponsorshipType: "silver",
      },
      {
        name: "Hapvida",
        logo: "/placeholder-logo.png",
        website: "https://www.hapvida.com.br",
        sponsorshipType: "silver",
      },
      {
        name: "Odont",
        logo: "/placeholder-logo.png",
        website: "https://www.odont.com.br",
        sponsorshipType: "bronze",
      },
    ],
    speakers: [
      {
        name: "Dr. João Santos",
        company: "ANS - Agência Nacional de Saúde Suplementar",
        role: "Diretor-Presidente",
        bio: "Líder máximo da ANS, responsável pela regulação do setor.",
        talkTitle: "Panorama e Perspectivas da Saúde Suplementar no Brasil",
        photo: "/professional-man.jpg",
      },
      {
        name: "Ana Paula Costa",
        company: "Unimed",
        role: "Diretora Executiva",
        bio: "Executiva com mais de 25 anos de experiência no setor.",
        talkTitle: "Inovação e Sustentabilidade em Planos de Saúde",
        photo: "/professional-woman-columnist.jpg",
      },
      {
        name: "Carlos Mendes",
        company: "Hospital Sírio-Libanês",
        role: "CEO",
        bio: "Executivo com vasta experiência em gestão hospitalar.",
        talkTitle: "O Futuro dos Hospitais no Brasil",
        photo: "/professional-man-in-suit-outdoors.jpg",
      },
      {
        name: "Mariana Souza",
        company: "ANS",
        role: "Superintendente de Regulação",
        bio: "Especialista em regulação e políticas públicas de saúde.",
        talkTitle: "Regulação e Qualidade em Saúde Suplementar",
        photo: "/professional-woman-smiling.png",
      },
    ],
  },
]

// Colunistas de fallback
export const fallbackColumnists = [
  {
    id: 1,
    name: "Ricardo Rodrigues",
    slug: "ricardo-rodrigues",
    role: "Editor Chefe",
    bio: "Especialista em saúde suplementar com mais de 15 anos de experiência no setor.",
    photo: "/professional-man-ricardo-rodrigues.jpg",
  },
  {
    id: 2,
    name: "Redação EdaShow",
    slug: "redacao-edashow",
    role: "Equipe Editorial",
    bio: "Equipe de jornalistas especializados em saúde suplementar e regulamentação.",
  },
]

// Funções auxiliares para filtrar dados de fallback
export function getFallbackPosts(options: {
  limit?: number
  status?: 'draft' | 'published' | 'archived'
  category?: string
  featured?: boolean
} = {}) {
  const {
    limit = 10,
    status = 'published',
    category,
    featured,
  } = options

  let filtered = [...fallbackPosts]

  // Filtrar por status (todos os fallbacks são 'published')
  if (status !== 'published') {
    return []
  }

  // Filtrar por categoria
  if (category) {
    filtered = filtered.filter(post => post.category === category)
  }

  // Filtrar por featured
  if (featured !== undefined) {
    filtered = filtered.filter(post => post.featured === featured)
  }

  // Limitar resultados
  return filtered.slice(0, limit)
}

export function getFallbackPostBySlug(slug: string) {
  return fallbackPostsFull[slug] || null
}

export function getFallbackEvents(options: {
  limit?: number
  status?: 'upcoming' | 'ongoing' | 'finished' | 'cancelled'
} = {}) {
  const { limit = 10, status = 'upcoming' } = options

  let filtered = [...fallbackEvents]

  // Filtrar por status
  if (status) {
    filtered = filtered.filter(event => event.status === status)
  }

  // Limitar resultados
  return filtered.slice(0, limit)
}

export function getFallbackColumnists(options: {
  limit?: number
} = {}) {
  const { limit = 10 } = options
  return fallbackColumnists.slice(0, limit)
}

// Sponsors de fallback
export const fallbackSponsors = [
  "1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.jpeg", "10.png",
  "11.png", "12.png", "13.png", "14.png", "15.png", "16.png", "17.png", "18.webp", "19.png", "20.jpg",
  "21.png", "22.png", "23.png", "24.png", "25.png", "26.png", "27.png", "28.png", "29.png", "30.png",
  "31.gif", "32.png", "33.png", "34.png", "35.png", "36.jpg", "37.jpg", "38.png", "39.jpeg", "40.png",
  "41.png", "42.png", "43.png"
].map((filename, index) => ({
  id: index + 1,
  name: `Patrocinador ${index + 1}`,
  logo: `/sponsors/${filename}`,
  website: '#',
  active: true,
}))

export function getFallbackSponsors(options: {
  limit?: number
  active?: boolean
} = {}) {
  const { limit = 100, active = true } = options

  let filtered = [...fallbackSponsors]

  if (active) {
    filtered = filtered.filter(sponsor => sponsor.active === active)
  }

  return filtered.slice(0, limit)
}










