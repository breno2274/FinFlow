// Regras de negocio para limites de gastos mensais por categoria e alertas de estouro

import { Budget, BudgetUsage, BudgetStatus } from '../types';
import { getBudgets, saveBudgets, getTransactions, getCategories } from './storage';
import { isDateInMonth } from '../utils/dates';

// Retorna todos os orcamentos cadastrados
export function listBudgets(monthKey?: string): Budget[] {
  const all = getBudgets();
  if (!monthKey || monthKey === 'todos') return all;
  return all.filter(b => b.monthKey === monthKey);
}

// Cria um novo limite de orcamento para uma categoria no mes
export function createBudget(data: Omit<Budget, 'id'>): Budget {
  const budgets = getBudgets();
  const newBudget: Budget = {
    ...data,
    id: `bg-${Date.now()}`
  };
  saveBudgets([...budgets, newBudget]);
  return newBudget;
}

// Atualiza o valor limite de um orcamento existente
export function updateBudget(id: string, data: Partial<Omit<Budget, 'id'>>): Budget | null {
  const budgets = getBudgets();
  const index = budgets.findIndex(b => b.id === id);
  if (index === -1) return null;

  const updated: Budget = {
    ...budgets[index],
    ...data
  };

  budgets[index] = updated;
  saveBudgets([...budgets]);
  return updated;
}

// Exclui um orcamento
export function deleteBudget(id: string): boolean {
  const budgets = getBudgets();
  const filtered = budgets.filter(b => b.id !== id);
  if (filtered.length === budgets.length) return false;
  saveBudgets(filtered);
  return true;
}

// Confronta as despesas reais do mes com os limites cadastrados para gerar barras e alertas visuais
export function getBudgetsWithUsage(monthKey: string): BudgetUsage[] {
  const budgets = listBudgets(monthKey);
  const transactions = getTransactions().filter(t => t.type === 'despesa' && isDateInMonth(t.date, monthKey));
  const categories = getCategories();
  const catMap = new Map(categories.map(c => [c.id, c]));

  // Agrupa os gastos reais por categoria no mes selecionado
  const spentByCat = new Map<string, number>();
  for (const t of transactions) {
    const current = spentByCat.get(t.categoryId) || 0;
    spentByCat.set(t.categoryId, current + t.amount);
  }

  return budgets.map(budget => {
    const category = catMap.get(budget.categoryId) || null;
    const spent = spentByCat.get(budget.categoryId) || 0;
    const remaining = Math.max(0, budget.limitAmount - spent);
    const percentage = budget.limitAmount > 0
      ? Math.round((spent / budget.limitAmount) * 100)
      : 0;

    let status: BudgetStatus = 'normal';
    if (percentage >= 100) {
      status = 'exceeded';
    } else if (percentage >= 80) {
      status = 'warning';
    }

    return {
      budget,
      category,
      spent,
      remaining,
      percentage,
      status
    };
  });
}

