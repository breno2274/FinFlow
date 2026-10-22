/**
 * VIEW DE CATEGORIAS — FINFLOW (Tela 08)
 * Gestão de categorias de receitas e despesas com proteção de integridade
 * para impedir transações órfãs através de reclassificação assistida.
 */

import {
  listCategories,
  getCategoryUsageCount,
  createCategory,
  updateCategory,
  deleteCategory,
  reassignAndDeleteCategory,
  getCategoryById
} from '../services/category-service.js';
import { openModal, closeModal, confirmAction } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { escapeHTML } from '../utils/format.js';

let categorySearchTerm = '';

// Paleta pré-selecionada de cores elegantes e legíveis
const PRESET_COLORS = [
  '#76B8B2', '#4D9690', '#329B76', '#A9DDBA',
  '#D96868', '#E5A83B', '#6E9BD9', '#9C88FF',
  '#F38181', '#303960', '#546E7A', '#F7B731'
];

/**
 * Renderiza o HTML da tela de Categorias
 * @returns {string}
 */
export function renderCategoriesView() {
  const allCategories = listCategories();

  // Aplica filtro de pesquisa se houver
  const filtered = categorySearchTerm
    ? allCategories.filter(c => c.name.toLowerCase().includes(categorySearchTerm.toLowerCase()))
    : allCategories;

  const incomeCategories = filtered.filter(c => c.type === 'receita');
  const expenseCategories = filtered.filter(c => c.type === 'despesa');

  const badgeIncome = document.getElementById('badge-count-income');
  if (badgeIncome) badgeIncome.textContent = `${incomeCategories.length} categorias`;

  const badgeExpense = document.getElementById('badge-count-expense');
  if (badgeExpense) badgeExpense.textContent = `${expenseCategories.length} categorias`;

  const renderCategoryList = (cats) => {
    if (cats.length === 0) {
      return '<p style="color: var(--color-text-secondary); padding: var(--spacing-4); text-align: center;">Nenhuma categoria encontrada.</p>';
    }

    return cats.map(cat => {
      const usageCount = getCategoryUsageCount(cat.id);
      return `
        <div class="category-row" data-id="${cat.id}">
          <div class="cat-row-left">
            <span class="cat-color-badge" style="background-color: ${cat.color};"></span>
            <span class="cat-title">${escapeHTML(cat.name)}</span>
            <span class="cat-badge-count">(${usageCount} transações)</span>
          </div>
          <div class="category-actions">
            <button
              type="button"
              class="btn btn-action-edit btn-edit-category"
              data-id="${cat.id}"
              title="Editar"
              aria-label="Editar categoria ${escapeHTML(cat.name)}"
            >
              <svg class="btn-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button
              type="button"
              class="btn btn-action-delete btn-delete-category"
              data-id="${cat.id}"
              data-name="${escapeHTML(cat.name)}"
              data-type="${cat.type}"
              data-count="${usageCount}"
              title="Excluir"
              aria-label="Excluir categoria ${escapeHTML(cat.name)}"
            >
              <svg class="btn-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');
  };

  const incomeContainer = document.getElementById('categories-income-list');
  if (incomeContainer) incomeContainer.innerHTML = renderCategoryList(incomeCategories);

  const expenseContainer = document.getElementById('categories-expense-list');
  if (expenseContainer) expenseContainer.innerHTML = renderCategoryList(expenseCategories);

  const container = document.getElementById('view-categories');
  return container ? container.innerHTML : '';
}


/**
 * Modal para criação ou edição de categoria
 */
function openCategoryFormModal(categoryId = null) {
  const isEditing = Boolean(categoryId);
  const existingCat = isEditing ? getCategoryById(categoryId) : null;
  let selectedColor = existingCat ? existingCat.color : PRESET_COLORS[0];

  const content = `
    <form id="form-category">
      <div class="form-group">
        <label for="cat-name-input" class="form-label">Nome da categoria *</label>
        <input
          type="text"
          id="cat-name-input"
          class="form-input"
          placeholder="Ex: Transporte, Alimentação, Salário"
          value="${existingCat ? escapeHTML(existingCat.name) : ''}"
          required
        />
        <div class="form-error" id="err-cat-name"></div>
      </div>

      <div class="form-group">
        <label for="cat-type-select" class="form-label">Tipo de movimentação *</label>
        <select id="cat-type-select" class="form-select" required>
          <option value="despesa" ${existingCat && existingCat.type === 'despesa' ? 'selected' : ''}>Despesa</option>
          <option value="receita" ${existingCat && existingCat.type === 'receita' ? 'selected' : ''}>Receita</option>
        </select>
        <div class="form-error" id="err-cat-type"></div>
      </div>

      <div class="form-group">
        <label class="form-label">Cor de identificação</label>
        <div style="display: flex; gap: var(--spacing-2); flex-wrap: wrap; margin-top: 4px;" id="color-palette-container">
          ${PRESET_COLORS.map(c => `
            <button
              type="button"
              class="cat-color-choice"
              data-color="${c}"
              style="width: 28px; height: 28px; border-radius: 50%; background-color: ${c}; border: 2px solid ${c === selectedColor ? 'var(--color-text)' : 'transparent'}; cursor: pointer;"
              aria-label="Cor ${c}"
            ></button>
          `).join('')}
        </div>
      </div>
    </form>
  `;

  openModal({
    title: isEditing ? 'Editar categoria' : 'Nova categoria',
    content,
    footer: `
      <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Cancelar</button>
      <button type="button" class="btn btn-primary" id="btn-save-cat">
        ${isEditing ? 'Atualizar categoria' : 'Salvar categoria'}
      </button>
    `,
    onOpen: (modalEl) => {
      modalEl.querySelector('#btn-cancel-modal').addEventListener('click', closeModal);

      // Seleção de cores
      modalEl.querySelectorAll('.cat-color-choice').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedColor = btn.dataset.color;
          modalEl.querySelectorAll('.cat-color-choice').forEach(b => {
            b.style.border = b.dataset.color === selectedColor ? '2px solid var(--color-text)' : 'transparent';
          });
        });
      });

      // Submissão
      modalEl.querySelector('#btn-save-cat').addEventListener('click', () => {
        const nameInput = modalEl.querySelector('#cat-name-input');
        const typeSelect = modalEl.querySelector('#cat-type-select');

        const payload = {
          name: nameInput.value,
          type: typeSelect.value,
          color: selectedColor
        };

        const result = isEditing
          ? updateCategory(categoryId, payload)
          : createCategory(payload);

        if (result.success) {
          closeModal();
          showToast(isEditing ? 'Categoria atualizada!' : 'Categoria cadastrada!', 'success');
        } else if (result.errors) {
          if (result.errors.name) modalEl.querySelector('#err-cat-name').textContent = result.errors.name;
          if (result.errors.type) modalEl.querySelector('#err-cat-type').textContent = result.errors.type;
        }
      });
    }
  });
}

/**
 * Modal assistido para exclusão ou reclassificação de categoria em uso
 */
function handleCategoryDelete(catId, catName, catType, usageCount) {
  if (usageCount === 0) {
    confirmAction({
      title: 'Excluir categoria',
      message: `Tem certeza que deseja excluir a categoria "${catName}"?`,
      confirmText: 'Excluir',
      confirmDanger: true,
      onConfirm: () => {
        deleteCategory(catId);
        showToast('Categoria excluída com sucesso.', 'info');
      }
    });
    return;
  }

  // Categoria em uso: oferece reatribuição para não criar transações órfãs
  const otherCategories = listCategories(catType).filter(c => c.id !== catId);

  if (otherCategories.length === 0) {
    openModal({
      title: 'Categoria em uso',
      content: `
        <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.6;">
          A categoria <strong>"${escapeHTML(catName)}"</strong> possui <strong>${usageCount}</strong> movimentação(ões) vinculada(s).
          Como não existem outras categorias de ${catType} cadastradas, crie uma nova categoria primeiro antes de excluí-la.
        </p>
      `,
      footer: `<button type="button" class="btn btn-primary" onclick="window.finflowCloseModal()">Entendido</button>`
    });
    return;
  }

  const content = `
    <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--spacing-4); line-height: 1.6;">
      A categoria <strong>"${escapeHTML(catName)}"</strong> possui <strong>${usageCount}</strong> movimentação(ões) vinculada(s).
      Para não deixar esses registros sem categoria, selecione para onde deseja transferi-los:
    </p>

    <div class="form-group">
      <label for="reassign-select" class="form-label">Transferir movimentações para:</label>
      <select id="reassign-select" class="form-select">
        ${otherCategories.map(c => `<option value="${c.id}">${escapeHTML(c.name)}</option>`).join('')}
      </select>
    </div>
  `;

  openModal({
    title: 'Reclassificar e Excluir Categoria',
    content,
    footer: `
      <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Cancelar</button>
      <button type="button" class="btn btn-danger" id="btn-confirm-reassign">Reclassificar e Excluir</button>
    `,
    onOpen: (modalEl) => {
      modalEl.querySelector('#btn-cancel-modal').addEventListener('click', closeModal);
      modalEl.querySelector('#btn-confirm-reassign').addEventListener('click', () => {
        const newCatId = modalEl.querySelector('#reassign-select').value;
        reassignAndDeleteCategory(catId, newCatId);
        closeModal();
        showToast('Transações reclassificadas e categoria removida com sucesso!', 'success');
      });
    }
  });
}

export function initCategoriesEvents(container = document.getElementById('view-categories')) {
  if (!container) return;
  if (container.dataset.eventsInit === 'true') return;
  container.dataset.eventsInit = 'true';

  const newCatBtn = container.querySelector('#btn-new-category');
  const searchInput = container.querySelector('#search-category');

  if (newCatBtn) {
    newCatBtn.addEventListener('click', () => openCategoryFormModal());
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      categorySearchTerm = e.target.value;
      renderCategoriesView();
    });
  }

  container.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.btn-edit-category');
    if (editBtn) {
      openCategoryFormModal(editBtn.dataset.id);
      return;
    }

    const deleteBtn = e.target.closest('.btn-delete-category');
    if (deleteBtn) {
      handleCategoryDelete(
        deleteBtn.dataset.id,
        deleteBtn.dataset.name,
        deleteBtn.dataset.type,
        parseInt(deleteBtn.dataset.count, 10)
      );
      return;
    }
  });
}

