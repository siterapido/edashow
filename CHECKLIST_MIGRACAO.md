# ✅ Checklist de Migração - MongoDB → Supabase

Use este checklist para acompanhar o progresso da migração.

## 📋 Status Geral

- [ ] **Migração iniciada**
- [ ] **Supabase configurado**
- [ ] **Dados migrados** (se aplicável)
- [ ] **Imagens migradas**
- [ ] **Testes realizados**
- [ ] **Migração concluída**

---

## 🔧 Fase 1: Preparação (Automática - Concluída)

- [x] Remover dependência `@payloadcms/db-mongodb`
- [x] Manter configuração PostgreSQL adapter
- [x] Criar script `export-mongodb.ts`
- [x] Criar script `import-to-postgres.ts`
- [x] Atualizar documentação
- [x] Criar guia do Supabase
- [x] Adicionar scripts NPM

**Status**: ✅ **CONCLUÍDO AUTOMATICAMENTE**

---

## 🚀 Fase 2: Configuração do Supabase (Manual)

### 2.1 Criar Projeto

- [ ] Acessar [supabase.com](https://supabase.com)
- [ ] Criar conta (se necessário)
- [ ] Clicar em "New Project"
- [ ] Preencher dados:
  - [ ] Nome do projeto
  - [ ] Senha do banco (⚠️ **GUARDAR SENHA!**)
  - [ ] Região (ex: South America)
- [ ] Aguardar criação do projeto (2-3 minutos)

### 2.2 Obter Credenciais

#### Database
- [ ] Settings → Database
- [ ] Copiar **Connection string** (URI)
- [ ] Substituir `[YOUR-PASSWORD]` pela senha real

#### API Keys
- [ ] Settings → API
- [ ] Copiar **Project URL**
- [ ] Copiar **anon public** key
- [ ] Copiar **service_role** key

#### Storage S3
- [ ] Settings → Storage
- [ ] Copiar **Endpoint**
- [ ] Copiar **Access Key ID**
- [ ] Copiar **Secret Access Key**
- [ ] Copiar **Region**

### 2.3 Criar Bucket de Storage

- [ ] Ir em **Storage** (menu lateral)
- [ ] Clicar em **"New bucket"**
- [ ] Nome: `media`
- [ ] Marcar **"Public bucket"**
- [ ] Clicar em **"Create bucket"**

### 2.4 Configurar Políticas de Acesso

#### Política 1: Leitura Pública
- [ ] Clicar no bucket `media`
- [ ] Aba **"Policies"**
- [ ] **"New policy"** → **"For full customization"**
- [ ] Nome: `Public Access`
- [ ] Operation: `SELECT`
- [ ] Policy: `bucket_id = 'media'`
- [ ] Salvar

#### Política 2: Upload Autenticado
- [ ] **"New policy"** → **"For full customization"**
- [ ] Nome: `Authenticated Upload`
- [ ] Operation: `INSERT`
- [ ] Policy: `bucket_id = 'media' AND auth.role() = 'authenticated'`
- [ ] Salvar

#### Política 3: Delete Autenticado (Opcional)
- [ ] **"New policy"** → **"For full customization"**
- [ ] Nome: `Authenticated Delete`
- [ ] Operation: `DELETE`
- [ ] Policy: `bucket_id = 'media' AND auth.role() = 'authenticated'`
- [ ] Salvar

### 2.5 Atualizar .env

- [ ] Abrir arquivo `.env` na raiz do projeto
- [ ] Atualizar `DATABASE_URI` com a connection string
- [ ] Atualizar `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Atualizar `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Atualizar `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Atualizar `SUPABASE_BUCKET` (deve ser `media`)
- [ ] Atualizar `SUPABASE_REGION`
- [ ] Atualizar `SUPABASE_ENDPOINT`
- [ ] Atualizar `SUPABASE_ACCESS_KEY_ID`
- [ ] Atualizar `SUPABASE_SECRET_ACCESS_KEY`
- [ ] Gerar e adicionar `PAYLOAD_SECRET` (32+ caracteres)

**Status**: ⏳ **AGUARDANDO AÇÃO**

---

## 🧪 Fase 3: Testar Conexão

- [ ] Executar: `npm run test:db`
- [ ] Verificar mensagem: `✅ Connected successfully!`
- [ ] Se erro, revisar [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

**Status**: ⏳ **AGUARDANDO AÇÃO**

---

## 📦 Fase 4: Migração de Dados (Opcional)

**⚠️ Somente se você tem dados no MongoDB para migrar**

### 4.1 Verificar MongoDB

- [ ] MongoDB está instalado?
- [ ] MongoDB está rodando? (`brew services list`)
- [ ] Se não, iniciar: `brew services start mongodb-community`

### 4.2 Exportar Dados

- [ ] Adicionar no `.env`: `MONGODB_URI=mongodb://localhost:27017/edashow`
- [ ] Executar: `npm run export:mongodb`
- [ ] Verificar backup em: `mongodb-backup/backup-YYYY-MM-DD/`
- [ ] Verificar arquivos JSON criados

### 4.3 Inicializar PostgreSQL

- [ ] Executar: `npm run dev`
- [ ] Aguardar mensagem: `✓ Ready in X.Xs`
- [ ] Parar servidor: `Ctrl+C`
- [ ] Verificar no Supabase: Tables foram criadas?

### 4.4 Importar Dados

- [ ] Executar: `npm run import:postgres`
- [ ] Verificar estatísticas da importação
- [ ] Verificar se há erros
- [ ] Se erros, consultar [MIGRACAO_MONGODB_SUPABASE.md](./MIGRACAO_MONGODB_SUPABASE.md)

**Status**: ⏳ **AGUARDANDO AÇÃO** (ou ⏭️ **PULADO** se não houver MongoDB)

---

## 🖼️ Fase 5: Migração de Imagens

### 5.1 Verificar Imagens Locais

- [ ] Existe pasta `public/uploads/`?
- [ ] Existe pasta `public/sponsors/`?
- [ ] Existem imagens na raiz de `public/`?

### 5.2 Executar Migração

- [ ] Executar: `npm run migrate:images`
- [ ] Aguardar upload de todas as imagens
- [ ] Verificar mensagem: `✨ Migração concluída!`

### 5.3 Verificar no Supabase

- [ ] Acessar Supabase Dashboard
- [ ] Ir em **Storage** → **media**
- [ ] Verificar se as imagens foram enviadas
- [ ] Clicar em uma imagem e copiar URL pública
- [ ] Abrir URL em nova aba - imagem deve carregar

**Status**: ⏳ **AGUARDANDO AÇÃO**

---

## ✅ Fase 6: Testes e Validação

### 6.1 Iniciar Servidor

- [ ] Executar: `npm run dev`
- [ ] Aguardar: `✓ Ready in X.Xs`
- [ ] Servidor rodando em: http://localhost:3000

### 6.2 Testar Admin Panel

- [ ] Acessar: http://localhost:3000/admin
- [ ] Criar primeiro usuário admin (se necessário)
- [ ] Login funcionou?
- [ ] Dashboard carrega?

### 6.3 Testar Collections

#### Categories
- [ ] Acessar "Categories"
- [ ] Ver categorias existentes (se migrou dados)
- [ ] Criar nova categoria
- [ ] Editar categoria
- [ ] Deletar categoria de teste

#### Columnists
- [ ] Acessar "Columnists"
- [ ] Ver colunistas existentes (se migrou dados)
- [ ] Criar novo colunista
- [ ] Upload de foto funciona?
- [ ] Editar colunista

#### Media
- [ ] Acessar "Media"
- [ ] Ver imagens existentes
- [ ] Upload de nova imagem funciona?
- [ ] Imagem carrega do Supabase?
- [ ] URL da imagem é do Supabase?

#### Posts
- [ ] Acessar "Posts"
- [ ] Ver posts existentes (se migrou dados)
- [ ] Criar novo post
- [ ] Adicionar imagem destacada
- [ ] Associar categoria
- [ ] Associar autor
- [ ] Salvar post
- [ ] Editar post
- [ ] Preview funciona?

#### Events
- [ ] Acessar "Events"
- [ ] Ver eventos existentes (se migrou dados)
- [ ] Criar novo evento
- [ ] Upload de imagem funciona?
- [ ] Adicionar palestrantes
- [ ] Adicionar patrocinadores
- [ ] Salvar evento

#### Sponsors
- [ ] Acessar "Sponsors"
- [ ] Ver patrocinadores existentes
- [ ] Criar novo patrocinador
- [ ] Upload de logo funciona?
- [ ] Logo carrega do Supabase?

#### Newsletter Subscribers
- [ ] Acessar "Newsletter Subscribers"
- [ ] Ver inscritos (se houver)
- [ ] Adicionar novo inscrito

### 6.4 Testar Globals

#### Site Settings
- [ ] Acessar "Site Settings"
- [ ] Ver configurações existentes
- [ ] Editar nome do site
- [ ] Upload de logo funciona?
- [ ] Atualizar redes sociais
- [ ] Salvar

#### Header
- [ ] Acessar "Header"
- [ ] Ver navegação existente
- [ ] Adicionar novo link
- [ ] Salvar

#### Footer
- [ ] Acessar "Footer"
- [ ] Ver links existentes
- [ ] Editar copyright
- [ ] Salvar

### 6.5 Testar Frontend

- [ ] Acessar: http://localhost:3000
- [ ] Homepage carrega?
- [ ] Imagens carregam?
- [ ] Posts aparecem?
- [ ] Clicar em um post - página carrega?
- [ ] Imagens do post carregam?
- [ ] Acessar: http://localhost:3000/posts
- [ ] Lista de posts carrega?
- [ ] Acessar: http://localhost:3000/events
- [ ] Lista de eventos carrega?
- [ ] Newsletter subscription funciona?

### 6.6 Testar Performance

- [ ] Imagens carregam rápido?
- [ ] Páginas carregam rápido?
- [ ] Admin é responsivo?
- [ ] Frontend é responsivo?

**Status**: ⏳ **AGUARDANDO AÇÃO**

---

## 🎉 Fase 7: Conclusão

### 7.1 Limpeza (Opcional)

- [ ] Remover `MONGODB_URI` do `.env` (se adicionou)
- [ ] Parar MongoDB: `brew services stop mongodb-community`
- [ ] Manter backup em `mongodb-backup/` (por segurança)

### 7.2 Documentação

- [ ] Ler [README.md](./README.md) atualizado
- [ ] Ler [COMO_COMECAR.md](./COMO_COMECAR.md) atualizado
- [ ] Bookmark [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para referência

### 7.3 Deploy (Opcional)

- [ ] Seguir [DEPLOY.md](./DEPLOY.md)
- [ ] Configurar variáveis no Vercel
- [ ] Deploy em produção
- [ ] Testar produção

**Status**: ⏳ **AGUARDANDO AÇÃO**

---

## 📊 Resumo Final

### Checklist Geral

- [ ] ✅ Fase 1: Preparação (Automática)
- [ ] 🚀 Fase 2: Configuração do Supabase
- [ ] 🧪 Fase 3: Testar Conexão
- [ ] 📦 Fase 4: Migração de Dados (Opcional)
- [ ] 🖼️ Fase 5: Migração de Imagens
- [ ] ✅ Fase 6: Testes e Validação
- [ ] 🎉 Fase 7: Conclusão

### Tempo Estimado

- **Configuração Supabase**: 15-20 minutos
- **Migração de Dados**: 10-15 minutos (se aplicável)
- **Testes**: 15-20 minutos
- **Total**: 40-55 minutos

### Próximos Passos

1. [ ] Começar pela Fase 2: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
2. [ ] Seguir este checklist em ordem
3. [ ] Marcar cada item conforme completa
4. [ ] Consultar documentação em caso de dúvidas

---

## 🆘 Ajuda

Se encontrar problemas:

1. **Consulte a documentação**:
   - [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Configuração
   - [MIGRACAO_MONGODB_SUPABASE.md](./MIGRACAO_MONGODB_SUPABASE.md) - Migração
   - [INDEX_DOCUMENTACAO.md](./INDEX_DOCUMENTACAO.md) - Índice geral

2. **Verifique os logs**:
   ```bash
   npm run dev  # Logs do servidor
   ```

3. **Verifique o Supabase**:
   - Dashboard → Logs
   - Dashboard → Database
   - Dashboard → Storage

4. **Comandos úteis**:
   ```bash
   npm run test:db        # Testar conexão
   npm run check:env      # Verificar variáveis
   ```

---

**💡 Dica**: Imprima este checklist ou mantenha-o aberto enquanto realiza a migração!

**📖 Próximo passo**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)



