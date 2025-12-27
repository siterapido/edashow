# Guia de UI/UX - EDA Show

Este guia serve como a "Fonte da Verdade" para o design e a experiência do usuário do portal EDA Show. Ele deve ser consultado por desenvolvedores e designers para garantir que a interface permaneça consistente, profissional e alinhada com os objetivos da marca.

---

## 1. Visão Geral da Marca
O EDA Show é um portal de notícias e análises focado no setor corporativo, saúde e eventos. A interface deve transmitir **autoridade**, **dinamismo** e **clareza**.

### Pilares do Design:
- **Editorial Moderno:** Layout limpo que prioriza a leitura.
- **Hierarquia Visual:** O que é mais importante deve ser visto primeiro.
- **Escaneabilidade:** Uso inteligente de espaços em branco e cards para facilitar o consumo rápido de informação.

---

## 2. Paleta de Cores
A paleta é baseada nas variáveis definidas em `app/globals.css`.

### Cores Principais
| Cor | Hex/Variável | Uso |
| :--- | :--- | :--- |
| **Laranja Primário** | `#FF6F00` | Ações principais (CTAs), Destaques, Logo e Identidade. |
| **Preto/Texto** | `#1A1A1A` | Títulos, textos principais e elementos de alto contraste. |
| **Branco Fundo** | `#FFFFFF` | Fundo principal da página e de cards. |

### Cores de Suporte e Semânticas
- **Muted/Secondary:** `#F1F5F9` (Cinza muito claro) - Usado para fundos de seções e hovers.
- **Muted Foreground:** `#64748B` (Cinza médio) - Usado para metadados (datas, categorias, legendas).
- **Accent:** `#0284C7` (Azul) - Links e informações secundárias.
- **Destructive:** Vermelho - Alertas e erros.

---

## 3. Tipografia
Utilizamos uma abordagem de fontes sem serifa (Sans-serif) para um visual moderno e limpo.

### Hierarquia de Texto (Tailwind)
- **H1 (Display):** `text-4xl font-bold tracking-tight` - Títulos de artigos principais.
- **H2 (Section):** `text-2xl font-bold` - Títulos de categorias ou seções na Home.
- **H3 (Card Title):** `text-lg font-semibold leading-snug` - Títulos em cards de notícias.
- **Body:** `text-base leading-relaxed` - Texto corrido de artigos.
- **Small/Meta:** `text-sm text-muted-foreground` - Datas, autor e categorias.

---

## 4. Componentes Centrais

### 4.1. Cards de Conteúdo (A Unidade Base)
Os cards devem ser a forma principal de organizar o conteúdo.
- **Visual:** `bg-card rounded-xl border border-border shadow-sm overflow-hidden`.
- **Comportamento:** Hover sutil com `hover:shadow-md transition-shadow`.
- **Imagens:** Proporção 16:9 sempre que possível.

### 4.2. Header (Navegação Principal)
- **Design:** Fundo sólido em Laranja Primário (`bg-primary`) para impacto ou Branco com borda inferior sutil.
- **Estrutura:** Logo à esquerda, menu central, busca e CTAs à direita.
- **UX:** Menu focado em contexto, sem submenus complexos em excesso.

### 4.3. Hero Section (Destaque Principal)
- **Visual:** Contraste forte (texto branco sobre fundo escuro ou imagem vibrante).
- **UX:** Uma única mensagem clara (Notícia do Dia). CTA direto "Leia mais".

### 4.4. Botões e Ações (CTAs)
- **Primário:** Fundo Laranja (`bg-primary`), texto Branco.
- **Secundário:** Fundo Cinza Claro (`bg-secondary`), texto Preto.
- **Outline:** Borda sutil, fundo transparente.

### 4.5. Grids e Layout
- **Layout:** Baseado em seções horizontais claras.
- **Grids:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` para listagens de notícias.
- **Espaçamento:** Uso constante de `gap-6` ou `gap-8` entre cards.

### 4.6. Footer (Rodapé)
- **Estilo:** Fundo Escuro (`bg-foreground` ou cinza muito escuro).
- **Conteúdo:** Links institucionais, redes sociais e newsletter.
- **UX:** Transmitir credibilidade e facilitar o contato.

---

## 5. Princípios de UX

### 5.1. Mobile-First
O portal será acessado majoritariamente via dispositivos móveis.
- Áreas de clique (Touch targets) de no mínimo 44x44px.
- Grids que se transformam em pilhas verticais (`grid-cols-1 md:grid-cols-2`).

### 5.2. Acessibilidade
- Contraste adequado entre texto e fundo.
- Uso de `aria-labels` em elementos interativos sem texto.
- Navegação via teclado funcional.

---

## 6. Referência de Implementação (Tailwind)

Exemplo de um Card de Notícia padrão:

```tsx
<div className="group rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md">
  <div className="aspect-video relative overflow-hidden">
    <img src="/placeholder.jpg" className="object-cover transition-transform group-hover:scale-105" />
  </div>
  <div className="p-4 space-y-2">
    <span className="text-xs font-medium text-primary uppercase">Categoria</span>
    <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
      Título da Notícia que Atrai a Atenção do Leitor
    </h3>
    <p className="text-sm text-muted-foreground line-clamp-2">
      Um breve resumo do que o leitor encontrará ao clicar para ler a matéria completa...
    </p>
    <div className="pt-2 text-xs text-muted-foreground">
      19 de Dezembro, 2025 • 5 min de leitura
    </div>
  </div>
</div>
```

---

## 7. Checklist de Qualidade UI
- [ ] A cor laranja (#FF6F00) está sendo usada apenas para destaque/ação?
- [ ] O espaçamento (padding/margin) é consistente em todo o layout?
- [ ] O texto está legível tanto no desktop quanto no mobile?
- [ ] Todos os estados de hover e focus estão implementados?







