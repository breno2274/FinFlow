// Regras de negocio para metas de economia, aportes financeiros e acompanhamento de progresso

import { Goal } from '../types';
import { getGoals, saveGoals } from './storage';

// Lista todas as metas de economia cadastradas
export function listGoals(): Goal[] {
  return getGoals();
}

// Localiza uma meta pelo identificador
export function getGoalById(id: string): Goal | null {
  const goals = getGoals();
  return goals.find(g => g.id === id) || null;
}

// Cria uma nova meta de economia com prazo e valor pretendido
export function createGoal(data: Omit<Goal, 'id'>): Goal {
  const goals = getGoals();
  const newGoal: Goal = {
    ...data,
    id: `goal-${Date.now()}`
  };
  saveGoals([...goals, newGoal]);
  return newGoal;
}

// Atualiza o objetivo, prazo ou valor de uma meta
export function updateGoal(id: string, data: Partial<Omit<Goal, 'id'>>): Goal | null {
  const goals = getGoals();
  const index = goals.findIndex(g => g.id === id);
  if (index === -1) return null;

  const updated: Goal = {
    ...goals[index],
    ...data
  };

  goals[index] = updated;
  saveGoals([...goals]);
  return updated;
}

// Remove uma meta de economia
export function deleteGoal(id: string): boolean {
  const goals = getGoals();
  const filtered = goals.filter(g => g.id !== id);
  if (filtered.length === goals.length) return false;
  saveGoals(filtered);
  return true;
}

// Registra um aporte financeiro incremental em uma meta ativa
export function addGoalContribution(id: string, amount: number): Goal | null {
  const goal = getGoalById(id);
  if (!goal) return null;

  const newCurrent = Math.max(0, goal.currentAmount + amount);
  return updateGoal(id, { currentAmount: newCurrent });
}

// Retorna os totais e a taxa percentual de conclusao de todas as metas combinadas
export function getOverallGoalsProgress(): { totalTarget: number; totalCurrent: number; percentage: number } {
  const goals = getGoals();
  let totalTarget = 0;
  let totalCurrent = 0;

  for (const g of goals) {
    totalTarget += g.targetAmount;
    totalCurrent += g.currentAmount;
  }

  const percentage = totalTarget > 0 ? Math.min(100, Math.round((totalCurrent / totalTarget) * 100)) : 0;

  return {
    totalTarget,
    totalCurrent,
    percentage
  };
}

