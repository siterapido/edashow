import { getPostBySlug, getPosts, getImageUrl } from '@/lib/payload/api'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Tag, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { LexicalRenderer } from '@/components/lexical-renderer'

// Força renderização dinâmica para evitar erros de serialização durante build
export const dynamic = 'force-dynamic'
export const dynamicParams = true

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Dados fallback para posts de exemplo (apenas posts essenciais usados na homepage)
const fallbackPosts: Record<string, any> = {
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
                text: 'A Usisaúde Seguro demonstrou crescimento significativo em 2025, consolidando sua posição no mercado de saúde suplementar. Sob a liderança de Ricardo Rodrigues, a empresa planeja expandir suas operações para todo o território nacional em 2026.',
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
                text: 'A Odont, maior cooperativa de Odontologia em número de cooperados, com mais de 15 mil profissionais, anunciou expansão de suas operações na região Nordeste, reforçando seu protagonismo no setor.',
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
    }
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
                text: 'O reajuste médio dos planos de saúde individuais em 2024 foi de 11,15%. Confira como ficou o aumento nas principais operadoras do país e entenda os fatores que influenciaram os índices.',
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
  }
}

// Metadados da página
export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params
  let post = await getPostBySlug(slug)
  
  // Se não encontrar no CMS, tenta usar dados fallback
  if (!post && fallbackPosts[slug]) {
    post = fallbackPosts[slug]
  }
  
  if (!post) {
    return {
      title: 'Post não encontrado',
    }
  }
  
  return {
    title: `${post.title} | EdaShow`,
    description: post.excerpt || 'Leia mais no EdaShow',
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [getImageUrl(post.featuredImage)] : [],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  let post = await getPostBySlug(slug)
  
  // Se não encontrar no CMS, tenta usar dados fallback
  if (!post && fallbackPosts[slug]) {
    post = fallbackPosts[slug]
  }
  
  if (!post) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Botão Voltar */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          {/* Categoria */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {post.category === 'news' && 'Notícias'}
              {post.category === 'analysis' && 'Análises'}
              {post.category === 'interviews' && 'Entrevistas'}
              {post.category === 'opinion' && 'Opinião'}
            </span>
            {post.featured && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                ⭐ Destaque
              </span>
            )}
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Resumo */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta informações */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.publishedDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedDate}>
                  {format(new Date(post.publishedDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </time>
              </div>
            )}
          </div>

          {/* Autor */}
          {post.author && (
            <div className="flex items-center gap-3 mt-6 p-4 bg-muted rounded-lg">
              <Avatar className="h-12 w-12">
                {post.author.photo && (
                  <AvatarImage 
                    src={getImageUrl(post.author.photo, 'thumbnail')} 
                    alt={post.author.name} 
                  />
                )}
                <AvatarFallback>
                  {post.author.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Por {post.author.name}</p>
                {post.author.role && (
                  <p className="text-sm text-muted-foreground">{post.author.role}</p>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Imagem Destacada */}
        {post.featuredImage && (
          <div className="relative w-full h-[400px] md:h-[500px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={getImageUrl(post.featuredImage)}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover"
              priority
            />
            {post.featuredImage.caption && (
              <p className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-sm p-3">
                {post.featuredImage.caption}
              </p>
            )}
          </div>
        )}

        {/* Conteúdo */}
        <div className="mb-8">
          {post.content ? (
            <LexicalRenderer content={post.content} />
          ) : (
            <div className="bg-muted p-6 rounded-lg">
              <p className="text-muted-foreground">
                Conteúdo não disponível.
              </p>
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4" />
              <h3 className="font-semibold">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: any, index: number) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {tag.tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Informações do Autor (expandido) */}
        {post.author && post.author.bio && (
          <div className="border-t pt-8 mt-8">
            <h3 className="text-xl font-bold mb-4">Sobre o Autor</h3>
            <div className="flex gap-4">
              <Avatar className="h-20 w-20 flex-shrink-0">
                {post.author.photo && (
                  <AvatarImage 
                    src={getImageUrl(post.author.photo, 'thumbnail')} 
                    alt={post.author.name} 
                  />
                )}
                <AvatarFallback className="text-2xl">
                  {post.author.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-bold text-lg">{post.author.name}</p>
                {post.author.role && (
                  <p className="text-sm text-muted-foreground mb-2">{post.author.role}</p>
                )}
                <p className="text-sm text-muted-foreground">{post.author.bio}</p>
                {post.author.social && (
                  <div className="flex gap-3 mt-3">
                    {post.author.social.twitter && (
                      <a 
                        href={post.author.social.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Twitter
                      </a>
                    )}
                    {post.author.social.linkedin && (
                      <a 
                        href={post.author.social.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        LinkedIn
                      </a>
                    )}
                    {post.author.social.instagram && (
                      <a 
                        href={post.author.social.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Instagram
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  )
}

