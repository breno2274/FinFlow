/**
 * COMPONENTE ESTADO VAZIO — FINFLOW
 * Apresenta ilustrações amigáveis e orientações quando não há dados registrados.
 */

import { escapeHTML } from '../utils/format.js';

/**
 * Retorna o HTML estruturado de um estado vazio com imagem e ação opcional
 * @param {Object} options
 * @param {string} options.title - Título do estado
 * @param {string} options.description - Mensagem orientadora
 * @param {string} [options.actionText] - Texto do botão
 * @param {string} [options.actionId] - ID para ligar eventos ao botão
 * @param {string} [options.imageSrc='img/ilustracao-sem-transacoes.svg']
 * @returns {string} Fragmento HTML
 */
export function renderEmptyState({
  title,
  description,
  actionText = '',
  actionId = '',
  imageSrc = 'img/ilustracao-sem-transacoes.svg'
}) {
  const buttonHTML = actionText
    ? `<button type="button" class="btn btn-primary btn-sm" id="${escapeHTML(actionId)}">${escapeHTML(actionText)}</button>`
    : '';

  return `
    <div class="empty-state">
      <img src="${imageSrc}" alt="" class="empty-state-img" aria-hidden="true" />
      <h3 class="empty-state-title">${escapeHTML(title)}</h3>
      <p class="empty-state-desc">${escapeHTML(description)}</p>
      ${buttonHTML}
    </div>
  `;
}
