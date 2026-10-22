# Guia de UX/UI e Design System — Finflow

**Autor:** Breno dos Santos Santana  
**Projeto:** Finflow  
**Referência Visual:** Guia de Telas UX/UI Finflow

---

## 1. Identidade Visual e Filosofia de Design
O design do Finflow foi concebido para transmitir **tranquilidade, organização e clareza financeira**. A proposta rejeita excessos gráficos desnecessários (como glassmorphism agressivo, gradientes neon ou emojis aleatórios em substituição a ícones de navegação) em favor de uma estética limpa, acolhedora e funcional.

### 1.1. Paleta de Cores Institucional
A paleta baseia-se em tonalidades de verde-água e menta, acompanhadas de cinzas suaves para estruturar os dados com alto contraste:

| Nome da Cor | Código Hexadecimal | Papel no Sistema Visual |
|---|---|---|
| **Verde-água Principal** | `#76B8B2` | Cor de destaque da marca, botões de ação primária e linhas principais de gráficos. |
| **Verde Escuro** | `#4D9690` | Títulos de ênfase, texto sobre fundo menta e ícones de navegação ativa. |
| **Menta Suave** | `#DDF3EE` | Fundo de badges de receita, destaques positivos e estados hover de menus. |
| **Verde de Transição** | `#A9DDBA` | Detalhes no logotipo e barras secundárias de progresso. |
| **Fundo Geral** | `#F4F8F6` | Superfície da página, gerando atmosfera suave e sem ofuscamento visual. |
| **Superfície dos Cartões** | `#FFFFFF` | Branco puro para cartões, modais e containers com dados de leitura. |
| **Texto Principal** | `#17212B` | Cinza escuro de alto contraste (relação superior a 7:1 contra o fundo branco). |
| **Texto Secundário** | `#687775` | Rótulos de apoio, datas relativas e subtítulos de seções. |
| **Bordas** | `#E2EAE7` | Divisores discretos entre cartões, tabelas e cabeçalhos. |
| **Verde Positivo** | `#329B76` | Valores de receita, saldos positivos e metas concluídas. |
| **Vermelho de Despesa** | `#D96868` | Valores de saída, alertas de limite de orçamento estourado e botões de perigo. |
| **Âmbar de Atenção** | `#E5A83B` | Alertas de orçamentos com consumo entre 80% e 100%. |

---

## 2. Tipografia e Escala Modular
O projeto adota a família tipográfica **Playfair Display** (com suporte a variáveis de peso 400 a 900 e `font-optical-sizing: auto`), trazendo elegância clássica e distinção editorial aos títulos e indicadores financeiros, com fallback seguro para `Georgia, 'Times New Roman', serif`.

- **Logotipo e Títulos de Seção (H1 / H2):** Pesos 700 (Bold) com curvas serifadas harmonizadas com a paleta verde-água.
- **Valores Financeiros:** Tipografia destacada em peso 700 para leitura rápida e sofisticada.
- **Textos de Apoio e Rótulos:** Tamanhos `0.75rem` (12px) a `0.875rem` (14px) legíveis e equilibrados.

### 2.1. Símbolo e Logotipo sem Fundo
O símbolo da marca (`img/simbolo-finflow.svg` e `img/logo-finflow.svg`) foi construído vetorialmente sem fundo (transparente), composto por:
- Pílula superior arredondada em tom verde-água (`#68B0A8`).
- Círculo de ancoragem inferior em verde escuro (`#438B84`).
- Pílula inferior conectada em tom menta suave (`#A2DCBB`).

## 3. Padrões de Componentes

### 3.1. Cartões e Elevação
- **Raios de Borda:** Cantos arredondados entre **8px e 12px**, mantendo consistência elegante sem exageros.
- **Sombras:** Sombras sutis (`box-shadow: 0 2px 8px rgba(23, 33, 43, 0.04)`) para demarcar profundidade sem poluir a interface.
- **Bordas Estruturais:** Delimitação contínua com `#E2EAE7` para máxima definição visual em qualquer tipo de monitor.

### 3.2. Botões e Efeito 3D Neumórfico
- **Estilo Base Neumórfico:** Todos os botões do projeto utilizam o conceito de relevo 3D suave baseado em sombras duplas opostas (`--neu-raised-sm` e `--neu-raised`), flutuação com leve escala no hover (`translateY(-3px) scale(1.02)`) e efeito de afundamento físico no clique com sombra interna (`:active { box-shadow: var(--neu-pressed); transform: scale(0.97); }`).
- **Botão Primário (`.btn-primary`):** Verde-água (`#76B8B2`), texto branco, relevo suave e brilho difuso verde-água no hover (`--color-primary-hover`), com afundamento físico no clique.
- **Botão Secundário (`.btn-secondary`):** Superfície em relevo suave (`var(--color-surface)`), sem contornos rígidos, com transição e brilho sutil para verde escuro no hover.
- **Botão de Perigo (`.btn-danger`):** Fundo vermelho suave (`#D96868`) com brilho avermelhado e afundamento em modais de confirmação.
- **Botões Circulares de Ação Rápida (`.btn-action-edit` e `.btn-action-delete`):**
  - Botões circulares (`border-radius: 50%`) de 42px com relevo 3D e foco exclusivo em ícones vetoriais em SVG, sem texto interno poluindo as linhas.
  - **Editar (`.btn-action-edit`):** Relevo 3D suave; no hover, o botão flutua (`translateY(-4px)`), o ícone de caneta em bloco gira a -15° simulando escrita e ganha brilho suave verde-água (`--neu-glow-edit`).
  - **Excluir (`.btn-action-delete`):** Relevo 3D suave; no hover, o botão flutua, o ícone de X gira 90° e ganha brilho avermelhado suave (`--neu-glow-delete`).
  - No clique (`:active`), ambos afundam na tela com sombra interna (`box-shadow: var(--neu-pressed)`).
- **Controle Segmentado e Paginação:** Trilhos afundados com sombra interna (`--neu-pressed`) e botões ativos em relevo 3D invertido, comunicando seleção de maneira tátil e integrada.

### 3.3. Símbolos de Autoria no Rodapé
- Substituição dos links textuais por **símbolos vetoriais minimalistas em SVG** para GitHub e LinkedIn, mantendo visual limpo, profissional e elegante com suporte a `aria-label` e `:hover` interativo.

### 3.4. Gráficos Vetoriais Nativos (SVG)
- Criados diretamente em código SVG com curvas de Bézier cúbicas (`C`).
- O gráfico de fluxo financeiro combina uma área preenchida com gradiente transparente e linhas suaves de receita e despesa.
- As metas contam com anéis concêntricos percentuais calculados por trigonometria SVG (`stroke-dasharray` e `stroke-dashoffset`).

---

## 4. Responsividade e Adaptação Móvel
Conforme documentado na **Tela 10 do Guia de UX/UI**:
1. **Desktop (> 1024px):** Layout clássico com barra lateral fixa à esquerda e grid em 2 ou 4 colunas.
2. **Tablets (768px a 1023px):** Compactação dos grids para 2 colunas e transição fluida de gráficos.
3. **Smartphones (< 768px):**
   - A sidebar converte-se em gaveta retrátil (*off-canvas drawer*) acionada pelo menu hambúrguer superior com área de toque mínima garantida de 44x44px.
   - Ativa-se a **Barra de Navegação Inferior (Mobile Nav)** com 60px de altura e itens flexíveis preenchendo toda a altura da zona do polegar (*thumb zone*).
   - A tabela de transações transforma-se em cartões individuais verticais através do atributo `data-label`.
   - Botões circulares mantêm raio visual elegante de 42px com expansão invisível de toque (`::after`) de 48px para evitar cliques acidentais e atender WCAG 2.5.5.

### 4.1. Arquitetura de Cabeçalho Limpo e Semântica sem Redundâncias
- **Cabeçalho Superior (`.app-header`):** Atua como barra de utilidades e identificação de contexto. Exibe exclusivamente o botão do menu (mobile), o título da subtela ativa (`#topbar-page-title`) e o avatar do usuário.
- **Eliminação de Subtítulos no Topo:** Subtítulos extensos foram removidos do cabeçalho superior tanto em desktop quanto em mobile, eliminando poluição visual, quebras desnecessárias de linha e colisões em telas estreitas.
- **Eliminação de Títulos Redundantes no Conteúdo:** Os títulos secundários (`<h2>`) duplicados dentro das barras de ferramentas das páginas (`Transações`, `Orçamentos e metas`, `Relatórios`, `Categorias`, `Configurações`) foram removidos, preservando apenas as orientações contextuais (`.card-subtitle`) e os controles acionáveis (filtros, busca e botões específicos da visão).
- **Remoção do Botão Global de Nova Transação do Topbar:** O botão de nova transação foi centralizado nas telas onde a ação é primária (Painel e Transações), garantindo espaço horizontal desobstruído na barra superior.

---

## 5. Cuidados de Acessibilidade (a11y)
- **Foco pelo Teclado:** Estilo `:focus-visible` destacado em verde escuro (`#4D9690`) com `outline-offset: 2px`.
- **Contraste de Cores:** Todos os textos principais superam a proporção de contraste de 4.5:1 exigida pelas diretrizes WCAG 2.1 nível AA.
- **Semântica HTML:** Uso estrito de `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`, `<dialog>`, `<table>`, `<form>` e `<label>`.
- **Movimento Reduzido:** Suporte nativo à preferência do sistema operacional `@media (prefers-reduced-motion: reduce)` desativando transições bruscas.
- **Informações não dependentes apenas da cor:** Textos explicativos, percentuais numéricos e sinais `+` e `-` acompanham todos os indicadores coloridos.
