import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
    console.error('Erro: Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são necessárias.')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const newPosts = [
    {
        title: 'Inteligência Artificial na Radiologia: O Futuro do Diagnóstico',
        slug: 'ia-radiologia-futuro-diagnostico',
        subtitle: 'Como algoritmos de deep learning estão aumentando a precisão dos laudos em tempo recorde.',
        content: 'A integração da Inteligência Artificial na radiologia não é mais uma promessa para o futuro, mas uma realidade que está transformando centros de diagnóstico em todo o mundo. Com a capacidade de processar milhares de imagens em segundos, a IA auxilia médicos a identificar patologias sutis que poderiam passar despercebidas.',
        excerpt: 'Deep learning e IA transformam a radiologia moderna, trazendo mais precisão e agilidade aos diagnósticos por imagem.',
        category_id: '2e1bcd33-0908-4f82-a838-6e852ccf569a', // Tecnologia
        columnist_id: '47f8ff64-c65a-43a4-a738-ac756e9577d3', // Dr. Carlos Silva
        cover_image_url: '/images/posts/radiologia_ia.png',
        status: 'published',
        featured: true
    },
    {
        title: 'Gestão de Custos em Saúde: Desafios e Estratégias para 2026',
        slug: 'gestao-custos-saude-estrategias-2026',
        subtitle: 'Executivos do setor debatem como equilibrar a sustentabilidade financeira com a qualidade do atendimento.',
        content: 'O aumento constante da sinistralidade e os custos de novas tecnologias médicas impõem um desafio sem precedentes para os gestores de saúde. Estratégias baseadas em Valor (Value-Based Healthcare) surgem como a principal via para garantir a longevidade do sistema.',
        excerpt: 'Cenário desafiador exige novas abordagens na gestão hospitalar para equilibrar finanças e qualidade assistencial.',
        category_id: '387d669a-6499-4850-832e-76b7b7127b97', // Saúde Suplementar
        columnist_id: 'b603fd31-f6b3-4b95-86a6-d1f62526c0f4', // Maria Santos
        cover_image_url: '/images/posts/gestao_saude.png',
        status: 'published'
    },
    {
        title: 'LGPD na Saúde: Protegendo Dados Sensíveis dos Pacientes',
        slug: 'lgpd-saude-protecao-dados-pacientes',
        subtitle: 'A conformidade regulatória como pilar fundamental da confiança na era digital.',
        content: 'Dados de saúde são considerados extremamente sensíveis pela LGPD. Hospitais e clínicas precisam investir em infraestrutura de cibersegurança robusta e treinamento constante de equipes para evitar vazamentos e sanções pesadas.',
        excerpt: 'Conformidade com a LGPD torna-se indispensável para garantir a segurança jurídica e a privacidade dos pacientes.',
        category_id: '38c0a6d9-f2b8-4319-88a3-defb2e3f557b', // Saúde Digital
        columnist_id: '04d9e883-b4c6-4288-80a0-ddfdf050d30b', // Dra. Ana Carolina Santos
        cover_image_url: '/images/posts/lgpd_saude.png',
        status: 'published'
    },
    {
        title: 'Telemedicina Humanizada: O Toque Pessoal na Tela',
        slug: 'telemedicina-humanizada-toque-pessoal',
        subtitle: 'Superando a barreira digital para oferecer um atendimento acolhedor e eficiente remotamente.',
        content: 'Muitos temiam que a telemedicina esfriasse a relação médico-paciente. No entanto, novas práticas mostram que é possível ser extremamente empático e resolutivo através da tela, ampliando o acesso à saúde de qualidade.',
        excerpt: 'Práticas de humanização digital fortalecem o vínculo médico-paciente mesmo à distância.',
        category_id: 'b70e109c-c550-4296-bf02-866252441742', // Telemedicina
        columnist_id: '47f8ff64-c65a-43a4-a738-ac756e9577d3', // Dr. Carlos Silva
        cover_image_url: '/images/posts/telemedicina_humanizada.png',
        status: 'published'
    },
    {
        title: 'Nova Resolução da ANS: O que muda para o Beneficiário',
        slug: 'nova-resolucao-ans-mudancas-beneficiario',
        subtitle: 'Entenda os novos prazos e garantias de atendimento que entram em vigor este mês.',
        content: 'A Agência Nacional de Saúde Suplementar atualizou o rol de procedimentos e as regras de atendimento. Beneficiários agora contam com novos mecanismos de portabilidade e prazos reduzidos para consultas especializadas.',
        excerpt: 'Beneficiários de planos de saúde devem ficar atentos às novas regras que ampliam direitos e prazos.',
        category_id: '387d669a-6499-4850-832e-76b7b7127b97', // Saúde Suplementar
        columnist_id: 'b603fd31-f6b3-4b95-86a6-d1f62526c0f4', // Maria Santos
        cover_image_url: '/images/posts/ans_tabela.png',
        status: 'published'
    },
    {
        title: 'Cibersegurança Hospitalar: A Primeira Linha de Defesa',
        slug: 'ciberseguranca-hospitalar-primeira-linha-defesa',
        subtitle: 'Por que hospitais se tornaram alvos preferenciais de ataques e como se proteger.',
        content: 'O aumento de incidentes de ransomware em instituições de saúde acende o sinal de alerta. Proteger a infraestrutura crítica não é apenas uma questão de TI, mas de segurança do próprio paciente.',
        excerpt: 'Investimento em cibersegurança é vital para proteger a continuidade operacional dos hospitais.',
        category_id: '2e1bcd33-0908-4f82-a838-6e852ccf569a', // Tecnologia
        columnist_id: '04d9e883-b4c6-4288-80a0-ddfdf050d30b', // Dra. Ana Carolina Santos
        cover_image_url: '/images/posts/ciberseguranca_saude.png',
        status: 'published'
    },
    {
        title: 'O Empoderamento do Paciente 4.0',
        slug: 'empoderamento-paciente-4-0',
        subtitle: 'Como aplicativos e dispositivos vestíveis estão mudando o engajamento com a própria saúde.',
        content: 'Com acesso a dados em tempo real sobre sua saúde, o paciente assume um papel protagonista no tratamento. A gestão compartilhada do cuidado é a nova norma para o sucesso terapêutico em doenças crônicas.',
        excerpt: 'Tecnologia coloca o paciente no centro das decisões, promovendo maior adesão aos tratamentos.',
        category_id: '38c0a6d9-f2b8-4319-88a3-defb2e3f557b', // Saúde Digital
        columnist_id: '47f8ff64-c65a-43a4-a738-ac756e9577d3', // Dr. Carlos Silva
        cover_image_url: '/images/posts/paciente_4_0.png',
        status: 'published'
    },
    {
        title: 'Biotecnologia 2026: Terapias Gênicas e Medicina de Precisão',
        slug: 'biotecnologia-2026-terapias-genicas',
        subtitle: 'A fronteira final da medicina que promete cura para doenças antes incuráveis.',
        content: 'A ciência avançou a passos largos na manipulação genética ética e segura. Novos tratamentos para câncer e doenças raras estão sendo aprovados com taxas de eficácia surpreendentes.',
        excerpt: 'Medicina de precisão e avanços genéticos abrem novas portas para a cura de patologias complexas.',
        category_id: '0bf10001-30ce-4eff-bad8-0f40c2d13b35', // Inovação em Saúde
        columnist_id: '04d9e883-b4c6-4288-80a0-ddfdf050d30b', // Dra. Ana Carolina Santos
        cover_image_url: '/images/posts/biotecnologia_2026.png',
        status: 'published',
        featured: true
    },
    {
        title: 'Saúde Mental no Trabalho: O Bem-Estar como Estratégia Corporativa',
        slug: 'saude-mental-trabalho-bem-estar-corporativo',
        subtitle: 'Por que o cuidado com a mente tornou-se o maior diferencial competitivo das empresas modernas.',
        content: 'Ambientes de trabalho saudáveis geram mais produtividade e retenção de talentos. Programas de apoio psicológico e cultura de segurança psicológica são agora prioridades absolutas no RH.',
        excerpt: 'Foco no bem-estar mental dos colaboradores reduz turnover e eleva o engajamento organizacional.',
        category_id: '1ed2d554-f922-4d7e-9769-0637cff30d28', // Notícias
        columnist_id: 'b603fd31-f6b3-4b95-86a6-d1f62526c0f4', // Maria Santos
        cover_image_url: '/images/posts/saude_mental_trabalho.png',
        status: 'published'
    }
]

async function seed() {
    console.log('🌱 Iniciando inserção de novos posts no Supabase...')

    for (const post of newPosts) {
        const { error } = await supabase
            .from('posts')
            .insert([post])

        if (error) {
            console.error(`❌ Erro ao inserir post "${post.title}":`, error.message)
        } else {
            console.log(`✅ Post inserido com sucesso: "${post.title}"`)
        }
    }

    console.log('✨ Processo concluído!')
}

seed()
