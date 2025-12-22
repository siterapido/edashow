import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { fileURLToPath } from 'url'
import path from 'path'
import sharp from 'sharp'
import { ptBRTranslations } from './lib/payload/translations/pt-BR'
// import { beforeChange, afterChange, beforeValidate } from './payload/hooks/posts'

// Importar componentes customizados do admin
// Nota: Em Payload 3.0, componentes customizados são registrados via path ou componente importado
// dependendo se são Server ou Client components.

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Configuração do Payload CMS
 * 
 * Esta configuração define:
 * - Banco de dados (PostgreSQL via Neon)
 * - Storage de arquivos (Supabase S3)
 * - Collections (tipos de conteúdo)
 * - Globals (dados singleton)
 * - Painel administrativo
 * - Internacionalização
 */
const config = buildConfig({
  // Secret para criptografia JWT
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-here',

  // Configuração do banco de dados PostgreSQL (Neon)
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    },
    push: true,
  }),

  // Plugins
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: process.env.SUPABASE_BUCKET || '',
      config: {
        forcePathStyle: true,
        region: process.env.SUPABASE_REGION || 'us-east-1',
        endpoint: process.env.SUPABASE_ENDPOINT || '',
        credentials: {
          accessKeyId: process.env.SUPABASE_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.SUPABASE_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],

  // Collections - tipos de conteúdo
  collections: [
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
      },
      labels: {
        plural: 'Usuários',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          required: true,
          defaultValue: 'editor',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'Autor', value: 'author' },
          ],
        },
      ],
    },
    {
      slug: 'categories',
      admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'slug', 'color', 'active'],
      },
      labels: {
        plural: 'Categorias',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nome da Categoria',
          admin: {
            placeholder: 'Digite o nome da categoria',
          },
          validate: (value: any) => {
            if (typeof value !== 'string') return true
            if (!value || value.trim().length < 2) {
              return 'Nome deve ter pelo menos 2 caracteres'
            }
            if (value.length > 50) {
              return 'Nome deve ter no máximo 50 caracteres'
            }
            return true
          },
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          label: 'Slug',
          admin: {
            description: 'Gerado automaticamente a partir do nome. Você pode editá-lo se necessário.',
            placeholder: 'sera-gerado-automaticamente',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descrição',
          admin: {
            placeholder: 'Breve descrição da categoria (opcional)',
            description: 'Ideal: 50-200 caracteres para melhor SEO',
          },
          validate: (value: any) => {
            if (value && typeof value === 'string' && value.length > 0) {
              if (value.length < 10) {
                return 'Descrição deve ter pelo menos 10 caracteres'
              }
              if (value.length > 300) {
                return 'Descrição deve ter no máximo 300 caracteres'
              }
            }
            return true
          },
        },
        {
          name: 'color',
          type: 'text',
          label: 'Cor',
          admin: {
            description: 'Cor hexadecimal (ex: #FF5733) ou nome da cor para identificação visual',
            placeholder: '#FF5733',
          },
          validate: (value: any) => {
            if (value && typeof value === 'string') {
              const hexRegex = /^#[0-9A-F]{6}$/i
              const colorNames = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'gray', 'black', 'white']
              if (!hexRegex.test(value) && !colorNames.includes(value.toLowerCase())) {
                return 'Digite um código hexadecimal válido (#FF5733) ou um nome de cor comum'
              }
            }
            return true
          },
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Ícone',
          admin: {
            description: 'Nome do ícone do Lucide React (ex: Newspaper, Users, TrendingUp)',
            placeholder: 'Newspaper',
          },
        },
        {
          name: 'active',
          type: 'checkbox',
          label: 'Ativa',
          defaultValue: true,
          admin: {
            description: 'Desmarque para ocultar esta categoria do site',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          label: 'Destaque',
          defaultValue: false,
          admin: {
            description: 'Marque para destacar esta categoria na navegação',
          },
        },
      ],
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      slug: 'posts',
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'category', 'status', 'publishedDate', 'author'],
        description: 'Gerencie seus posts, artigos e notícias. Use o editor para criar conteúdo rico e agende publicações para o futuro.',
        preview: (doc) => {
          if (doc?.slug) {
            return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/posts/${doc.slug}`
          }
          return null
        },
      },
      labels: {
        plural: 'Posts',
      },
      // hooks: {
      //   beforeChange: [beforeChange],
      //   afterChange: [afterChange],
      //   beforeValidate: [beforeValidate],
      // },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Título',
          admin: {
            placeholder: 'Digite o título do post...',
            description: 'Título deve ter entre 10-200 caracteres para melhor SEO',
          },
          validate: (value: any) => {
            if (typeof value !== 'string') return true
            if (!value || value.trim().length < 10) {
              return 'Título deve ter pelo menos 10 caracteres'
            }
            if (value.length > 200) {
              return 'Título deve ter no máximo 200 caracteres'
            }
            return true
          },
        },
        {
          name: 'slug',
          type: 'text',
          required: false,
          unique: true,
          label: 'Slug',
          admin: {
            description: 'Gerado automaticamente a partir do título. Você pode editá-lo se necessário.',
            placeholder: 'sera-gerado-automaticamente',
          },
        },
        {
          name: 'excerpt',
          type: 'textarea',
          label: 'Resumo',
          admin: {
            placeholder: 'Resumo do post (será gerado automaticamente se vazio)',
            description: 'Ideal: 50-300 caracteres. Será gerado automaticamente a partir do conteúdo se não preenchido.',
          },
          validate: (value: any) => {
            if (value && typeof value === 'string' && value.length > 0) {
              if (value.length < 50) {
                return 'Excerpt deve ter pelo menos 50 caracteres'
              }
              if (value.length > 300) {
                return 'Excerpt deve ter no máximo 300 caracteres'
              }
            }
            return true
          },
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
          label: 'Conteúdo',
          admin: {
            description: 'Use o editor para formatar seu conteúdo. Suporte a texto rico, imagens e muito mais.',
          },
        },
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagem Destacada',
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
          label: 'Categoria',
          admin: {
            description: 'Selecione a categoria deste post',
          },
        },
        {
          name: 'tags',
          type: 'array',
          label: 'Tags',
          fields: [
            {
              name: 'tag',
              type: 'text',
            },
          ],
        },
        {
          name: 'author',
          type: 'relationship',
          relationTo: 'columnists',
          label: 'Autor',
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'draft',
          label: 'Status',
          admin: {
            description: 'Rascunho: ainda não publicado | Publicado: visível no site | Arquivado: removido do site',
          },
          options: [
            {
              label: 'Rascunho',
              value: 'draft',
            },
            {
              label: 'Publicado',
              value: 'published',
            },
            {
              label: 'Arquivado',
              value: 'archived',
            },
          ],
        },
        {
          name: 'publishedDate',
          type: 'date',
          label: 'Data de Publicação',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            description: 'Deixe em branco para publicar imediatamente, ou escolha uma data futura para agendar a publicação automaticamente.',
          },
          validate: (value: any, { data }: any) => {
            if (data?.status === 'published' && value) {
              const publishedDate = new Date(value)
              const now = new Date()
              if (publishedDate > now) {
                return 'Posts publicados não podem ter data futura. Use status "Rascunho" para agendar.'
              }
            }
            return true
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          label: 'Destaque',
          defaultValue: false,
        },
        // Temporariamente desabilitado para evitar erros de build
        // {
        //   name: 'postTools',
        //   type: 'ui',
        //   label: 'Ferramentas de Postagem',
        //   admin: {
        //     position: 'sidebar',
        //     components: {
        //       Field: '/components/admin/posts/PostTools.tsx',
        //     },
        //   },
        // },
        {
          name: 'sourceUrl',
          type: 'text',
          label: 'URL de Origem',
          admin: {
            description: 'URL original do conteúdo importado',
          },
        },
      ],
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      slug: 'columnists',
      admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'slug', 'photo', 'role'],
      },
      labels: {
        plural: 'Colunistas',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nome',
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          label: 'Slug',
        },
        {
          name: 'bio',
          type: 'textarea',
          label: 'Biografia',
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: 'Foto',
        },
        {
          name: 'role',
          type: 'text',
          label: 'Cargo/Função',
        },
        {
          name: 'social',
          type: 'group',
          label: 'Redes Sociais',
          fields: [
            {
              name: 'twitter',
              type: 'text',
              label: 'Twitter/X',
            },
            {
              name: 'linkedin',
              type: 'text',
              label: 'LinkedIn',
            },
            {
              name: 'instagram',
              type: 'text',
              label: 'Instagram',
            },
          ],
        },
      ],
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      slug: 'events',
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'category', 'author', 'status', 'publishedDate'],
      },
      labels: {
        plural: 'Eventos',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Título',
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          label: 'Slug',
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Descrição',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagem',
        },
        {
          name: 'startDate',
          type: 'date',
          required: true,
          label: 'Data de Início',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'Data de Término',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'location',
          type: 'text',
          label: 'Local',
        },
        {
          name: 'eventType',
          type: 'select',
          label: 'Tipo de Evento',
          options: [
            { label: 'Presencial', value: 'in-person' },
            { label: 'Online', value: 'online' },
            { label: 'Híbrido', value: 'hybrid' },
          ],
        },
        {
          name: 'registrationUrl',
          type: 'text',
          label: 'URL de Inscrição',
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'upcoming',
          label: 'Status',
          options: [
            { label: 'Próximo', value: 'upcoming' },
            { label: 'Em Andamento', value: 'ongoing' },
            { label: 'Finalizado', value: 'finished' },
            { label: 'Cancelado', value: 'cancelled' },
          ],
        },
        {
          name: 'organizers',
          type: 'array',
          label: 'Organizadores',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Nome',
            },
            {
              name: 'company',
              type: 'text',
              required: true,
              label: 'Empresa/Organização',
            },
            {
              name: 'email',
              type: 'email',
              label: 'Email',
            },
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
              label: 'Foto',
            },
            {
              name: 'role',
              type: 'text',
              label: 'Cargo',
            },
          ],
        },
        {
          name: 'sponsors',
          type: 'array',
          label: 'Empresas Patrocinadoras',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Nome da Empresa',
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
            },
            {
              name: 'website',
              type: 'text',
              label: 'Website',
            },
            {
              name: 'sponsorshipType',
              type: 'select',
              label: 'Tipo de Patrocínio',
              options: [
                { label: 'Ouro', value: 'gold' },
                { label: 'Prata', value: 'silver' },
                { label: 'Bronze', value: 'bronze' },
              ],
            },
          ],
        },
        {
          name: 'speakers',
          type: 'array',
          label: 'Palestrantes',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Nome',
            },
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
              label: 'Foto',
            },
            {
              name: 'company',
              type: 'text',
              required: true,
              label: 'Empresa',
            },
            {
              name: 'role',
              type: 'text',
              required: true,
              label: 'Cargo',
            },
            {
              name: 'bio',
              type: 'textarea',
              label: 'Biografia',
            },
            {
              name: 'talkTitle',
              type: 'text',
              label: 'Tema da Palestra',
            },
          ],
        },
      ],
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      slug: 'media',
      admin: {
      },
      labels: {
        plural: 'Mídia',
      },
      upload: {
        staticDir: 'public/uploads',
        imageSizes: [
          {
            name: 'thumbnail',
            width: 400,
            height: 300,
            position: 'centre',
          },
          {
            name: 'card',
            width: 768,
            height: 1024,
            position: 'centre',
          },
          {
            name: 'tablet',
            width: 1024,
            height: undefined,
            position: 'centre',
          },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/*'],
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          label: 'Texto Alternativo',
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Legenda',
        },
      ],
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      slug: 'sponsors',
      admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'website', 'active'],
      },
      labels: {
        plural: 'Patrocinadores',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nome',
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Logo',
        },
        {
          name: 'website',
          type: 'text',
          label: 'Website',
        },
        {
          name: 'active',
          type: 'checkbox',
          label: 'Ativo',
          defaultValue: true,
        },
      ],
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      slug: 'newsletter-subscribers',
      admin: {
        useAsTitle: 'email',
        defaultColumns: ['email', 'subscriptionDate'],
      },
      labels: {
        plural: 'Assinantes da Newsletter',
      },
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
          unique: true,
          label: 'Email',
        },
        {
          name: 'subscriptionDate',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
          label: 'Data de Inscrição',
          admin: {
            readOnly: true,
          },
        },
      ],
      access: {
        read: ({ req }) => req.user?.role === 'admin',
        create: () => true, // Permitir criação pública (via API)
        update: ({ req }) => req.user?.role === 'admin',
        delete: ({ req }) => req.user?.role === 'admin',
      },
    },
  ],

  // Globals - dados singleton (únicos)
  globals: [
    {
      slug: 'site-settings',
      label: 'Configurações do Site',
      admin: {
        group: 'Configurações',
        description: 'Configure o nome, descrição, logos e redes sociais do site.',
      },
      fields: [
        {
          type: 'tabs',
          tabs: [
            {
              label: 'Geral',
              description: 'Informações básicas do site',
              fields: [
                {
                  name: 'siteName',
                  type: 'text',
                  required: true,
                  label: 'Nome do Site',
                  admin: {
                    placeholder: 'Ex: EDA.Show',
                  },
                },
                {
                  name: 'siteDescription',
                  type: 'textarea',
                  label: 'Descrição do Site',
                  admin: {
                    placeholder: 'Descrição para SEO e redes sociais',
                    description: 'Será usada como meta description padrão',
                  },
                },
                {
                  name: 'siteKeywords',
                  type: 'text',
                  label: 'Palavras-chave',
                  admin: {
                    placeholder: 'saúde, eventos, notícias',
                    description: 'Separadas por vírgula para SEO',
                  },
                },
              ],
            },
            {
              label: 'Logos e Imagens',
              description: 'Logos do site para diferentes contextos',
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo Principal',
                  admin: {
                    description: 'Logo principal do site (recomendado: PNG transparente, mínimo 200x80px)',
                  },
                },
                {
                  name: 'logoDark',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo para Fundo Escuro',
                  admin: {
                    description: 'Versão do logo para usar em fundos escuros/modo escuro',
                  },
                },
                {
                  name: 'logoWhite',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo Branco (Header)',
                  admin: {
                    description: 'Logo branco/claro para usar no header laranja',
                  },
                },
                {
                  name: 'favicon',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Favicon',
                  admin: {
                    description: 'Ícone do site (recomendado: 32x32px ou 64x64px)',
                  },
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Imagem para Redes Sociais (OG Image)',
                  admin: {
                    description: 'Imagem exibida ao compartilhar o site (recomendado: 1200x630px)',
                  },
                },
              ],
            },
            {
              label: 'Cores do Tema',
              description: 'Personalize as cores do site',
              fields: [
                {
                  name: 'themeColors',
                  type: 'group',
                  label: 'Cores Principais',
                  admin: {
                    description: 'Defina as cores principais do tema. Use códigos hexadecimais (ex: #FF6F00)',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'primary',
                          type: 'text',
                          label: 'Cor Primária',
                          defaultValue: '#FF6F00',
                          admin: {
                            placeholder: '#FF6F00',
                            description: 'Cor principal (botões, links, destaques)',
                            width: '50%',
                          },
                        },
                        {
                          name: 'primaryForeground',
                          type: 'text',
                          label: 'Texto na Cor Primária',
                          defaultValue: '#ffffff',
                          admin: {
                            placeholder: '#ffffff',
                            description: 'Cor do texto sobre elementos primários',
                            width: '50%',
                          },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'secondary',
                          type: 'text',
                          label: 'Cor Secundária',
                          defaultValue: '#f5f5f5',
                          admin: {
                            placeholder: '#f5f5f5',
                            description: 'Cor para elementos secundários',
                            width: '50%',
                          },
                        },
                        {
                          name: 'secondaryForeground',
                          type: 'text',
                          label: 'Texto na Cor Secundária',
                          defaultValue: '#1a1a1a',
                          admin: {
                            placeholder: '#1a1a1a',
                            width: '50%',
                          },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'accent',
                          type: 'text',
                          label: 'Cor de Destaque (Accent)',
                          defaultValue: '#FF6F00',
                          admin: {
                            placeholder: '#FF6F00',
                            description: 'Cor para elementos de destaque',
                            width: '50%',
                          },
                        },
                        {
                          name: 'accentForeground',
                          type: 'text',
                          label: 'Texto no Destaque',
                          defaultValue: '#ffffff',
                          admin: {
                            placeholder: '#ffffff',
                            width: '50%',
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'backgroundColors',
                  type: 'group',
                  label: 'Cores de Fundo',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'background',
                          type: 'text',
                          label: 'Fundo Principal',
                          defaultValue: '#ffffff',
                          admin: {
                            placeholder: '#ffffff',
                            description: 'Cor de fundo do site',
                            width: '50%',
                          },
                        },
                        {
                          name: 'foreground',
                          type: 'text',
                          label: 'Texto Principal',
                          defaultValue: '#1a1a1a',
                          admin: {
                            placeholder: '#1a1a1a',
                            description: 'Cor do texto principal',
                            width: '50%',
                          },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'card',
                          type: 'text',
                          label: 'Fundo dos Cards',
                          defaultValue: '#ffffff',
                          admin: {
                            placeholder: '#ffffff',
                            width: '50%',
                          },
                        },
                        {
                          name: 'cardForeground',
                          type: 'text',
                          label: 'Texto dos Cards',
                          defaultValue: '#1a1a1a',
                          admin: {
                            placeholder: '#1a1a1a',
                            width: '50%',
                          },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'muted',
                          type: 'text',
                          label: 'Fundo Neutro',
                          defaultValue: '#fafafa',
                          admin: {
                            placeholder: '#fafafa',
                            description: 'Para seções alternadas',
                            width: '50%',
                          },
                        },
                        {
                          name: 'mutedForeground',
                          type: 'text',
                          label: 'Texto Neutro',
                          defaultValue: '#64748b',
                          admin: {
                            placeholder: '#64748b',
                            description: 'Para textos secundários',
                            width: '50%',
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'otherColors',
                  type: 'group',
                  label: 'Outras Cores',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'border',
                          type: 'text',
                          label: 'Bordas',
                          defaultValue: '#e5e5e5',
                          admin: {
                            placeholder: '#e5e5e5',
                            width: '50%',
                          },
                        },
                        {
                          name: 'ring',
                          type: 'text',
                          label: 'Foco (Ring)',
                          defaultValue: '#FF6F00',
                          admin: {
                            placeholder: '#FF6F00',
                            description: 'Cor do foco em inputs',
                            width: '50%',
                          },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'destructive',
                          type: 'text',
                          label: 'Cor de Erro/Perigo',
                          defaultValue: '#dc2626',
                          admin: {
                            placeholder: '#dc2626',
                            width: '50%',
                          },
                        },
                        {
                          name: 'destructiveForeground',
                          type: 'text',
                          label: 'Texto em Erro',
                          defaultValue: '#ffffff',
                          admin: {
                            placeholder: '#ffffff',
                            width: '50%',
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'darkModeColors',
                  type: 'group',
                  label: 'Cores do Modo Escuro',
                  admin: {
                    description: 'Cores para quando o modo escuro estiver ativo (opcional - deixe em branco para usar valores padrão)',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'darkBackground',
                          type: 'text',
                          label: 'Fundo (Dark)',
                          admin: {
                            placeholder: '#09090b',
                            width: '50%',
                          },
                        },
                        {
                          name: 'darkForeground',
                          type: 'text',
                          label: 'Texto (Dark)',
                          admin: {
                            placeholder: '#fafafa',
                            width: '50%',
                          },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'darkCard',
                          type: 'text',
                          label: 'Cards (Dark)',
                          admin: {
                            placeholder: '#18181b',
                            width: '50%',
                          },
                        },
                        {
                          name: 'darkCardForeground',
                          type: 'text',
                          label: 'Texto Cards (Dark)',
                          admin: {
                            placeholder: '#fafafa',
                            width: '50%',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              label: 'Tipografia',
              description: 'Configurações de fontes',
              fields: [
                {
                  name: 'typography',
                  type: 'group',
                  label: 'Fontes',
                  fields: [
                    {
                      name: 'fontFamily',
                      type: 'select',
                      label: 'Fonte Principal',
                      defaultValue: 'inter',
                      options: [
                        { label: 'Inter (Padrão)', value: 'inter' },
                        { label: 'Roboto', value: 'roboto' },
                        { label: 'Open Sans', value: 'open-sans' },
                        { label: 'Lato', value: 'lato' },
                        { label: 'Poppins', value: 'poppins' },
                        { label: 'Montserrat', value: 'montserrat' },
                        { label: 'Source Sans Pro', value: 'source-sans-pro' },
                      ],
                    },
                    {
                      name: 'headingFontFamily',
                      type: 'select',
                      label: 'Fonte dos Títulos',
                      defaultValue: 'inter',
                      options: [
                        { label: 'Mesma da principal', value: 'inter' },
                        { label: 'Roboto', value: 'roboto' },
                        { label: 'Open Sans', value: 'open-sans' },
                        { label: 'Lato', value: 'lato' },
                        { label: 'Poppins', value: 'poppins' },
                        { label: 'Montserrat', value: 'montserrat' },
                        { label: 'Playfair Display', value: 'playfair-display' },
                      ],
                    },
                    {
                      name: 'borderRadius',
                      type: 'select',
                      label: 'Arredondamento dos Cantos',
                      defaultValue: '0.625rem',
                      options: [
                        { label: 'Nenhum', value: '0' },
                        { label: 'Pequeno', value: '0.25rem' },
                        { label: 'Médio (Padrão)', value: '0.625rem' },
                        { label: 'Grande', value: '1rem' },
                        { label: 'Muito Grande', value: '1.5rem' },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              label: 'Redes Sociais',
              description: 'Links das redes sociais',
              fields: [
                {
                  name: 'socialMedia',
                  type: 'group',
                  label: 'Redes Sociais',
                  fields: [
                    {
                      name: 'facebook',
                      type: 'text',
                      label: 'Facebook',
                      admin: {
                        placeholder: 'https://facebook.com/suapagina',
                      },
                    },
                    {
                      name: 'twitter',
                      type: 'text',
                      label: 'Twitter/X',
                      admin: {
                        placeholder: 'https://x.com/seuusuario',
                      },
                    },
                    {
                      name: 'instagram',
                      type: 'text',
                      label: 'Instagram',
                      admin: {
                        placeholder: 'https://instagram.com/seuusuario',
                      },
                    },
                    {
                      name: 'linkedin',
                      type: 'text',
                      label: 'LinkedIn',
                      admin: {
                        placeholder: 'https://linkedin.com/company/suaempresa',
                      },
                    },
                    {
                      name: 'youtube',
                      type: 'text',
                      label: 'YouTube',
                      admin: {
                        placeholder: 'https://youtube.com/@seucanal',
                      },
                    },
                    {
                      name: 'whatsapp',
                      type: 'text',
                      label: 'WhatsApp',
                      admin: {
                        placeholder: 'https://wa.me/5511999999999',
                      },
                    },
                  ],
                },
              ],
            },
            {
              label: 'Contato',
              description: 'Informações de contato',
              fields: [
                {
                  name: 'contact',
                  type: 'group',
                  label: 'Informações de Contato',
                  fields: [
                    {
                      name: 'email',
                      type: 'email',
                      label: 'Email Principal',
                      admin: {
                        placeholder: 'contato@exemplo.com.br',
                      },
                    },
                    {
                      name: 'phone',
                      type: 'text',
                      label: 'Telefone',
                      admin: {
                        placeholder: '(11) 99999-9999',
                      },
                    },
                    {
                      name: 'address',
                      type: 'textarea',
                      label: 'Endereço',
                      admin: {
                        placeholder: 'Rua Example, 123 - São Paulo, SP',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      access: {
        read: () => true,
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      slug: 'header',
      fields: [
        {
          name: 'navigation',
          type: 'array',
          label: 'Navegação',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Texto',
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'URL',
            },
          ],
        },
      ],
      access: {
        read: () => true,
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      slug: 'footer',
      fields: [
        {
          name: 'copyright',
          type: 'text',
          label: 'Copyright',
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Texto',
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'URL',
            },
          ],
        },
      ],
      access: {
        read: () => true,
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
  ],

  // Configuração do painel admin
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, 'app/admin.backup/importMap.ts'),
    },
    user: 'users',
    meta: {
      titleSuffix: '- EdaShow CMS',
    },
  },

  // Configuração de internacionalização (i18n)
  i18n: {
    fallbackLanguage: 'en',
  },

  // Editor de texto rico
  editor: lexicalEditor({}),

  // TypeScript
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // Sharp para processamento de imagens
  sharp,
})

/**
 * Exporta a configuração do Payload CMS
 * 
 * IMPORTANTE: No Payload CMS 3.x, a configuração pode ser exportada diretamente
 * ou como uma Promise. O Next.js e o Payload cuidam da resolução assíncrona.
 */
export default config
