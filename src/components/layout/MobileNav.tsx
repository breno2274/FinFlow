// Barra de navegacao inferior fixa para acesso rapido em dispositivos moveis

import React from 'react';

interface MobileNavProps {
  currentRoute: string;
}

const SHORTCUTS = [
  { label: 'Início', route: '#/dashboard', iconSrc: 'img/icone-dashboard.svg' },
  { label: 'Trans.', route: '#/transacoes', iconSrc: 'img/icone-receitas.svg' },
  { label: 'Metas', route: '#/orcamentos', iconSrc: 'img/icone-metas.svg' },
  { label: 'Relat.', route: '#/relatorios', iconSrc: 'img/icone-relatorios.svg' },
  { label: 'Mais', route: '#/configuracoes', iconSrc: 'img/icone-configuracoes.svg' }
];

// Monta os botoes de atalho inferiores com identificacao visual do item ativo
export const MobileNav: React.FC<MobileNavProps> = ({ currentRoute }) => {
  return (
    <nav className="mobile-nav" id="app-mobile-nav" aria-label="Navegação mobile">
      {SHORTCUTS.map(item => {
        const isActive = currentRoute === item.route;
        return (
          <a
            key={item.route}
            href={item.route}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <img src={item.iconSrc} alt="" aria-hidden="true" />
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
};

