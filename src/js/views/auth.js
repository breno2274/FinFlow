/**
 * VIEW DE LOGIN E CADASTRO DEMONSTRATIVO — FINFLOW (Tela 02)
 * Interface conceitual de autenticação com separação clara de responsabilidades:
 * elucida que a versão atual roda em modo estático/demonstração com LocalStorage
 * sem expor senhas e permite acesso instantâneo ao painel.
 */

import { getPreferences, savePreferences } from '../core/storage.js';
import { showToast } from '../components/toast.js';

/**
 * Renderiza o HTML da tela de autenticação
 * @returns {string}
 */
export function renderAuthView() {
  const prefs = getPreferences();
  const defaultEmail = prefs.userName ? `${prefs.userName.toLowerCase()}@exemplo.com` : 'usertest@exemplo.com';

  return `
    <div class="auth-view">
      <div class="auth-card-split">
        <!-- Lado Esquerdo: Identidade Visual e Mensagem do Finflow -->
        <div class="auth-side-brand">
          <div>
            <a href="#/" aria-label="Voltar para a página inicial">
              <img src="img/logo-finflow.svg" alt="Finflow" style="height: 32px; width: auto;" />
            </a>
          </div>

          <div class="auth-tagline">
            <h2>Seu dinheiro,<br>mais organizado.</h2>
            <p style="color: var(--color-primary-dark); font-size: var(--font-size-sm); margin-top: var(--spacing-2);">
              Acesse seu espaço para acompanhar despesas, receitas e objetivos financeiros.
            </p>
          </div>

          <div>
            <a href="#/" style="font-size: var(--font-size-xs); color: var(--color-primary-dark); font-weight: 600;">
              &larr; Voltar para a página inicial
            </a>
          </div>
        </div>

        <!-- Lado Direito: Formulário de Autenticação -->
        <div class="auth-form-side">
          <h2 style="font-size: var(--font-size-2xl); margin-bottom: var(--spacing-1);">Bem-vindo de volta</h2>
          <p class="card-subtitle" style="margin-bottom: var(--spacing-6);">Entre para continuar no Finflow</p>

          <form id="form-auth" novalidate>
            <div class="form-group">
              <label for="auth-email" class="form-label">E-mail</label>
              <input
                type="email"
                id="auth-email"
                class="form-input"
                placeholder="voce@email.com"
                value="${defaultEmail}"
                required
              />
            </div>

            <div class="form-group">
              <label for="auth-password" class="form-label">Senha</label>
              <input
                type="password"
                id="auth-password"
                class="form-input"
                placeholder="Sua senha"
                value="demo12345"
                required
              />
            </div>

            <div style="display: flex; flex-direction: column; gap: var(--spacing-3); margin-top: var(--spacing-4);">
              <button type="submit" class="btn btn-primary btn-lg" id="btn-submit-auth" style="width: 100%;">
                Entrar
              </button>
            </div>
          </form>

          <!-- Aviso Educativo sobre Limitações Técnicas do MVP Estático -->
          <div class="auth-disclaimer">
            <strong>Aviso:</strong> Esta primeira versão do Finflow é 100% estática e utiliza LocalStorage.
            Não armazenamos senhas no navegador nem simulamos um backend com falsa segurança.
            O login com sincronização em nuvem e banco de dados faz parte do planejamento da fase seguinte.
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Registra os eventos da tela de autenticação
 * @param {HTMLElement} container
 */
export function initAuthEvents(container = document.getElementById('view-login')) {
  if (!container) return;
  const formAuth = container.querySelector('#form-auth');
  const submitBtn = container.querySelector('#btn-submit-auth');
  const emailInput = container.querySelector('#auth-email');

  let isSubmitting = false;

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;

    const emailVal = (emailInput?.value || '').trim();

    // Extrai o nome do usuário a partir do que vier antes do "@"
    let extractedName = 'UserTest';
    if (emailVal) {
      const beforeAt = emailVal.includes('@') ? emailVal.split('@')[0].trim() : emailVal.trim();
      if (beforeAt) {
        extractedName = beforeAt.charAt(0).toUpperCase() + beforeAt.slice(1);
      }
    }

    // Persiste o nome nas preferências do LocalStorage
    const currentPrefs = getPreferences();
    savePreferences({ ...currentPrefs, userName: extractedName });

    // Atualiza imediatamente os componentes da interface em memória
    const initial = extractedName.charAt(0).toUpperCase();
    document.querySelectorAll('.user-avatar').forEach(el => { el.textContent = initial; });
    document.querySelectorAll('.sidebar-footer .user-name').forEach(el => { el.textContent = extractedName; });

    const greeting = document.getElementById('dashboard-greeting');
    if (greeting) greeting.textContent = `Olá, ${extractedName}!`;

    const prefUsername = document.getElementById('pref-username');
    if (prefUsername) prefUsername.value = extractedName;

    showToast(`Bem-vindo, ${extractedName}!`, 'success');

    setTimeout(() => {
      window.location.hash = '#/dashboard';
      isSubmitting = false;
    }, 350);
  };

  if (formAuth) {
    formAuth.addEventListener('submit', handleLogin);
  }
  if (submitBtn) {
    submitBtn.addEventListener('click', handleLogin);
  }
}
