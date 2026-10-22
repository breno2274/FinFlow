/**
 * SERVIÇO DE CATEGORIAS — FINFLOW
 * Gerencia o cadastro, edição, consulta e exclusão segura de categorias,
 * impedindo que transações fiquem órfãs sem uma categoria válida.
 */

import { getCategories, saveCategories, getTransactions, saveTransactions } from '../core/storage.js';
import { validateCategory } from '../utils/validators.js';

/**
 * Retorna todas as categorias, opcionalmente filtradas por tipo
 * @param {'receita'|'despesa'|null} [type=null]
 * @returns {Array}
 */
export function listCategories(type = null) {
  const cats = getCategories();
  if (!type) return cats;
  return cats.filter(c => c.type === type);
}

/**
 * Busca uma categoria pelo seu ID
 * @param {string} id
 * @returns {Object|null}
 */
export function getCategoryById(id) {
  const cats = getCategories();
  return cats.find(c => c.id === id) || null;
}

/**
 * Conta quantas transações estão vinculadas a uma categoria
 * @param {string} categoryId
 * @returns {number}
 */
export function getCategoryUsageCount(categoryId) {
  const txs = getTransactions();
  return txs.filter(t => t.categoryId === categoryId).length;
}

/**
 * Cria uma nova categoria
 * @param {Object} data - { name, type, color }
 * @returns {{ success: boolean, category?: Object, errors?: Object }}
 */
export function createCategory(data) {
  const cats = getCategories();
  const validation = validateCategory(data, cats);

  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const newCat = {
    id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: data.name.trim(),
    type: data.type,
    color: data.color || '#76B8B2'
  };

  cats.push(newCat);
  saveCategories(cats);
  return { success: true, category: newCat };
}

/**
 * Atualiza uma categoria existente
 * @param {string} id
 * @param {Object} data - { name, type, color }
 * @returns {{ success: boolean, category?: Object, errors?: Object }}
 */
export function updateCategory(id, data) {
  const cats = getCategories();
  const index = cats.findIndex(c => c.id === id);

  if (index === -1) {
    return { success: false, errors: { general: 'Categoria não encontrada.' } };
  }

  const validation = validateCategory(data, cats, id);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  cats[index] = {
    ...cats[index],
    name: data.name.trim(),
    type: data.type,
    color: data.color
  };

  saveCategories(cats);
  return { success: true, category: cats[index] };
}

/**
 * Tenta excluir uma categoria com verificação de segurança
 * Se existirem transações usando a categoria, impede a exclusão direta e orienta o usuário.
 * @param {string} id
 * @returns {{ success: boolean, reason?: string, count?: number, message?: string }}
 */
export function deleteCategory(id) {
  const usageCount = getCategoryUsageCount(id);

  if (usageCount > 0) {
    return {
      success: false,
      reason: 'in_use',
      count: usageCount,
      message: `Esta categoria possui ${usageCount} transação(ões) vinculada(s). Reatribua as transações antes de excluir.`
    };
  }

  const cats = getCategories();
  const filtered = cats.filter(c => c.id !== id);
  saveCategories(filtered);
  return { success: true };
}

/**
 * Reclassifica transações de uma categoria antiga para uma nova e depois exclui a antiga
 * @param {string} oldCategoryId
 * @param {string} newCategoryId
 * @returns {{ success: boolean }}
 */
export function reassignAndDeleteCategory(oldCategoryId, newCategoryId) {
  const txs = getTransactions();
  const updatedTxs = txs.map(t => {
    if (t.categoryId === oldCategoryId) {
      return { ...t, categoryId: newCategoryId };
    }
    return t;
  });

  saveTransactions(updatedTxs);

  const cats = getCategories();
  const filtered = cats.filter(c => c.id !== oldCategoryId);
  saveCategories(filtered);

  return { success: true };
}
