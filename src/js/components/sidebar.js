/**
 * COMPONENTE SIDEBAR E NAVEGAÇÃO — FINFLOW
 * Renderiza o menu lateral para desktop e a barra de navegação inferior em celulares,
 * sincronizando os estados ativos conforme a rota hash atual.
 */

import { getPreferences } from '../core/storage.js';

export const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Visão geral',
    route: '#/dashboard',
    iconSrc: 'img/icone-dashboard.svg'
  },
  {
    id: 'transacoes',
    label: 'Transações',
    route: '#/transacoes',
    iconSrc: 'img/icone-receitas.svg'
  },
  {
    id: 'orcamentos',
    label: 'Orçamentos e metas',
    route: '#/orcamentos',
    iconSrc: 'img/icone-metas.svg'
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    route: '#/relatorios',
    iconSrc: 'img/icone-relatorios.svg'
  },
  {
    id: 'categorias',
    label: 'Categorias',
    route: '#/categorias',
    iconSrc: 'img/icone-categorias.svg'
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    route: '#/configuracoes',
    iconSrc: 'img/icone-configuracoes.svg'
  }
];

/**
 * Renderiza o HTML da Sidebar de navegação
 * @param {string} currentRoute - Rota atual (ex: '#/dashboard')
 * @returns {string} Fragmento HTML
 */
export function renderSidebar(currentRoute) {
  const prefs = getPreferences();
  const userName = prefs.userName || 'UserTest';
  const initial = userName.charAt(0).toUpperCase();

  const linksHTML = NAV_ITEMS.map(item => {
    const isActive = currentRoute === item.route;
    const activeClass = isActive ? 'active' : '';
    const ariaCurrent = isActive ? 'aria-current="page"' : '';

    return `
      <li>
        <a href="${item.route}" class="nav-link ${activeClass}" ${ariaCurrent} data-nav-id="${item.id}">
          <img src="${item.iconSrc}" alt="" aria-hidden="true" />
          <span>${item.label}</span>
        </a>
      </li>
    `;
  }).join('');

  return `
    <aside class="app-sidebar" id="app-sidebar" aria-label="Navegação principal">
      <div class="sidebar-header">
        <a href="#/" class="sidebar-brand" aria-label="Finflow Início">
          <img src="img/logo-finflow.svg" alt="Finflow" />
        </a>
      </div>

      <nav class="sidebar-nav">
        <ul>
          ${linksHTML}
        </ul>
      </nav>

      <div class="sidebar-footer">
        <div class="user-avatar" title="Perfil do usuário">${initial}</div>
        <div class="user-info">
          <span class="user-name">${userName}</span>
          <span class="user-role">Modo Demonstração</span>
        </div>
      </div>
    </aside>
    <div class="sidebar-backdrop" id="sidebar-backdrop" aria-hidden="true"></div>
  `;
}

/**
 * Renderiza a barra de navegação inferior para telas estreitas (Mobile)
 * @param {string} currentRoute
 * @returns {string} Fragmento HTML
 */
export function renderMobileNav(currentRoute) {
  const mobileShortcuts = [
    { label: 'Início', route: '#/dashboard', iconSrc: 'img/icone-dashboard.svg' },
    { label: 'Trans.', route: '#/transacoes', iconSrc: 'img/icone-receitas.svg' },
    { label: 'Metas', route: '#/orcamentos', iconSrc: 'img/icone-metas.svg' },
    { label: 'Relat.', route: '#/relatorios', iconSrc: 'img/icone-relatorios.svg' },
    { label: 'Mais', route: '#/configuracoes', iconSrc: 'img/icone-configuracoes.svg' }
  ];

  const itemsHTML = mobileShortcuts.map(item => {
    const isActive = currentRoute === item.route;
    const activeClass = isActive ? 'active' : '';
    return `
      <a href="${item.route}" class="mobile-nav-item ${activeClass}">
        <img src="${item.iconSrc}" alt="" aria-hidden="true" />
        <span>${item.label}</span>
      </a>
    `;
  }).join('');

  return `
    <nav class="mobile-nav" aria-label="Navegação mobile">
      ${itemsHTML}
    </nav>
  `;
}

/**
 * Inicializa os ouvintes de eventos para abrir e fechar a gaveta mobile
 */
export function initSidebarEvents() {
  const sidebar = document.getElementById('app-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');

  const closeSidebar = () => {
    if (sidebar) sidebar.classList.remove('sidebar-open');
    if (backdrop) backdrop.classList.remove('active');
  };

  if (backdrop) {
    backdrop.addEventListener('click', closeSidebar);
  }

  // Fecha o menu móvel ao clicar em qualquer link de navegação ou no logo
  if (sidebar) {
    sidebar.querySelectorAll('.nav-link, .sidebar-brand').forEach(link => {
      link.addEventListener('click', closeSidebar);
    });
  }
}

/**
 * Atualiza classes ativas nos links de navegação da barra lateral e mobile nav
 * @param {string} currentRoute - Hash da rota atual (ex: '#/dashboard')
 */
export function updateActiveNavLinks(currentRoute) {
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar) {
    sidebar.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === currentRoute;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  const mobileNav = document.getElementById('app-mobile-nav');
  if (mobileNav) {
    mobileNav.querySelectorAll('.mobile-nav-item').forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === currentRoute;
      link.classList.toggle('active', isActive);
    });
  }
}

