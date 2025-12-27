# 🚀 Deploy Imediato - EdaShow

## ✅ Status: Pronto para Deploy!

A nova senha do banco de dados foi atualizada em todos os arquivos necessários.

### Nova DATABASE_URI:
```
postgresql://postgres.exeuuqbgyfaxgbwygfuu:hRfmIWdaZtIyeJYh@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

---

## 🎯 3 Opções de Deploy

### Opção 1: Script Automático (⚡ Mais Rápido)

```bash
# 1. Dar permissão ao script
chmod +x scripts/quick-setup-vercel.sh

# 2. Executar o script (configura as variáveis automaticamente)
./scripts/quick-setup-vercel.sh

# 3. Fazer deploy
vercel --prod
```

### Opção 2: Dashboard da Vercel (👁️ Mais Visual)

1. **Acesse**: https://vercel.com/insightfy/edashow/settings/environment-variables

2. **Adicione estas 3 variáveis**:

| Variável | Valor | Ambiente |
|----------|-------|----------|
| `DATABASE_URI` | `postgresql://postgres.exeuuqbgyfaxgbwygfuu:hRfmIWdaZtIyeJYh@aws-0-sa-east-1.pooler.supabase.com:6543/postgres` | Production |
| `PAYLOAD_SECRET` | `fK+TGJAdOgcaLxYgOGhLqeXizTAcFiZwS7hriJbShsA=` | Production |
| `NEXT_PUBLIC_SERVER_URL` | `https://www.edashow.com.br` | Production |

3. **Faça Redeploy**: 
   - Vá em "Deployments"
   - Clique nos 3 pontos do último deploy
   - Clique em "Redeploy"

### Opção 3: CLI Manual (🔧 Controle Total)

```bash
# 1. Configurar DATABASE_URI
echo "postgresql://postgres.exeuuqbgyfaxgbwygfuu:hRfmIWdaZtIyeJYh@aws-0-sa-east-1.pooler.supabase.com:6543/postgres" | vercel env add DATABASE_URI production

# 2. Configurar PAYLOAD_SECRET
echo "fK+TGJAdOgcaLxYgOGhLqeXizTAcFiZwS7hriJbShsA=" | vercel env add PAYLOAD_SECRET production

# 3. Configurar NEXT_PUBLIC_SERVER_URL
echo "https://www.edashow.com.br" | vercel env add NEXT_PUBLIC_SERVER_URL production

# 4. Fazer deploy
vercel --prod
```

---

## 📋 Após o Deploy (2-5 minutos)

### 1. Verificar se o site está no ar
```
✅ Site: https://www.edashow.com.br
```

### 2. Acessar o Admin do Payload CMS
```
✅ Admin: https://www.edashow.com.br/admin
```

### 3. Criar Primeiro Usuário Admin

No primeiro acesso ao `/admin`, você verá a tela de criação de usuário:

1. **Nome**: Seu nome completo
2. **Email**: seu@email.com
3. **Senha**: Escolha uma senha forte
4. **Role**: Selecione **Admin**
5. Clique em **Create**

### 4. Começar a Usar! 🎉

Após criar o usuário admin, você pode:

- ✅ **Criar Categorias**: `/admin/collections/categories`
- ✅ **Criar Posts**: `/admin/collections/posts`
- ✅ **Adicionar Colunistas**: `/admin/collections/columnists`
- ✅ **Gerenciar Eventos**: `/admin/collections/events`
- ✅ **Upload de Imagens**: `/admin/collections/media`
- ✅ **Configurar Site**: `/admin/globals/site-settings`

---

## 🔍 Verificar Configuração

### Listar Variáveis Configuradas
```bash
vercel env ls
```

Você deve ver:
- ✅ `DATABASE_URI` (Production)
- ✅ `PAYLOAD_SECRET` (Production)
- ✅ `NEXT_PUBLIC_SERVER_URL` (Production)

### Ver Logs do Deploy
```bash
vercel logs --follow
```

### Testar API
```bash
curl https://www.edashow.com.br/api/posts
```

---

## 🐛 Problemas Comuns

### ❌ Erro: "Database connection failed"

**Causa**: Senha incorreta ou banco inacessível

**Solução**:
1. Verifique se a senha está correta: `hRfmIWdaZtIyeJYh`
2. Teste a conexão no Supabase Dashboard
3. Verifique se não há firewall bloqueando

### ❌ Erro: "PAYLOAD_SECRET is required"

**Causa**: Variável não configurada

**Solução**:
1. Configure `PAYLOAD_SECRET` na Vercel
2. Faça redeploy após adicionar

### ❌ Build falhou

**Causa**: Erro no código ou variáveis faltando

**Solução**:
1. Veja os logs: `vercel logs`
2. Verifique se todas as 3 variáveis estão configuradas
3. Tente fazer redeploy

### ❌ Admin não carrega

**Causa**: `NEXT_PUBLIC_SERVER_URL` incorreta

**Solução**:
1. Verifique se está configurada como `https://www.edashow.com.br`
2. Limpe o cache do navegador
3. Faça redeploy

---

## 📦 Variáveis Opcionais (Upload de Imagens)

Para habilitar upload de imagens no admin, configure também:

```bash
# Supabase Storage (opcional)
vercel env add SUPABASE_ENDPOINT production
# Valor: https://exeuuqbgyfaxgbwygfuu.supabase.co/storage/v1/s3

vercel env add SUPABASE_REGION production
# Valor: us-east-1

vercel env add SUPABASE_BUCKET production
# Valor: media

vercel env add SUPABASE_ACCESS_KEY_ID production
# Obter em: Supabase Dashboard → Settings → Storage → S3 Access Keys

vercel env add SUPABASE_SECRET_ACCESS_KEY production
# Obter em: Supabase Dashboard → Settings → Storage → S3 Access Keys
```

**Nota**: O site e admin funcionam perfeitamente sem essas variáveis. Você pode configurá-las depois.

---

## 🎯 Checklist Final

- [ ] Variáveis configuradas na Vercel (3 obrigatórias)
- [ ] Deploy realizado com sucesso
- [ ] Site acessível em https://www.edashow.com.br
- [ ] Admin acessível em https://www.edashow.com.br/admin
- [ ] Primeiro usuário admin criado
- [ ] Categorias criadas
- [ ] Primeiro post publicado

---

## 🔗 Links Úteis

- 📊 **Dashboard Vercel**: https://vercel.com/insightfy/edashow
- 🔧 **Variáveis de Ambiente**: https://vercel.com/insightfy/edashow/settings/environment-variables
- 🌐 **Site**: https://www.edashow.com.br
- 🔐 **Admin**: https://www.edashow.com.br/admin
- 📡 **API Posts**: https://www.edashow.com.br/api/posts

---

## 💡 Dicas

### Deploy Automático via GitHub

Configure deploy automático:
```bash
# Qualquer push para main faz deploy automaticamente
git add .
git commit -m "feat: atualiza senha do banco de dados"
git push origin main
```

A Vercel detectará o push e fará deploy automaticamente! 🚀

### Domínio Customizado

Se ainda não configurou o domínio `www.edashow.com.br`:

1. Acesse: https://vercel.com/insightfy/edashow/settings/domains
2. Adicione: `www.edashow.com.br`
3. Configure DNS no seu provedor de domínio
4. Aguarde propagação (pode levar até 48h)

---

## ✨ Resumo

**O que foi feito**:
- ✅ Senha do banco atualizada em todos os arquivos
- ✅ Scripts de configuração atualizados
- ✅ Código verificado (sem senhas hardcoded)
- ✅ Documentação completa criada

**O que você precisa fazer**:
1. Escolher uma das 3 opções de deploy acima
2. Configurar as 3 variáveis obrigatórias na Vercel
3. Fazer o deploy
4. Criar o primeiro usuário admin
5. Começar a usar! 🎉

---

**Última atualização**: 24/12/2025
**Senha do Banco**: `hRfmIWdaZtIyeJYh` ✅
**Status**: Pronto para Deploy! 🚀






