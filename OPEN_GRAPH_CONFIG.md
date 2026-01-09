# Configuração de Open Graph para WhatsApp

As mudanças foram implementadas com sucesso para garantir que ao compartilhar links no WhatsApp, a imagem destacada apareça corretamente.

## O que foi alterado:

### 1. Layout Principal (`app/layout.tsx`)
- ✅ Adicionados metadados Open Graph completos
- ✅ Configurado `metadataBase` para URLs absolutas
- ✅ Adicionada imagem padrão para compartilhamento (logo do EDA.Show)
- ✅ Configurados metadados Twitter Cards

### 2. Página de Posts (`app/posts/[slug]/page.tsx`)
- ✅ Melhorados os metadados Open Graph para posts individuais
- ✅ Adicionado `metadataBase` para URLs absolutas
- ✅ Configurado para usar imagem destacada do post como thumbnail
- ✅ Fallback para imagem de capa ou logo padrão

### 3. Variáveis de Ambiente
- ✅ Adicionado `NEXT_PUBLIC_SITE_URL` no `.env`
- ✅ Adicionado `NEXT_PUBLIC_SITE_URL` no `.env.example`

## Como usar em produção:

### 1. Atualizar a URL do site
No ambiente de produção, altere a variável `NEXT_PUBLIC_SITE_URL` no arquivo `.env`:

```bash
# Para desenvolvimento
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Para produção (substitua pela URL real)
NEXT_PUBLIC_SITE_URL=https://edashow.com.br
```

### 2. Criar imagem otimizada (opcional)
O sistema está configurado para usar `/public/eda-show-logo.png` como imagem padrão.

Para criar uma imagem personalizada de 1200x630px:
- Use Canva, Photoshop ou similar
- Tamanho: 1200 x 630 pixels
- Inclua logo e slogan do EDA.Show
- Salve como `og-image.png` em `/public/`

### 3. Testar o compartilhamento
Após fazer deploy, use o Facebook Sharing Debugger:
- https://developers.facebook.com/tools/debug/
- Cole a URL do seu site
- Clique em "Scrape Again" se necessário

## Como funciona:

1. **Home page**: Usa o logo do EDA.Show como imagem de compartilhamento
2. **Posts individuais**: Usa a imagem destacada do post automaticamente
3. **Fallback**: Se não houver imagem, usa o logo do EDA.Show

## Tags HTML geradas:

```html
<meta property="og:type" content="website" />
<meta property="og:locale" content="pt_BR" />
<meta property="og:url" content="https://edashow.com.br" />
<meta property="og:title" content="EDA.Show" />
<meta property="og:description" content="Portal editorial do mercado de saúde suplementar" />
<meta property="og:image" content="https://edashow.com.br/eda-show-logo.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="EDA.Show" />
<meta name="twitter:description" content="Portal editorial do mercado de saúde suplementar" />
<meta name="twitter:image" content="https://edashow.com.br/eda-show-logo.png" />
```

## Observações importantes:

- ⚠️ O WhatsApp pode levar até 24-48 horas para atualizar o cache de uma URL
- ⚠️ Para forçar atualização imediata, use o Facebook Sharing Debugger
- ⚠️ Imagens devem ser acessíveis publicamente (não atrás de autenticação)
- ⚠️ URLs relativas são convertidas em absolutas automaticamente pelo Next.js

## Próximos passos recomendados:

1. ✅ Fazer deploy das alterações
2. 📱 Testar compartilhamento no WhatsApp
3. 🎨 Criar imagem Open Graph personalizada (1200x630px)
4. 🔄 Atualizar `NEXT_PUBLIC_SITE_URL` no ambiente de produção
