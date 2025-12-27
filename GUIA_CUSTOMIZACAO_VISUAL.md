# 🎨 Guia de Customização Visual

Este guia explica como personalizar o visual do site (logos, cores, tipografia) diretamente pelo painel administrativo do Payload CMS.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Acessando as Configurações](#acessando-as-configurações)
3. [Personalizando Logos](#personalizando-logos)
4. [Personalizando Cores](#personalizando-cores)
5. [Personalizando Tipografia](#personalizando-tipografia)
6. [Redes Sociais e Contato](#redes-sociais-e-contato)
7. [Como Funciona Tecnicamente](#como-funciona-tecnicamente)

---

## 🌟 Visão Geral

Toda a personalização visual do site é gerenciada através do **Global "Configurações do Site"** no Payload CMS. Você pode alterar:

- ✅ **Logos** (principal, para fundo escuro, para header)
- ✅ **Cores** (primária, secundária, fundo, texto, etc.)
- ✅ **Tipografia** (fontes e arredondamento)
- ✅ **Redes Sociais** (links para perfis sociais)
- ✅ **Informações de Contato**

**Todas as alterações são aplicadas automaticamente em todo o site!**

---

## 🚀 Acessando as Configurações

1. Acesse o painel administrativo: `http://localhost:3000/admin`
2. No menu lateral, vá em **Globals** → **Configurações do Site**
3. Você verá várias abas de configuração

---

## 🖼️ Personalizando Logos

### Aba: "Logos e Imagens"

#### 1. Logo Principal
- **Quando usar**: Logo padrão exibido no site
- **Recomendações**: 
  - Formato PNG transparente
  - Tamanho mínimo: 200x80px
  - Proporção: Horizontal (mais largo que alto)

#### 2. Logo para Fundo Escuro
- **Quando usar**: Versão para modo escuro
- **Recomendações**: Versão clara/branca do logo

#### 3. Logo Branco (Header)
- **Quando usar**: Logo para o header laranja
- **Recomendações**: 
  - Versão branca/clara do logo
  - Boa visibilidade sobre fundo laranja (#FF6F00)

#### 4. Favicon
- **Quando usar**: Ícone da aba do navegador
- **Recomendações**: 
  - 32x32px ou 64x64px
  - Formato ICO, PNG ou SVG

#### 5. OG Image
- **Quando usar**: Imagem ao compartilhar nas redes sociais
- **Recomendações**: 
  - 1200x630px
  - Formato JPG ou PNG
  - Inclua logo e texto legível

---

## 🎨 Personalizando Cores

### Aba: "Cores do Tema"

O sistema de cores usa um esquema hierárquico:

#### Cores Principais

**Cor Primária** (`primary`)
- Usada em: Botões principais, links, destaques
- Padrão: `#FF6F00` (Laranja)
- Exemplo: Botões de ação, header

**Cor Secundária** (`secondary`)
- Usada em: Elementos secundários, backgrounds alternativos
- Padrão: `#f5f5f5` (Cinza claro)

**Cor de Destaque** (`accent`)
- Usada em: Badges, notificações, elementos especiais
- Padrão: `#FF6F00`

#### Cores de Fundo

**Fundo Principal** (`background`)
- Cor de fundo geral do site
- Padrão: `#ffffff` (Branco)

**Texto Principal** (`foreground`)
- Cor do texto principal
- Padrão: `#1a1a1a` (Quase preto)

**Cards** (`card`)
- Fundo dos cards e elementos destacados
- Padrão: `#ffffff`

**Neutro/Muted** (`muted`)
- Para seções alternadas e textos secundários
- Padrão: `#fafafa`

#### Outras Cores

**Bordas** (`border`)
- Cor das bordas
- Padrão: `#e5e5e5`

**Foco** (`ring`)
- Cor do outline ao focar em inputs
- Padrão: `#FF6F00`

**Erro/Perigo** (`destructive`)
- Para mensagens de erro e ações perigosas
- Padrão: `#dc2626` (Vermelho)

### 💡 Dicas de Cores

1. **Contraste**: Sempre garanta bom contraste entre texto e fundo (mínimo 4.5:1)
2. **Consistência**: Use a paleta de forma consistente
3. **Testes**: Teste as cores em diferentes seções do site
4. **Acessibilidade**: Use ferramentas como [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### 🌙 Modo Escuro (Opcional)

Se você quiser personalizar as cores do modo escuro:

1. Vá na seção "Cores do Modo Escuro"
2. Deixe em branco para usar valores padrão
3. Ou customize para ter controle total

---

## ✍️ Personalizando Tipografia

### Aba: "Tipografia"

#### Fonte Principal
Opções disponíveis:
- **Inter** (Padrão) - Moderna, legível
- **Roboto** - Clássica do Google
- **Open Sans** - Humanista, amigável
- **Lato** - Semi-arredondada
- **Poppins** - Geométrica, moderna
- **Montserrat** - Urban, bold
- **Source Sans Pro** - Para texto corrido

#### Fonte dos Títulos
- Pode ser igual à principal ou diferente
- Use fontes decorativas com cautela

#### Arredondamento dos Cantos
Define o `border-radius` de elementos:
- **Nenhum** (0) - Visual reto, moderno
- **Pequeno** (0.25rem) - Sutil
- **Médio** (0.625rem) - **Padrão**, equilibrado
- **Grande** (1rem) - Amigável
- **Muito Grande** (1.5rem) - Destacado, moderno

---

## 📱 Redes Sociais e Contato

### Aba: "Redes Sociais"
Configure links para:
- Facebook
- Twitter/X
- Instagram
- LinkedIn
- YouTube
- WhatsApp

**Formato**: URL completa (ex: `https://instagram.com/seuusuario`)

### Aba: "Contato"
Configure:
- Email principal
- Telefone
- Endereço físico

---

## 🔧 Como Funciona Tecnicamente

### Fluxo de Aplicação

1. **Configurações salvas no CMS** → Armazenadas no banco PostgreSQL
2. **ThemeProvider carrega as configs** → Via API `/api/globals/site-settings`
3. **CSS Variables atualizadas** → Aplicadas no `:root` do documento
4. **Site renderizado com cores customizadas** → Usando Tailwind CSS

### Estrutura de Arquivos

```
payload.config.ts          # Define o Global "site-settings" com todos os campos
components/
  theme-provider.tsx       # Carrega e aplica as customizações
  logo.tsx                 # Carrega logos do CMS dinamicamente
  client-layout.tsx        # Integra o ThemeProvider
lib/payload/
  api.ts                   # Funções helper para buscar configs
app/globals.css           # CSS Variables base (fallback)
```

### CSS Variables Disponíveis

As seguintes variáveis CSS são aplicadas dinamicamente:

```css
--primary                  /* Cor primária */
--primary-foreground       /* Texto na cor primária */
--secondary                /* Cor secundária */
--secondary-foreground     /* Texto na cor secundária */
--accent                   /* Cor de destaque */
--accent-foreground        /* Texto no destaque */
--background               /* Fundo principal */
--foreground               /* Texto principal */
--card                     /* Fundo dos cards */
--card-foreground          /* Texto dos cards */
--muted                    /* Fundo neutro */
--muted-foreground         /* Texto secundário */
--border                   /* Bordas */
--ring                     /* Foco */
--destructive              /* Erro/perigo */
--destructive-foreground   /* Texto em erro */
--radius                   /* Arredondamento */
```

### Componentes Afetados

Todos os componentes que usam classes Tailwind são afetados:
- ✅ Header
- ✅ Footer
- ✅ Cards de notícias
- ✅ Botões
- ✅ Formulários
- ✅ Navegação
- ✅ Modais
- ✅ E muito mais!

---

## 📝 Exemplos de Uso

### Exemplo 1: Mudar para Tema Azul

1. Vá em **Cores do Tema** → **Cor Primária**
2. Mude de `#FF6F00` para `#2563eb` (Azul)
3. Ajuste **Texto na Cor Primária** se necessário
4. Salve as alterações
5. O site inteiro agora usa azul!

### Exemplo 2: Adicionar Logo Personalizado

1. Faça upload do logo em **Mídia**
2. Vá em **Logos e Imagens** → **Logo Principal**
3. Selecione o logo que você fez upload
4. Para o header laranja, faça upload de uma versão branca
5. Selecione em **Logo Branco (Header)**
6. Salve e pronto!

### Exemplo 3: Arredondamento Suave

1. Vá em **Tipografia** → **Arredondamento dos Cantos**
2. Mude para "Muito Grande" (1.5rem)
3. Salve
4. Todos os cards, botões e inputs ficarão mais arredondados

---

## ⚠️ Troubleshooting

### As cores não mudaram
1. Limpe o cache do navegador (Ctrl+Shift+R)
2. Verifique se as cores estão em formato hexadecimal válido (#RRGGBB)
3. Verifique o console do navegador para erros

### O logo não aparece
1. Verifique se o upload foi bem-sucedido
2. Verifique se a imagem não é muito grande (máx 5MB)
3. Use formato PNG ou JPG

### Cores não têm bom contraste
1. Use ferramentas de validação:
   - [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
   - [Coolors Contrast Checker](https://coolors.co/contrast-checker)
2. Ajuste as cores até atingir contraste mínimo de 4.5:1

---

## 🎯 Próximos Passos

Após personalizar o visual:

1. ✅ Teste em diferentes dispositivos (mobile, tablet, desktop)
2. ✅ Verifique a acessibilidade (contraste, legibilidade)
3. ✅ Compartilhe um link nas redes sociais para ver a OG Image
4. ✅ Teste o modo escuro (se configurado)

---

## 📚 Recursos Adicionais

- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
- [Google Fonts](https://fonts.google.com/)
- [Coolors - Gerador de Paletas](https://coolors.co/)
- [Adobe Color Wheel](https://color.adobe.com/create/color-wheel)

---

**Dúvidas?** Consulte a documentação do Payload CMS: [payloadcms.com/docs](https://payloadcms.com/docs)




