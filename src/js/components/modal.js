/**
 * COMPONENTE MODAL — FINFLOW
 * Janelas modais acessíveis para formulários, edições e confirmação de ações destrutivas.
 */

import { escapeHTML } from '../utils/format.js';

let activeBackdrop = null;
let lastFocusedElement = null;
let currentOnCloseCallback = null;

function handleKeyDown(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
}

/**
 * Abre um modal com título, conteúdo customizado e rodapé de ações
 * @param {Object} options
 * @param {string} options.title - Título do modal
 * @param {string|HTMLElement} options.content - Conteúdo em HTML ou elemento DOM
 * @param {string|HTMLElement} [options.footer] - Botões de ação do rodapé
 * @param {Function} [options.onOpen] - Callback chamado após renderização
 * @param {Function} [options.onClose] - Callback chamado ao fechar
 */
export function openModal({ title, content, footer = '', onOpen, onClose }) {
  closeModal(); // Garante fechamento de instâncias anteriores

  lastFocusedElement = document.activeElement;
  currentOnCloseCallback = onClose;

  activeBackdrop = document.createElement('div');
  activeBackdrop.className = 'modal-backdrop';
  activeBackdrop.setAttribute('role', 'dialog');
  activeBackdrop.setAttribute('aria-modal', 'true');
  activeBackdrop.setAttribute('aria-labelledby', 'modal-title');

  const container = document.createElement('div');
  container.className = 'modal-container';

  // Cabeçalho
  const headerEl = document.createElement('div');
  headerEl.className = 'modal-header';
  headerEl.innerHTML = `
    <h2 id="modal-title" class="modal-title">${escapeHTML(title)}</h2>
    <button type="button" class="modal-close-btn" aria-label="Fechar modal">&times;</button>
  `;

  // Corpo
  const bodyEl = document.createElement('div');
  bodyEl.className = 'modal-body';
  if (typeof content === 'string') {
    bodyEl.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    bodyEl.appendChild(content);
  }

  container.appendChild(headerEl);
  container.appendChild(bodyEl);

  // Rodapé opcional
  if (footer) {
    const footerEl = document.createElement('div');
    footerEl.className = 'modal-footer';
    if (typeof footer === 'string') {
      footerEl.innerHTML = footer;
    } else if (footer instanceof HTMLElement) {
      footerEl.appendChild(footer);
    }
    container.appendChild(footerEl);
  }

  activeBackdrop.appendChild(container);
  document.body.appendChild(activeBackdrop);

  // Fechar ao clicar no backdrop (fora do container)
  activeBackdrop.addEventListener('click', (e) => {
    if (e.target === activeBackdrop) {
      closeModal();
    }
  });

  // Fechar no botão X
  headerEl.querySelector('.modal-close-btn').addEventListener('click', closeModal);

  // Fechar com ESC
  document.addEventListener('keydown', handleKeyDown);

  // Transição de abertura
  requestAnimationFrame(() => {
    activeBackdrop.classList.add('is-open');

    // Foco automático no primeiro campo de formulário ou botão de fechar
    const focusable = container.querySelector('input, select, textarea, button:not(.modal-close-btn)');
    if (focusable) {
      focusable.focus();
    } else {
      headerEl.querySelector('.modal-close-btn').focus();
    }

    if (typeof onOpen === 'function') {
      onOpen(container);
    }
  });
}

/**
 * Fecha o modal ativo no momento
 */
export function closeModal() {
  if (!activeBackdrop) return;

  const backdrop = activeBackdrop;
  backdrop.classList.remove('is-open');

  document.removeEventListener('keydown', handleKeyDown);

  setTimeout(() => {
    if (backdrop.parentElement) {
      backdrop.parentElement.removeChild(backdrop);
    }
    if (typeof currentOnCloseCallback === 'function') {
      currentOnCloseCallback();
      currentOnCloseCallback = null;
    }
  }, 220);

  activeBackdrop = null;

  // Restaura o foco para o elemento disparador original
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

/**
 * Modal padronizado para confirmação de ações críticas/destrutivas
 * @param {Object} options
 * @param {string} options.title - Título do diálogo
 * @param {string} options.message - Texto explicativo
 * @param {string} [options.confirmText='Confirmar']
 * @param {string} [options.cancelText='Cancelar']
 * @param {boolean} [options.confirmDanger=false] - Se o botão de confirmação deve ser vermelho
 * @param {Function} options.onConfirm - Callback executado caso o usuário confirme
 */
export function confirmAction({
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmDanger = false,
  onConfirm
}) {
  const content = `<p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.6;">${escapeHTML(message)}</p>`;
  const confirmBtnClass = confirmDanger ? 'btn-danger' : 'btn-primary';

  const footer = `
    <button type="button" class="btn btn-secondary modal-cancel-btn">${escapeHTML(cancelText)}</button>
    <button type="button" class="btn ${confirmBtnClass} modal-confirm-btn">${escapeHTML(confirmText)}</button>
  `;

  openModal({
    title,
    content,
    footer,
    onOpen: (modalEl) => {
      const cancelBtn = modalEl.querySelector('.modal-cancel-btn');
      const confirmBtn = modalEl.querySelector('.modal-confirm-btn');

      cancelBtn.addEventListener('click', closeModal);
      confirmBtn.addEventListener('click', () => {
        closeModal();
        if (typeof onConfirm === 'function') {
          onConfirm();
        }
      });
    }
  });
}
