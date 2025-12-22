# 🚀 Guia de Deploy - EdaShow

## 📋 Pré-requisitos

Antes de fazer o deploy, você precisa:

1. ✅ Conta no GitHub
2. ✅ Conta no Vercel (pode usar login do GitHub)
3. ✅ Projeto Supabase configurado (para produção)

---

## 🔐 Passo 1: Autenticar no GitHub

Execute no terminal:

```bash
gh auth login
```

Siga as instruções:
- Escolha `GitHub.com`
- Escolha `HTTPS`
- Escolha `Login with a web browser`
- Copie o código e cole no navegador

---

## 📤 Passo 2: Fazer Push para o GitHub

```bash
git add .
git commit -m "Preparando para deploy no Vercel"
git push origin main
```

---

## 🗄️ Passo 3: Configurar Supabase (Produção)

1. Acesse [Supabase](https://supabase.com)
2. Crie um projeto (se ainda não tiver)
3. Configure o bucket `media` no Storage
4. Configure as políticas de acesso
5. Copie todas as credenciais necessárias

> 📖 **Guia completo**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

---

## 🌐 Passo 4: Deploy no Vercel

### Opção A: Via CLI (Recomendado)

```bash
# Login no Vercel
vercel login

# Deploy
vercel
```

Siga as instruções:
- Confirme o projeto
- Escolha o escopo (sua conta)
- Confirme as configurações

### Opção B: Via Dashboard do Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Importe o repositório do GitHub: `soumarcosdesouza/edashow`
4. Configure as variáveis de ambiente (veja abaixo)
5. Clique em "Deploy"

---

## 🔧 Passo 5: Configurar Variáveis de Ambiente no Vercel

No dashboard do Vercel ou durante o deploy via CLI, adicione:

```bash
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
PAYLOAD_SECRET=seu-secret-super-seguro-aqui-minimo-32-caracteres

# Next.js
NEXT_PUBLIC_SERVER_URL=https://seu-projeto.vercel.app
```

**⚠️ IMPORTANTE:**
- Gere um `PAYLOAD_SECRET` forte (pode usar: `openssl rand -base64 32`)
- Use as credenciais do Supabase (veja [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))
- Atualize `NEXT_PUBLIC_SERVER_URL` com a URL do Vercel

---

## 🎯 Comandos Rápidos

### Deploy via CLI:

```bash
# Deploy para produção
vercel --prod

# Deploy para preview
vercel

# Ver logs
vercel logs

# Listar deploys
vercel ls
```

### Atualizar variáveis de ambiente:

```bash
vercel env add PAYLOAD_SECRET
vercel env add DATABASE_URI
vercel env add NEXT_PUBLIC_SERVER_URL
```

---

## 🔍 Verificar Deploy

Após o deploy, verifique:

1. ✅ Site carregando: `https://seu-projeto.vercel.app`
2. ✅ Admin do Payload: `https://seu-projeto.vercel.app/admin`
3. ✅ API funcionando: `https://seu-projeto.vercel.app/api/posts`

---

## 🐛 Troubleshooting

### Erro de autenticação no GitHub:
```bash
gh auth logout
gh auth login
```

### Erro de build no Vercel:
- Verifique se todas as variáveis de ambiente estão configuradas
- Verifique os logs no dashboard do Vercel
- Certifique-se que o MongoDB Atlas está acessível

### Erro de conexão com MongoDB:
- Verifique se o IP está na whitelist do Atlas
- Verifique se a connection string está correta
- Teste a conexão localmente primeiro

---

## 📚 Recursos Úteis

- [Documentação do Vercel](https://vercel.com/docs)
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Payload CMS](https://payloadcms.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)

---

## 🎉 Pronto!

Seu projeto EdaShow está agora no ar! 🚀

Para atualizações futuras, basta fazer:

```bash
git add .
git commit -m "Suas alterações"
git push origin main
```

O Vercel vai automaticamente fazer o redeploy! ✨












