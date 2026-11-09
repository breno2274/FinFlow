// Gestao de tetos de gastos mensais por categoria e metas de economia com progresso circular

import React, { useState } from 'react';
import { getBudgetsWithUsage, deleteBudget } from '../services/budgetService';
import { listGoals, deleteGoal } from '../services/goalService';
import { Budget, Goal, BudgetUsage } from '../types';
import { formatCurrency } from '../utils/format';
import { getCurrentMonthKey, getLastNMonths, formatDate } from '../utils/dates';
import { GoalRing } from '../components/charts/GoalRing';
import { BudgetModal } from '../components/modals/BudgetModal';
import { GoalModal } from '../components/modals/GoalModal';
import { ContributionModal } from '../components/modals/ContributionModal';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import { useFinflowData } from '../hooks/useFinflowData';

// Exibe a tela dividida entre limites orcamentarios do mes e acompanhamento de objetivos
export const BudgetsPage: React.FC = () => {
  useFinflowData();

  const [activeMonthKey, setActiveMonthKey] = useState<string>(getCurrentMonthKey());

  // Estados dos modais de interacao
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);

  const [contribGoal, setContribGoal] = useState<Goal | null>(null);

  const monthOptions = getLastNMonths(6);
  const budgetsUsage = getBudgetsWithUsage(activeMonthKey);
  const goals = listGoals();

  const handleDeleteBudget = () => {
    if (budgetToDelete) {
      deleteBudget(budgetToDelete.id);
      setBudgetToDelete(null);
    }
  };

  const handleDeleteGoal = () => {
    if (goalToDelete) {
      deleteGoal(goalToDelete.id);
      setGoalToDelete(null);
    }
  };

  return (
    <div className="budgets-goals-view">
      <div className="dashboard-toolbar">
        <div>
          <p className="card-subtitle">Controle limites mensais por categoria e alcance seus objetivos.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
          <select
            id="budget-month-select"
            className="form-select"
            style={{ width: 'auto' }}
            aria-label="Mês do orçamento"
            value={activeMonthKey}
            onChange={(e) => setActiveMonthKey(e.target.value)}
          >
            {monthOptions.map((m: { key: string; label: string }) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-secondary"
            id="btn-open-create-budget"
            onClick={() => {
              setBudgetToEdit(null);
              setIsBudgetModalOpen(true);
            }}
          >
            + Criar orçamento
          </button>
          <button
            type="button"
            className="btn btn-primary"
            id="btn-open-create-goal"
            onClick={() => {
              setGoalToEdit(null);
              setIsGoalModalOpen(true);
            }}
          >
            + Nova meta
          </button>
        </div>
      </div>

      <div className="budgets-goals-grid">
        <section aria-labelledby="heading-orcamentos">
          <h3 id="heading-orcamentos" className="card-title">Orçamentos por categoria</h3>
          <p className="card-subtitle">Limites de gastos estipulados para o mês selecionado</p>

          <div className="budget-cards-list" id="budget-cards-container" style={{ marginTop: 'var(--spacing-4)' }}>
            {budgetsUsage.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', padding: '24px 0' }}>
                Nenhum orçamento configurado para este mês. Clique em "+ Criar orçamento" para definir limites.
              </p>
            ) : (
              budgetsUsage.map((b: BudgetUsage) => {
                let badgeClass = 'badge-neutral';
                let badgeText = `${b.percentage}% utilizado`;
                let fillClass = 'success';

                if (b.status === 'exceeded') {
                  badgeClass = 'badge-expense';
                  badgeText = `Excedido (${b.percentage}%)`;
                  fillClass = 'danger';
                } else if (b.status === 'warning') {
                  badgeClass = 'badge-warning';
                  badgeText = `Atenção (${b.percentage}%)`;
                  fillClass = 'warning';
                }

                return (
                  <div key={b.budget.id} className="budget-card">
                    <div className="budget-card-header">
                      <span className="budget-category-title">
                        <span
                          className="category-dot"
                          style={{ backgroundColor: b.category?.color || '#76B8B2', width: '10px', height: '10px', borderRadius: '50%' }}
                        />
                        {b.category?.name || 'Despesas gerais'}
                      </span>
                      <span className={`badge ${badgeClass}`}>{badgeText}</span>
                    </div>

                    <div className="progress-track" style={{ height: '8px', margin: 'var(--spacing-3) 0' }}>
                      <div
                        className={`progress-fill ${fillClass}`}
                        style={{ width: `${Math.min(100, b.percentage)}%` }}
                      />
                    </div>

                    <div className="budget-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                        Gasto: <strong>{formatCurrency(b.spent)}</strong> de {formatCurrency(b.budget.limitAmount)}
                        {b.status !== 'exceeded' && (
                          <span style={{ display: 'block', color: 'var(--color-positive)', marginTop: '2px' }}>
                            Restam {formatCurrency(b.remaining)}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setBudgetToEdit(b.budget);
                            setIsBudgetModalOpen(true);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--color-negative)' }}
                          onClick={() => setBudgetToDelete(b.budget)}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section aria-labelledby="heading-metas">
          <h3 id="heading-metas" className="card-title">Metas de economia</h3>
          <p className="card-subtitle">Progresso dos seus objetivos de médio e longo prazo</p>

          <div className="goals-list" id="goals-cards-container" style={{ marginTop: 'var(--spacing-4)' }}>
            {goals.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', padding: '24px 0' }}>
                Nenhuma meta cadastrada. Clique em "+ Nova meta" para planejar seus sonhos.
              </p>
            ) : (
              goals.map((goal: Goal) => {
                const pct = goal.targetAmount > 0
                  ? Math.round((goal.currentAmount / goal.targetAmount) * 100)
                  : 0;

                return (
                  <div key={goal.id} className="goal-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-5)', padding: 'var(--spacing-5)' }}>
                    <GoalRing percentage={pct} color={goal.color} size={110} />

                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>
                        {goal.name}
                      </h4>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-3)' }}>
                        Acumulado: <strong>{formatCurrency(goal.currentAmount)}</strong> de {formatCurrency(goal.targetAmount)}
                        {goal.targetDate && (
                          <span style={{ display: 'block', marginTop: '2px' }}>
                            Prazo: {formatDate(goal.targetDate, 'full')}
                          </span>
                        )}
                      </p>

                      <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => setContribGoal(goal)}
                        >
                          + Aportar
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setGoalToEdit(goal);
                            setIsGoalModalOpen(true);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--color-negative)' }}
                          onClick={() => setGoalToDelete(goal)}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => {
          setIsBudgetModalOpen(false);
          setBudgetToEdit(null);
        }}
        activeMonthKey={activeMonthKey}
        budgetToEdit={budgetToEdit}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setGoalToEdit(null);
        }}
        goalToEdit={goalToEdit}
      />

      <ContributionModal
        isOpen={Boolean(contribGoal)}
        onClose={() => setContribGoal(null)}
        goal={contribGoal}
      />

      <ConfirmModal
        isOpen={Boolean(budgetToDelete)}
        onClose={() => setBudgetToDelete(null)}
        onConfirm={handleDeleteBudget}
        title="Excluir orçamento"
        message="Deseja realmente remover este teto de orçamento mensal? O cálculo de gastos da categoria continuará existindo normalmente."
      />

      <ConfirmModal
        isOpen={Boolean(goalToDelete)}
        onClose={() => setGoalToDelete(null)}
        onConfirm={handleDeleteGoal}
        title="Excluir meta de economia"
        message={`Deseja realmente apagar a meta "${goalToDelete?.name}"? O saldo total guardado deixará de ser acompanhado.`}
      />
    </div>
  );
};

