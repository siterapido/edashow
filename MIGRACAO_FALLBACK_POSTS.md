# 📦 Migração de Posts Fallback para Banco de Dados

Este documento explica como migrar todos os posts fallback com imagens para serem posts reais no banco de dados PayloadCMS.

## 🎯 O que faz este script?

O script `migrate-fallback-posts.ts` identifica todos os posts fallback que possuem imagens (`featuredImage`) e os migra para o banco de dados PayloadCMS, criando:

- ✅ Categorias necessárias (se não existirem)
- ✅ Colunistas necessários (se não existirem)
- ✅ Upload das imagens para a collection Media
- ✅ Posts completos no banco de dados com todos os dados

## 📋 Pré-requisitos

1. **Servidor Next.js rodando**: O servidor deve estar em execução (`pnpm dev`) para que as imagens possam ser acessadas
2. **Variáveis de ambiente configuradas**:
   - `PAYLOAD_SERVER_URL` ou `NEXT_PUBLIC_SERVER_URL` (padrão: `http://localhost:3000`)
   - `PAYLOAD_ADMIN_EMAIL` (padrão: `admin@example.com`)
   - `PAYLOAD_ADMIN_PASSWORD` (padrão: `password`)
   - Ou `PAYLOAD_API_TOKEN` (alternativa ao email/senha)

## 🚀 Como executar

### Opção 1: Usando o script npm (recomendado)

```bash
pnpm migrate:fallback-posts
```

### Opção 2: Usando tsx diretamente

```bash
pnpm tsx scripts/migrate-fallback-posts.ts
```

### Opção 3: Usando ts-node

```bash
pnpm ts-node --esm scripts/migrate-fallback-posts.ts
```

## 📊 O que o script faz

1. **Autenticação**: Autentica no PayloadCMS usando as credenciais fornecidas
2. **Filtragem**: Identifica apenas posts fallback que possuem imagens
3. **Criação de categorias**: Cria/busca as categorias necessárias:
   - `news` → "Notícias"
   - `analysis` → "Análises"
   - `interviews` → "Entrevistas"
   - `opinion` → "Opinião"
4. **Criação de colunistas**: Cria/busca os colunistas mencionados nos posts
5. **Upload de imagens**: Faz upload de cada imagem para a collection Media
6. **Criação de posts**: Cria ou atualiza cada post no banco de dados com:
   - Título, slug, resumo
   - Conteúdo completo (formato Lexical)
   - Imagem destacada
   - Categoria
   - Tags (se existirem)
   - Autor (se existir)
   - Data de publicação
   - Status: publicado

## 🔍 Verificação

Após a execução, você pode verificar os posts criados:

1. **Via Admin Panel**: Acesse `http://localhost:3000/admin` e vá em "Posts"
2. **Via API**: `GET http://localhost:3000/api/posts?where[status][equals]=published`

## ⚠️ Observações importantes

- **Posts duplicados**: O script verifica se um post com o mesmo slug já existe. Se existir, ele será **atualizado** em vez de criar um novo
- **Imagens não encontradas**: Se uma imagem não for encontrada no diretório `public/`, o script continuará sem imagem para aquele post
- **Categorias**: Se uma categoria não existir, ela será criada automaticamente
- **Colunistas**: Se um colunista não existir, ele será criado automaticamente com o nome fornecido

## 📝 Exemplo de saída

```
🚀 Iniciando migração de posts fallback com imagens...

🔐 Autenticando no PayloadCMS...
✅ Autenticação realizada com sucesso

📊 Encontrados 8 posts fallback com imagens

📁 Criando/buscando categorias...
  ✅ Categoria "Notícias" (ID: abc123)
  ✅ Categoria "Análises" (ID: def456)

👤 Criando/buscando colunistas...
  ✅ Colunista "Redação EdaShow" (ID: ghi789)
  ✅ Colunista "Ricardo Rodrigues" (ID: jkl012)

📝 Processando post 1/8: "Usisaúde Seguro cresceu em 2025..."
  📸 Fazendo upload da imagem: /professional-man-ricardo-rodrigues.jpg
  ✅ Imagem enviada com sucesso (ID: mno345)
  ✅ Post criado/atualizado com sucesso! (ID: pqr678, Slug: usisaude-seguro-cresceu-em-2025...)

...

✨ Processo concluído!

📊 Resumo:
   - Posts processados: 8
   - Sucesso: 8
   - Erros: 0

🎉 Migração finalizada!
```

## 🐛 Solução de problemas

### Erro de autenticação
- Verifique se as credenciais estão corretas no arquivo `.env`
- Certifique-se de que o usuário admin existe no PayloadCMS

### Imagens não encontradas
- Verifique se as imagens estão no diretório `public/`
- Certifique-se de que o caminho da imagem está correto (ex: `/image.jpg`)

### Erro ao criar categoria
- Verifique se o nome da categoria não excede 50 caracteres
- Certifique-se de que o slug é único

### Erro ao criar post
- Verifique se todos os campos obrigatórios estão preenchidos
- Verifique se a categoria existe e está ativa
- Verifique os logs do servidor para mais detalhes

## 📚 Arquivos relacionados

- `scripts/migrate-fallback-posts.ts` - Script de migração
- `lib/fallback-data.ts` - Dados fallback originais
- `lib/payload/client.ts` - Cliente PayloadCMS para operações administrativas
