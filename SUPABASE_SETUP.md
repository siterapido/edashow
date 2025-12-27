# 🚀 Configuração do Supabase

Este guia completo irá te ajudar a configurar o Supabase para o projeto EdaShow.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com) (gratuita)
- Node.js instalado
- Git instalado

## 🎯 Passo 1: Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em **"New Project"**
4. Preencha os dados:
   - **Name**: `edashow` (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte e **GUARDE-A** (você vai precisar!)
   - **Region**: Escolha a região mais próxima (ex: `South America (São Paulo)`)
   - **Pricing Plan**: Free (ou Pro se preferir)
5. Clique em **"Create new project"**
6. Aguarde alguns minutos até o projeto ser criado

## 🔑 Passo 2: Obter Credenciais

### 2.1 Database Connection String

1. No painel do Supabase, vá em **Settings** (⚙️) → **Database**
2. Role até a seção **"Connection string"**
3. Selecione a aba **"URI"**
4. Copie a string de conexão (ela será algo como):
   ```
   postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
   ```
5. **IMPORTANTE**: Substitua `[YOUR-PASSWORD]` pela senha que você criou no Passo 1

### 2.2 API Keys

1. No painel do Supabase, vá em **Settings** (⚙️) → **API**
2. Copie as seguintes informações:
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **anon public**: `eyJhbGc...` (chave pública)
   - **service_role**: `eyJhbGc...` (chave privada - **NÃO COMPARTILHE**)

### 2.3 Storage S3 Credentials

1. No painel do Supabase, vá em **Settings** (⚙️) → **Storage**
2. Role até **"S3 Connection"**
3. Copie:
   - **Endpoint**: `https://xxxxxxxxxxxx.supabase.co/storage/v1/s3`
   - **Access Key ID**: `xxxxxxxxxxxxxxxxxxxxxxxx`
   - **Secret Access Key**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Region**: `us-east-1` (ou a região que você escolheu)

## 📦 Passo 3: Criar Bucket de Storage

1. No painel do Supabase, vá em **Storage** (🗂️)
2. Clique em **"New bucket"**
3. Preencha:
   - **Name**: `media`
   - **Public bucket**: ✅ Marque esta opção
4. Clique em **"Create bucket"**

### 3.1 Configurar Políticas de Acesso

1. Clique no bucket `media` que você acabou de criar
2. Vá na aba **"Policies"**
3. Clique em **"New policy"**

#### Política 1: Leitura Pública

1. Clique em **"For full customization"** → **"Create policy"**
2. Preencha:
   - **Policy name**: `Public Access`
   - **Allowed operation**: `SELECT`
   - **Policy definition**: Use o seguinte SQL:
   ```sql
   bucket_id = 'media'
   ```
3. Clique em **"Review"** → **"Save policy"**

#### Política 2: Upload Autenticado

1. Clique em **"New policy"** novamente
2. Clique em **"For full customization"** → **"Create policy"**
3. Preencha:
   - **Policy name**: `Authenticated Upload`
   - **Allowed operation**: `INSERT`
   - **Policy definition**: Use o seguinte SQL:
   ```sql
   bucket_id = 'media' AND auth.role() = 'authenticated'
   ```
4. Clique em **"Review"** → **"Save policy"**

#### Política 3: Delete Autenticado (Opcional)

1. Clique em **"New policy"** novamente
2. Clique em **"For full customization"** → **"Create policy"**
3. Preencha:
   - **Policy name**: `Authenticated Delete`
   - **Allowed operation**: `DELETE`
   - **Policy definition**: Use o seguinte SQL:
   ```sql
   bucket_id = 'media' AND auth.role() = 'authenticated'
   ```
4. Clique em **"Review"** → **"Save policy"**

## ⚙️ Passo 4: Configurar Variáveis de Ambiente

1. Abra o arquivo `.env` na raiz do projeto
2. Atualize com as credenciais que você copiou:

```bash
# ============================================
# DATABASE (PostgreSQL via Supabase)
# ============================================
DATABASE_URI=postgresql://postgres.xxxxxxxxxxxx:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres

# ============================================
# SUPABASE
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# ============================================
# SUPABASE STORAGE (S3)
# ============================================
SUPABASE_BUCKET=media
SUPABASE_REGION=us-east-1
SUPABASE_ENDPOINT=https://xxxxxxxxxxxx.supabase.co/storage/v1/s3
SUPABASE_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ============================================
# PAYLOAD CMS
# ============================================
PAYLOAD_SECRET=sua-chave-secreta-muito-forte-com-pelo-menos-32-caracteres

# ============================================
# NEXT.JS
# ============================================
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### 4.1 Gerar PAYLOAD_SECRET

Execute o seguinte comando para gerar uma chave segura:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado e cole no `PAYLOAD_SECRET`.

## ✅ Passo 5: Testar Conexão

Execute o seguinte comando para testar a conexão com o Supabase:

```bash
npm run test:db
```

Você deve ver:
```
✅ Connected successfully!
Results: { current_database: 'postgres', current_user: 'postgres' }
```

Se houver erro, verifique:
- ✅ A senha está correta na `DATABASE_URI`
- ✅ Não há espaços extras nas variáveis de ambiente
- ✅ O projeto Supabase está ativo (não pausado)

## 🔄 Passo 6: Migração de Dados (Se houver MongoDB)

Se você já tem dados no MongoDB e quer migrá-los:

### 6.1 Exportar Dados do MongoDB

1. Certifique-se de que o MongoDB está rodando:
   ```bash
   brew services start mongodb-community
   ```

2. Adicione a variável `MONGODB_URI` temporariamente no `.env`:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/edashow
   ```

3. Execute a exportação:
   ```bash
   npx tsx scripts/export-mongodb.ts
   ```

4. Os dados serão salvos em `mongodb-backup/backup-YYYY-MM-DD/`

### 6.2 Inicializar Schema PostgreSQL

1. Inicie o servidor Next.js (isso criará as tabelas automaticamente):
   ```bash
   npm run dev
   ```

2. Aguarde até ver a mensagem:
   ```
   ✓ Ready in X.Xs
   ```

3. Pare o servidor (Ctrl+C)

### 6.3 Importar Dados para PostgreSQL

Execute o script de importação:

```bash
npx tsx scripts/import-to-postgres.ts
```

Você verá um resumo da importação:
```
✨ Importação concluída!
✅ X documentos importados
⏭️ X documentos pulados (já existiam)
❌ X documentos falharam
```

### 6.4 Migrar Imagens para Supabase Storage

Execute o script de migração de imagens:

```bash
npx tsx scripts/migrate-to-supabase.ts
```

Isso fará upload de todas as imagens de:
- `public/uploads/`
- `public/sponsors/`
- Imagens na raiz de `public/`

## 🎉 Passo 7: Verificar Instalação

1. Inicie o servidor:
   ```bash
   npm run dev
   ```

2. Acesse o Admin Panel:
   ```
   http://localhost:3000/admin
   ```

3. Crie seu primeiro usuário administrador

4. Teste criando:
   - ✅ Uma categoria
   - ✅ Um colunista
   - ✅ Um post com imagem
   - ✅ Um evento

5. Acesse o frontend:
   ```
   http://localhost:3000
   ```

## 🔍 Verificar Storage

1. Vá no painel do Supabase → **Storage** → **media**
2. Você deve ver as imagens que foram enviadas
3. Clique em uma imagem e copie a URL pública
4. Abra a URL em uma nova aba - a imagem deve carregar

## 🚨 Troubleshooting

### Erro: "Cannot read properties of undefined (reading 'searchParams')"

**Causa**: `DATABASE_URI` está com formato inválido

**Solução**: 
1. Verifique se a URI está no formato correto
2. Certifique-se de que substituiu `[YOUR-PASSWORD]` pela senha real
3. Não deve haver espaços ou quebras de linha na URI

### Erro: "Connection refused"

**Causa**: Projeto Supabase está pausado ou região incorreta

**Solução**:
1. Acesse o painel do Supabase
2. Verifique se o projeto está ativo (não pausado)
3. Aguarde alguns minutos se acabou de criar o projeto

### Erro: "Authentication failed"

**Causa**: Senha incorreta na `DATABASE_URI`

**Solução**:
1. Vá em Settings → Database → Reset Database Password
2. Crie uma nova senha
3. Atualize a `DATABASE_URI` com a nova senha

### Erro: "Bucket not found"

**Causa**: Bucket `media` não foi criado ou nome está incorreto

**Solução**:
1. Vá em Storage no painel do Supabase
2. Verifique se o bucket `media` existe
3. Certifique-se de que `SUPABASE_BUCKET=media` no `.env`

### Imagens não carregam

**Causa**: Políticas de storage não estão configuradas

**Solução**:
1. Vá em Storage → media → Policies
2. Certifique-se de que a política "Public Access" existe
3. Teste acessar uma imagem diretamente pela URL

## 📚 Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Payload CMS Docs](https://payloadcms.com/docs)
- [PostgreSQL Adapter](https://payloadcms.com/docs/database/postgres)

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do servidor (`npm run dev`)
2. Verifique os logs do Supabase (Dashboard → Logs)
3. Consulte a documentação do Payload CMS
4. Abra uma issue no repositório

---

**✨ Pronto! Seu projeto está configurado com Supabase!**




