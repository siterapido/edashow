# Guia de Design e UI/UX - EDA Show

Este documento consolida os princípios de design, padrões de UI e diretrizes de UX para o portal EDA Show.

## 1. Princípios Gerais

*   **Layout Modular:** Baseado em seções horizontais claras.
*   **Cards como Unidade Central:** Todo conteúdo deve ser encapsulado em cards escaneáveis.
*   **Hierarquia Visual Forte:** Diferenciação clara entre títulos, subtítulos e corpo de texto.
*   **Design Limpo e Corporativo:** Estilo editorial, sem poluição visual.
*   **Mobile-First Real:** Prioridade para a experiência em dispositivos móveis (toque e leitura).
*   **Separação Conteúdo/Ação:** Distinção clara entre o que é informação e o que é interativo.

## 2. Paleta de Cores

### Cores Primárias
*   **Laranja (Primary):** `#FF6F00` (Usado para ações, destaques e identidade da marca).
*   **Branco (Background):** `#FFFFFF` (Fundo predominante para limpeza visual).
*   **Preto/Cinza Escuro (Foreground):** `#1A1A1A` (Textos principais e títulos).

### Cores Secundárias e Neutras
*   **Cinza Claro (Secondary/Muted):** `#F1F5F9` / `#F8FAFC` (Fundos de seções secundárias, hovers).
*   **Cinza Médio (Muted Foreground):** `#64748B` (Textos auxiliares, datas, legendas).
*   **Azul (Accent):** `#0284C7` (Links, informações informativas).
*   **Vermelho (Destructive):** Para erros e alertas críticos.

### Regra de Ouro
> **Cor forte (#FF6F00) apenas para ações ou destaques editoriais.** Não usar para fundos grandes de texto ou áreas de leitura densa.

## 3. Tipografia

### Hierarquia
1.  **Headline (H1/H2):** Grande, Bold, Alto contraste.
2.  **Subheadline (H3/Lead):** Média, Regular/Medium, contraste médio.
3.  **Body (P):** Legível, corpo generoso, espaçamento confortável.
4.  **Labels/Meta:** Pequenos, sutis (uppercase opcional), baixo contraste.

### UX de Leitura
*   Fonte Sans-serif moderna.
*   Espaçamento de linha confortável (1.5 ou maior para corpo).
*   Fácil escaneabilidade (parágrafos curtos, listas).

## 4. Componentes Principais

### 4.1. Header (Navegação)
**UI:**
*   Fundo sólido na cor Primária (#FF6F00) ou Branco com borda inferior forte. *Decisão atual: Fundo Sólido Primário para impacto.*
*   Altura média.
*   Logo à esquerda.
*   Menu horizontal central.
*   CTAs à direita.

**UX:**
*   Menu dividido por contexto.
*   Sem mega menus confusos.
*   Busca sempre visível.

### 4.2. Hero Section (Topo Editorial)
**UI:**
*   Fundo escuro ou neutro para contraste com o restante do site branco.
*   Texto em alto contraste (Branco sobre fundo escuro).
*   Headline forte.
*   CTA discreto ("Leia mais").

**UX:**
*   Uma ideia principal por vez (Destaque do dia).
*   Sem excesso de informação.

### 4.3. Grid de Serviços (Quick Actions)
**UI:**
*   Cards pequenos em grid.
*   Ícones simples.
*   Bordas suaves.

**UX:**
*   Acesso rápido (Últimas, Mais Lidas, Colunas, Newsletter).
*   Reduz fricção para usuários recorrentes.

### 4.4. Cards de Conteúdo
**UI:**
*   Fundo branco.
*   Bordas arredondadas (`rounded-xl` ou `rounded-lg`).
*   Sombra leve (`shadow-sm`) ou borda sutil.
*   Imagem com proporção consistente (16:9 ou 4:3).
*   Título destacado.

**UX:**
*   Altamente escaneáveis.
*   Fácil comparação visual.
*   Área de clique clara.

### 4.5. Footer
**UI:**
*   Fundo escuro.
*   Texto claro.
*   Colunas organizadas.

**UX:**
*   Links institucionais, editorial, contato e redes sociais.
*   Transmite confiança.

## 5. Mobile First
*   Cards empilhados verticalmente.
*   CTAs grandes (área de toque > 44px).
*   Navegação simplificada (Hambúrguer).
*   Scroll natural e fluido.













