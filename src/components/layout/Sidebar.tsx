// Barra de navegacao lateral para desktop e gaveta retratil para celulares

import React from 'react';
import { getPreferences } from '../../services/storage';

interface SidebarProps {
  currentRoute: string;
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Visão geral', route: '#/dashboard', iconSrc: 'img/icone-dashboard.svg' },
  { id: 'transacoes', label: 'Transações', route: '#/transacoes', iconSrc: 'img/icone-receitas.svg' },
  { id: 'orcamentos', label: 'Orçamentos e metas', route: '#/orcamentos', iconSrc: 'img/icone-metas.svg' },
  { id: 'relatorios', label: 'Relatórios', route: '#/relatorios', iconSrc: 'img/icone-relatorios.svg' },
  { id: 'categorias', label: 'Categorias', route: '#/categorias', iconSrc: 'img/icone-categorias.svg' },
  { id: 'configuracoes', label: 'Configurações', route: '#/configuracoes', iconSrc: 'img/icone-configuracoes.svg' }
];

// Monta o menu lateral destacando o item correspondente a tela atualmente aberta
export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, isOpen, onClose }) => {
  const prefs = getPreferences();
  const userName = prefs.userName || 'UserTest';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <>
      <aside
        className={`app-sidebar ${isOpen ? 'sidebar-open' : ''}`}
        id="app-sidebar"
        aria-label="Navegação principal"
      >
        <div className="sidebar-header">
          <a href="#/" className="sidebar-brand" aria-label="Finflow Início" onClick={onClose}>
            <img src="img/logo-finflow.svg" alt="Finflow" />
          </a>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {NAV_ITEMS.map(item => {
              const isActive = currentRoute === item.route;
              return (
                <li key={item.id}>
                  <a
                    href={item.route}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={onClose}
                  >
                    <img src={item.iconSrc} alt="" aria-hidden="true" />
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar" title="Perfil do usuário">
            {initial}
          </div>
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">Modo Demonstração</span>
          </div>
        </div>
      </aside>

      <div
        className={`sidebar-backdrop ${isOpen ? 'active' : ''}`}
        id="sidebar-backdrop"
        aria-hidden="true"
        onClick={onClose}
      />
    </>
  );
};

