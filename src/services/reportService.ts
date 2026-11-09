// Agregacoes historicas para graficos de fluxo, comparativos de barras e distribuicao de despesas

import { CashFlowPoint, CategoryDistribution } from '../types';
import { getTransactions, getCategories } from './storage';
import { getLastNMonths, isDateInMonth } from '../utils/dates';

// Consolida entradas e saidas mensais para o grafico de fluxo em curvas suaves
export function getMonthlyCashFlow(monthsCount = 6): CashFlowPoint[] {
  const months = getLastNMonths(monthsCount);
  const transactions = getTransactions();

  return months.map(m => {
    let income = 0;
    let expense = 0;

    for (const t of transactions) {
      if (isDateInMonth(t.date, m.key)) {
        if (t.type === 'receita') income += t.amount;
        else expense += t.amount;
      }
    }

    return {
      monthKey: m.key,
      label: m.label,
      short: m.short,
      income,
      expense
    };
  });
}

// Consolida a proporcao percentual de despesas por categoria no periodo selecionado
export function getCategoryExpenseDistribution(monthsCount = 6): CategoryDistribution[] {
  const months = getLastNMonths(monthsCount);
  const monthKeys = new Set(months.map(m => m.key));
  const transactions = getTransactions().filter(t => t.type === 'despesa' && monthKeys.has(t.date.slice(0, 7)));
  const categories = getCategories();
  const catMap = new Map(categories.map(c => [c.id, c]));

  let totalExpense = 0;
  const spentByCat = new Map<string, number>();

  for (const t of transactions) {
    totalExpense += t.amount;
    const current = spentByCat.get(t.categoryId) || 0;
    spentByCat.set(t.categoryId, current + t.amount);
  }

  const result: CategoryDistribution[] = [];

  for (const [catId, amount] of spentByCat.entries()) {
    const category = catMap.get(catId);
    const categoryName = category ? category.name : 'Outras';
    const color = category ? category.color : '#76B8B2';
    const percentage = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;

    result.push({
      categoryId: catId,
      categoryName,
      color,
      amount,
      percentage
    });
  }

  // Ordena pelas categorias com maiores gastos
  return result.sort((a, b) => b.amount - a.amount);
}

// Retorna totais agregados de receitas, despesas e saldo acumulado no periodo
export function getReportKPIs(monthsCount = 6): { totalIncome: number; totalExpense: number; netSavings: number } {
  const flow = getMonthlyCashFlow(monthsCount);
  let totalIncome = 0;
  let totalExpense = 0;

  for (const item of flow) {
    totalIncome += item.income;
    totalExpense += item.expense;
  }

  return {
    totalIncome,
    totalExpense,
    netSavings: totalIncome - totalExpense
  };
}

