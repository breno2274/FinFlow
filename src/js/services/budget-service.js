/**
 * SERVIÇO DE ORÇAMENTOS — FINFLOW
 * Lógica de limites mensais por categoria, cálculo dinâmico de valor utilizado
 * e emissão de alertas de limite atingido ou estourado.
 */

import { getBudgets, saveBudgets, getTransactions, getCategories } from '../core/storage.js';
import { validateBudget } from '../utils/validators.js';
import { isDateInMonth } from '../utils/dates.js';

/**
 * Retorna os orçamentos do mês com cálculos em tempo real de consumo
 * @param {string} monthKey - Formato YYYY-MM
 * @returns {Array<Object>} Lista de orçamentos enriquecida com totais gastos e status
 */
export function getBudgetsWithProgress(monthKey) {
  const budgets = getBudgets().filter(b => b.monthKey === monthKey);
  const transactions = getTransactions();
  const categories = getCategories();
  const catMap = new Map(categories.map(c => [c.id, c]));

  return budgets.map(budget => {
    const category = catMap.get(budget.categoryId) || {
      id: budget.categoryId,
      name: 'Categoria Removida',
      color: '#99A6A3'
    };

    // Soma despesas daquela categoria no mês especificado
    const spentAmount = transactions
      .filter(t => t.type === 'despesa' && t.categoryId === budget.categoryId && isDateInMonth(t.date, monthKey))
      .reduce((sum, t) => sum + t.amount, 0);

    const limitAmount = budget.limitAmount;
    const remainingAmount = Math.max(0, limitAmount - spentAmount);
    const percentage = limitAmount > 0 ? (spentAmount / limitAmount) * 100 : 0;

    let status = 'normal';
    if (spentAmount > limitAmount) {
      status = 'exceeded'; // Ultrapassou o limite
    } else if (percentage >= 80) {
      status = 'warning';  // Próximo do limite (>= 80%)
    }

    return {
      id: budget.id,
      categoryId: budget.categoryId,
      categoryName: category.name,
      categoryColor: category.color,
      limitAmount,
      spentAmount,
      remainingAmount,
      percentage: Math.min(100, Math.round(percentage)),
      realPercentage: Math.round(percentage),
      status,
      monthKey
    };
  });
}

/**
 * Cria ou atualiza o orçamento de uma categoria no mês
 * @param {Object} data - { categoryId, limitAmount, monthKey }
 * @returns {{ success: boolean, budget?: Object, errors?: Object }}
 */
export function setCategoryBudget(data) {
  const validation = validateBudget(data);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const budgets = getBudgets();
  const existingIndex = budgets.findIndex(
    b => b.categoryId === data.categoryId && b.monthKey === data.monthKey
  );

  const budgetRecord = {
    id: existingIndex >= 0 ? budgets[existingIndex].id : `bg-${Date.now()}`,
    categoryId: data.categoryId,
    limitAmount: Number(data.limitAmount),
    monthKey: data.monthKey
  };

  if (existingIndex >= 0) {
    budgets[existingIndex] = budgetRecord;
  } else {
    budgets.push(budgetRecord);
  }

  saveBudgets(budgets);
  return { success: true, budget: budgetRecord };
}

/**
 * Remove um orçamento definido
 * @param {string} id
 * @returns {{ success: boolean }}
 */
export function deleteBudget(id) {
  const budgets = getBudgets();
  const filtered = budgets.filter(b => b.id !== id);
  saveBudgets(filtered);
  return { success: true };
}
