// Modal para estipular e ajustar limites de gastos mensais por categoria

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Budget } from '../../types';
import { listCategories } from '../../services/categoryService';
import { createBudget, updateBudget } from '../../services/budgetService';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMonthKey: string;
  budgetToEdit?: Budget | null;
}

// Controla o cadastro de tetos de gastos para categorias de despesas
export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  activeMonthKey,
  budgetToEdit
}) => {
  const [categoryId, setCategoryId] = useState('');
  const [limitAmount, setLimitAmount] = useState('');
  const [monthKey, setMonthKey] = useState(activeMonthKey);
  const [errorMsg, setErrorMsg] = useState('');

  const expenseCategories = listCategories('despesa');

  // Preenche valores existentes caso seja uma edicao ou reseta campos
  useEffect(() => {
    if (budgetToEdit) {
      setCategoryId(budgetToEdit.categoryId);
      setLimitAmount(String(budgetToEdit.limitAmount));
      setMonthKey(budgetToEdit.monthKey);
      setErrorMsg('');
    } else {
      setMonthKey(activeMonthKey);
      setLimitAmount('');
      setErrorMsg('');
      if (expenseCategories.length > 0) {
        setCategoryId(expenseCategories[0].id);
      }
    }
  }, [budgetToEdit, activeMonthKey, isOpen]);

  // Salva ou atualiza o teto orcamentario
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    const numLimit = parseFloat(limitAmount.replace(',', '.'));
    if (isNaN(numLimit) || numLimit <= 0) {
      setErrorMsg('Informe um valor de limite positivo maior que zero.');
      return;
    }

    if (!categoryId) {
      setErrorMsg('Selecione uma categoria de despesa.');
      return;
    }

    if (budgetToEdit) {
      updateBudget(budgetToEdit.id, {
        categoryId,
        limitAmount: numLimit,
        monthKey
      });
    } else {
      createBudget({
        categoryId,
        limitAmount: numLimit,
        monthKey
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={budgetToEdit ? 'Editar orçamento' : 'Criar orçamento mensal'}
      footer={
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end', width: '100%' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="budget-form" className="btn btn-primary" onClick={handleSubmit}>
            Salvar orçamento
          </button>
        </div>
      }
    >
      <form id="budget-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="budget-cat" className="form-label">
            Categoria de despesa <span className="required" aria-hidden="true">*</span>
          </label>
          <select
            id="budget-cat"
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {expenseCategories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="budget-limit" className="form-label">
            Limite mensal (R$) <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            id="budget-limit"
            className="form-input"
            placeholder="Ex.: 900,00"
            value={limitAmount}
            onChange={(e) => setLimitAmount(e.target.value)}
            required
          />
        </div>

        {errorMsg && (
          <div className="form-error" style={{ display: 'block', marginBottom: 'var(--spacing-3)' }} role="alert">
            {errorMsg}
          </div>
        )}
      </form>
    </Modal>
  );
};

