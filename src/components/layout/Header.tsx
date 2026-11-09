// Cabecalho superior fixo com titulo contextual da tela e botao de menu para celulares

import React from 'react';
import { getPreferences } from '../../services/storage';

interface HeaderProps {
  title: string;
  onOpenMobileMenu: () => void;
}

// Renderiza a barra superior sincronizando o titulo da tela e o avatar do usuario
export const Header: React.FC<HeaderProps> = ({ title, onOpenMobileMenu }) => {
  const prefs = getPreferences();
  const userName = prefs.userName || 'UserTest';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          id="btn-mobile-menu"
          aria-label="Abrir menu de navegação lateral"
          onClick={onOpenMobileMenu}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div className="page-title-wrap">
          <h1 id="topbar-page-title">{title}</h1>
        </div>
      </div>

      <div className="header-right">
        <a href="#/configuracoes" className="user-avatar" id="topbar-user-avatar" title="Configurações de perfil">
          {initial}
        </a>
      </div>
    </header>
  );
};

