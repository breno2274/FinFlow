// Pagina inicial publica com apresentacao institucional do Finflow e demonstracao de recursos

import React from 'react';

// Apresenta a proposta de valor do Finflow, ilustracao de hero e beneficios principais
export const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <a href="#/" className="sidebar-brand" aria-label="Finflow Início">
          <img src="img/logo-finflow.svg" alt="Finflow" />
        </a>
        <nav className="landing-nav" aria-label="Navegação institucional">
          <a href="#recursos" className="landing-nav-link">Recursos</a>
          <a href="#/sobre" className="landing-nav-link">Sobre</a>
          <a href="#/login" className="landing-nav-link">Entrar</a>
          <a href="#/dashboard" className="btn btn-primary btn-sm">Acessar Painel</a>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-tag">Finanças com mais clareza</span>
            <h1 className="hero-title">Seu controle financeiro.</h1>
            <p className="hero-description">
              Organize receitas, despesas e metas em um painel simples, leve e intuitivo
              para tomar decisões melhores e alcançar sua tranquilidade financeira.
            </p>
            <div className="hero-actions">
              <a href="#/dashboard" className="btn btn-primary btn-lg" id="btn-comecar-agora">
                Começar agora
              </a>
              <a href="#/sobre" className="btn btn-secondary btn-lg" id="btn-saiba-mais">
                Saiba mais
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <img
              src="img/ilustracao-hero-finflow.svg"
              alt="Prévia do painel do Finflow com gráficos de fluxo e cartões de saldo"
              width="620"
              height="420"
            />
          </div>
        </section>

        <section className="landing-features-section" id="recursos">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-badge">
                <img src="img/icone-receitas.svg" alt="" aria-hidden="true" />
              </div>
              <div>
                <h3 className="feature-title">Registro fácil</h3>
                <p className="feature-desc">Lance receitas e despesas rapidamente com categorias personalizadas e datas organizadas.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-badge">
                <img src="img/icone-relatorios.svg" alt="" aria-hidden="true" />
              </div>
              <div>
                <h3 className="feature-title">Leitura de gastos</h3>
                <p className="feature-desc">Entenda para onde vai o seu dinheiro por meio de gráficos limpos e indicadores de rápida absorção.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-badge">
                <img src="img/icone-metas.svg" alt="" aria-hidden="true" />
              </div>
              <div>
                <h3 className="feature-title">Metas financeiras</h3>
                <p className="feature-desc">Estipule limites de orçamento mensais e acompanhe o percentual de conclusão dos seus sonhos de economia.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section" id="sobre">
          <div className="about-container">
            <h2>Engenharia Front-end e UX/UI</h2>
            <p>
              O <strong>Finflow</strong> foi desenvolvido focado em engenharia de software front-end e experiência do usuário.
            </p>
            <p>
              Construído com React, TypeScript e Vite, o projeto funciona de forma autônoma e leve, persistindo seus dados com segurança no seu navegador.
            </p>
            <div style={{ marginTop: 'var(--spacing-6)' }}>
              <a href="#/dashboard" className="btn btn-primary">Experimentar demonstração completa</a>
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

