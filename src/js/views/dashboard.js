/**
 * VIEW DASHBOARD / VISÃO GERAL — FINFLOW (Tela 03)
 * Painel financeiro executivo com resumo de saldo, receitas, despesas,
 * metas de economia, gráfico de fluxo financeiro nativo em SVG e transações recentes.
 */

import { calculateSummary, getRecentTransactions } from '../services/transaction-service.js';
import { getOverallGoalsProgress } from '../services/goal-service.js';
import { getMonthlyCashFlow } from '../services/report-service.js';
import { getCategoryById } from '../services/category-service.js';
import { getPreferences } from '../core/storage.js';
import { formatCurrency, formatPercent, escapeHTML } from '../utils/format.js';
import { formatDate, getCurrentMonthKey } from '../utils/dates.js';
import { openTransactionModal } from './transaction-form.js';
import { renderEmptyState } from '../components/empty-state.js';

let selectedPeriod = getCurrentMonthKey(); // Padrão: mês atual

/**
 * Renderiza o gráfico vetorial SVG de fluxo financeiro com curvas suaves
 * @param {Array} cashFlowData
 * @returns {string} Código SVG
 */
function renderFlowChartSVG(cashFlowData) {
  if (!cashFlowData || cashFlowData.length === 0) {
    return '<p style="text-align: center; color: var(--color-text-secondary); padding: 40px 0;">Sem dados de fluxo para o período.</p>';
  }

  const width = 560;
  const height = 200;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(...cashFlowData.map(d => Math.max(d.income, d.expense, 1000)), 7000);

  // Calcula coordenadas dos pontos para a curva de receita
  const pointsIncome = cashFlowData.map((d, i) => {
    const x = paddingX + (i * ((width - paddingX * 2) / (cashFlowData.length - 1 || 1)));
    const y = height - paddingY - (d.income / maxVal) * (height - paddingY * 2);
    return { x, y, val: d.income, label: d.short };
  });

  // Calcula coordenadas dos pontos para a curva de despesa
  const pointsExpense = cashFlowData.map((d, i) => {
    const x = paddingX + (i * ((width - paddingX * 2) / (cashFlowData.length - 1 || 1)));
    const y = height - paddingY - (d.expense / maxVal) * (height - paddingY * 2);
    return { x, y, val: d.expense, label: d.short };
  });

  // Cria caminho suave (spline) para a curva
  const createSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx = (p0.x + p1.x) / 2;
      path += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const incomePath = createSmoothPath(pointsIncome);
  const expensePath = createSmoothPath(pointsExpense);

  // Área preenchida sob a curva de receitas
  const areaPath = pointsIncome.length > 0
    ? `${incomePath} L ${pointsIncome[pointsIncome.length - 1].x} ${height - paddingY} L ${pointsIncome[0].x} ${height - paddingY} Z`
    : '';

  return `
    <svg viewBox="0 0 ${width} ${height}" class="chart-svg" role="img" aria-label="Gráfico de fluxo financeiro dos últimos 6 meses">
      <defs>
        <linearGradient id="chartGradientTeal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#76B8B2" stop-opacity="0.28" />
          <stop offset="100%" stop-color="#76B8B2" stop-opacity="0.0" />
        </linearGradient>
      </defs>

      <!-- Linhas horizontais de referência -->
      <line x1="${paddingX}" y1="${paddingY}" x2="${width - paddingX}" y2="${paddingY}" stroke="var(--color-border-subtle)" stroke-dasharray="3,3" />
      <line x1="${paddingX}" y1="${height / 2}" x2="${width - paddingX}" y2="${height / 2}" stroke="var(--color-border-subtle)" stroke-dasharray="3,3" />
      <line x1="${paddingX}" y1="${height - paddingY}" x2="${width - paddingX}" y2="${height - paddingY}" stroke="var(--color-border)" />

      <!-- Área preenchida da curva de receitas -->
      <path d="${areaPath}" fill="url(#chartGradientTeal)" />

      <!-- Linha de Despesas (vermelho suave) -->
      <path d="${expensePath}" fill="none" stroke="#D96868" stroke-width="2" stroke-linecap="round" stroke-dasharray="4,4" />

      <!-- Linha de Receitas (verde-água principal) -->
      <path d="${incomePath}" fill="none" stroke="#76B8B2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Pontos de dados e rótulos do eixo X -->
      ${pointsIncome.map(p => `
        <circle cx="${p.x}" cy="${p.y}" r="4" fill="#FFFFFF" stroke="#4D9690" stroke-width="2">
          <title>Receitas (${p.label}): ${formatCurrency(p.val)}</title>
        </circle>
        <text x="${p.x}" y="${height - 10}" font-size="11" fill="var(--color-text-secondary)" text-anchor="middle" font-family="'Playfair Display', serif">
          ${p.label}
        </text>
      `).join('')}

      <!-- Legenda do gráfico no canto superior direito -->
      <g transform="translate(${width - 190}, 12)">
        <rect x="0" y="0" width="10" height="10" rx="2" fill="#76B8B2" />
        <text x="16" y="9" font-size="11" fill="var(--color-text-secondary)" font-family="'Playfair Display', serif">Receitas</text>
        <line x1="85" y1="5" x2="100" y2="5" stroke="#D96868" stroke-width="2" stroke-dasharray="3,3" />
        <text x="106" y="9" font-size="11" fill="var(--color-text-secondary)" font-family="'Playfair Display', serif">Despesas</text>
      </g>
    </svg>
  `;
}

export function renderDashboardView() {
  const prefs = getPreferences();
  const userName = prefs.userName || 'UserTest';

  // Cálculos dinâmicos a partir das transações no período selecionado
  const summary = calculateSummary(selectedPeriod);
  const goalsPct = getOverallGoalsProgress();
  const recentTransactions = getRecentTransactions(5);
  const cashFlowData = getMonthlyCashFlow(6);

  const greetingEl = document.getElementById('dashboard-greeting');
  if (greetingEl) {
    greetingEl.textContent = `Olá, ${userName}!`;
  }

  const periodSelect = document.getElementById('dashboard-period-select');
  if (periodSelect && periodSelect.value !== selectedPeriod) {
    periodSelect.value = selectedPeriod;
  }

  const balanceEl = document.getElementById('dashboard-metric-balance');
  if (balanceEl) {
    balanceEl.textContent = formatCurrency(summary.balance);
    balanceEl.className = `metric-value ${summary.balance < 0 ? 'negative' : ''}`;
  }

  const incomeEl = document.getElementById('dashboard-metric-income');
  if (incomeEl) {
    incomeEl.textContent = formatCurrency(summary.totalIncome);
  }

  const expenseEl = document.getElementById('dashboard-metric-expense');
  if (expenseEl) {
    expenseEl.textContent = formatCurrency(summary.totalExpense);
  }

  const goalsEl = document.getElementById('dashboard-metric-goals');
  const goalsFillEl = document.getElementById('dashboard-metric-goals-fill');
  if (goalsEl) {
    goalsEl.textContent = `${goalsPct}%`;
  }
  if (goalsFillEl) {
    goalsFillEl.style.width = `${goalsPct}%`;
  }

  const chartContainer = document.getElementById('dashboard-chart-container');
  if (chartContainer) {
    chartContainer.innerHTML = renderFlowChartSVG(cashFlowData);
  }

  const recentContainer = document.getElementById('dashboard-recent-transactions');
  if (recentContainer) {
    recentContainer.innerHTML = recentTransactions.length > 0
      ? recentTransactions.map(tx => {
          const cat = getCategoryById(tx.categoryId) || { name: 'Geral', color: '#76B8B2' };
          const isIncome = tx.type === 'receita';
          const sign = isIncome ? '+' : '-';
          const amountClass = isIncome ? 'income' : 'expense';

          return `
            <div class="transaction-item">
              <div class="tx-left">
                <div class="tx-icon-wrap ${amountClass}">
                  <span class="category-dot" style="background-color: ${cat.color};"></span>
                </div>
                <div class="tx-details">
                  <span class="tx-desc">${escapeHTML(tx.description)}</span>
                  <span class="tx-meta">
                    <span>${escapeHTML(cat.name)}</span>
                    <span>&bull;</span>
                    <span>${formatDate(tx.date, 'relative')}</span>
                  </span>
                </div>
              </div>
              <div class="tx-amount ${amountClass}">
                ${sign} ${formatCurrency(tx.amount)}
              </div>
            </div>
          `;
        }).join('')
      : renderEmptyState({
          title: 'Sem transações recentes',
          description: 'Comece adicionando uma receita ou despesa no botão acima.',
          actionText: '+ Adicionar transação',
          actionId: 'btn-empty-add-tx'
        });
  }

  const container = document.getElementById('view-dashboard');
  return container ? container.innerHTML : '';
}

/**
 * Registra ouvintes de evento específicos da tela de Dashboard
 * @param {HTMLElement} container
 */
export function initDashboardEvents(container = document.getElementById('view-dashboard')) {
  if (!container) return;
  if (container.dataset.eventsInit === 'true') return;
  container.dataset.eventsInit = 'true';

  const quickNewTxBtn = container.querySelector('#btn-quick-new-tx');
  const periodSelect = container.querySelector('#dashboard-period-select');

  if (quickNewTxBtn) {
    quickNewTxBtn.addEventListener('click', () => openTransactionModal());
  }

  container.addEventListener('click', (e) => {
    if (e.target.closest('#btn-empty-add-tx')) {
      openTransactionModal();
    }
  });

  if (periodSelect) {
    periodSelect.addEventListener('change', (e) => {
      selectedPeriod = e.target.value;
      renderDashboardView();
    });
  }
}

