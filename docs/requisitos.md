# Especificação de Requisitos — Finflow

**Projeto:** Finflow — Aplicação Web de Controle Financeiro Pessoal  
**Autor:** Breno dos Santos Santana  
**Status da Versão:** MVP 1.0 (Front-end Autônomo com LocalStorage)

---

## 1. Visão Geral do Produto
O Finflow é uma plataforma digital focada no controle financeiro pessoal, projetada para proporcionar clareza sobre receitas, despesas, limites de orçamento e objetivos de economia através de uma interface leve, limpa e responsiva.

---

## 2. Requisitos Funcionais (RF)

| ID | Descrição do Requisito | Status | Implementação |
|---|---|---|---|
| **RF01** | **Landing Page Institucional:** Apresentar a proposta de valor, prévia visual do painel, benefícios principais e chamada para ação (*CTA*). | **Implementado** | `src/js/views/landing.js` |
| **RF02** | **Painel Executivo (Dashboard):** Exibir saldo consolidado, total de receitas, total de despesas e percentual de metas calculados a partir dos dados reais do período. | **Implementado** | `src/js/views/dashboard.js` |
| **RF03** | **Gráfico de Fluxo Financeiro:** Apresentar evolução comparativa entre entradas e saídas ao longo dos últimos meses em SVG vetorial. | **Implementado** | Gráfico SVG nativo em `dashboard.js` |
| **RF04** | **Transações Recentes:** Listar os últimos lançamentos com distinção visual de tipo, categoria e data relativa. | **Implementado** | `src/js/services/transaction-service.js` |
| **RF05** | **Registro e Edição de Transações:** Formulário modal com alternância entre receita/despesa, validação de campos obrigatórios e categorias dinâmicas. | **Implementado** | `src/js/views/transaction-form.js` |
| **RF06** | **Filtros e Pesquisa de Transações:** Permitir busca por texto, filtro por período (mês), tipo e categoria com resposta em tempo real. | **Implementado** | `src/js/views/transactions.js` |
| **RF07** | **Paginação de Lançamentos:** Dividir registros em páginas navegáveis com contadores claros. | **Implementado** | `src/js/services/transaction-service.js` |
| **RF08** | **Orçamentos Mensais:** Definir limites de gastos por categoria e exibir barras de progresso dinâmicas com alerta visual de atenção (>=80%) e estouro (>100%). | **Implementado** | `src/js/views/budgets.js` |
| **RF09** | **Metas de Economia:** Criar objetivos com valor acumulado, valor desejado, anel circular de progresso e funcionalidade de registro de aportes. | **Implementado** | `src/js/services/goal-service.js` |
| **RF10** | **Relatórios Analíticos:** Comparativo mensal de receitas versus despesas e distribuição percentual de despesas por categoria. | **Implementado** | `src/js/views/reports.js` |
| **RF11** | **Gestão de Categorias:** Cadastrar, editar e excluir categorias personalizadas com paleta de cores. | **Implementado** | `src/js/views/categories.js` |
| **RF12** | **Integridade de Categorias:** Impedir exclusão direta de categorias em uso e oferecer reclassificação orientada para evitar dados órfãos. | **Implementado** | `src/js/services/category-service.js` |
| **RF13** | **Exportação de Dados:** Gerar arquivo JSON estruturado com todos os dados locais para download. | **Implementado** | `src/js/core/storage.js` |
| **RF14** | **Importação com Validação:** Validar arquivo JSON de backup antes de substituir os dados do navegador. | **Implementado** | `src/js/utils/validators.js` |
| **RF15** | **Restauração e Limpeza de Dados:** Permitir retorno aos dados de demonstração ou zerar o armazenamento mediante confirmação explícita. | **Implementado** | `src/js/views/settings.js` |
| **RF16** | **Autenticação Online em Nuvem:** Criação de contas reais de usuário com sincronização entre dispositivos. | *Planejado (Fase 2)* | Documentado em `decisoes-tecnicas.md` |
| **RF17** | **Página Institucional Sobre e Funcionalidades:** Apresentar em detalhes a arquitetura, propósito do Finflow, 8 pilares funcionais e autoria de Breno dos Santos Santana. | **Implementado** | `src/js/views/about.js` |

---

## 3. Requisitos Não Funcionais (RNF)

| ID | Categoria | Descrição | Status |
|---|---|---|---|
| **RNF01** | **Arquitetura Estática** | Executar 100% no navegador sem necessidade de servidor ou banco de dados backend, compatível com GitHub Pages. | **Atendido** |
| **RNF02** | **Desempenho** | Tempo de carregamento quase instantâneo, utilizando HTML, CSS e JavaScript puros sem ferramentas pesadas de compilação. | **Atendido** |
| **RNF03** | **Persistência Local** | Armazenar dados no `LocalStorage` sob chave versionada (`finflow_v1_`) com população automática de dados de teste caso vazio. | **Atendido** |
| **RNF04** | **Acessibilidade (a11y)** | Suporte à navegação por teclado (`:focus-visible`), contraste de cores conforme diretrizes WCAG AA, atributos ARIA e tags semânticas. | **Atendido** |
| **RNF05** | **Responsividade** | Interface fluida adaptada para telas de celulares (<768px), tablets e monitores desktop grandes. | **Atendido** |
| **RNF06** | **Segurança no Front-end** | Higienização de strings para prevenção de XSS e proibição de armazenamento de senhas em LocalStorage. | **Atendido** |
| **RNF07** | **Manutenibilidade** | Código modular com separação de responsabilidades (Serviços, Views, Utilitários e Componentes) e comentários explicativos em português. | **Atendido** |
