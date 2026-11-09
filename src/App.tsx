// Componente raiz e roteador client-side do Finflow baseado no hash da URL

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';

import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { ReportsPage } from './pages/ReportsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { SettingsPage } from './pages/SettingsPage';

import { initStorage, getPreferences } from './services/storage';

// Normaliza o hash da URL para identificar a tela atual
function getNormalizedHash(): string {
  const hash = window.location.hash || '#/';
  if (hash === '#sobre' || hash.startsWith('#/sobre')) {
    return '#/sobre';
  }
  if (hash.startsWith('#recursos')) {
    return '#/';
  }
  return hash.split('?')[0];
}

// Mapeamento de titulos de pagina para o cabecalho
const PAGE_TITLES: Record<string, string> = {
  '#/dashboard': 'Visão geral',
  '#/transacoes': 'Registro de transações',
  '#/orcamentos': 'Orçamentos e metas',
  '#/relatorios': 'Relatórios financeiros',
  '#/categorias': 'Categorias',
  '#/configuracoes': 'Configurações e backup'
};

// Componente principal que coordena o roteamento e a alternancia de telas
export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>(getNormalizedHash());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Inicializa o banco local e aplica o tema visual salvo
  useEffect(() => {
    initStorage();
    const prefs = getPreferences();
    if (prefs.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  // Escuta alteracoes na rota hash e rola suavemente para o topo da tela
  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = getNormalizedHash();
      setCurrentRoute(nextRoute);
      setIsMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Telas publicas isoladas que nao utilizam a barra lateral nem a estrutura interna do aplicativo
  if (currentRoute === '#/' || currentRoute === '') {
    return <LandingPage />;
  }
  if (currentRoute === '#/sobre') {
    return <AboutPage />;
  }
  if (currentRoute === '#/login') {
    return <LoginPage />;
  }

  // Telas internas operacionais renderizadas dentro da casca da aplicacao (App Shell)
  const renderSubpage = () => {
    switch (currentRoute) {
      case '#/dashboard':
        return <DashboardPage />;
      case '#/transacoes':
        return <TransactionsPage />;
      case '#/orcamentos':
        return <BudgetsPage />;
      case '#/relatorios':
        return <ReportsPage />;
      case '#/categorias':
        return <CategoriesPage />;
      case '#/configuracoes':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  const pageTitle = PAGE_TITLES[currentRoute] || 'Finflow';

  return (
    <div className="app-shell" id="view-app-shell" style={{ display: 'flex' }}>
      <Sidebar
        currentRoute={currentRoute}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="app-main">
        <Header
          title={pageTitle}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="app-content">
          {renderSubpage()}
        </main>

        <footer className="app-footer">
          <p>Finflow &mdash; projeto de controle financeiro desenvolvido por <strong>Breno dos Santos Santana</strong>.</p>
          <div className="footer-author-links">
            <a href="https://github.com/breno2274" target="_blank" rel="noopener noreferrer" className="footer-link" aria-label="GitHub de Breno dos Santos Santana" title="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/breno-dos-santos-santana-2723a4213" target="_blank" rel="noopener noreferrer" className="footer-link" aria-label="LinkedIn de Breno dos Santos Santana" title="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>
          </div>
        </footer>
      </div>

      <MobileNav currentRoute={currentRoute} />
    </div>
  );
};

