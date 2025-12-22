# 🚀 Como Começar - Guia Rápido

## ⚡ Quick Start (2 passos)

### 1. Configurar Supabase

**Primeira vez?** Siga o guia completo: [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

**Resumo rápido:**
1. Crie um projeto no [Supabase](https://supabase.com)
2. Copie as credenciais para o arquivo `.env`
3. Crie o bucket `media` no Storage
4. Configure as políticas de acesso

**Já configurou?** Pule para o próximo passo!

### 2. Iniciar o Servidor

```bash
pnpm dev
```

### 3. Acessar e Criar Conteúdo

> **💡 Primeira vez?** O Payload irá criar as tabelas automaticamente no PostgreSQL quando você iniciar o servidor pela primeira vez!

1. **Admin Panel**: http://localhost:3000/admin
   - Crie seu primeiro usuário administrador
   
2. **Adicionar Conteúdo**:
   - Vá em "Columnists" → Adicione alguns colunistas
   - Vá em "Posts" → Crie posts e associe aos colunistas
   - Vá em "Events" → Adicione eventos
   - Vá em "Media" → Faça upload de imagens

3. **Ver no Frontend**:
   - Home: http://localhost:3000
   - Posts: http://localhost:3000/posts
   - Eventos: http://localhost:3000/events

---

## 📖 Documentação Completa

- **SUPABASE_SETUP.md** - 🆕 Guia completo de configuração do Supabase
- **INTEGRACAO_PAYLOAD.md** - Resumo da integração
- **PAYLOAD_README.md** - Guia completo do CMS
- **EXEMPLOS_USO.md** - Exemplos de código
- **ESTRUTURA_PROJETO.md** - Estrutura do projeto
- **IMPLEMENTACAO_COMPLETA.md** - Tudo que foi implementado

---

## 🆘 Problemas Comuns

### Erro de conexão com o banco de dados
```bash
# Verifique se as credenciais do Supabase estão corretas no .env
# Teste a conexão:
npm run test:db
```

### Porta 3000 já está em uso
```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Ou usar outra porta
PORT=3001 pnpm dev
```

### Tipos TypeScript não atualizam
```bash
# Reiniciar o servidor
# Os tipos são gerados automaticamente em payload-types.ts
```

### Imagens não carregam
```bash
# Verifique se o bucket 'media' foi criado no Supabase
# Verifique se as políticas de acesso estão configuradas
# Consulte: SUPABASE_SETUP.md
```

---

## 💡 Dicas

1. **Sempre crie conteúdo com imagens** - Fica muito melhor!
2. **Use slugs descritivos** - Melhor para SEO
3. **Preencha os resumos** - Aparecem nas listagens
4. **Marque posts como destaque** - Aparecem com ⭐
5. **Configure as redes sociais** - Dos colunistas e do site

## 🎨 Animações com Framer Motion

O projeto utiliza **Framer Motion** para animações suaves e interativas. As animações estão centralizadas em `lib/motion.ts`:

### Utilitários Disponíveis

- **`fadeIn(direction, delay)`** - Animação de fade com direção (up, down, left, right, none)
- **`container`** - Variante para animações em cascata (stagger)
- **`scaleIn(delay)`** - Animação de escala (zoom)
- **`slideIn(direction, delay)`** - Animação de slide horizontal
- **`rotateIn(delay)`** - Animação de rotação
- **`viewportConfig`** - Configuração padrão para animações on-scroll

### Exemplo de Uso

```tsx
"use client";

import { motion } from "framer-motion";
import { fadeIn, container } from "@/lib/motion";

export function MyComponent() {
  return (
    <motion.section 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <motion.div variants={fadeIn("up", 0.1)}>
        Conteúdo animado
      </motion.div>
    </motion.section>
  );
}
```

### Componentes com Animações

Os seguintes componentes já utilizam animações:
- `components/hero-section.tsx` - Hero principal com animações de entrada
- `components/news-grid.tsx` - Grid de notícias com hover effects
- `components/events.tsx` - Cards de eventos com animações on-scroll
- `components/latest-news.tsx` - Lista de últimas notícias
- `components/columnists.tsx` - Grid de colunistas
- `components/newsletter.tsx` - Seção de newsletter com background animado
- `components/ad-banners.tsx` - Banners promocionais
- `components/header.tsx` - Header com animação de scroll
- `components/footer.tsx` - Footer com animações de entrada

---

## 🎯 Fluxo Recomendado

1. ✅ Criar colunistas primeiro
2. ✅ Fazer upload de imagens na Media
3. ✅ Criar posts e associar aos colunistas
4. ✅ Adicionar eventos
5. ✅ Configurar Site Settings (logo, redes sociais)
6. ✅ Configurar Header e Footer

---

**Pronto! Agora é só usar! 🎉**
