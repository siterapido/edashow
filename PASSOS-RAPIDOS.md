# 🚀 Passos Rápidos para Deploy

## ✅ Status Atual

- ✅ Projeto preparado para deploy
- ✅ Arquivos de configuração criados (vercel.json, .gitignore)
- ✅ Commit feito localmente
- ✅ Vercel CLI autenticado (marckexpert1-2601)
- ⚠️ Pendente: Push para GitHub
- ⚠️ Pendente: Deploy no Vercel

---

## 📤 PASSO 1: Enviar para GitHub

Você precisa autenticar com a conta correta do GitHub. Execute:

```bash
gh auth login
```

**Instruções:**
1. Escolha: `GitHub.com`
2. Escolha: `HTTPS`
3. Escolha: `Login with a web browser`
4. Copie o código que aparecer
5. Cole no navegador e autorize

**Depois, faça o push:**

```bash
cd /Users/marcosalexandre/edashow-1
git push origin main
```

---

## 🌐 PASSO 2: Deploy no Vercel

Após o push para o GitHub, execute:

```bash
cd /Users/marcosalexandre/edashow-1
vercel
```

**Durante o processo, você será perguntado:**

1. `Set up and deploy "~/edashow-1"?` → Digite: **Y**
2. `Which scope do you want to deploy to?` → Escolha sua conta
3. `Link to existing project?` → Digite: **N** (primeira vez)
4. `What's your project's name?` → Digite: **edashow** (ou deixe o padrão)
5. `In which directory is your code located?` → Pressione **Enter** (./​)

---

## 🔧 PASSO 3: Configurar Variáveis de Ambiente

Após o primeiro deploy, configure as variáveis:

```bash
# Gere um secret seguro
openssl rand -base64 32

# Adicione as variáveis
vercel env add PAYLOAD_SECRET
vercel env add DATABASE_URI
vercel env add NEXT_PUBLIC_SERVER_URL
```

**Valores necessários:**

1. **PAYLOAD_SECRET**: Use o valor gerado pelo comando `openssl rand -base64 32`
2. **DATABASE_URI**: Sua connection string do MongoDB Atlas
   - Formato: `mongodb+srv://username:password@cluster.mongodb.net/edashow?retryWrites=true&w=majority`
3. **NEXT_PUBLIC_SERVER_URL**: URL do Vercel (será fornecida após o deploy)
   - Formato: `https://edashow.vercel.app`

**Para cada variável, escolha:**
- Environment: **Production, Preview, Development** (todas)

---

## 🎯 PASSO 4: Deploy Final para Produção

Após configurar as variáveis, faça o deploy final:

```bash
vercel --prod
```

---

## 📋 MongoDB Atlas - Configuração Rápida

Se ainda não tiver MongoDB Atlas configurado:

1. Acesse: https://www.mongodb.com/cloud/atlas
2. Crie conta gratuita
3. Crie um cluster (Free Tier - M0)
4. Database Access → Add New User
   - Username: `edashow`
   - Password: (gere uma senha forte)
5. Network Access → Add IP Address
   - Escolha: `Allow Access from Anywhere` (0.0.0.0/0)
6. Clusters → Connect → Connect your application
   - Copie a connection string
   - Substitua `<password>` pela senha do usuário
   - Substitua `<database>` por `edashow`

---

## 🎉 Verificação Final

Após o deploy, teste:

1. **Site principal**: https://seu-projeto.vercel.app
2. **Admin Payload**: https://seu-projeto.vercel.app/admin
3. **API Posts**: https://seu-projeto.vercel.app/api/posts

---

## 🆘 Comandos Úteis

```bash
# Ver status do deploy
vercel ls

# Ver logs em tempo real
vercel logs

# Abrir projeto no navegador
vercel open

# Ver domínios
vercel domains ls

# Remover deploy
vercel remove [deployment-url]
```

---

## 📞 Suporte

Se tiver problemas:

1. Verifique os logs: `vercel logs`
2. Verifique as variáveis: `vercel env ls`
3. Consulte o arquivo DEPLOY.md para troubleshooting detalhado

---

**Boa sorte com o deploy! 🚀**












