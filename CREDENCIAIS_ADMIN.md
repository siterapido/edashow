# 🔐 Credenciais de Administrador

## Acesso ao Painel CMS

As credenciais de administrador do sistema estão configuradas e prontas para uso:

### 📧 Email
```
admin@edashow.com.br
```

### 🔑 Senha
```
@Admin2026
```

## 🌐 URLs de Acesso

- **Login**: `https://seudominio.com/login` ou `http://localhost:3000/login`
- **Dashboard**: `https://seudominio.com/cms/dashboard` ou `http://localhost:3000/cms/dashboard`

## ✅ Verificação do Sistema

O sistema foi verificado e confirmado que:

1. ✅ O usuário `admin@edashow.com.br` existe no sistema
2. ✅ O usuário possui a role `admin` na tabela `user_roles`
3. ✅ O perfil do usuário está configurado
4. ✅ O middleware de autenticação protege todas as rotas do CMS
5. ✅ Apenas usuários com roles permitidas podem acessar o painel:
   - `admin` - Acesso total
   - `editor` - Edição de conteúdo
   - `author` - Criação de posts
   - `columnist` - Colunista
   - `contributor` - Contribuidor

## 🛠️ Scripts Úteis

### Criar um novo usuário admin
```bash
npx tsx scripts/create-admin.ts email@exemplo.com SenhaSegura123
```

### Garantir role de admin para usuário existente
```bash
npx tsx scripts/ensure-admin-role.ts email@exemplo.com
```

### Verificar usuário específico
```bash
npx tsx scripts/ensure-admin-role.ts admin@edashow.com.br
```

## 🔒 Segurança

⚠️ **IMPORTANTE**: Após o primeiro acesso, é altamente recomendado:

1. Alterar a senha padrão
2. Configurar autenticação de dois fatores (se disponível)
3. Não compartilhar essas credenciais
4. Manter este arquivo fora do controle de versão (Git)

## 📝 Notas

- O sistema utiliza Supabase Auth para autenticação
- As sessions são mantidas em cookies seguros
- O logout pode ser feito através do botão "Sair" no painel lateral
- Em caso de esquecimento de senha, use o painel do Supabase para resetar
