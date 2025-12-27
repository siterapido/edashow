# 🔄 Migração MongoDB → Supabase PostgreSQL

Este documento descreve o processo de migração do MongoDB para Supabase PostgreSQL.

## ✅ Status da Migração

### Concluído

- ✅ Configuração do PostgreSQL adapter no `payload.config.ts`
- ✅ Configuração do Supabase S3 Storage
- ✅ Remoção da dependência `@payloadcms/db-mongodb`
- ✅ Scripts de exportação e importação criados
- ✅ Documentação atualizada (README, COMO_COMECAR, DEPLOY)
- ✅ Guia completo de configuração do Supabase criado

### Pendente (Requer Ação do Usuário)

- ⏳ Configurar projeto no Supabase
- ⏳ Atualizar variáveis de ambiente no `.env`
- ⏳ Criar bucket `media` no Supabase Storage
- ⏳ Configurar políticas de acesso no Storage
- ⏳ Exportar dados do MongoDB (se houver)
- ⏳ Testar conexão com Supabase
- ⏳ Importar dados para PostgreSQL
- ⏳ Migrar imagens para Supabase Storage

## 📋 Checklist de Migração

### 1. Configuração do Supabase

- [ ] Criar projeto no [Supabase](https://supabase.com)
- [ ] Copiar credenciais (Database URI, API Keys, Storage Keys)
- [ ] Criar bucket `media` no Storage
- [ ] Configurar políticas de acesso (Public Read, Authenticated Write)
- [ ] Atualizar arquivo `.env` com as credenciais

> 📖 **Guia completo**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 2. Testar Conexão

```bash
npm run test:db
```

**Resultado esperado:**
```
✅ Connected successfully!
Results: { current_database: 'postgres', current_user: 'postgres' }
```

### 3. Exportar Dados do MongoDB (Se Aplicável)

**Somente se você tem dados no MongoDB que deseja migrar.**

#### 3.1 Iniciar MongoDB

```bash
# macOS
brew services start mongodb-community

# Verificar se está rodando
brew services list
```

#### 3.2 Configurar MONGODB_URI

Adicione temporariamente no `.env`:

```bash
MONGODB_URI=mongodb://localhost:27017/edashow
```

#### 3.3 Executar Exportação

```bash
npx tsx scripts/export-mongodb.ts
```

**Resultado esperado:**
- Backup salvo em `mongodb-backup/backup-YYYY-MM-DD/`
- Arquivos JSON para cada coleção
- Arquivo `_metadata.json` com informações da exportação

### 4. Inicializar Schema PostgreSQL

```bash
npm run dev
```

**O que acontece:**
- Payload CMS cria automaticamente as tabelas no PostgreSQL
- Schema é gerado baseado nas collections definidas em `payload.config.ts`
- Aguarde até ver `✓ Ready in X.Xs`
- Pare o servidor (Ctrl+C)

### 5. Importar Dados para PostgreSQL

**Somente se você exportou dados do MongoDB.**

```bash
npx tsx scripts/import-to-postgres.ts
```

**Resultado esperado:**
- Resumo da importação com estatísticas
- Documentos importados, pulados e falhados
- Tabela com resumo por coleção

### 6. Migrar Imagens para Supabase Storage

```bash
npx tsx scripts/migrate-to-supabase.ts
```

**O que é migrado:**
- `public/uploads/` → Imagens do CMS
- `public/sponsors/` → Logos de patrocinadores
- Imagens na raiz de `public/` (exceto favicons)

### 7. Verificar Migração

#### 7.1 Iniciar Servidor

```bash
npm run dev
```

#### 7.2 Acessar Admin Panel

```
http://localhost:3000/admin
```

- Criar primeiro usuário administrador (se necessário)
- Verificar se as coleções estão visíveis
- Verificar se os dados foram importados

#### 7.3 Testar CRUD

- ✅ Criar uma categoria
- ✅ Criar um colunista
- ✅ Fazer upload de uma imagem
- ✅ Criar um post com imagem
- ✅ Criar um evento

#### 7.4 Verificar Frontend

```
http://localhost:3000
```

- ✅ Homepage carrega
- ✅ Posts aparecem
- ✅ Imagens carregam do Supabase
- ✅ Eventos aparecem

#### 7.5 Verificar Storage

1. Acesse o painel do Supabase
2. Vá em **Storage** → **media**
3. Verifique se as imagens foram enviadas
4. Clique em uma imagem e copie a URL pública
5. Abra a URL em uma nova aba - deve carregar

## 🔧 Scripts Disponíveis

```bash
# Testar conexão com Supabase
npm run test:db

# Exportar dados do MongoDB
npx tsx scripts/export-mongodb.ts

# Importar dados para PostgreSQL
npx tsx scripts/import-to-postgres.ts

# Migrar imagens para Supabase Storage
npx tsx scripts/migrate-to-supabase.ts

# Verificar variáveis de ambiente
npm run check:env
```

## 🗂️ Estrutura de Dados

### Collections

1. **users** - Usuários do sistema
2. **categories** - Categorias de posts
3. **columnists** - Colunistas/Autores
4. **posts** - Posts/Artigos (depende de categories e columnists)
5. **events** - Eventos
6. **media** - Metadados de imagens
7. **sponsors** - Patrocinadores
8. **newsletter-subscribers** - Inscritos na newsletter

### Globals

1. **site-settings** - Configurações gerais do site
2. **header** - Configuração do cabeçalho
3. **footer** - Configuração do rodapé

### Ordem de Importação

A ordem é importante devido aos relacionamentos:

1. users
2. categories
3. columnists
4. media
5. posts (depende de categories, columnists e media)
6. events
7. sponsors
8. newsletter-subscribers
9. globals (site-settings, header, footer)

## 🚨 Troubleshooting

### Erro: "Cannot read properties of undefined (reading 'searchParams')"

**Causa**: `DATABASE_URI` está com formato inválido

**Solução**:
```bash
# Formato correto:
DATABASE_URI=postgresql://postgres.xxxx:[SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres

# Verifique:
# - Não há espaços ou quebras de linha
# - A senha está correta
# - O formato está completo
```

### Erro: "MONGODB_URI não está configurado"

**Causa**: Tentando exportar do MongoDB sem a variável configurada

**Solução**:
```bash
# Adicione no .env:
MONGODB_URI=mongodb://localhost:27017/edashow
```

### Erro: "Nenhum backup encontrado"

**Causa**: Tentando importar sem ter exportado antes

**Solução**:
```bash
# Execute primeiro:
npx tsx scripts/export-mongodb.ts

# Depois:
npx tsx scripts/import-to-postgres.ts
```

### Erro: "Bucket not found"

**Causa**: Bucket `media` não foi criado no Supabase

**Solução**:
1. Acesse o painel do Supabase
2. Vá em **Storage**
3. Clique em **New bucket**
4. Nome: `media`
5. Marque **Public bucket**
6. Configure as políticas de acesso

### Imagens não carregam

**Causa**: Políticas de storage não configuradas

**Solução**:
1. Vá em Storage → media → Policies
2. Crie política "Public Access" para SELECT
3. Crie política "Authenticated Upload" para INSERT
4. Veja detalhes em [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## 📊 Comparação: Antes vs Depois

### Antes (MongoDB)

```
┌─────────────────┐
│   MongoDB       │
│   (Local/Atlas) │
└────────┬────────┘
         │
         │
┌────────▼────────┐
│  Payload CMS    │
│  + Next.js      │
└────────┬────────┘
         │
         │
┌────────▼────────┐
│  Local Files    │
│  (public/)      │
└─────────────────┘
```

### Depois (Supabase)

```
┌─────────────────┐
│   PostgreSQL    │
│   (Supabase)    │
└────────┬────────┘
         │
         │
┌────────▼────────┐
│  Payload CMS    │
│  + Next.js      │
└────────┬────────┘
         │
         │
┌────────▼────────┐
│  S3 Storage     │
│  (Supabase)     │
└─────────────────┘
```

## 🎯 Vantagens da Migração

### PostgreSQL vs MongoDB

- ✅ **Relações mais fortes**: Foreign keys e constraints
- ✅ **Queries mais complexas**: JOINs nativos
- ✅ **ACID completo**: Transações mais robustas
- ✅ **Ferramentas melhores**: pgAdmin, DataGrip, etc.
- ✅ **Escalabilidade**: Melhor para dados relacionais

### Supabase Storage vs Local Files

- ✅ **CDN global**: Imagens carregam mais rápido
- ✅ **Backup automático**: Sem risco de perder arquivos
- ✅ **Escalável**: Sem limite de espaço
- ✅ **Seguro**: Políticas de acesso granulares
- ✅ **Otimização**: Redimensionamento automático

### Supabase vs MongoDB Atlas

- ✅ **Tudo em um**: Database + Storage + Auth
- ✅ **Gratuito**: 500MB database + 1GB storage
- ✅ **Dashboard melhor**: Interface mais intuitiva
- ✅ **Realtime**: WebSockets nativos
- ✅ **Edge Functions**: Serverless functions incluídas

## 📚 Recursos

- [Documentação Supabase](https://supabase.com/docs)
- [Payload PostgreSQL Adapter](https://payloadcms.com/docs/database/postgres)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## 🆘 Suporte

Se encontrar problemas:

1. Consulte [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
2. Verifique os logs: `npm run dev`
3. Verifique o Supabase Dashboard → Logs
4. Abra uma issue no repositório

---

**✨ Boa sorte com a migração!**




