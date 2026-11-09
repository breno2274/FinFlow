// Regras de negocio para gestao de categorias e protecao contra exclusao acidental de dados vinculados

import { Category, TransactionType } from '../types';
import { getCategories, saveCategories, getTransactions, saveTransactions } from './storage';

// Lista categorias cadastradas, permitindo filtro opcional por tipo
export function listCategories(type?: TransactionType): Category[] {
  const categories = getCategories();
  if (!type) return categories;
  return categories.filter(c => c.type === type);
}

// Localiza uma categoria pelo identificador
export function getCategoryById(id: string): Category | null {
  const categories = getCategories();
  return categories.find(c => c.id === id) || null;
}

// Cria uma nova categoria com cor personalizada
export function createCategory(data: Omit<Category, 'id'>): Category {
  const categories = getCategories();
  const newCat: Category = {
    ...data,
    id: `cat-${Date.now()}`
  };
  saveCategories([...categories, newCat]);
  return newCat;
}

// Atualiza o nome ou cor de uma categoria
export function updateCategory(id: string, data: Partial<Omit<Category, 'id'>>): Category | null {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return null;

  const updated: Category = {
    ...categories[index],
    ...data
  };

  categories[index] = updated;
  saveCategories([...categories]);
  return updated;
}

// Verifica se existem transacoes vinculadas a uma categoria para impedir dados orfaos
export function canDeleteCategory(id: string): { canDelete: boolean; usageCount: number } {
  const transactions = getTransactions();
  const usageCount = transactions.filter(t => t.categoryId === id).length;
  return {
    canDelete: usageCount === 0,
    usageCount
  };
}

// Reclassifica transacoes para uma nova categoria e remove a categoria antiga
export function reclassifyAndRemove(oldCategoryId: string, newCategoryId: string): boolean {
  const transactions = getTransactions();
  let updatedAny = false;

  const reclassified = transactions.map(t => {
    if (t.categoryId === oldCategoryId) {
      updatedAny = true;
      return { ...t, categoryId: newCategoryId };
    }
    return t;
  });

  if (updatedAny) {
    saveTransactions(reclassified);
  }

  const categories = getCategories();
  saveCategories(categories.filter(c => c.id !== oldCategoryId));
  return true;
}

// Remove uma categoria caso ela nao possua transacoes ativas
export function deleteCategory(id: string): boolean {
  const { canDelete } = canDeleteCategory(id);
  if (!canDelete) return false;

  const categories = getCategories();
  saveCategories(categories.filter(c => c.id !== id));
  return true;
}

