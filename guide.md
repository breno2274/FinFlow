# DIRETRIZES PERMANENTES DE DESENVOLVIMENTO — FINFLOW (GEMINI.md)

Este documento estabelece as regras obrigatórias e permanentes para quaisquer agentes de inteligência artificial ou desenvolvedores que realizem futuras manutenções, melhorias ou refatorações no repositório do **Finflow**.

A regra fundamental deste projeto é: **Código, comentários, diagramas e documentação técnica devem permanecer rigorosamente sincronizados.**

---

## 1. Regras Antes de Qualquer Alteração Futura
Antes de modificar ou criar qualquer arquivo no projeto:
1. **Ler o README.md e a documentação técnica:** Entenda o propósito do projeto, a identidade de Breno dos Santos Santana e a arquitetura sem dependências pesadas.
2. **Inspecionar os arquivos relacionados:** Localize os arquivos exatos impactados pela alteração pretendida no diretório `src/`.
3. **Consultar a documentação e os diagramas afetados:** Revise `docs/requisitos.md`, `docs/arquitetura.md`, `docs/ux-ui.md`, `docs/modelo-de-dados.md`, `docs/decisoes-tecnicas.md` e a pasta `docs/diagramas/`.
4. **Compreender o comportamento atual:** Não adivinhe a lógica existente; estude como os serviços e views interagem através do `core/storage.js` e do barramento de eventos.
5. **Identificar testes afetados:** Consulte `tests/roteiro-de-testes.md` para mapear quais cenários deverão ser validados ou adicionados.

---

## 2. Regras Durante a Implementação
Ao escrever código no repositório:
1. **Consistência Arquitetural:** Mantenha a separação limpa de camadas:
   - Apresentação em `src/js/views/` e `src/js/components/`
   - Regras de negócio em `src/js/services/`
   - Persistência e dados em `src/js/core/storage.js`
   - Validações em `src/js/utils/validators.js`
   - Formatação e datas em `src/js/utils/format.js` e `src/js/utils/dates.js`
2. **Reaproveitamento de Componentes:** Não crie novos estilos ou modais isolados se existirem abstrações prontas (`modal.js`, `toast.js`, `empty-state.js`, classes do `components.css` e tokens do `tokens.css`).
3. **Zero Frameworks ou Dependências Pesadas:** Não introduza React, bibliotecas de build (Webpack, Vite), Tailwind ou dependências externas sem aprovação explícita. O projeto deve rodar diretamente no navegador via GitHub Pages.
4. **Comentários Profissionais em Português:** Comente trechos importantes explicando a **intenção** e o **motivo** de decisões de código, e não apenas descrevendo comandos óbvios. Remova comentários obsoletos quando a lógica mudar.
5. **Atualização Imediata da Documentação Concomitante:**
   - **Mudança de Layout/Estilo:** Atualize `docs/ux-ui.md` e `src/css/tokens.css` se necessário.
   - **Nova Funcionalidade / Alteração de Comportamento:** Atualize `docs/requisitos.md`, o fluxo em `docs/diagramas/fluxo-de-navegacao.mmd` e `docs/diagramas/fluxo-de-dados.mmd`.
   - **Mudança no Modelo de Dados:** Atualize `docs/modelo-de-dados.md`, `docs/diagramas/modelo-de-dados.mmd`, o validador `validators.js` e a migração de esquema em `storage.js`.
   - **Mudança Arquitetural:** Atualize `docs/arquitetura.md`, `docs/decisoes-tecnicas.md` e `docs/diagramas/arquitetura.mmd`.
   - **Instruções e Visão Geral:** Atualize `README.md`.
   - **Histórico:** Registre a alteração no `CHANGELOG.md` com data e descrição no padrão Keep a Changelog.
   - **Testes:** Atualize `tests/roteiro-de-testes.md` com os novos cenários ou ajustes necessários.

---

## 3. Regras Após a Conclusão da Alteração
Antes de finalizar a tarefa:
1. **Conferência Cruzada:** Compare o código escrito com a documentação atualizada para garantir que nenhum termo, rota ou propriedade permaneça inconsistente.
2. **Checagem de Recursos:** Verifique se caminhos de arquivos em `img/` ou `src/` continuam válidos e que nenhuma imagem ou importação esteja quebrada.
3. **Execução das Validações:** Teste a funcionalidade no ambiente de execução (navegador ou script) e confirme que o console não apresenta erros (`Zero Console Errors`).
4. **Relatório Transparente:** Ao reportar o resultado, liste com clareza:
   - Quais arquivos de código foram modificados ou criados;
   - Quais documentos e diagramas foram sincronizados;
   - Quais testes foram de fato executados e aprovados;
   - Qualquer eventual teste ou limitação que não pôde ser verificada no ambiente.

---

## 4. Princípio da Fonte de Verdade
> **A implementação é a fonte de verdade do Finflow.**  
> A documentação técnica deve sempre explicar a realidade existente no código, e nunca descrever uma arquitetura hipotética ou fantasiosa. Não reescreva arquivos inteiros em pequenas mudanças; altere apenas as partes impactadas, mantendo a integridade do restante.
