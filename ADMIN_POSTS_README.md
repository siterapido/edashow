# Área Admin - Postagem de Conteúdo

Este documento descreve as funcionalidades implementadas para melhorar a experiência de postagem de conteúdo no admin do PayloadCMS.

## Funcionalidades Implementadas

### 1. Auto-Geração Inteligente

#### Slug Automático
- O slug é gerado automaticamente a partir do título quando não fornecido
- Usa a biblioteca `slugify` para normalização
- Verifica unicidade e adiciona sufixo numérico se necessário
- Hook: `payload/hooks/posts.ts` - `beforeChange`

#### Excerpt Automático
- O excerpt é gerado automaticamente a partir do conteúdo se não fornecido
- Extrai as primeiras 150 caracteres do conteúdo rich text
- Remove HTML tags e formatação
- Função: `lib/admin/posts/excerpt-generator.ts`

### 2. Preview em Tempo Real

#### Componente PostPreview
- Modal com preview do post antes de publicar
- Renderiza título, excerpt, imagem destacada e conteúdo
- Mostra URL de preview
- Arquivo: `components/admin/posts/post-preview.tsx`
- API: `app/api/admin/posts/preview/route.ts`

### 3. Auto-Save de Rascunhos

#### Indicador de Salvamento
- Mostra status de salvamento em tempo real
- Indicadores: "Salvando...", "Salvo", "Não salvo"
- Última data/hora de salvamento
- Componente: `components/admin/posts/auto-save-indicator.tsx`
- API: `app/api/admin/posts/auto-save/route.ts`

### 4. Agendamento Automático

#### Sistema de Agendamento
- Posts com `publishedDate` futura são mantidos como "draft"
- Sistema verifica e publica automaticamente quando a data chega
- API de verificação: `app/api/admin/posts/schedule-check/route.ts`
- Hook: `payload/hooks/posts.ts` - `beforeChange`

### 5. Publicação Rápida

#### Quick Publish Button
- Botão de publicação com um clique
- Valida campos obrigatórios antes de publicar
- Feedback visual de sucesso/erro
- Componente: `components/admin/posts/quick-publish-button.tsx`
- API: `app/api/admin/posts/quick-publish/route.ts`

### 6. Validações em Tempo Real

#### Post Form Enhancements
- Contador de caracteres para título e excerpt
- Indicador de score SEO básico
- Validação visual de campos obrigatórios
- Preview da URL final do post
- Componente: `components/admin/posts/post-form-enhancements.tsx`

### 7. Indicadores de Status

#### Post Status Badge
- Badge visual mostrando status atual
- Cores diferentes para cada status (Rascunho, Agendado, Publicado, Arquivado)
- Mostra data de publicação se agendado/publicado
- Componente: `components/admin/posts/post-status-badge.tsx`

### 8. Atalhos de Teclado

#### Keyboard Shortcuts
- `Ctrl+S`: Salvar rascunho
- `Ctrl+P`: Abrir preview
- `Ctrl+Shift+P`: Publicar imediatamente
- `Ctrl+N`: Novo post
- `Esc`: Fechar preview/modal
- Hook: `lib/admin/posts/keyboard-shortcuts.ts`

### 9. Sistema de Notificações

#### Notificações com Sonner
- Notificações de sucesso/erro para todas as ações
- Feedback visual para auto-save, publicação, agendamento
- Utilitários: `components/admin/posts/notifications.tsx`

## Estrutura de Arquivos

```
components/admin/posts/
├── post-preview.tsx              # Componente de preview
├── auto-save-indicator.tsx        # Indicador de auto-save
├── post-status-badge.tsx          # Badge de status
├── quick-publish-button.tsx       # Botão de publicação rápida
├── post-form-enhancements.tsx     # Melhorias no formulário
└── notifications.tsx              # Utilitários de notificação

lib/admin/posts/
├── slug-generator.ts             # Geração de slug
├── excerpt-generator.ts          # Geração de excerpt
├── validation-helpers.ts          # Validações
├── keyboard-shortcuts.ts         # Atalhos de teclado
└── preview-renderer.tsx          # Renderização de preview

app/api/admin/posts/
├── preview/route.ts              # API de preview
├── auto-save/route.ts            # API de auto-save
├── quick-publish/route.ts        # API de publicação rápida
├── generate-slug/route.ts        # API de geração de slug
├── generate-excerpt/route.ts      # API de geração de excerpt
└── schedule-check/route.ts       # API de verificação de agendamento

payload/hooks/
└── posts.ts                      # Hooks do Payload para posts

app/admin/posts/
└── custom.css                    # Estilos customizados
```

## Como Usar

### Integração no Admin do Payload

Os hooks já estão configurados no `payload.config.ts` e funcionam automaticamente. Os componentes podem ser integrados no admin do Payload através de custom components.

### Exemplo de Uso dos Componentes

```tsx
import { PostPreview } from '@/components/admin/posts/post-preview'
import { AutoSaveIndicator } from '@/components/admin/posts/auto-save-indicator'
import { QuickPublishButton } from '@/components/admin/posts/quick-publish-button'
import { PostStatusBadge } from '@/components/admin/posts/post-status-badge'

// No formulário de edição
<PostStatusBadge status={post.status} publishedDate={post.publishedDate} />
<PostPreview postData={postData} postId={post.id} />
<QuickPublishButton postData={postData} postId={post.id} />
<AutoSaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
```

### Configuração do Toaster

Certifique-se de que o Toaster do Sonner está configurado no layout:

```tsx
import { Toaster } from 'sonner'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

## APIs Disponíveis

### POST /api/admin/posts/preview
Gera preview de um post (pode ser não salvo ainda)

### POST /api/admin/posts/auto-save
Salva rascunho automaticamente

### POST /api/admin/posts/quick-publish
Publica post rapidamente com validação

### POST /api/admin/posts/generate-slug
Gera slug a partir do título

### POST /api/admin/posts/generate-excerpt
Gera excerpt a partir do conteúdo

### GET /api/admin/posts/schedule-check
Verifica e publica posts agendados

## Hooks do Payload

### beforeChange
- Auto-gera slug se não fornecido
- Auto-gera excerpt se não fornecido
- Normaliza tags
- Valida publishedDate para posts publicados
- Gerencia agendamento automático

### afterChange
- Log de alterações (pode ser expandido)
- Auto-save é gerenciado pelo componente no frontend

### beforeValidate
- Valida título (mínimo 10 caracteres)
- Valida excerpt (50-300 caracteres se fornecido)
- Valida slug
- Valida categoria

## Melhorias nos Campos

Os campos do post foram melhorados com:
- Placeholders úteis
- Descriptions claras
- Validações customizadas
- Slug opcional (gerado automaticamente)

## Próximos Passos

Para usar essas funcionalidades no admin do Payload:

1. Os hooks já estão funcionando automaticamente
2. Integre os componentes React no admin através de custom components do Payload
3. Configure o Toaster do Sonner no layout
4. Use os estilos customizados em `app/admin/posts/custom.css`

## Notas Técnicas

- Todos os hooks são executados no servidor, garantindo segurança
- As APIs validam autenticação do usuário
- Auto-save usa debounce para evitar salvamentos excessivos
- Preview pode ser renderizado tanto no servidor quanto no cliente
- Agendamento pode usar verificação periódica via API ou cron job












