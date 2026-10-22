/**
 * VALIDATORES — FINFLOW
 * Centraliza regras de validação para transações, categorias, orçamentos,
 * metas e arquivos de backup JSON.
 */

/**
 * Valida os dados de uma movimentação financeira
 * @param {Object} tx - Dados da transação
 * @param {Array} categories - Lista de categorias válidas existentes
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateTransaction(tx, categories = []) {
  const errors = {};

  if (!tx.description || tx.description.trim().length < 2) {
    errors.description = 'A descrição deve ter pelo menos 2 caracteres.';
  }

  const amount = Number(tx.amount);
  if (isNaN(amount) || amount <= 0) {
    errors.amount = 'O valor deve ser maior que zero.';
  }

  if (!tx.date || !/^\d{4}-\d{2}-\d{2}$/.test(tx.date)) {
    errors.date = 'Informe uma data válida no formato correto.';
  }

  if (!tx.type || !['receita', 'despesa'].includes(tx.type)) {
    errors.type = 'Selecione o tipo (Receita ou Despesa).';
  }

  if (!tx.categoryId) {
    errors.categoryId = 'Selecione uma categoria válida.';
  } else if (categories.length > 0 && !categories.some(c => c.id === tx.categoryId)) {
    errors.categoryId = 'A categoria selecionada não existe no cadastro.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Valida o cadastro ou edição de uma categoria
 * @param {Object} cat - Dados da categoria
 * @param {Array} existingCats - Lista atual de categorias
 * @param {string|null} currentId - ID da categoria se for edição
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateCategory(cat, existingCats = [], currentId = null) {
  const errors = {};

  if (!cat.name || cat.name.trim().length < 2) {
    errors.name = 'O nome da categoria deve ter pelo menos 2 caracteres.';
  } else {
    // Evita duplicidade de nomes no mesmo tipo
    const duplicate = existingCats.find(c =>
      c.id !== currentId &&
      c.type === cat.type &&
      c.name.trim().toLowerCase() === cat.name.trim().toLowerCase()
    );
    if (duplicate) {
      errors.name = `Já existe uma categoria de ${cat.type} com este nome.`;
    }
  }

  if (!cat.type || !['receita', 'despesa'].includes(cat.type)) {
    errors.type = 'O tipo deve ser Receita ou Despesa.';
  }

  if (!cat.color || !/^#([0-9A-F]{3}){1,2}$/i.test(cat.color)) {
    errors.color = 'Selecione uma cor hexadecimal válida.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Valida o limite de um orçamento mensal
 * @param {Object} budget - Dados do orçamento
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateBudget(budget) {
  const errors = {};

  if (!budget.categoryId) {
    errors.categoryId = 'Selecione a categoria do orçamento.';
  }

  const limit = Number(budget.limitAmount);
  if (isNaN(limit) || limit <= 0) {
    errors.limitAmount = 'O limite estipulado deve ser maior que zero.';
  }

  if (!budget.monthKey || !/^\d{4}-\d{2}$/.test(budget.monthKey)) {
    errors.monthKey = 'Mês do orçamento inválido.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Valida uma meta financeira de economia
 * @param {Object} goal - Dados da meta
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateGoal(goal) {
  const errors = {};

  if (!goal.name || goal.name.trim().length < 2) {
    errors.name = 'O título da meta deve ter pelo menos 2 caracteres.';
  }

  const target = Number(goal.targetAmount);
  if (isNaN(target) || target <= 0) {
    errors.targetAmount = 'O valor desejado deve ser maior que zero.';
  }

  const current = Number(goal.currentAmount || 0);
  if (isNaN(current) || current < 0) {
    errors.currentAmount = 'O valor acumulado não pode ser negativo.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Valida a estrutura completa de um arquivo JSON de backup antes da importação
 * @param {any} data - Conteúdo parseado do arquivo JSON
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateBackupJSON(data) {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'O arquivo importado não contém um objeto JSON válido.' };
  }

  if (!data.schemaVersion || typeof data.schemaVersion !== 'string') {
    return { isValid: false, error: 'Arquivo incompatível: versão do esquema ausente ou inválida.' };
  }

  if (!Array.isArray(data.transactions)) {
    return { isValid: false, error: 'O backup não possui a lista de transações esperada.' };
  }

  if (!Array.isArray(data.categories)) {
    return { isValid: false, error: 'O backup não possui a lista de categorias esperada.' };
  }

  if (!Array.isArray(data.budgets)) {
    return { isValid: false, error: 'O backup não possui a lista de orçamentos esperada.' };
  }

  if (!Array.isArray(data.goals)) {
    return { isValid: false, error: 'O backup não possui a lista de metas esperada.' };
  }

  return { isValid: true };
}
