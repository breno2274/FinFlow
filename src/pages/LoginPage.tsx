// Tela de acesso com modo de demonstracao e informacoes sobre persistencia local

import React, { useState } from 'react';

// Apresenta o formulario conceitual de autenticacao e direciona para o painel de controle
export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('usertest@exemplo.com');
  const [password, setPassword] = useState('demo12345');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.hash = '#/dashboard';
  };

  return (
    <div className="auth-view">
      <div className="auth-card-split">
        <div className="auth-side-brand">
          <div>
            <a href="#/" aria-label="Voltar para a página inicial">
              <img src="img/logo-finflow.svg" alt="Finflow" style={{ height: '32px', width: 'auto' }} />
            </a>
          </div>

          <div className="auth-tagline">
            <h2>Seu dinheiro,<br />mais organizado.</h2>
            <p style={{ color: 'var(--color-primary-dark)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-2)' }}>
              Acesse seu espaço para acompanhar despesas, receitas e objetivos financeiros.
            </p>
          </div>

          <div>
            <a href="#/" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
              &larr; Voltar para a página inicial
            </a>
          </div>
        </div>

        <div className="auth-form-side">
          <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-1)' }}>Bem-vindo de volta</h2>
          <p className="card-subtitle" style={{ marginBottom: 'var(--spacing-6)' }}>Entre para continuar no Finflow</p>

          <form id="form-auth" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="auth-email" className="form-label">E-mail</label>
              <input
                type="email"
                id="auth-email"
                className="form-input"
                placeholder="voce@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="auth-password" className="form-label">Senha</label>
              <input
                type="password"
                id="auth-password"
                className="form-input"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <button type="submit" className="btn btn-primary btn-lg" id="btn-submit-auth" style={{ width: '100%' }}>
                Entrar
              </button>
            </div>
          </form>

          <div className="auth-disclaimer">
            <strong>Aviso:</strong> Esta versão do Finflow utiliza LocalStorage seguro.
            Não armazenamos senhas no navegador nem simulamos um backend com falsa segurança.
            O login com sincronização em nuvem e banco de dados faz parte do planejamento da fase seguinte.
          </div>
        </div>
      </div>
    </div>
  );
};

