# 🔧 Como Configurar DATABASE_URI

## 📋 Informações do seu Projeto Supabase

- **Projeto**: `exeuuqbgyfaxgbwygfuu`
- **Host**: `aws-1-sa-east-1.pooler.supabase.com`
- **Porta**: `5432`
- **Database**: `postgres`
- **User**: `postgres.exeuuqbgyfaxgbwygfuu`

## 🚀 Opções para Configurar

### Opção 1: Script Interativo (Recomendado)

```bash
./scripts/configurar-database-uri.sh
```

O script vai pedir a senha interativamente (ela não será exibida na tela por segurança).

### Opção 2: Script com Senha como Argumento

```bash
./scripts/configurar-database-uri-com-senha.sh [SUA-SENHA-AQUI]
```

**Exemplo:**
```bash
./scripts/configurar-database-uri-com-senha.sh minhaSenha123
```

### Opção 3: Via Variável de Ambiente

```bash
SUPABASE_PASSWORD=[SUA-SENHA] ./scripts/configurar-database-uri-com-senha.sh
```

### Opção 4: Manualmente via Vercel CLI

```bash
vercel env add DATABASE_URI production
```

Quando solicitado, cole a connection string completa:

```
postgresql://postgres.exeuuqbgyfaxgbwygfuu:[SUA-SENHA]@aws-1-sa-east-1.pooler.supabase.com:5432/postgres
```

**Substitua `[SUA-SENHA]` pela senha real.**

## 🔐 Como Obter a Senha do Supabase

1. **Acesse**: https://supabase.com/dashboard
2. **Selecione** seu projeto: `exeuuqbgyfaxgbwygfuu`
3. **Vá em**: Settings → Database
4. **Encontre**: Database Password

### Se não lembra a senha:

1. Vá em **Settings** → **Database**
2. Clique em **"Reset Database Password"**
3. ⚠️ **COPIE A SENHA IMEDIATAMENTE** (ela só aparece uma vez!)
4. Use a senha copiada em um dos métodos acima

## ✅ Após Configurar

1. **Verificar variáveis:**
   ```bash
   vercel env ls
   ```

2. **Fazer redeploy:**
   ```bash
   vercel --prod
   ```

3. **Verificar logs:**
   ```bash
   vercel logs --follow
   ```

## 📝 Exemplo Completo

```bash
# 1. Obter senha do Supabase (via dashboard)
# 2. Executar script com a senha
./scripts/configurar-database-uri-com-senha.sh minhaSenhaSuperSegura123

# 3. Verificar
vercel env ls

# 4. Fazer deploy
vercel --prod
```

## 🔒 Segurança

- ⚠️ **Nunca** commite a senha no Git
- ⚠️ A senha é armazenada de forma **criptografada** na Vercel
- ⚠️ Use apenas em scripts locais ou variáveis de ambiente locais

---

**Dica**: Se preferir, você pode executar o script interativo que pede a senha de forma segura (sem exibir na tela).






