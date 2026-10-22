/**
 * ROTEADOR CLIENT-SIDE — FINFLOW (router.js)
 * Sistema de rotas baseado em Hash (#/) leve e autônomo, compatível com GitHub Pages
 * sem necessidade de configuração de servidor ou roteamento HTML5 pushState.
 */

import { renderLandingView } from './views/landing.js';
import { renderAboutView } from './views/about.js';
import { renderDashboardView, initDashboardEvents } from './views/dashboard.js';
import { renderTransactionsView, initTransactionsEvents } from './views/transactions.js';
import { renderBudgetsView, initBudgetsEvents } from './views/budgets.js';
import { renderReportsView, initReportsEvents } from './views/reports.js';
import { renderCategoriesView, initCategoriesEvents } from './views/categories.js';
import { renderSettingsView, initSettingsEvents } from './views/settings.js';
import { renderAuthView, initAuthEvents } from './views/auth.js';
import { updateActiveNavLinks, initSidebarEvents } from './components/sidebar.js';
import { openTransactionModal } from './views/transaction-form.js';
import { getPreferences } from './core/storage.js';

const ROUTES = {
  '#/': {
    title: 'Finflow',
    standalone: true,
    screenId: 'view-landing',
    render: renderLandingView
  },
  '#/sobre': {
    title: 'Sobre o Finflow — Funcionalidades e Propósito',
    standalone: true,
    screenId: 'view-about',
    render: renderAboutView
  },
  '#/login': {
    title: 'Entrar — Finflow',
    standalone: true,
    screenId: 'view-login',
    render: renderAuthView,
    init: initAuthEvents
  },
  '#/dashboard': {
    title: 'Visão geral — Finflow',
    standalone: false,
    screenId: 'view-dashboard',
    pageTitle: 'Visão geral',
    pageSubtitle: 'Veja sua vida financeira em um só lugar.',
    render: renderDashboardView,
    init: initDashboardEvents
  },
  '#/transacoes': {
    title: 'Transações — Finflow',
    standalone: false,
    screenId: 'view-transactions',
    pageTitle: 'Registro de transações',
    pageSubtitle: 'Controle de receitas e despesas com filtros e pesquisa.',
    render: renderTransactionsView,
    init: initTransactionsEvents
  },
  '#/orcamentos': {
    title: 'Orçamentos e Metas — Finflow',
    standalone: false,
    screenId: 'view-budgets',
    pageTitle: 'Orçamentos e metas',
    pageSubtitle: 'Limites de gastos por categoria e acompanhamento de objetivos.',
    render: renderBudgetsView,
    init: initBudgetsEvents
  },
  '#/relatorios': {
    title: 'Relatórios Financeiros — Finflow',
    standalone: false,
    screenId: 'view-reports',
    pageTitle: 'Relatórios financeiros',
    pageSubtitle: 'Análise comparativa do seu fluxo de receitas e despesas.',
    render: renderReportsView,
    init: initReportsEvents
  },
  '#/categorias': {
    title: 'Categorias — Finflow',
    standalone: false,
    screenId: 'view-categories',
    pageTitle: 'Categorias',
    pageSubtitle: 'Organização e classificação de movimentações.',
    render: renderCategoriesView,
    init: initCategoriesEvents
  },
  '#/configuracoes': {
    title: 'Configurações e Backup — Finflow',
    standalone: false,
    screenId: 'view-settings',
    pageTitle: 'Configurações e backup',
    pageSubtitle: 'Preferências pessoais e exportação/importação de dados.',
    render: renderSettingsView,
    init: initSettingsEvents
  }
};

let appShellInitialized = false;

/**
 * Inicializa os ouvintes fixos da casca da aplicação (Sidebar e Header)
 */
function initAppShell() {
  if (appShellInitialized) return;
  appShellInitialized = true;

  initSidebarEvents();

  const mobileMenuBtn = document.getElementById('btn-mobile-menu');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const sidebar = document.getElementById('app-sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      if (sidebar) sidebar.classList.add('sidebar-open');
      if (backdrop) backdrop.classList.add('active');
    });
  }
}

/**
 * Normaliza o hash da URL atual
 * @returns {string}
 */
export function getCurrentHash() {
  const hash = window.location.hash || '#/';
  // Direciona #sobre e #/sobre para a tela de Sobre
  if (hash === '#sobre' || hash.startsWith('#/sobre')) {
    return '#/sobre';
  }
  // Trata âncoras locais como #recursos dentro da landing
  if (hash.startsWith('#recursos')) {
    return '#/';
  }
  return hash.split('?')[0];
}

/**
 * Renderiza a view correspondente à rota atual
 */
export function navigate() {
  const hash = getCurrentHash();
  const route = ROUTES[hash] || ROUTES['#/'];

  document.title = route.title;

  // Atualiza identificação de usuário
  const prefs = getPreferences();
  const userName = prefs.userName || 'UserTest';
  const initial = userName.charAt(0).toUpperCase();

  document.querySelectorAll('.user-avatar').forEach(el => {
    el.textContent = initial;
  });
  document.querySelectorAll('.sidebar-footer .user-name').forEach(el => {
    el.textContent = userName;
  });

  if (route.standalone) {
    // Telas públicas e isoladas (Landing, Sobre, Login)
    const appShell = document.getElementById('view-app-shell');
    if (appShell) appShell.classList.remove('active');

    // Desativa telas principais e ativa a solicitada
    document.querySelectorAll('.view-screen').forEach(screen => {
      if (screen.id !== 'view-app-shell') {
        screen.classList.toggle('active', screen.id === route.screenId);
      }
    });

    const targetEl = document.getElementById(route.screenId);
    if (typeof route.render === 'function') {
      route.render(targetEl);
    }
    if (typeof route.init === 'function') {
      route.init(targetEl);
    }
  } else {
    // Telas operacionais internas (Dashboard, Transações, etc.)
    // Desativa telas standalone
    document.querySelectorAll('.view-screen').forEach(screen => {
      if (screen.id !== 'view-app-shell') {
        screen.classList.remove('active');
      }
    });

    // Ativa casca do app
    const appShell = document.getElementById('view-app-shell');
    if (appShell) appShell.classList.add('active');

    initAppShell();

    // Atualiza cabeçalho limpo com o título da tela e sincroniza inicial do avatar
    const titleEl = document.getElementById('topbar-page-title');
    if (titleEl) titleEl.textContent = route.pageTitle || 'Finflow';

    const avatarEl = document.getElementById('topbar-user-avatar');
    if (avatarEl) {
      const prefs = getPreferences();
      const userName = prefs?.userName || 'UserTest';
      avatarEl.textContent = userName.charAt(0).toUpperCase();
    }

    // Atualiza navegação ativa
    updateActiveNavLinks(hash);

    // Alterna a subtela ativa
    document.querySelectorAll('.subpage-view').forEach(subpage => {
      subpage.classList.toggle('active', subpage.id === route.screenId);
    });

    const targetSubpage = document.getElementById(route.screenId);
    if (typeof route.render === 'function') {
      route.render(targetSubpage);
    }
    if (typeof route.init === 'function') {
      route.init(targetSubpage);
    }
  }

  // Rola suavemente para o topo a cada mudança de rota
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Atualiza o conteúdo da tela ativa sem remontar a casca do app
 */
export function refreshCurrentView() {
  const hash = getCurrentHash();
  const route = ROUTES[hash] || ROUTES['#/'];
  if (!route) return;

  const targetSubpage = document.getElementById(route.screenId);
  if (targetSubpage && typeof route.render === 'function') {
    route.render(targetSubpage);
  }
}

