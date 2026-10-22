/**
 * FORMULÁRIO DE TRANSAÇÃO — FINFLOW (Tela 05)
 * Modal interativo para criação e edição de receitas ou despesas com validações em tempo real.
 */

import { openModal, closeModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { listCategories } from '../services/category-service.js';
import { createTransaction, updateTransaction, getTransactionById } from '../services/transaction-service.js';
import { getTodayISO } from '../utils/dates.js';
import { escapeHTML } from '../utils/format.js';

/**
 * Abre o modal de cadastro ou edição de transação
 * @param {string|null} [transactionId=null] - Se informado, carrega dados para edição
 * @param {string} [defaultType='despesa'] - Tipo padrão ao abrir novo
 */
export function openTransactionModal(transactionId = null, defaultType = 'despesa') {
  const isEditing = Boolean(transactionId);
  const existingTx = isEditing ? getTransactionById(transactionId) : null;

  let currentType = existingTx ? existingTx.type : defaultType;
  const title = isEditing ? 'Editar transação' : 'Nova transação';

  const modalContent = `
    <form id="transaction-form" novalidate>
      <!-- Alternância Receita / Despesa -->
      <div class="form-group">
        <label class="form-label">Tipo de movimentação</label>
        <div class="segmented-control" role="radiogroup" aria-label="Tipo de transação">
          <button
            type="button"
            class="segmented-btn ${currentType === 'despesa' ? 'active type-expense' : ''}"
            id="toggle-despesa"
            role="radio"
            aria-checked="${currentType === 'despesa'}"
          >
            Despesa
          </button>
          <button
            type="button"
            class="segmented-btn ${currentType === 'receita' ? 'active type-income' : ''}"
            id="toggle-receita"
            role="radio"
            aria-checked="${currentType === 'receita'}"
          >
            Receita
          </button>
        </div>
      </div>

      <!-- Descrição -->
      <div class="form-group">
        <label for="tx-description" class="form-label">
          Descrição <span class="required" aria-hidden="true">*</span>
        </label>
        <input
          type="text"
          id="tx-description"
          name="description"
          class="form-input"
          placeholder="Ex.: Supermercado, Salário, Internet"
          value="${existingTx ? escapeHTML(existingTx.description) : ''}"
          required
        />
        <div class="form-error" id="err-description" role="alert"></div>
      </div>

      <!-- Valor e Data em Linha Dupla -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-4);">
        <div class="form-group">
          <label for="tx-amount" class="form-label">
            Valor (R$) <span class="required" aria-hidden="true">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            id="tx-amount"
            name="amount"
            class="form-input"
            placeholder="0,00"
            value="${existingTx ? existingTx.amount : ''}"
            required
          />
          <div class="form-error" id="err-amount" role="alert"></div>
        </div>

        <div class="form-group">
          <label for="tx-date" class="form-label">
            Data <span class="required" aria-hidden="true">*</span>
          </label>
          <input
            type="date"
            id="tx-date"
            name="date"
            class="form-input"
            value="${existingTx ? existingTx.date : getTodayISO()}"
            required
          />
          <div class="form-error" id="err-date" role="alert"></div>
        </div>
      </div>

      <!-- Categoria -->
      <div class="form-group">
        <label for="tx-category" class="form-label">
          Categoria <span class="required" aria-hidden="true">*</span>
        </label>
        <select id="tx-category" name="categoryId" class="form-select" required>
          <option value="">Selecione uma categoria...</option>
        </select>
        <div class="form-error" id="err-categoryId" role="alert"></div>
      </div>

      <!-- Observações Opcionais -->
      <div class="form-group">
        <label for="tx-notes" class="form-label">Observações (opcional)</label>
        <textarea
          id="tx-notes"
          name="notes"
          class="form-textarea"
          rows="2"
          placeholder="Detalhes ou anotações adicionais..."
        >${existingTx && existingTx.notes ? escapeHTML(existingTx.notes) : ''}</textarea>
      </div>
    </form>
  `;

  const modalFooter = `
    <button type="button" class="btn btn-secondary" id="btn-cancel-tx">Cancelar</button>
    <button type="button" class="btn btn-primary" id="btn-submit-tx">
      ${isEditing ? 'Atualizar transação' : 'Salvar transação'}
    </button>
  `;

  openModal({
    title,
    content: modalContent,
    footer: modalFooter,
    onOpen: (container) => {
      const form = container.querySelector('#transaction-form');
      const categorySelect = container.querySelector('#tx-category');
      const toggleDespesa = container.querySelector('#toggle-despesa');
      const toggleReceita = container.querySelector('#toggle-receita');
      const cancelBtn = container.querySelector('#btn-cancel-tx');
      const submitBtn = container.querySelector('#btn-submit-tx');

      // Popula o select de categorias conforme o tipo atual
      const updateCategoriesDropdown = (type) => {
        const availableCategories = listCategories(type);
        categorySelect.innerHTML = '<option value="">Selecione uma categoria...</option>';

        availableCategories.forEach(cat => {
          const opt = document.createElement('option');
          opt.value = cat.id;
          opt.textContent = cat.name;
          if (existingTx && existingTx.categoryId === cat.id) {
            opt.selected = true;
          }
          categorySelect.appendChild(opt);
        });
      };

      updateCategoriesDropdown(currentType);

      // Alternância do tipo
      toggleDespesa.addEventListener('click', () => {
        currentType = 'despesa';
        toggleDespesa.className = 'segmented-btn active type-expense';
        toggleReceita.className = 'segmented-btn';
        toggleDespesa.setAttribute('aria-checked', 'true');
        toggleReceita.setAttribute('aria-checked', 'false');
        updateCategoriesDropdown('despesa');
      });

      toggleReceita.addEventListener('click', () => {
        currentType = 'receita';
        toggleReceita.className = 'segmented-btn active type-income';
        toggleDespesa.className = 'segmented-btn';
        toggleReceita.setAttribute('aria-checked', 'true');
        toggleDespesa.setAttribute('aria-checked', 'false');
        updateCategoriesDropdown('receita');
      });

      cancelBtn.addEventListener('click', closeModal);

      // Envio e validação
      submitBtn.addEventListener('click', () => {
        // Limpa erros anteriores
        container.querySelectorAll('.form-error').forEach(el => el.textContent = '');
        container.querySelectorAll('.form-input, .form-select').forEach(el => el.classList.remove('is-invalid'));

        const payload = {
          description: form.description.value,
          amount: parseFloat(form.amount.value),
          date: form.date.value,
          type: currentType,
          categoryId: form.categoryId.value,
          notes: form.notes.value
        };

        const result = isEditing
          ? updateTransaction(transactionId, payload)
          : createTransaction(payload);

        if (result.success) {
          closeModal();
          showToast(
            isEditing ? 'Transação atualizada com sucesso!' : 'Transação registrada com sucesso!',
            'success'
          );
        } else if (result.errors) {
          // Exibe os erros de validação abaixo dos respectivos campos
          Object.entries(result.errors).forEach(([field, msg]) => {
            const errEl = container.querySelector(`#err-${field}`);
            const inputEl = container.querySelector(`[name="${field}"]`);
            if (errEl) errEl.textContent = msg;
            if (inputEl) inputEl.classList.add('is-invalid');
          });
        }
      });
    }
  });
}
