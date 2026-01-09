# Criar Imagem Open Graph (1200x630px)

Para criar uma imagem otimizada para compartilhamento no WhatsApp e redes sociais, você tem duas opções:

## Opção 1: Usar Ferramenta Online

Recomendamos usar o Canva ou Photoshop:
- Tamanho: 1200 x 630 pixels
- Formato: PNG ou JPG
- Conteúdo sugerido:
  - Logo do EDA.Show
  - Slogan: "Portal editorial do mercado de saúde suplementar"
  - Fundo relacionado ao setor de saúde

## Opção 2: Usar o Logo Existente (Atual)

O sistema está configurado para usar o logo existente `/public/eda-show-logo.png` como fallback.

## Testar Compartilhamento

Após fazer deploy, teste o link em:
- https://developers.facebook.com/tools/debug/
- Cole a URL do seu site para verificar se a imagem aparece corretamente

## Configuração

A URL do site é definida na variável de ambiente:
```
NEXT_PUBLIC_SITE_URL=https://edashow.com.br
```

Certifique-se de atualizar essa variável no ambiente de produção.
