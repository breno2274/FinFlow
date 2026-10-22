/**
 * SERVIÇO DE TRANSAÇÕES — FINFLOW
 * Lógica de negócio para inclusão, consulta, filtragem, paginação,
 * ordenação e cálculos de saldo e totais financeiros.
 */

import { getTransactions, saveTransactions, getCategories } from '../core/storage.js';
import { validateTransaction } from '../utils/validators.js';
import { isDateInMonth } from '../utils/dates.js';

/**
 * Consulta transações aplicando filtros e paginação
 * @param {Object} options
 * @param {string} [options.search=''] - Termo para busca em descrição
 * @param {string} [options.type='todos'] - 'todos' | 'receita' | 'despesa'
 * @param {string} [options.categoryId='todos'] - ID de categoria específica
 * @param {string} [options.monthKey='todos'] - Formato YYYY-MM ou 'todos'
 * @param {string} [options.sortBy='date'] - 'date' | 'amount'
 * @param {string} [options.sortOrder='desc'] - 'desc' | 'asc'
 * @param {number} [options.page=1] - Página atual
 * @param {number} [options.pageSize=10] - Itens por página
 * @returns {{ items: Array, totalItems: number, totalPages: number, page: number }}
 */
export function listTransactions(options = {}) {
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

  // Filtro de Busca por texto
  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    list = list.filter(t => {
      const descMatches = t.description.toLowerCase().includes(term);
      const catName = catMap.get(t.categoryId) || '';
      const catMatches = catName.includes(term);
      return descMatches || catMatches;
    });
  }

  // Filtro por Tipo
  if (type && type !== 'todos') {
    list = list.filter(t => t.type === type);
  }

  // Filtro por Categoria
  if (categoryId && categoryId !== 'todos') {
    list = list.filter(t => t.categoryId === categoryId);
  }

  // Filtro por Mês (YYYY-MM)
  if (monthKey && monthKey !== 'todos') {
    list = list.filter(t => isDateInMonth(t.date, monthKey));
  }

  // Ordenação
  list.sort((a, b) => {
    if (sortBy === 'amount') {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    // Ordenação padrão por data
    const dateComparison = sortOrder === 'asc'
      ? a.date.localeCompare(b.date)
      : b.date.localeCompare(a.date);

    // Desempate por ID caso a data seja igual
    return dateComparison !== 0 ? dateComparison : b.id.localeCompare(a.id);
  });

  // Paginação
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

/**
 * Obtém transações recentes ordenadas por data
 * @param {number} limit
 * @returns {Array}
 */
export function getRecentTransactions(limit = 5) {
  const list = getTransactions();
  return list
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

/**
 * Busca uma transação por ID
 * @param {string} id
 * @returns {Object|null}
 */
export function getTransactionById(id) {
  const list = getTransactions();
  return list.find(t => t.id === id) || null;
}

/**
 * Cria uma nova transação com validação de dados
 * @param {Object} data
 * @returns {{ success: boolean, transaction?: Object, errors?: Object }}
 */
export function createTransaction(data) {
  const categories = getCategories();
  const validation = validateTransaction(data, categories);

  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const newTx = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    description: data.description.trim(),
    amount: Number(data.amount),
    type: data.type,
    categoryId: data.categoryId,
    date: data.date,
    notes: data.notes ? data.notes.trim() : ''
  };

  const list = getTransactions();
  list.unshift(newTx);
  saveTransactions(list);

  return { success: true, transaction: newTx };
}

/**
 * Atualiza uma transação existente
 * @param {string} id
 * @param {Object} data
 * @returns {{ success: boolean, transaction?: Object, errors?: Object }}
 */
export function updateTransaction(id, data) {
  const list = getTransactions();
  const index = list.findIndex(t => t.id === id);

  if (index === -1) {
    return { success: false, errors: { general: 'Transação não encontrada.' } };
  }

  const categories = getCategories();
  const validation = validateTransaction(data, categories);

  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  list[index] = {
    ...list[index],
    description: data.description.trim(),
    amount: Number(data.amount),
    type: data.type,
    categoryId: data.categoryId,
    date: data.date,
    notes: data.notes ? data.notes.trim() : ''
  };

  saveTransactions(list);
  return { success: true, transaction: list[index] };
}

/**
 * Exclui uma transação pelo ID
 * @param {string} id
 * @returns {{ success: boolean }}
 */
export function deleteTransaction(id) {
  const list = getTransactions();
  const filtered = list.filter(t => t.id !== id);
  saveTransactions(filtered);
  return { success: true };
}

/**
 * Calcula o resumo de receitas, despesas e saldo para um conjunto de dados ou mês específico
 * @param {string|null} [monthKey=null] - YYYY-MM ou null para calcular geral
 * @returns {{ totalIncome: number, totalExpense: number, balance: number, count: number }}
 */
export function calculateSummary(monthKey = null) {
  let list = getTransactions();

  if (monthKey && monthKey !== 'todos') {
    list = list.filter(t => isDateInMonth(t.date, monthKey));
  }

  let totalIncome = 0;
  let totalExpense = 0;

  for (const t of list) {
    if (t.type === 'receita') {
      totalIncome += t.amount;
    } else if (t.type === 'despesa') {
      totalExpense += t.amount;
    }
  }

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    count: list.length
  };
}
