/**
 * SERVIÇO DE METAS FINANCEIRAS — FINFLOW
 * Gerencia objetivos de economia, aportes/contribuições e cálculo de progresso.
 */

import { getGoals, saveGoals } from '../core/storage.js';
import { validateGoal } from '../utils/validators.js';

/**
 * Retorna as metas cadastradas enriquecidas com o percentual de conclusão
 * @returns {Array<Object>}
 */
export function listGoals() {
  const goals = getGoals();
  return goals.map(goal => {
    const target = Number(goal.targetAmount) || 0;
    const current = Number(goal.currentAmount) || 0;
    const percentage = target > 0 ? (current / target) * 100 : 0;

    return {
      ...goal,
      targetAmount: target,
      currentAmount: current,
      percentage: Math.min(100, Math.round(percentage)),
      realPercentage: Math.round(percentage),
      isCompleted: current >= target
    };
  });
}

/**
 * Calcula a taxa global de progresso das metas para exibição no Dashboard
 * @returns {number} Percentual consolidado médio (0 a 100)
 */
export function getOverallGoalsProgress() {
  const goals = listGoals();
  if (goals.length === 0) return 0;

  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalCurrent = goals.reduce((acc, g) => acc + g.currentAmount, 0);

  if (totalTarget === 0) return 0;
  return Math.min(100, Math.round((totalCurrent / totalTarget) * 100));
}

/**
 * Cria uma nova meta financeira
 * @param {Object} data - { name, targetAmount, currentAmount, targetDate, color }
 * @returns {{ success: boolean, goal?: Object, errors?: Object }}
 */
export function createGoal(data) {
  const validation = validateGoal(data);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const newGoal = {
    id: `goal-${Date.now()}`,
    name: data.name.trim(),
    targetAmount: Number(data.targetAmount),
    currentAmount: Number(data.currentAmount || 0),
    targetDate: data.targetDate || '',
    color: data.color || '#76B8B2'
  };

  const goals = getGoals();
  goals.push(newGoal);
  saveGoals(goals);

  return { success: true, goal: newGoal };
}

/**
 * Atualiza uma meta existente
 * @param {string} id
 * @param {Object} data
 * @returns {{ success: boolean, goal?: Object, errors?: Object }}
 */
export function updateGoal(id, data) {
  const goals = getGoals();
  const index = goals.findIndex(g => g.id === id);

  if (index === -1) {
    return { success: false, errors: { general: 'Meta não encontrada.' } };
  }

  const validation = validateGoal(data);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  goals[index] = {
    ...goals[index],
    name: data.name.trim(),
    targetAmount: Number(data.targetAmount),
    currentAmount: Number(data.currentAmount || 0),
    targetDate: data.targetDate || '',
    color: data.color || goals[index].color
  };

  saveGoals(goals);
  return { success: true, goal: goals[index] };
}

/**
 * Registra um aporte/contribuição de valor em uma meta
 * @param {string} goalId
 * @param {number} amount - Valor a adicionar
 * @returns {{ success: boolean, goal?: Object, message?: string }}
 */
export function addGoalContribution(goalId, amount) {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return { success: false, message: 'O valor da contribuição deve ser positivo.' };
  }

  const goals = getGoals();
  const index = goals.findIndex(g => g.id === goalId);

  if (index === -1) {
    return { success: false, message: 'Meta não encontrada.' };
  }

  goals[index].currentAmount += numericAmount;
  saveGoals(goals);

  return { success: true, goal: goals[index] };
}

/**
 * Remove uma meta
 * @param {string} id
 * @returns {{ success: boolean }}
 */
export function deleteGoal(id) {
  const goals = getGoals();
  const filtered = goals.filter(g => g.id !== id);
  saveGoals(filtered);
  return { success: true };
}
