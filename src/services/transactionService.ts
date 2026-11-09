// Regras de negocio para criacao, edicao, exclusao e calculos de movimentacoes financeiras

import { Transaction, TransactionType, FinancialSummary } from '../types';
import { getTransactions, saveTransactions, getCategories, getGoals } from './storage';
import { isDateInMonth, getPreviousMonthKey } from '../utils/dates';

export interface ListTransactionsOptions {
  search?: string;
  type?: 'todos' | TransactionType;
  categoryId?: string;
  monthKey?: string;
  sortBy?: 'date' | 'amount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface ListTransactionsResult {
  items: Transaction[];
  totalItems: number;
  totalPages: number;
  page: number;
}

// Filtra e pagina transacoes com busca em descricao e nome de categoria
export function listTransactions(options: ListTransactionsOptions = {}): ListTransactionsResult {
  const {
    search = '',
    type = 'todos',
    categoryId = 'todos',
    monthKey = 'todos',
    sortBy = 'date',
    sortOrder = 'desc',
    page = 1,
    pageSize = 10
  } = options;

  let list = getTransactions();
  const categories = getCategories();
  const catMap = new Map(categories.map(c => [c.id, c.name.toLowerCase()]));

  // Aplica busca textual combinada por descricao e categoria
  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    list = list.filter(t => {
      const descMatches = t.description.toLowerCase().includes(term);
      const catName = catMap.get(t.categoryId) || '';
      const catMatches = catName.includes(term);
      return descMatches || catMatches;
    });
  }

  // Filtra por receita ou despesa
  if (type && type !== 'todos') {
    list = list.filter(t => t.type === type);
  }

  // Filtra por categoria especifica
  if (categoryId && categoryId !== 'todos') {
    list = list.filter(t => t.categoryId === categoryId);
  }

  // Filtra pelo mes especificado no formato YYYY-MM
  if (monthKey && monthKey !== 'todos') {
    list = list.filter(t => isDateInMonth(t.date, monthKey));
  }

  // Ordena por data ou valor conforme a preferencia do usuario
  list.sort((a, b) => {
    if (sortBy === 'amount') {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    const dateComparison = sortOrder === 'asc'
      ? a.date.localeCompare(b.date)
      : b.date.localeCompare(a.date);

    return dateComparison !== 0 ? dateComparison : b.id.localeCompare(a.id);
  });

  // Realiza o fatiamento para paginacao da tabela
  const totalItems = list.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = list.slice(startIndex, startIndex + pageSize);

  return {
    items: paginatedItems,
    totalItems,
    totalPages,
    page: currentPage
  };
}

// Localiza uma transacao pelo identificador unico
export function getTransactionById(id: string): Transaction | null {
  const transactions = getTransactions();
  return transactions.find(t => t.id === id) || null;
}

// Cadastra uma nova receita ou despesa gerando identificador unico
export function createTransaction(data: Omit<Transaction, 'id'>): Transaction {
  const transactions = getTransactions();
  const newTx: Transaction = {
    ...data,
    id: `tx-${Date.now()}`
  };
  saveTransactions([newTx, ...transactions]);
  return newTx;
}

// Atualiza os dados de uma transacao existente
export function updateTransaction(id: string, data: Partial<Omit<Transaction, 'id'>>): Transaction | null {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === id);
  if (index === -1) return null;

  const updated: Transaction = {
    ...transactions[index],
    ...data
  };

  transactions[index] = updated;
  saveTransactions([...transactions]);
  return updated;
}

// Remove permanentemente uma movimentacao financeira
export function deleteTransaction(id: string): boolean {
  const transactions = getTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  if (filtered.length === transactions.length) return false;
  saveTransactions(filtered);
  return true;
}

// Retorna as transacoes mais recentes para o card da pagina inicial
export function getRecentTransactions(limit = 5): Transaction[] {
  const transactions = getTransactions();
  return [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

// Calcula o consolidado de saldo, receitas, despesas e variacao percentual contra o mes anterior
export function calculateSummary(monthKey: string = 'todos'): FinancialSummary {
  const transactions = getTransactions();

  // Filtra movimentacoes do periodo selecionado
  const currentTxs = monthKey === 'todos'
    ? transactions
    : transactions.filter(t => isDateInMonth(t.date, monthKey));

  let income = 0;
  let expense = 0;

  for (const t of currentTxs) {
    if (t.type === 'receita') {
      income += t.amount;
    } else {
      expense += t.amount;
    }
  }

  const balance = income - expense;

  // Calcula variacao dinamica com base no mes anterior
  let balanceTrend = 0;
  let expenseTrend = 0;

  if (monthKey !== 'todos') {
    const prevKey = getPreviousMonthKey(monthKey);
    const prevTxs = transactions.filter(t => isDateInMonth(t.date, prevKey));

    let prevIncome = 0;
    let prevExpense = 0;

    for (const t of prevTxs) {
      if (t.type === 'receita') prevIncome += t.amount;
      else prevExpense += t.amount;
    }

    const prevBalance = prevIncome - prevExpense;
    if (prevBalance > 0) {
      balanceTrend = Math.round(((balance - prevBalance) / prevBalance) * 100);
    }
    if (prevExpense > 0) {
      expenseTrend = Math.round(((expense - prevExpense) / prevExpense) * 100);
    }
  }

  // Calcula taxa geral de conclusao das metas ativas
  const goals = getGoals();
  let totalTarget = 0;
  let totalCurrent = 0;

  for (const g of goals) {
    totalTarget += g.targetAmount;
    totalCurrent += g.currentAmount;
  }

  const goalsPercent = totalTarget > 0 ? Math.min(100, Math.round((totalCurrent / totalTarget) * 100)) : 0;

  return {
    balance,
    income,
    expense,
    goalsPercent,
    balanceTrend,
    expenseTrend
  };
}

