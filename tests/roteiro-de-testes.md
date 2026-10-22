# Roteiro de Testes e Critérios de Aceitação — Finflow

**Projeto:** Finflow  
**Autor:** Breno dos Santos Santana  
**Ambiente de Execução:** Navegador Web (Google Chrome / Edge)  
**Data da Validação:** 20 de Outubro de 2026

---

## 1. Matriz de Cenários de Teste

| ID | Cenário de Teste | Procedimento de Verificação | Resultado Esperado | Status da Validação |
|---|---|---|---|---|
| **CT-01** | **Abertura da Landing Page** | Acessar a raiz da aplicação (`#/`). | Carregamento da hero, prévia da interface, 3 cartões de benefícios e rodapé com links funcionais de Breno. | **Aprovado** |
| **CT-02** | **Navegação SPA sem recarga** | Clicar nos itens da barra lateral (Dashboard, Transações, Orçamentos, Relatórios, Categorias, Configurações). | A tela ativa atualiza instantaneamente, alterando o hash da URL e o estado visual ativo no menu. | **Aprovado** |
| **CT-03** | **Criação de Transação (Receita/Despesa)** | Clicar em "+ Nova transação", preencher descrição, valor, data e categoria e submeter. | A transação aparece na lista de transações recentes e os cards de saldo e totais recalculam fluidamente sem interrupções de toast. | **Aprovado** |
| **CT-04** | **Validação de Formulário** | Tentar salvar transação sem descrição ou com valor 0. | O formulário bloqueia o envio e exibe mensagens de erro em vermelho nos campos obrigatórios. | **Aprovado** |
| **CT-05** | **Edição de Transação** | Clicar em "Editar" em uma linha existente, alterar o valor e salvar. | O valor atualizado é refletido na tabela e nos gráficos imediatamente. | **Aprovado** |
| **CT-06** | **Exclusão de Transação com Confirmação** | Clicar em "Excluir" em uma transação. | Abre modal de confirmação. Ao confirmar, o item é removido e o saldo recalculado. | **Aprovado** |
| **CT-07** | **Busca e Filtros em Tempo Real** | Digitar um termo no campo de pesquisa da lista de transações e alternar filtros de tipo. | A tabela filtra dinamicamente exibindo apenas as transações correspondentes. | **Aprovado** |
| **CT-08** | **Paginação da Tabela** | Navegar entre páginas numéricas na tabela de movimentações. | A fatia de registros exibida muda corretamente respeitando o limite por página. | **Aprovado** |
| **CT-09** | **Cálculo de Orçamentos e Alertas** | Verificar consumo de categorias com limite estipulado em `#/orcamentos`. | A barra de progresso preenche proporcionalmente, exibindo alerta amarelo em >=80% e vermelho em >100%. | **Aprovado** |
| **CT-10** | **Metas e Aportes** | Clicar em "Adicionar dinheiro" em uma meta existente e informar um valor. | O valor acumulado aumenta e o anel percentual SVG recalcula seu ângulo em tempo real. | **Aprovado** |
| **CT-11** | **Consistência dos Relatórios** | Acessar `#/relatorios` e alternar períodos (3, 6 ou 12 meses). | Gráficos SVG e distribuição de despesas por categoria refletem os totais matematicamente exatos. | **Aprovado** |
| **CT-12** | **Integridade de Categorias em Uso** | Tentar excluir uma categoria vinculada a transações ativas. | O sistema impede a exclusão direta e abre modal orientando a reclassificação dos registros vinculados. | **Aprovado** |
| **CT-13** | **Persistência ao Recarregar a Página** | Cadastrar novos registros e pressionar `F5` / Recarregar no navegador. | Todos os dados permanecem intactos graças à persistência no `LocalStorage`. | **Aprovado** |
| **CT-14** | **Exportação de Backup JSON** | Clicar em "Exportar backup (.json)" em `#/configuracoes`. | O navegador realiza o download do arquivo estruturado com versão do esquema `1.0.0`. | **Aprovado** |
| **CT-15** | **Importação com Validação de JSON** | Importar arquivo JSON corrompido ou sem os nós obrigatórios. | O validador rejeita a operação com mensagem de erro clara sem sobrescrever os dados atuais. | **Aprovado** |
| **CT-16** | **Restauração de Dados de Demonstração** | Clicar em "Restaurar dados de demonstração" e confirmar. | O sistema repovoa as transações e metas padrão de demonstração do Finflow. | **Aprovado** |
| **CT-17** | **Acessibilidade e Navegação por Teclado** | Navegar utilizando a tecla `Tab` e acionar modais. | Anéis de foco `:focus-visible` visíveis, modais fecham com tecla `Esc` e foco é capturado adequadamente. | **Aprovado** |
| **CT-18** | **Responsividade Mobile (< 768px)** | Reduzir a largura da janela para simular celular. | Barra lateral recolhe em gaveta retrátil, barra móvel inferior ativa e tabelas convertem-se em cartões. | **Aprovado** |
| **CT-19** | **Integridade de Recursos da Pasta `img/`** | Inspecionar requisições de rede para todos os SVGs. | Todos os arquivos (`logo-finflow.svg`, `simbolo-finflow.svg`, `ilustracao-hero-finflow.svg`, ícones) existem e retornam HTTP 200. | **Aprovado** |
| **CT-20** | **Console sem Erros** | Inspecionar a aba Console das Ferramentas de Desenvolvedor. | Zero erros de sintaxe ou exceções não tratadas durante todos os fluxos. | **Aprovado** |
| **CT-21** | **Botões Neumórficos 3D e Ações Circulares** | Inspecionar botões "Editar" e "Excluir" em Categorias, Transações e Metas, e testar interação hover/clique. | Renderizados como círculos em relevo 3D com sombra dupla; no hover flutuam e os ícones rotacionam com brilho suave; no clique (:active) afundam realisticamente com sombra inset. | **Aprovado** |
| **CT-22** | **Navegação do Logotipo e Remoção do Botão X** | Estando em qualquer tela interna (`#/dashboard`, `#/relatorios`, etc.), clicar no logotipo "Finflow" da barra lateral e verificar o cabeçalho da sidebar. | A navegação retorna imediatamente para a Landing Page (`#/`) e o botão "X" não existe no cabeçalho da barra lateral. | **Aprovado** |
| **CT-23** | **Símbolos Minimalistas de Ação (Lápis e X Vermelho)** | Inspecionar os botões "Editar" e "Excluir" em Categorias, Transações e Orçamentos/Metas. | Exibem ícone SVG de traço fino de lápis em Editar e X em vermelho em Excluir/Remover sem aspecto de emoji. | **Aprovado** |
| **CT-24** | **Símbolos Gráficos Isolados no Rodapé** | Inspecionar a seção de autoria no rodapé das páginas pública e interna. | Exibe exclusivamente os símbolos vetoriais em SVG do GitHub e do LinkedIn, sem textos auxiliares redundantes. | **Aprovado** |
| **CT-25** | **Tela Sobre o Finflow (`#/sobre`)** | Clicar em "Sobre" na navegação superior ou "Saiba mais" na Landing Page. | Carrega a tela com apresentação institucional, os 8 cartões detalhando as funcionalidades do produto, tecnologias e autoria de Breno. | **Aprovado** |
