/**
 * SERVIÇO DE RELATÓRIOS FINANCEIROS — FINFLOW
 * Consolidação analítica de receitas, despesas, fluxo mensal e distribuição
 * por categoria para alimentação de gráficos e indicadores.
 */

import { getTransactions, getCategories } from '../core/storage.js';
import { getLastNMonths, isDateInMonth } from '../utils/dates.js';

/**
 * Agrupa receitas e despesas ao longo dos últimos N meses
 * @param {number} [monthsCount=6]
 * @returns {Array<{ key: string, label: string, short: string, income: number, expense: number, balance: number }>}
 */
export function getMonthlyCashFlow(monthsCount = 6) {
  const months = getLastNMonths(monthsCount);
  const transactions = getTransactions();

  return months.map(m => {
    let income = 0;
    let expense = 0;

    for (const tx of transactions) {
      if (isDateInMonth(tx.date, m.key)) {
        if (tx.type === 'receita') {
          income += tx.amount;
        } else if (tx.type === 'despesa') {
          expense += tx.amount;
        }
      }
    }

    return {
      key: m.key,
      label: m.label,
      short: m.short,
      income,
      expense,
      balance: income - expense
    };
  });
}

/**
 * Calcula a distribuição de gastos por categoria em um período
 * @param {string|null} [monthKey=null] - Se informado, filtra pelo mês; senão, calcula últimos N meses
 * @param {number} [monthsCount=6]
 * @returns {Array<{ categoryId: string, categoryName: string, categoryColor: string, totalAmount: number, percentage: number }>}
 */
export function getExpensesByCategory(monthKey = null, monthsCount = 6) {
  const transactions = getTransactions();
  const categories = getCategories();
  const catMap = new Map(categories.map(c => [c.id, c]));

  let filteredExpenses = transactions.filter(t => t.type === 'despesa');

  if (monthKey && monthKey !== 'todos') {
    filteredExpenses = filteredExpenses.filter(t => isDateInMonth(t.date, monthKey));
  } else if (monthsCount) {
    const validMonths = new Set(getLastNMonths(monthsCount).map(m => m.key));
    filteredExpenses = filteredExpenses.filter(t => {
      const monthPart = t.date.substring(0, 7);
      return validMonths.has(monthPart);
    });
  }

  const totalsByCat = {};
  let totalPeriodExpenses = 0;

  for (const t of filteredExpenses) {
    totalsByCat[t.categoryId] = (totalsByCat[t.categoryId] || 0) + t.amount;
    totalPeriodExpenses += t.amount;
  }

  const result = Object.entries(totalsByCat).map(([catId, amount]) => {
    const cat = catMap.get(catId) || { name: 'Geral', color: '#76B8B2' };
    const percentage = totalPeriodExpenses > 0 ? (amount / totalPeriodExpenses) * 100 : 0;

    return {
      categoryId: catId,
      categoryName: cat.name,
      categoryColor: cat.color,
      totalAmount: amount,
      percentage: Math.round(percentage)
    };
  });

  // Ordena pelas categorias com maiores gastos
  return result.sort((a, b) => b.totalAmount - a.totalAmount);
}

/**
 * Retorna os totais consolidados para um período de N meses
 * @param {number} [monthsCount=6]
 * @returns {{ totalIncome: number, totalExpense: number, totalSavings: number }}
 */
export function getPeriodTotals(monthsCount = 6) {
  const flow = getMonthlyCashFlow(monthsCount);
  const totalIncome = flow.reduce((acc, m) => acc + m.income, 0);
  const totalExpense = flow.reduce((acc, m) => acc + m.expense, 0);

  return {
    totalIncome,
    totalExpense,
    totalSavings: totalIncome - totalExpense
  };
}
