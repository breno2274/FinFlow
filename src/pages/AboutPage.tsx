// Pagina institucional Sobre com detalhamento das funcionalidades e tecnologia

import React from 'react';

// Apresenta a motivacao do Finflow, os 8 recursos principais e a arquitetura adotada
export const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <header className="landing-header">
        <a href="#/" className="sidebar-brand" aria-label="Finflow Início">
          <img src="img/logo-finflow.svg" alt="Finflow" />
        </a>
        <nav className="landing-nav" aria-label="Navegação institucional">
          <a href="#/" className="landing-nav-link">Início</a>
          <a href="#/sobre" className="landing-nav-link active">Sobre</a>
          <a href="#/login" className="landing-nav-link">Entrar</a>
          <a href="#/dashboard" className="btn btn-primary btn-sm">Acessar Painel</a>
        </nav>
      </header>

      <main className="about-main">
        <section className="about-hero-section">
          <span className="hero-tag">Conheça o Finflow</span>
          <h1 className="about-hero-title">Controle financeiro inteligente, visual e sem complicação.</h1>
          <p className="about-hero-subtitle">
            O Finflow é uma plataforma web completa de finanças pessoais, desenvolvida para entregar controle total
            sobre suas movimentações, orçamentos e metas, priorizando transparência, privacidade e excelência de interface.
          </p>
          <div className="about-hero-actions">
            <a href="#/dashboard" className="btn btn-primary btn-lg">Explorar Painel Agora</a>
            <a href="#/" className="btn btn-secondary btn-lg">Voltar ao Início</a>
          </div>
        </section>

        <section className="about-features-section" aria-label="Funcionalidades do Finflow">
          <div className="section-title-wrap">
            <span className="hero-tag" style={{ backgroundColor: 'var(--color-mint)', color: 'var(--color-primary-dark)' }}>
              Recursos e Capacidades
            </span>
            <h2 className="about-section-heading">Tudo o que você precisa para dominar suas finanças</h2>
            <p className="about-section-subheading">Cada tela foi projetada para resolver um desafio real de organização e planejamento financeiro pessoal.</p>
          </div>

          <div className="about-features-grid">
            <article className="about-feature-card">
              <div className="about-feature-header">
                <div className="about-feature-icon-wrap">
                  <img src="img/icone-dashboard.svg" alt="" aria-hidden="true" />
                </div>
                <span className="about-feature-number">01</span>
              </div>
              <h3 className="about-feature-title">Painel Executivo e Dashboard em Tempo Real</h3>
              <p className="about-feature-desc">Acompanhe seu saldo consolidado, receitas do mês, despesas e taxa de metas atingidas. Gráfico vetorial de fluxo financeiro em SVG com curvas suaves para visualizar entradas e saídas dos últimos 6 meses.</p>
            </article>

            <article className="about-feature-card">
              <div className="about-feature-header">
                <div className="about-feature-icon-wrap">
                  <img src="img/icone-receitas.svg" alt="" aria-hidden="true" />
                </div>
                <span className="about-feature-number">02</span>
              </div>
              <h3 className="about-feature-title">Gestão Inteligente de Transações</h3>
              <p className="about-feature-desc">Lance receitas e despesas com valores em Real (BRL), data e categoria personalizada. Tabela dinâmica com busca em tempo real por descrição, filtros rápidos por período, tipo e paginação sob medida.</p>
            </article>

            <article className="about-feature-card">
              <div className="about-feature-header">
                <div className="about-feature-icon-wrap">
                  <img src="img/icone-despesas.svg" alt="" aria-hidden="true" />
                </div>
                <span className="about-feature-number">03</span>
              </div>
              <h3 className="about-feature-title">Tetos de Gastos e Limites de Orçamento</h3>
              <p className="about-feature-desc">Estipule orçamentos mensais para categorias-chave (Moradia, Alimentação, Lazer). Barras de consumo inteligentes com alerta em amarelo ao atingir 80% e vermelho ao estourar o limite de 100%.</p>
            </article>

            <article className="about-feature-card">
              <div className="about-feature-header">
                <div className="about-feature-icon-wrap">
                  <img src="img/icone-metas.svg" alt="" aria-hidden="true" />
                </div>
                <span className="about-feature-number">04</span>
              </div>
              <h3 className="about-feature-title">Metas Financeiras e Acompanhamento de Economia</h3>
              <p className="about-feature-desc">Planeje viagens, reservas de emergência ou grandes aquisições. Visualize a evolução com anéis circulares percentuais em SVG e adicione aportes rápidos com o botão de aporte.</p>
            </article>

            <article className="about-feature-card">
              <div className="about-feature-header">
                <div className="about-feature-icon-wrap">
                  <img src="img/icone-relatorios.svg" alt="" aria-hidden="true" />
                </div>
                <span className="about-feature-number">05</span>
              </div>
              <h3 className="about-feature-title">Relatórios Analíticos e Distribuição de Gastos</h3>
              <p className="about-feature-desc">Compreenda a evolução financeira através de gráficos comparativos de barras mensais e análise proporcional de despesas por categoria nos períodos de 3, 6 ou 12 meses.</p>
            </article>

            <article className="about-feature-card">
              <div className="about-feature-header">
                <div className="about-feature-icon-wrap">
                  <img src="img/icone-categorias.svg" alt="" aria-hidden="true" />
                </div>
                <span className="about-feature-number">06</span>
              </div>
              <h3 className="about-feature-title">Categorias Customizadas com Proteção de Dados</h3>
              <p className="about-feature-desc">Crie e organize categorias com cores exclusivas. O sistema possui trava inteligente que impede a exclusão acidental de categorias com movimentações vinculadas, oferecendo reclassificação assistida.</p>
            </article>

            <article className="about-feature-card">
              <div className="about-feature-header">
                <div className="about-feature-icon-wrap">
                  <img src="img/icone-configuracoes.svg" alt="" aria-hidden="true" />
                </div>
                <span className="about-feature-number">07</span>
              </div>
              <h3 className="about-feature-title">Privacidade Total e Backup Local em JSON e CSV</h3>
              <p className="about-feature-desc">Seus dados financeiros permanecem 100% no seu dispositivo via LocalStorage, sem rastreadores. Exporte backups completos em JSON versionado e baixe extratos prontos para o Excel em CSV.</p>
            </article>

            <article className="about-feature-card">
              <div className="about-feature-header">
                <div className="about-feature-icon-wrap">
                  <img src="img/simbolo-finflow.svg" alt="" aria-hidden="true" />
                </div>
                <span className="about-feature-number">08</span>
              </div>
              <h3 className="about-feature-title">Design Responsivo, Acessibilidade e Modo Escuro</h3>
              <p className="about-feature-desc">Interface adaptável para smartphones com gaveta retrátil e barra móvel de atalhos, contraste auditado conforme diretrizes WCAG AA, navegação total por teclado e suporte a tema escuro.</p>
            </article>
          </div>
        </section>

        <section className="about-tech-section">
          <div className="about-tech-card">
            <h2 className="about-section-heading" style={{ color: 'var(--color-text)' }}>Engenharia Front-end Limpa com React e TypeScript</h2>
            <p className="about-tech-desc">
              O <strong>FinFlow</strong> foi concebido por <strong>Breno dos Santos Santana</strong>. O projeto foi projetado para portfólio em desenvolvimento web moderno.
            </p>

            <div className="about-tech-pills">
              <span className="about-tech-pill">React 18</span>
              <span className="about-tech-pill">TypeScript Estrito</span>
              <span className="about-tech-pill">Vite</span>
              <span className="about-tech-pill">HTML5 Semântico</span>
              <span className="about-tech-pill">Vanilla CSS & Tokens</span>
              <span className="about-tech-pill">LocalStorage Versionado</span>
              <span className="about-tech-pill">Gráficos SVG Nativos</span>
              <span className="about-tech-pill">Exportação CSV</span>
              <span className="about-tech-pill">Acessibilidade WCAG AA</span>
            </div>

            <div style={{ marginTop: 'var(--spacing-8)', display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#/dashboard" className="btn btn-primary">Começar a usar o Finflow</a>
              <a href="#/" className="btn btn-secondary">Página inicial</a>
            </div>
          </div>
        </section>
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
  );
};

