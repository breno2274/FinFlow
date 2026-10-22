/**
 * ENTRADA PRINCIPAL DA APLICAÇÃO — FINFLOW (app.js)
 * Inicializa a persistência local, o tema visual, o roteamento e os ouvintes globais.
 */

import { initStorage, getPreferences } from './core/storage.js';
import { navigate, refreshCurrentView } from './router.js';
import { closeModal } from './components/modal.js';

// Expõe fechamento de modal para conveniência no escopo global
window.finflowCloseModal = closeModal;

/**
 * Aplica o tema visual preferido (Claro ou Escuro) no documento
 */
function applyStoredTheme() {
  const prefs = getPreferences();
  if (prefs && prefs.theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

/**
 * Inicialização do Finflow
 */
function initApp() {
  // 1. Inicializa LocalStorage com dados padrão de demonstração se vazio
  initStorage();

  // 2. Aplica configurações de tema
  applyStoredTheme();

  // 3. Registra ouvinte para alterações na rota hash da URL
  window.addEventListener('hashchange', () => {
    navigate();
  });

  // 4. Registra ouvinte para atualizações reativas de dados
  window.addEventListener('finflow-data-changed', () => {
    refreshCurrentView();
  });

  window.addEventListener('finflow-refresh-view', () => {
    refreshCurrentView();
  });

  // 5. Renderiza a primeira tela com base na rota atual
  navigate();
}

// Inicia imediatamente se o DOM já estiver carregado ou no evento DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
