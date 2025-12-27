# Script de Ingestão do Conexão Saúde

Este documento descreve como usar o script para importar notícias do site Conexão Saúde para o Payload CMS.

## 📋 Visão Geral

O script `scripts/scrape-conexao-saude.ts` raspa notícias do site [Conexão Saúde](https://conexaosaudebr.com.br) e importa automaticamente para o Payload CMS, incluindo:

- ✅ Títulos e conteúdo completo
- ✅ Imagens destacadas
- ✅ Resumos/excerpts
- ✅ Datas de publicação
- ✅ Autores (criando colunistas automaticamente)
- ✅ URLs de origem para referência

## 🚀 Pré-requisitos

1. **Dependências instaladas:**
   ```bash
   pnpm install
   ```

2. **Servidor Payload CMS rodando:**
   ```bash
   pnpm dev
   ```

3. **Variáveis de ambiente configuradas** (crie um arquivo `.env` na raiz do projeto):
   ```env
   # URL do servidor Payload (padrão: http://localhost:3000)
   PAYLOAD_SERVER_URL=http://localhost:3000
   
   # Opção 1: Token de autenticação (recomendado para produção)
   PAYLOAD_API_TOKEN=seu-token-aqui
   
   # Opção 2: Credenciais de admin (para desenvolvimento)
   PAYLOAD_ADMIN_EMAIL=admin@example.com
   PAYLOAD_ADMIN_PASSWORD=sua-senha
   ```

## 📝 Como Usar

### Execução Básica

```bash
pnpm ts-node scripts/scrape-conexao-saude.ts
```

### Com Variáveis de Ambiente Customizadas

```bash
PAYLOAD_SERVER_URL=https://seu-site.com \
PAYLOAD_API_TOKEN=seu-token \
LIMIT=20 \
DELAY_MS=2000 \
pnpm ts-node scripts/scrape-conexao-saude.ts
```

### Variáveis de Ambiente Disponíveis

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PAYLOAD_SERVER_URL` | URL do servidor Payload CMS | `http://localhost:3000` |
| `PAYLOAD_API_TOKEN` | Token de autenticação JWT | - |
| `PAYLOAD_ADMIN_EMAIL` | Email do admin (se não usar token) | `admin@example.com` |
| `PAYLOAD_ADMIN_PASSWORD` | Senha do admin (se não usar token) | `password` |
| `LIMIT` | Número máximo de notícias para importar | `10` |
| `DELAY_MS` | Delay entre requisições em milissegundos | `1000` |

## 🔧 Funcionamento

### Fluxo de Execução

1. **Autenticação**: O script autentica no Payload CMS usando token ou credenciais
2. **Raspagem da Home**: Baixa e parseia a página inicial do Conexão Saúde
3. **Extração de Notícias**: Identifica links e informações de notícias
4. **Processamento Individual**: Para cada notícia:
   - Baixa o conteúdo completo da página
   - Extrai título, conteúdo, imagem, data e autor
   - Faz upload da imagem para o Payload CMS
   - Cria ou atualiza o colunista (se houver autor)
   - Cria ou atualiza o post no Payload CMS
5. **Logs**: Exibe progresso e resultados

### Estrutura de Dados

O script cria/atualiza posts com a seguinte estrutura:

```typescript
{
  title: string              // Título da notícia
  slug: string               // Slug único baseado na URL
  excerpt: string            // Resumo da notícia
  content: LexicalJSON       // Conteúdo completo em formato Lexical
  category: 'news'           // Categoria padrão: 'news'
  featuredImage: string      // ID da mídia (se houver imagem)
  author: string             // ID do colunista (se houver autor)
  status: 'published'        // Status: publicado
  publishedDate: ISOString   // Data de publicação
  sourceUrl: string          // URL original do Conexão Saúde
}
```

## 📊 Exemplo de Saída

```
🚀 Iniciando raspagem do Conexão Saúde

📊 Configuração:
   - Limite: 10 notícias
   - Delay: 1000ms entre requisições
   - URL: https://conexaosaudebr.com.br

📥 Baixando página inicial...
✅ Encontradas 10 notícias

[1/10]
📰 Processando: Usina do Seguro cresce em 2025...
  📄 Baixando: https://conexaosaudebr.com.br/...
  🖼️  Fazendo upload da imagem...
  ✅ Imagem enviada: imagem.jpg
  👤 Buscando/criando colunista: Autor Nome
  ✅ Colunista encontrado/criado
  💾 Salvando no Payload CMS...
  ✅ Post criado/atualizado: usina-do-seguro-cresce-2025

...

✅ Processo concluído! 10 notícias processadas.
```

## ⚠️ Considerações Importantes

### Respeito ao Site Fonte

- O script inclui delays entre requisições para não sobrecarregar o servidor
- Use `DELAY_MS` para ajustar o intervalo (recomendado: 1000-2000ms)
- Não execute o script muito frequentemente

### Duplicação

- O script usa o `slug` derivado da URL como chave única
- Posts existentes são atualizados, não duplicados
- O campo `sourceUrl` permite rastrear a origem

### Limitações

- O script depende da estrutura HTML do site fonte
- Mudanças no layout do Conexão Saúde podem quebrar os seletores
- Algumas notícias podem não ter todos os campos preenchidos

### Tratamento de Erros

- Erros individuais não interrompem o processo
- Cada erro é logado para análise
- Posts parcialmente processados podem ser completados manualmente

## 🔍 Troubleshooting

### Erro de Autenticação

```
Erro: Falha na autenticação: 401 Unauthorized
```

**Solução:**
- Verifique se `PAYLOAD_API_TOKEN` está correto
- Ou configure `PAYLOAD_ADMIN_EMAIL` e `PAYLOAD_ADMIN_PASSWORD`
- Certifique-se de que o servidor Payload está rodando

### Nenhuma Notícia Encontrada

```
⚠️  Seletores padrão não funcionaram, tentando busca alternativa...
✅ Encontradas 0 notícias
```

**Solução:**
- O layout do site pode ter mudado
- Verifique manualmente a estrutura HTML do site
- Ajuste os seletores no código do script se necessário

### Erro ao Fazer Upload de Imagem

```
❌ Erro ao fazer upload de mídia de https://...
```

**Solução:**
- Verifique se a URL da imagem é válida
- Certifique-se de que o diretório `public/uploads` existe
- Verifique permissões de escrita

### Posts Não Aparecem na Home

**Solução:**
- Verifique se o status está como `published`
- Limpe o cache do Next.js: `rm -rf .next`
- Reinicie o servidor de desenvolvimento

## 🎯 Integração com Frontend

Após executar o script, os posts importados estarão disponíveis em:

- **Home Page** (`/`): Exibe posts nas seções "Política e Regulação" e "Tecnologia e Inovação"
- **Lista de Posts** (`/posts`): Lista todos os posts publicados
- **Página Individual** (`/posts/[slug]`): Exibe o conteúdo completo de cada post
- **Notícias** (`/noticias`): Página dedicada de notícias

## 📚 Arquivos Relacionados

- `scripts/scrape-conexao-saude.ts` - Script principal de raspagem
- `lib/payload/client.ts` - Cliente autenticado do Payload CMS
- `payload.config.ts` - Configuração do Payload CMS (inclui campo `sourceUrl`)
- `app/page.tsx` - Home page que exibe os posts importados
- `app/noticias/page.tsx` - Página de listagem de notícias

## 🔄 Atualizações Futuras

Possíveis melhorias:

- [ ] Suporte a múltiplas fontes de notícias
- [ ] Agendamento automático (cron job)
- [ ] Detecção de mudanças no layout do site
- [ ] Melhor conversão HTML → Lexical
- [ ] Suporte a categorias automáticas baseadas em tags
- [ ] Dashboard de monitoramento de importações

## 📞 Suporte

Para problemas ou dúvidas:

1. Verifique os logs do script
2. Consulte a documentação do Payload CMS
3. Revise os arquivos de configuração
4. Verifique as variáveis de ambiente

---

**Última atualização:** Dezembro 2025













