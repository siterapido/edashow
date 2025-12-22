# Painel Administrativo do Payload CMS

Este diretório contém a implementação do painel administrativo do Payload CMS 3.x integrado ao Next.js App Router.

## Estrutura de Arquivos

```
admin/
├── [[...segments]]/
│   ├── page.tsx          # Página principal do admin
│   └── not-found.tsx     # Página 404 customizada
└── README.md             # Este arquivo
```

## Como Funciona

### page.tsx
- Renderiza o componente `RootPage` do Payload CMS
- Aguarda o carregamento da configuração via `configPromise`
- Trata erros de forma robusta, exibindo mensagens amigáveis

### not-found.tsx
- Renderiza a página 404 customizada do Payload CMS
- Usa o componente `NotFoundPage` do Payload

## Configuração Necessária

### Variáveis de Ambiente Obrigatórias

```env
# Banco de Dados PostgreSQL
DATABASE_URI=postgresql://user:password@host:5432/database

# Payload CMS Secret (mínimo 32 caracteres)
PAYLOAD_SECRET=seu-secret-com-no-minimo-32-caracteres-aqui

# URL do Servidor
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Supabase Storage (para uploads de imagens)
SUPABASE_ENDPOINT=https://seu-projeto.supabase.co/storage/v1/s3
SUPABASE_REGION=us-east-1
SUPABASE_BUCKET=seu-bucket
SUPABASE_ACCESS_KEY_ID=sua-access-key
SUPABASE_SECRET_ACCESS_KEY=sua-secret-key
```

## Resolução de Problemas

### Erro: "Cannot destructure property 'config'"

**Causa**: A configuração do Payload não está sendo carregada corretamente.

**Soluções**:
1. Verifique se todas as variáveis de ambiente estão configuradas
2. Confirme que `DATABASE_URI` está acessível
3. Verifique se `PAYLOAD_SECRET` tem pelo menos 32 caracteres
4. Reinicie o servidor de desenvolvimento

### Erro: "Config is undefined"

**Causa**: O `configPromise` não está sendo resolvido corretamente.

**Soluções**:
1. Verifique o arquivo `payload.config.ts`
2. Confirme que a exportação padrão está correta
3. Verifique se o alias `@payload-config` está configurado em `tsconfig.json`

### Erro de Conexão com Banco de Dados

**Causa**: Não é possível conectar ao PostgreSQL.

**Soluções**:
1. Verifique se `DATABASE_URI` está correta
2. Confirme que o banco de dados está acessível
3. Teste a conexão usando um cliente PostgreSQL
4. Verifique as configurações de SSL se estiver usando

### Página em Branco no Admin

**Causa**: JavaScript não está sendo carregado ou há erro no bundle.

**Soluções**:
1. Abra o Console do navegador (F12) e verifique erros
2. Limpe o cache do Next.js: `rm -rf .next`
3. Reinstale as dependências: `npm install`
4. Reinicie o servidor

## Acesso ao Painel Admin

- **URL Local**: http://localhost:3000/admin
- **URL Produção**: https://seu-dominio.com/admin

### Primeiro Acesso

Na primeira vez que acessar, você precisará criar um usuário admin:

1. Acesse `/admin`
2. Preencha o formulário de cadastro
3. Use as credenciais para fazer login

## Customização

### Alterar Cor do Tema

Edite `payload.config.ts` e adicione:

```typescript
admin: {
  meta: {
    titleSuffix: '- Seu Site',
  },
  // Adicione suas customizações aqui
}
```

### Adicionar Componentes Customizados

Crie componentes em `app/admin/components/` e adicione nas collections:

```typescript
fields: [
  {
    name: 'customField',
    type: 'ui',
    admin: {
      components: {
        Field: '/app/admin/components/CustomField.tsx'
      }
    }
  }
]
```

## Segurança

### Em Produção

1. **Use HTTPS**: Sempre sirva o admin via HTTPS
2. **SECRET forte**: Use um `PAYLOAD_SECRET` gerado aleatoriamente
3. **Restrinja acesso**: Configure firewall/WAF para limitar acesso ao `/admin`
4. **Backup regular**: Faça backup do banco de dados regularmente
5. **Atualize**: Mantenha o Payload CMS atualizado

### Exemplo de geração de SECRET seguro:

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32
```

## Suporte

- Documentação Oficial: https://payloadcms.com/docs
- GitHub Issues: https://github.com/payloadcms/payload/issues
- Discord: https://discord.gg/payload

## Logs e Debug

### Ativar logs detalhados

Em desenvolvimento, os logs já estão ativos. Para ver mais detalhes:

```bash
# Iniciar com logs do Next.js
DEBUG=payload:* npm run dev
```

### Verificar configuração

Execute o script de verificação:

```bash
npm run check:env
```

## Manutenção

### Limpar cache

```bash
# Limpar cache do Next.js
rm -rf .next

# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Atualizar Payload CMS

```bash
npm update payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical
```

## Arquitetura

```
Usuário → Next.js (App Router) → RootPage (Payload) → Collections/Globals → PostgreSQL
                                                      ↓
                                                 Supabase S3 (Media)
```

O Payload CMS renderiza todo o painel admin como uma aplicação React dentro do Next.js, utilizando Server Components para melhor performance e Client Components onde interatividade é necessária.



