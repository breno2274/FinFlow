/**
 * VIEW DE ORÇAMENTOS E METAS — FINFLOW (Tela 06)
 * Acompanhamento de limites mensais por categoria com barras de progresso dinâmicas
 * e gestão de objetivos de economia com anéis circulares percentuais e aportes.
 */

import { getBudgetsWithProgress, setCategoryBudget, deleteBudget } from '../services/budget-service.js';
import { listGoals, createGoal, updateGoal, deleteGoal, addGoalContribution } from '../services/goal-service.js';
import { listCategories } from '../services/category-service.js';
import { openModal, closeModal, confirmAction } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { formatCurrency, formatPercent, escapeHTML } from '../utils/format.js';
import { formatDate, getCurrentMonthKey } from '../utils/dates.js';

let activeMonthKey = getCurrentMonthKey();

/**
 * Renderiza um anel de progresso circular SVG para metas de economia
 * @param {number} percentage
 * @param {string} color
 * @returns {string} Código SVG
 */
function renderCircularProgressSVG(percentage, color = '#76B8B2') {
  const size = 130;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const offset = circumference - (clampedPct / 100) * circumference;

  return `
    <div class="goal-ring-wrap">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle
          cx="${size / 2}"
          cy="${size / 2}"
          r="${radius}"
          stroke="var(--color-border-subtle)"
          stroke-width="${strokeWidth}"
          fill="transparent"
        />
        <circle
          cx="${size / 2}"
          cy="${size / 2}"
          r="${radius}"
          stroke="${color}"
          stroke-width="${strokeWidth}"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          stroke-linecap="round"
          fill="transparent"
          transform="rotate(-90 ${size / 2} ${size / 2})"
          style="transition: stroke-dashoffset var(--transition-normal);"
        />
      </svg>
      <div class="goal-ring-text">
        <span class="goal-ring-pct">${clampedPct}%</span>
        <span style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">concluído</span>
      </div>
    </div>
  `;
}

/**
 * Renderiza o HTML da tela de Orçamentos e Metas
 * @returns {string}
 */
export function renderBudgetsView() {
  const budgets = getBudgetsWithProgress(activeMonthKey);
  const goals = listGoals();

  const monthSelect = document.getElementById('budget-month-select');
  if (monthSelect && monthSelect.value !== activeMonthKey) {
    monthSelect.value = activeMonthKey;
  }

  // Cards de Orçamentos por Categoria
  const budgetCardsHTML = budgets.length > 0
    ? budgets.map(b => {
        let fillClass = '';
        let badgeHTML = '';

        if (b.status === 'exceeded') {
          fillClass = 'danger';
          badgeHTML = `<span class="badge badge-expense">Excedido (+${b.realPercentage - 100}%)</span>`;
        } else if (b.status === 'warning') {
          fillClass = 'warning';
          badgeHTML = `<span class="badge badge-warning">Atenção (${b.percentage}%)</span>`;
        } else {
          fillClass = 'success';
          badgeHTML = `<span class="badge badge-neutral">${b.percentage}% utilizado</span>`;
        }

        return `
          <div class="budget-card" data-id="${b.id}">
            <div class="budget-card-header">
              <span class="budget-category-title">
                <span class="category-dot" style="background-color: ${b.categoryColor};"></span>
                ${escapeHTML(b.categoryName)}
              </span>
              ${badgeHTML}
            </div>

            <div class="budget-card-amounts">
              <strong>${formatCurrency(b.spentAmount)}</strong> de ${formatCurrency(b.limitAmount)}
            </div>

            <div class="progress-track" role="progressbar" aria-valuenow="${b.percentage}" aria-valuemin="0" aria-valuemax="100">
              <div class="progress-fill ${fillClass}" style="width: ${b.percentage}%;"></div>
            </div>

            <div class="budget-card-footer">
              <span>Restante: <strong>${formatCurrency(b.remainingAmount)}</strong></span>
              <button
                type="button"
                class="btn btn-action-delete btn-delete-budget"
                data-id="${b.id}"
                title="Remover"
                aria-label="Remover limite de ${escapeHTML(b.categoryName)}"
              >
                <svg class="btn-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        `;
      }).join('')
    : `
      <div style="grid-column: span 2; padding: var(--spacing-8); text-align: center; background: var(--color-surface); border: 1px dashed var(--color-border); border-radius: var(--radius-lg);">
        <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-3);">Nenhum limite de orçamento definido para este mês.</p>
        <button type="button" class="btn btn-primary btn-sm" id="btn-empty-create-budget">+ Definir orçamento</button>
      </div>
    `;

  // Cards de Metas de Economia
  const goalsCardsHTML = goals.length > 0
    ? goals.map(g => {
        return `
          <div class="goal-card" data-id="${g.id}">
            ${renderCircularProgressSVG(g.percentage, g.color)}
            <h4 class="goal-title">${escapeHTML(g.name)}</h4>
            <div class="goal-amount-text">
              <strong>${formatCurrency(g.currentAmount)}</strong> de ${formatCurrency(g.targetAmount)}
              ${g.targetDate ? `<br><small style="color: var(--color-text-muted);">Alvo: ${formatDate(g.targetDate, 'full')}</small>` : ''}
            </div>

            <div class="goal-actions">
              <button
                type="button"
                class="btn btn-primary btn-sm btn-contribute-goal"
                data-id="${g.id}"
                data-name="${escapeHTML(g.name)}"
              >
                Adicionar dinheiro +
              </button>
              <button
                type="button"
                class="btn btn-action-edit btn-edit-goal"
                data-id="${g.id}"
                title="Editar"
                aria-label="Editar meta ${escapeHTML(g.name)}"
              >
                <svg class="btn-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button
                type="button"
                class="btn btn-action-delete btn-delete-goal"
                data-id="${g.id}"
                title="Excluir"
                aria-label="Excluir meta ${escapeHTML(g.name)}"
              >
                <svg class="btn-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        `;
      }).join('')
    : `
      <div style="padding: var(--spacing-8); text-align: center; background: var(--color-surface); border: 1px dashed var(--color-border); border-radius: var(--radius-lg);">
        <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-3);">Nenhuma meta de economia ativa.</p>
        <button type="button" class="btn btn-primary btn-sm" id="btn-empty-create-goal">+ Criar primeira meta</button>
      </div>
    `;

  const budgetContainer = document.getElementById('budget-cards-container');
  if (budgetContainer) budgetContainer.innerHTML = budgetCardsHTML;

  const goalsContainer = document.getElementById('goals-cards-container');
  if (goalsContainer) goalsContainer.innerHTML = goalsCardsHTML;

  const container = document.getElementById('view-budgets');
  return container ? container.innerHTML : '';
}


/**
 * Modal para definir ou atualizar o limite de uma categoria
 */
function openBudgetModal() {
  const expenseCategories = listCategories('despesa');

  const content = `
    <form id="form-budget">
      <div class="form-group">
        <label for="budget-cat-select" class="form-label">Categoria de despesa *</label>
        <select id="budget-cat-select" class="form-select" required>
          <option value="">Selecione uma categoria...</option>
          ${expenseCategories.map(c => `<option value="${c.id}">${escapeHTML(c.name)}</option>`).join('')}
        </select>
        <div class="form-error" id="err-budget-category"></div>
      </div>

      <div class="form-group">
        <label for="budget-limit-input" class="form-label">Limite mensal desejado (R$) *</label>
        <input type="number" step="10" min="1" id="budget-limit-input" class="form-input" placeholder="Ex: 500,00" required />
        <div class="form-error" id="err-budget-limit"></div>
      </div>
    </form>
  `;

  openModal({
    title: 'Definir limite de orçamento',
    content,
    footer: `
      <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Cancelar</button>
      <button type="button" class="btn btn-primary" id="btn-save-budget">Salvar orçamento</button>
    `,
    onOpen: (modalEl) => {
      modalEl.querySelector('#btn-cancel-modal').addEventListener('click', closeModal);
      modalEl.querySelector('#btn-save-budget').addEventListener('click', () => {
        const catSelect = modalEl.querySelector('#budget-cat-select');
        const limitInput = modalEl.querySelector('#budget-limit-input');

        const result = setCategoryBudget({
          categoryId: catSelect.value,
          limitAmount: parseFloat(limitInput.value),
          monthKey: activeMonthKey
        });

        if (result.success) {
          closeModal();
          showToast('Orçamento registrado com sucesso!', 'success');
        } else if (result.errors) {
          if (result.errors.categoryId) modalEl.querySelector('#err-budget-category').textContent = result.errors.categoryId;
          if (result.errors.limitAmount) modalEl.querySelector('#err-budget-limit').textContent = result.errors.limitAmount;
        }
      });
    }
  });
}

/**
 * Modal para criar ou editar uma meta financeira
 */
function openGoalModal(goalId = null) {
  const isEditing = Boolean(goalId);
  const existingGoal = isEditing ? listGoals().find(g => g.id === goalId) : null;

  const content = `
    <form id="form-goal">
      <div class="form-group">
        <label for="goal-name-input" class="form-label">Nome da meta *</label>
        <input
          type="text"
          id="goal-name-input"
          class="form-input"
          placeholder="Ex: Viagem de férias, Reserva de emergência"
          value="${existingGoal ? escapeHTML(existingGoal.name) : ''}"
          required
        />
        <div class="form-error" id="err-goal-name"></div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-4);">
        <div class="form-group">
          <label for="goal-target-input" class="form-label">Valor desejado (R$) *</label>
          <input
            type="number"
            step="10"
            min="1"
            id="goal-target-input"
            class="form-input"
            placeholder="5000,00"
            value="${existingGoal ? existingGoal.targetAmount : ''}"
            required
          />
          <div class="form-error" id="err-goal-target"></div>
        </div>

        <div class="form-group">
          <label for="goal-current-input" class="form-label">Valor inicial acumulado (R$)</label>
          <input
            type="number"
            step="10"
            min="0"
            id="goal-current-input"
            class="form-input"
            placeholder="0,00"
            value="${existingGoal ? existingGoal.currentAmount : '0'}"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="goal-date-input" class="form-label">Data alvo (opcional)</label>
        <input
          type="date"
          id="goal-date-input"
          class="form-input"
          value="${existingGoal && existingGoal.targetDate ? existingGoal.targetDate : ''}"
        />
      </div>
    </form>
  `;

  openModal({
    title: isEditing ? 'Editar meta de economia' : 'Nova meta de economia',
    content,
    footer: `
      <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Cancelar</button>
      <button type="button" class="btn btn-primary" id="btn-save-goal">
        ${isEditing ? 'Atualizar meta' : 'Salvar meta'}
      </button>
    `,
    onOpen: (modalEl) => {
      modalEl.querySelector('#btn-cancel-modal').addEventListener('click', closeModal);
      modalEl.querySelector('#btn-save-goal').addEventListener('click', () => {
        const payload = {
          name: modalEl.querySelector('#goal-name-input').value,
          targetAmount: parseFloat(modalEl.querySelector('#goal-target-input').value),
          currentAmount: parseFloat(modalEl.querySelector('#goal-current-input').value || 0),
          targetDate: modalEl.querySelector('#goal-date-input').value
        };

        const result = isEditing
          ? updateGoal(goalId, payload)
          : createGoal(payload);

        if (result.success) {
          closeModal();
          showToast(isEditing ? 'Meta atualizada com sucesso!' : 'Meta criada com sucesso!', 'success');
        } else if (result.errors) {
          if (result.errors.name) modalEl.querySelector('#err-goal-name').textContent = result.errors.name;
          if (result.errors.targetAmount) modalEl.querySelector('#err-goal-target').textContent = result.errors.targetAmount;
        }
      });
    }
  });
}

/**
 * Modal para registrar um aporte/contribuição em uma meta
 */
function openContributeModal(goalId, goalName) {
  const content = `
    <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--spacing-4);">
      Adicione valor guardado para a meta <strong>${escapeHTML(goalName)}</strong>.
    </p>
    <div class="form-group">
      <label for="contrib-amount" class="form-label">Valor do aporte (R$) *</label>
      <input type="number" step="10" min="0.01" id="contrib-amount" class="form-input" placeholder="Ex.: 250,00" required />
      <div class="form-error" id="err-contrib"></div>
    </div>
  `;

  openModal({
    title: 'Adicionar dinheiro à meta',
    content,
    footer: `
      <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Cancelar</button>
      <button type="button" class="btn btn-primary" id="btn-save-contrib">Confirmar aporte</button>
    `,
    onOpen: (modalEl) => {
      modalEl.querySelector('#btn-cancel-modal').addEventListener('click', closeModal);
      modalEl.querySelector('#btn-save-contrib').addEventListener('click', () => {
        const amountInput = modalEl.querySelector('#contrib-amount');
        const amount = parseFloat(amountInput.value);

        if (isNaN(amount) || amount <= 0) {
          modalEl.querySelector('#err-contrib').textContent = 'Informe um valor maior que zero.';
          return;
        }

        const res = addGoalContribution(goalId, amount);
        if (res.success) {
          closeModal();
          showToast(`Aporte de ${formatCurrency(amount)} adicionado com sucesso!`, 'success');
        } else {
          modalEl.querySelector('#err-contrib').textContent = res.message;
        }
      });
    }
  });
}

/**
 * Registra os eventos da tela de Orçamentos e Metas
 * @param {HTMLElement} container
 */
export function initBudgetsEvents(container = document.getElementById('view-budgets')) {
  if (!container) return;
  if (container.dataset.eventsInit === 'true') return;
  container.dataset.eventsInit = 'true';

  const monthSelect = container.querySelector('#budget-month-select');
  const createBudgetBtn = container.querySelector('#btn-open-create-budget');
  const createGoalBtn = container.querySelector('#btn-open-create-goal');

  if (monthSelect) {
    monthSelect.addEventListener('change', (e) => {
      activeMonthKey = e.target.value;
      renderBudgetsView();
    });
  }

  if (createBudgetBtn) createBudgetBtn.addEventListener('click', openBudgetModal);
  if (createGoalBtn) createGoalBtn.addEventListener('click', () => openGoalModal());

  // Delegação de cliques em botões dinâmicos de orçamentos e metas
  container.addEventListener('click', (e) => {
    // Botão de definir orçamento no estado vazio
    if (e.target.closest('#btn-empty-create-budget')) {
      openBudgetModal();
      return;
    }

    // Botão de criar meta no estado vazio
    if (e.target.closest('#btn-empty-create-goal')) {
      openGoalModal();
      return;
    }

    // Remover orçamento
    const deleteBudgetBtn = e.target.closest('.btn-delete-budget');
    if (deleteBudgetBtn) {
      confirmAction({
        title: 'Remover orçamento',
        message: 'Deseja remover o teto estipulado para esta categoria neste mês?',
        confirmText: 'Remover limite',
        confirmDanger: true,
        onConfirm: () => {
          deleteBudget(deleteBudgetBtn.dataset.id);
          renderBudgetsView();
          showToast('Orçamento removido.', 'info');
        }
      });
      return;
    }

    // Aportar dinheiro em meta
    const contributeBtn = e.target.closest('.btn-contribute-goal');
    if (contributeBtn) {
      openContributeModal(contributeBtn.dataset.id, contributeBtn.dataset.name);
      return;
    }

    // Editar meta
    const editGoalBtn = e.target.closest('.btn-edit-goal');
    if (editGoalBtn) {
      openGoalModal(editGoalBtn.dataset.id);
      return;
    }

    // Excluir meta
    const deleteGoalBtn = e.target.closest('.btn-delete-goal');
    if (deleteGoalBtn) {
      confirmAction({
        title: 'Excluir meta',
        message: 'Tem certeza que deseja excluir esta meta de economia?',
        confirmText: 'Excluir meta',
        confirmDanger: true,
        onConfirm: () => {
          deleteGoal(deleteGoalBtn.dataset.id);
          renderBudgetsView();
          showToast('Meta excluída.', 'info');
        }
      });
      return;
    }
  });
}

