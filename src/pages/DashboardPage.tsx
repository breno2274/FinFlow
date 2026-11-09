// Painel executivo principal com metricas consolidadas, grafico de fluxo e transacoes recentes

import React, { useState } from 'react';
import { calculateSummary, getRecentTransactions } from '../services/transactionService';
import { getMonthlyCashFlow } from '../services/reportService';
import { getCategories, getPreferences } from '../services/storage';
import { formatCurrency, formatPercent } from '../utils/format';
import { formatDate, getCurrentMonthKey, getLastNMonths } from '../utils/dates';
import { FlowChart } from '../components/charts/FlowChart';
import { TransactionModal } from '../components/modals/TransactionModal';
import { useFinflowData } from '../hooks/useFinflowData';
import { Category, Transaction } from '../types';

// Reune os indicadores financeiros mais importantes do usuario em tempo real
export const DashboardPage: React.FC = () => {
  // Observa alteracoes nos dados do LocalStorage para recarregar a visualizacao
  useFinflowData();

  const [selectedPeriod, setSelectedPeriod] = useState<string>(getCurrentMonthKey());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const prefs = getPreferences();
  const userName = prefs.userName || 'UserTest';

  const summary = calculateSummary(selectedPeriod);
  const flowData = getMonthlyCashFlow(6);
  const recentTransactions = getRecentTransactions(5);
  const categories = getCategories();
  const catMap = new Map<string, Category>(categories.map((c: Category) => [c.id, c]));

  const monthOptions = getLastNMonths(6);

  return (
    <div className="dashboard-view">
      <div className="dashboard-toolbar">
        <div>
          <h2 className="greeting-text" id="dashboard-greeting">Olá, {userName}!</h2>
          <p className="card-subtitle">Veja sua vida financeira em um só lugar.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
          <select
            id="dashboard-period-select"
            className="form-select"
            style={{ width: 'auto', minWidth: '170px' }}
            aria-label="Filtrar por período"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            {monthOptions.map((m: { key: string; label: string }) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
            <option value="todos">Todas as transações</option>
          </select>

          <button
            type="button"
            className="btn btn-primary"
            id="btn-quick-new-tx"
            onClick={() => setIsModalOpen(true)}
          >
            + Nova transação
          </button>
        </div>
      </div>

      <section className="metrics-grid" aria-label="Indicadores financeiros">
        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Saldo atual</span>
            <div className="metric-icon-wrap" style={{ backgroundColor: 'var(--color-mint)' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>$</span>
            </div>
          </div>
          <div className="metric-value" id="dashboard-metric-balance">
            {formatCurrency(summary.balance)}
          </div>
          <div className="metric-footer">
            <span style={{ color: summary.balanceTrend >= 0 ? 'var(--color-positive)' : 'var(--color-negative)', fontWeight: 600 }}>
              {summary.balanceTrend >= 0 ? `+${summary.balanceTrend}%` : `${summary.balanceTrend}%`}
            </span>
            <span>comparado ao mês passado</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Receitas</span>
            <div className="metric-icon-wrap" style={{ backgroundColor: 'var(--color-positive-bg)' }}>
              <img src="img/icone-receitas.svg" alt="" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
            </div>
          </div>
          <div className="metric-value positive" id="dashboard-metric-income">
            {formatCurrency(summary.income)}
          </div>
          <div className="metric-footer">
            <span>Entradas do período</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Despesas</span>
            <div className="metric-icon-wrap" style={{ backgroundColor: 'var(--color-negative-bg)' }}>
              <img src="img/icone-despesas.svg" alt="" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
            </div>
          </div>
          <div className="metric-value negative" id="dashboard-metric-expense">
            {formatCurrency(summary.expense)}
          </div>
          <div className="metric-footer">
            <span>Saídas do período</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Metas de economia</span>
            <div className="metric-icon-wrap" style={{ backgroundColor: 'var(--color-mint)' }}>
              <img src="img/icone-metas.svg" alt="" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
            </div>
          </div>
          <div className="metric-value" id="dashboard-metric-goals">
            {formatPercent(summary.goalsPercent)}
          </div>
          <div className="metric-footer">
            <div className="progress-track" style={{ marginTop: 'var(--spacing-2)', height: '6px' }}>
              <div
                className="progress-fill"
                id="dashboard-metric-goals-fill"
                style={{ width: `${summary.goalsPercent}%` }}
              />
            </div>
            <span id="dashboard-metric-goals-sub" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-1)', display: 'inline-block' }}>
              Concluído do total
            </span>
          </div>
        </div>
      </section>

      <section className="dashboard-charts-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Fluxo financeiro</h3>
              <p className="card-subtitle">Entradas e saídas dos últimos 6 meses</p>
            </div>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#76B8B2' }}></span>Receitas
              </span>
              <span className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#D96868' }}></span>Despesas
              </span>
            </div>
          </div>
          <div className="chart-container" id="dashboard-chart-container">
            <FlowChart data={flowData} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Transações recentes</h3>
              <p className="card-subtitle">Últimas movimentações registradas</p>
            </div>
            <a href="#/transacoes" className="btn btn-secondary btn-sm">Ver todas</a>
          </div>
          <div className="recent-transactions-list" id="dashboard-recent-transactions">
            {recentTransactions.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '24px 0' }}>
                Nenhuma transação registrada.
              </p>
            ) : (
              recentTransactions.map((t: Transaction) => {
                const category = catMap.get(t.categoryId);
                const isIncome = t.type === 'receita';
                return (
                  <div key={t.id} className="recent-tx-item">
                    <div className="recent-tx-left">
                      <div
                        className="recent-tx-icon-wrap"
                        style={{
                          backgroundColor: isIncome ? 'var(--color-positive-bg)' : 'var(--color-negative-bg)'
                        }}
                      >
                        <img
                          src={isIncome ? 'img/icone-receitas.svg' : 'img/icone-despesas.svg'}
                          alt=""
                          aria-hidden="true"
                          style={{ width: '16px', height: '16px' }}
                        />
                      </div>
                      <div>
                        <div className="recent-tx-desc">{t.description}</div>
                        <div className="recent-tx-meta">
                          <span className="recent-tx-date">{formatDate(t.date, 'relative')}</span>
                          {category && (
                            <span className="recent-tx-category">
                              &bull; {category.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={`recent-tx-amount ${isIncome ? 'positive' : 'negative'}`}>
                      {isIncome ? `+${formatCurrency(t.amount)}` : `-${formatCurrency(t.amount)}`}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

