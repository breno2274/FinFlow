// Relatorios analiticos com comparativo mensal de receitas versus despesas e distribuicao por categoria

import React, { useState } from 'react';
import { getMonthlyCashFlow, getCategoryExpenseDistribution, getReportKPIs } from '../services/reportService';
import { formatCurrency, formatPercent } from '../utils/format';
import { BarChart } from '../components/charts/BarChart';
import { useFinflowData } from '../hooks/useFinflowData';
import { CategoryDistribution } from '../types';

// Exibe painel analitico consolidando os ultimos 3, 6 ou 12 meses
export const ReportsPage: React.FC = () => {
  useFinflowData();

  const [periodMonths, setPeriodMonths] = useState<number>(6);

  const kpis = getReportKPIs(periodMonths);
  const flowData = getMonthlyCashFlow(periodMonths);
  const categoriesDist = getCategoryExpenseDistribution(periodMonths);

  return (
    <div className="reports-view">
      <div className="dashboard-toolbar">
        <div>
          <p className="card-subtitle">Transforme movimentações em tendências para entender seus hábitos.</p>
        </div>

        <div>
          <select
            id="reports-period-select"
            className="form-select"
            style={{ width: 'auto' }}
            aria-label="Período do relatório"
            value={periodMonths}
            onChange={(e) => setPeriodMonths(Number(e.target.value))}
          >
            <option value={6}>Últimos 6 meses</option>
            <option value={3}>Últimos 3 meses</option>
            <option value={12}>Últimos 12 meses</option>
          </select>
        </div>
      </div>

      <section className="reports-kpis-grid" aria-label="Totais do período analisado">
        <div className="card metric-card">
          <span className="metric-label">Receitas</span>
          <div className="metric-value positive" id="reports-kpi-income">
            {formatCurrency(kpis.totalIncome)}
          </div>
          <div className="metric-footer"><span>Total acumulado no período</span></div>
        </div>

        <div className="card metric-card">
          <span className="metric-label">Despesas</span>
          <div className="metric-value negative" id="reports-kpi-expense">
            {formatCurrency(kpis.totalExpense)}
          </div>
          <div className="metric-footer"><span>Saídas totais no período</span></div>
        </div>

        <div className="card metric-card">
          <span className="metric-label">Economia líquida</span>
          <div className="metric-value" id="reports-kpi-savings" style={{ color: kpis.netSavings >= 0 ? 'var(--color-primary-dark)' : 'var(--color-negative)' }}>
            {formatCurrency(kpis.netSavings)}
          </div>
          <div className="metric-footer"><span>Superávit financeiro acumulado</span></div>
        </div>
      </section>

      <section className="reports-charts-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Receitas x Despesas</h3>
              <p className="card-subtitle">Comparação mensal do fluxo no período</p>
            </div>
          </div>
          <div className="chart-container" id="reports-chart-container">
            <BarChart data={flowData} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Distribuição de despesas</h3>
              <p className="card-subtitle">Gastos consolidados por categoria no período</p>
            </div>
          </div>
          <div className="categories-progress-list" id="reports-categories-container">
            {categoriesDist.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '30px 0' }}>
                Nenhuma despesa registrada no período.
              </p>
            ) : (
              categoriesDist.map((cat: CategoryDistribution) => (
                <div key={cat.categoryId} className="category-progress-item" style={{ marginBottom: 'var(--spacing-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-1)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                      <span className="category-dot" style={{ backgroundColor: cat.color, width: '10px', height: '10px', borderRadius: '50%' }} />
                      {cat.categoryName}
                    </span>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                      {formatCurrency(cat.amount)}{' '}
                      <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>
                        ({formatPercent(cat.percentage)})
                      </span>
                    </span>
                  </div>

                  <div className="progress-track" style={{ height: '6px' }}>
                    <div
                      className="progress-fill"
                      style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

