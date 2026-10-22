# Decisões Técnicas de Arquitetura (ADR) — Finflow

**Autor:** Breno dos Santos Santana  
**Projeto:** Finflow  
**Status do Projeto:** Fase 1 (MVP Front-end Estático Concluído)

---

## ADR 01: Uso de Tecnologias Nativas (HTML5, CSS3 e ES Modules) em vez de Frameworks
- **Status:** Aprovado e Implementado
- **Contexto:** Para vagas de estágio em Front-end, recrutadores buscam comprovação de domínio sobre os fundamentos da web (DOM, eventos, manipulação de estado e estilização pura), sem o mascaramento de abstrações prontas como React ou Angular.
- **Decisão:** Desenvolver toda a aplicação utilizando HTML5 semântico, Vanilla CSS estruturado em tokens e JavaScript moderno modular (ES Modules nativo).
- **Consequências:**
  - *Positivas:* Zero etapas de compilação (`npm run build`), carregamento ultrarrápido, compatibilidade imediata com qualquer servidor estático, código transparente para estudo e auditoria.
  - *Compensações:* A reatividade e o roteamento precisaram ser criados artesanalmente no projeto.

---

## ADR 02: Roteamento Baseado em Hash (`#/`) para Compatibilidade com GitHub Pages
- **Status:** Aprovado e Implementado
- **Contexto:** Servidores de páginas estáticas simples como o GitHub Pages não suportam reescrita de URLs (*fallback rewriting*) para rotas profundas da History API (`/dashboard` retornaria erro HTTP 404 ao recarregar).
- **Decisão:** Implementar um roteador client-side nativo baseado no evento `hashchange` e caminhos do tipo `#/dashboard`, `#/transacoes` e `#/configuracoes`.
- **Consequências:**
  - *Positivas:* O usuário pode recarregar qualquer tela ou salvar links nos favoritos sem que o servidor quebre a navegação.

---

## ADR 03: Persistência no LocalStorage com Versionamento de Esquema
- **Status:** Aprovado e Implementado
- **Contexto:** O MVP precisa funcionar offline e sem necessidade de contratação ou manutenção de um servidor ou banco de dados remoto pago.
- **Decisão:** Utilizar a API de `LocalStorage` do navegador, agrupada sob chaves com prefixo versionado (`finflow_v1_`), combinada a um mecanismo de exportação e importação de backups em formato JSON para prevenir perda de dados.
- **Limitações e Futuro (Fase 2):**
  - O LocalStorage não sincroniza dados entre diferentes aparelhos.
  - Para a Fase 2, está planejado o desacoplamento da interface para conectar a um backend como Supabase ou Firebase via API REST.

---

## ADR 04: Gráficos Vetoriais Nativos em SVG
- **Status:** Aprovado e Implementado
- **Contexto:** A inclusão de bibliotecas pesadas de gráficos (como Chart.js ou Highcharts) adicionaria centenas de kilobytes de dependências e limitaria o controle sobre o design system do produto.
- **Decisão:** Desenvolver os gráficos de fluxo mensal e comparativo de receitas e despesas diretamente em SVG matemático nativo com curvas de Bézier e anéis circulares.
- **Consequências:**
  - *Positivas:* 100% responsivo, escalável em qualquer densidade de pixels, estilizado através das variáveis CSS do projeto, sem nenhuma dependência externa.

---

## ADR 06: Tipografia Editorial Playfair Display, Novo Logotipo sem Fundo e Feedback Fluido sem Toasts
- **Status:** Aprovado e Implementado
- **Contexto:** A interface demandava uma assinatura visual com maior personalidade e elegância gráfica (tipografia serifada editorial), com eliminação completa de caracteres emoji em botões e eliminação de popups flutuantes de verificação de ação que poluíam a experiência do usuário.
- **Decisão:** Adotar a fonte `Playfair Display` carregada via Google Fonts, atualizar o símbolo vetorial transparente da marca (`img/simbolo-finflow.svg` e `img/logo-finflow.svg`), substituir todos os emojis de botões por SVGs e desativar toasts flutuantes para que as ações ocorram diretamente na tela sem interrupções.
- **Consequências:**
  - *Positivas:* Visual profissional com acabamento refinado, sem ícones genéricos e com resposta instantânea em formulários e configurações.

---

## ADR 07: Estruturação Semântica Declarativa no `index.html` (Semantic HTML-First)
- **Status:** Aprovado e Implementado
- **Contexto:** A concentração de marcação HTML (títulos `<h1>`, `<h2>`, parágrafos `<p>` e seções `<section>`) dentro de template strings nos arquivos JavaScript dificultava a edição de textos, manutenção do conteúdo editorial e inspeção semântica pelo desenvolvedor.
- **Decisão:** Declarar toda a estrutura do site (telas públicas, shell da aplicação, cabeçalhos, formulários de filtros, seções e parágrafos explicativos) diretamente dentro do arquivo `index.html`, organizados por seções semânticas identificáveis por comentários em português. Os módulos JavaScript das views (`src/js/views/`) passam a atuar exclusivamente como apresentadores e controladores reativos, atualizando apenas os contêineres dinâmicos de dados (tabelas, listas, gráficos SVG e cartões métricos) e alternando a visibilidade de telas por classes CSS (`.active`).
- **Consequências:**
  - *Positivas:* Facilidade absoluta para edição e revisão de cópia e textos pelo desenvolvedor direto no HTML; melhor performance e menor processamento de montagem de nós no DOM; preservação de estado e formulários; conformidade exemplar com os padrões web nativos.

---

## ADR 08: Sistema de Botões com Relevo 3D Neumórfico e Ações Circulares
- **Status:** Aprovado e Implementado
- **Contexto:** A interface utilizava botões retangulares simples com texto ("Editar" e "Excluir") nas linhas de tabelas e listas de categorias, que ocupavam espaço horizontal excessivo e possuíam apelo visual plano. O usuário solicitou a evolução visual para botões com relevo 3D / neumorfismo e botões circulares minimalistas focados em ícones.
- **Decisão:** Adotar um design system de botões baseado em relevo 3D suave (Neumorfismo adaptado à paleta verde-água/menta e com suporte total ao tema escuro via variáveis CSS). As ações de linha (tabela de transações, listas de categorias e orçamentos/metas) tornaram-se botões circulares de 42px contendo exclusivamente ícones vetoriais SVG (caneta em caixa para edição e X para exclusão). No hover, o botão flutua com leve escala e os ícones rotacionam (-15° na caneta e 90° no X) com brilho difuso nas cores verde-água e vermelho. No clique (`:active`), as sombras invertem para `inset`, gerando efeito tátil de afundamento físico na tela.
- **Consequências:**
  - *Positivas:* Visual contemporâneo, refinado e com grande apelo tátil; economia substancial de largura em tabelas e telas menores; acessibilidade preservada com atributos `title` e `aria-label`; consistência estética estendida a botões principais, paginação e modais.


