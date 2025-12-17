# 🎭 EdaShow - Plataforma de Eventos

Uma plataforma moderna para gerenciamento e divulgação de eventos, construída com Next.js 16, Payload CMS e MongoDB.

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

- 📖 **[PASSOS-RAPIDOS.md](./PASSOS-RAPIDOS.md)** - Guia passo a passo resumido
- 📘 **[DEPLOY.md](./DEPLOY.md)** - Documentação completa de deploy
- 🔧 **[.env.example](./.env.example)** - Exemplo de variáveis de ambiente

---

## 🛠️ Tecnologias

- **Framework**: Next.js 16
- **CMS**: Payload CMS 3.x
- **Database**: MongoDB
- **UI**: React 19, Tailwind CSS 4, Radix UI
- **Deploy**: Vercel

---

## 💻 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Iniciar servidor de desenvolvimento
npm run dev
```

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
PAYLOAD_SECRET=seu-secret-aqui
DATABASE_URI=mongodb://localhost:27017/edashow
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### Produção (Vercel)

```env
PAYLOAD_SECRET=secret-super-seguro-gerado
DATABASE_URI=mongodb+srv://user:pass@cluster.mongodb.net/edashow
NEXT_PUBLIC_SERVER_URL=https://seu-projeto.vercel.app
```

---

## 🗄️ MongoDB Atlas

Para produção, você precisa de um banco MongoDB Atlas:

1. Crie conta em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster gratuito (M0)
3. Configure usuário e senha
4. Adicione IP à whitelist (0.0.0.0/0 para permitir todos)
5. Copie a connection string

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
- [Documentação Vercel](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)

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
