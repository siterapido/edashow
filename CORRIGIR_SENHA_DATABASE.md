# 🔐 Como Corrigir a Senha do Banco de Dados

## ⚠️ Problema Atual

O erro "password authentication failed for user 'postgres'" indica que a senha no arquivo `.env.local` está incorreta.

## ✅ Solução

### Opção 1: Verificar Senha Existente (se você sabe)

1. Acesse: **https://supabase.com/dashboard**
2. Selecione seu projeto: **`exeuuqbgyfaxgbwygfuu`**
3. Vá em: **Settings** → **Database**
4. Procure por: **Database Password**
5. Se a senha estiver visível, copie-a

### Opção 2: Resetar Senha (Recomendado)

1. Acesse: **https://supabase.com/dashboard**
2. Selecione seu projeto: **`exeuuqbgyfaxgbwygfuu`**
3. Vá em: **Settings** → **Database**
4. Clique em **"Reset Database Password"**
5. ⚠️ **IMPORTANTE**: Copie a nova senha imediatamente (ela só aparece uma vez!)
6. Guarde a senha em um local seguro

### Opção 3: Usar Script Automático

Depois de obter a senha, execute:

```bash
# Substitua [SUA-SENHA] pela senha que você copiou
./scripts/configurar-database-uri-com-senha.sh [SUA-SENHA]
```

## 🔧 Atualizar .env.local Manualmente

1. Abra o arquivo `.env.local` na raiz do projeto
2. Encontre a linha `DATABASE_URI`
3. Substitua a senha na connection string:

```env
DATABASE_URI=postgresql://postgres.exeuuqbgyfaxgbwygfuu:[SUA-SENHA-AQUI]@aws-1-sa-east-1.pooler.supabase.com:5432/postgres
```

**Substitua `[SUA-SENHA-AQUI]` pela senha real do Supabase.**

## ✅ Testar Conexão

Depois de atualizar a senha, teste a conexão:

```bash
npm run test:db
```

Se funcionar, você verá:
```
✅ Connected successfully!
Results: { current_database: 'postgres', current_user: 'postgres.exeuuqbgyfaxgbwygfuu' }
```

## 📝 Formato Correto da Connection String

```
postgresql://postgres.exeuuqbgyfaxgbwygfuu:[SENHA]@aws-1-sa-east-1.pooler.supabase.com:5432/postgres
```

**Componentes:**
- **Usuário**: `postgres.exeuuqbgyfaxgbwygfuu`
- **Senha**: `[SENHA]` ← Você precisa substituir isso
- **Host**: `aws-1-sa-east-1.pooler.supabase.com`
- **Porta**: `5432`
- **Database**: `postgres`

## 🔒 Segurança

- ⚠️ **Nunca** commite o arquivo `.env.local` no Git (já está no .gitignore)
- ⚠️ **Nunca** compartilhe a senha publicamente
- ⚠️ Use apenas em arquivos locais ou variáveis de ambiente seguras

## 🚀 Próximos Passos

Depois de corrigir a senha:
1. Teste a conexão: `npm run test:db`
2. Inicie o servidor: `npm run dev`
3. O erro de autenticação deve estar resolvido






