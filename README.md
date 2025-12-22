# 🎭 EdaShow - Plataforma de Eventos

Uma plataforma moderna para gerenciamento e divulgação de eventos, construída com Next.js 15, Payload CMS e Supabase PostgreSQL.

## 🚀 Deploy Rápido

### Opção 1: Script Automático (Recomendado)

```bash
./deploy.sh
```

### Opção 2: Manual

#### 1️⃣ Autenticar no GitHub

```bash
gh auth logout
gh auth login
```

Escolha:
- `GitHub.com`
- `HTTPS`
- `Login with a web browser`

#### 2️⃣ Enviar para GitHub

```bash
git push origin main
```

#### 3️⃣ Deploy no Vercel

```bash
vercel --prod
```

#### 4️⃣ Configurar Variáveis de Ambiente

```bash
# Gerar secret
openssl rand -base64 32

# Adicionar variáveis
vercel env add PAYLOAD_SECRET
vercel env add DATABASE_URI
vercel env add NEXT_PUBLIC_SERVER_URL

# Deploy final
vercel --prod
```

---

## 📚 Documentação Completa

- 🚀 **[COMO_COMECAR.md](./COMO_COMECAR.md)** - Guia rápido para começar
- 🔧 **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Configuração completa do Supabase
- 📖 **[PASSOS-RAPIDOS.md](./PASSOS-RAPIDOS.md)** - Guia passo a passo resumido
- 📘 **[DEPLOY.md](./DEPLOY.md)** - Documentação completa de deploy
- 🔧 **[.env.example](./.env.example)** - Exemplo de variáveis de ambiente

---

## 🛠️ Tecnologias

- **Framework**: Next.js 15
- **CMS**: Payload CMS 3.x
- **Database**: PostgreSQL (Supabase)
- **Storage**: Supabase S3
- **UI**: React 19, Tailwind CSS 4, Radix UI
- **Deploy**: Vercel

---

## 💻 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar Supabase
# Siga o guia completo: SUPABASE_SETUP.md

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do Supabase

# Iniciar servidor de desenvolvimento
npm run dev
```

> 📖 **Primeira vez?** Consulte [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para configuração completa do Supabase.

Acesse:
- **Site**: http://localhost:3000
- **Admin**: http://localhost:3000/admin

---

## 📦 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run start        # Iniciar produção
npm run lint         # Lint do código
npm run seed:posts   # Popular posts de exemplo
```

---

## 🌍 Variáveis de Ambiente

### Desenvolvimento (`.env`)

```env
# Database
DATABASE_URI=postgresql://postgres.xxxx:[SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Storage
SUPABASE_BUCKET=media
SUPABASE_REGION=us-east-1
SUPABASE_ENDPOINT=https://xxxx.supabase.co/storage/v1/s3
SUPABASE_ACCESS_KEY_ID=xxxx
SUPABASE_SECRET_ACCESS_KEY=xxxx

# Payload
PAYLOAD_SECRET=seu-secret-aqui-minimo-32-caracteres
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### Produção (Vercel)

Use as mesmas variáveis, mas atualize:
- `NEXT_PUBLIC_SERVER_URL=https://seu-projeto.vercel.app`

> 📖 Veja [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para obter todas as credenciais.

---

## 🗄️ Supabase

Para desenvolvimento e produção, você precisa de um projeto Supabase:

1. Crie conta em [Supabase](https://supabase.com)
2. Crie um novo projeto (gratuito)
3. Configure o bucket `media` no Storage
4. Configure as políticas de acesso
5. Copie as credenciais

> 📖 **Guia completo**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

---

## 📋 Estrutura do Projeto

```
edashow/
├── app/                    # Next.js App Router
│   ├── (frontend)/        # Páginas públicas
│   ├── (payload)/         # Admin Payload CMS
│   └── api/               # API Routes
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI
│   └── ...               # Componentes específicos
├── lib/                   # Utilitários
├── payload/              # Configuração Payload CMS
│   ├── collections/      # Coleções (Posts, Users, etc)
│   └── payload.config.ts # Config principal
├── public/               # Arquivos estáticos
└── scripts/              # Scripts auxiliares
```

---

## 🎯 Recursos

- ✅ Sistema de posts com rich text editor
- ✅ Gerenciamento de usuários
- ✅ Upload de imagens
- ✅ SEO otimizado
- ✅ Responsive design
- ✅ Dark mode
- ✅ API REST completa
- ✅ Admin dashboard

---

## 🔗 Links Úteis

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Payload CMS](https://payloadcms.com/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Vercel](https://vercel.com/docs)

---

## 📞 Suporte

Para problemas ou dúvidas:

1. Consulte [DEPLOY.md](./DEPLOY.md) para troubleshooting
2. Verifique os logs: `vercel logs`
3. Verifique as variáveis: `vercel env ls`

---

## 📄 Licença

Este projeto é privado.

---

## 🎉 Pronto para Deploy!

Execute `./deploy.sh` e siga as instruções! 🚀

---

**Desenvolvido com ❤️ usando Next.js e Payload CMS**
