/**
 * VIEW DE TRANSAÇÕES — FINFLOW (Tela 04)
 * Lista detalhada de transações com busca em tempo real, filtros por tipo,
 * categoria e período, ordenação, paginação e ações de edição e exclusão.
 */

import { listTransactions, deleteTransaction } from '../services/transaction-service.js';
import { listCategories, getCategoryById } from '../services/category-service.js';
import { openTransactionModal } from './transaction-form.js';
import { confirmAction } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { formatCurrency, escapeHTML } from '../utils/format.js';
import { formatDate } from '../utils/dates.js';
import { renderEmptyState } from '../components/empty-state.js';

// Estado local de filtros e paginação
const state = {
  search: '',
  type: 'todos',
  categoryId: 'todos',
  monthKey: 'todos',
  sortBy: 'date',
  sortOrder: 'desc',
  page: 1,
  pageSize: 8
};

/**
 * Renderiza o corpo da tela de Transações
 * @returns {string} Fragmento HTML
 */
export function renderTransactionsView() {
  const categories = listCategories();
  const { items, totalItems, totalPages, page } = listTransactions(state);

  // Sincroniza categorias no select
  const categorySelect = document.getElementById('filter-category');
  if (categorySelect && categorySelect.options.length <= 1) {
    categories.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.name} (${c.type})`;
      categorySelect.appendChild(opt);
    });
  }
  if (categorySelect) categorySelect.value = state.categoryId;

  const searchInput = document.getElementById('filter-search');
  if (searchInput && searchInput.value !== state.search) searchInput.value = state.search;

  const monthSelect = document.getElementById('filter-month');
  if (monthSelect) monthSelect.value = state.monthKey;

  const typeSelect = document.getElementById('filter-type');
  if (typeSelect) typeSelect.value = state.type;

  // Monta linhas da tabela
  const tableRowsHTML = items.map(tx => {
    const cat = getCategoryById(tx.categoryId) || { name: 'Sem categoria', color: '#99A6A3' };
    const isIncome = tx.type === 'receita';
    const sign = isIncome ? '+' : '-';
    const badgeClass = isIncome ? 'badge-income' : 'badge-expense';
    const amountClass = isIncome ? 'positive' : 'negative';

    return `
      <tr data-id="${tx.id}">
        <td data-label="Descrição">
          <strong>${escapeHTML(tx.description)}</strong>
          ${tx.notes ? `<br><small style="color: var(--color-text-secondary);">${escapeHTML(tx.notes)}</small>` : ''}
        </td>
        <td data-label="Categoria">
          <span class="badge badge-neutral">
            <span class="category-dot" style="background-color: ${cat.color};"></span>
            ${escapeHTML(cat.name)}
          </span>
        </td>
        <td data-label="Data">
          ${formatDate(tx.date, 'full')}
        </td>
        <td data-label="Tipo">
          <span class="badge ${badgeClass}">${isIncome ? 'Receita' : 'Despesa'}</span>
        </td>
        <td data-label="Valor" style="font-weight: 700; color: var(--color-${amountClass});">
          ${sign} ${formatCurrency(tx.amount)}
        </td>
        <td data-label="Ações" class="table-actions">
          <button
            type="button"
            class="btn btn-action-edit btn-edit-tx"
            data-id="${tx.id}"
            title="Editar"
            aria-label="Editar transação ${escapeHTML(tx.description)}"
          >
            <svg class="btn-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button
            type="button"
            class="btn btn-action-delete btn-delete-tx"
            data-id="${tx.id}"
            title="Excluir"
            aria-label="Excluir transação ${escapeHTML(tx.description)}"
          >
            <svg class="btn-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Renderiza botões de paginação
  let paginationButtonsHTML = '';
  if (totalPages > 1) {
    paginationButtonsHTML = `
      <button type="button" class="page-btn" id="btn-page-prev" ${page <= 1 ? 'disabled' : ''} aria-label="Página anterior">&lt;</button>
    `;

    for (let p = 1; p <= totalPages; p++) {
      paginationButtonsHTML += `
        <button type="button" class="page-btn ${p === page ? 'active' : ''}" data-page="${p}">${p}</button>
      `;
    }

    paginationButtonsHTML += `
      <button type="button" class="page-btn" id="btn-page-next" ${page >= totalPages ? 'disabled' : ''} aria-label="Próxima página">&gt;</button>
    `;
  }

  const showingCountText = totalItems > 0
    ? `Mostrando ${items.length} de ${totalItems} transações`
    : 'Nenhuma transação encontrada';

  const tbody = document.getElementById('transactions-tbody');
  const tableWrap = document.getElementById('transactions-table-wrap');
  const emptyStateWrap = document.getElementById('transactions-empty-state');
  const paginationWrap = document.getElementById('transactions-pagination-wrap');

  if (totalItems > 0) {
    if (tableWrap) tableWrap.style.display = 'block';
    if (emptyStateWrap) emptyStateWrap.style.display = 'none';
    if (tbody) tbody.innerHTML = tableRowsHTML;
    if (paginationWrap) {
      paginationWrap.innerHTML = `
        <div class="pagination-bar" style="margin-top: var(--spacing-4); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--spacing-4);">
          <span>${showingCountText}</span>
          <div class="pagination-controls" style="display: flex; gap: var(--spacing-2);">
            ${paginationButtonsHTML}
          </div>
        </div>
      `;
    }
  } else {
    if (tableWrap) tableWrap.style.display = 'none';
    if (paginationWrap) paginationWrap.innerHTML = '';
    if (emptyStateWrap) {
      emptyStateWrap.style.display = 'block';
      emptyStateWrap.innerHTML = renderEmptyState({
        title: 'Nenhuma transação encontrada',
        description: state.search || state.type !== 'todos' || state.categoryId !== 'todos'
          ? 'Não há resultados correspondentes aos filtros aplicados. Tente ajustar os termos de pesquisa.'
          : 'Você ainda não registrou nenhuma receita ou despesa.',
        actionText: '+ Adicionar transação',
        actionId: 'btn-empty-add-tx'
      });
    }
  }

  const container = document.getElementById('view-transactions');
  return container ? container.innerHTML : '';
}

/**
 * Registra ouvintes para os filtros, paginação e ações da tabela
 * @param {HTMLElement} container
 */
export function initTransactionsEvents(container = document.getElementById('view-transactions')) {
  if (!container) return;
  if (container.dataset.eventsInit === 'true') return;
  container.dataset.eventsInit = 'true';

  const addBtn = container.querySelector('#btn-add-transaction');
  const searchInput = container.querySelector('#filter-search');
  const monthSelect = container.querySelector('#filter-month');
  const typeSelect = container.querySelector('#filter-type');
  const categorySelect = container.querySelector('#filter-category');
  const clearFiltersBtn = container.querySelector('#btn-clear-filters');

  if (addBtn) addBtn.addEventListener('click', () => openTransactionModal());

  // Busca em tempo real com debounce simples
  let searchTimeout = null;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        state.search = e.target.value;
        state.page = 1;
        renderTransactionsView();
      }, 250);
    });
  }

  // Filtros de seleção
  if (monthSelect) {
    monthSelect.addEventListener('change', (e) => {
      state.monthKey = e.target.value;
      state.page = 1;
      renderTransactionsView();
    });
  }

  if (typeSelect) {
    typeSelect.addEventListener('change', (e) => {
      state.type = e.target.value;
      state.page = 1;
      renderTransactionsView();
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      state.categoryId = e.target.value;
      state.page = 1;
      renderTransactionsView();
    });
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      state.search = '';
      state.type = 'todos';
      state.categoryId = 'todos';
      state.monthKey = 'todos';
      state.page = 1;
      renderTransactionsView();
    });
  }

  // Delegação de cliques para botões dinâmicos (Paginação, Adicionar, Editar e Excluir)
  container.addEventListener('click', (e) => {
    // Paginação
    const pageBtn = e.target.closest('.page-btn[data-page]');
    if (pageBtn) {
      state.page = parseInt(pageBtn.dataset.page, 10);
      renderTransactionsView();
      return;
    }

    if (e.target.closest('#btn-page-prev')) {
      if (state.page > 1) {
        state.page--;
        renderTransactionsView();
      }
      return;
    }

    if (e.target.closest('#btn-page-next')) {
      state.page++;
      renderTransactionsView();
      return;
    }

    // Botão de adicionar no estado vazio
    if (e.target.closest('#btn-empty-add-tx')) {
      openTransactionModal();
      return;
    }

    // Editar
    const editBtn = e.target.closest('.btn-edit-tx');
    if (editBtn) {
      openTransactionModal(editBtn.dataset.id);
      return;
    }

    // Excluir
    const deleteBtn = e.target.closest('.btn-delete-tx');
    if (deleteBtn) {
      confirmAction({
        title: 'Excluir transação',
        message: 'Tem certeza que deseja excluir esta transação? O valor será removido do saldo e dos relatórios permanentemente.',
        confirmText: 'Excluir transação',
        confirmDanger: true,
        onConfirm: () => {
          deleteTransaction(deleteBtn.dataset.id);
          showToast('Transação excluída com sucesso.', 'info');
        }
      });
      return;
    }
  });
}

