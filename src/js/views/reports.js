/**
 * VIEW DE RELATÓRIOS FINANCEIROS — FINFLOW (Tela 07)
 * Painel analítico com evolução de receitas versus despesas mensal em SVG
 * e distribuição percentual de gastos por categoria.
 */

import { getMonthlyCashFlow, getExpensesByCategory, getPeriodTotals } from '../services/report-service.js';
import { formatCurrency, escapeHTML } from '../utils/format.js';

let selectedPeriodMonths = 6;

/**
 * Renderiza o gráfico comparativo de barras ou linhas SVG de Receitas x Despesas
 * @param {Array} cashFlowData
 * @returns {string} Código SVG
 */
function renderComparisonBarChartSVG(cashFlowData) {
  if (!cashFlowData || cashFlowData.length === 0) {
    return '<p style="text-align: center; color: var(--color-text-secondary); padding: 40px 0;">Sem dados suficientes para gerar o gráfico.</p>';
  }

  const width = 500;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(...cashFlowData.map(d => Math.max(d.income, d.expense, 500)), 5000);
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;
  const groupWidth = chartWidth / cashFlowData.length;
  const barWidth = Math.min(18, groupWidth * 0.32);

  const barsHTML = cashFlowData.map((d, i) => {
    const groupX = paddingX + (i * groupWidth);

    const incomeHeight = (d.income / maxVal) * chartHeight;
    const incomeY = height - paddingY - incomeHeight;

    const expenseHeight = (d.expense / maxVal) * chartHeight;
    const expenseY = height - paddingY - expenseHeight;

    return `
      <!-- Grupo do mês ${d.short} -->
      <g>
        <!-- Barra de Receitas -->
        <rect
          x="${groupX + (groupWidth / 2) - barWidth - 2}"
          y="${incomeY}"
          width="${barWidth}"
          height="${Math.max(2, incomeHeight)}"
          rx="3"
          fill="#76B8B2"
        >
          <title>Receitas (${d.short}): ${formatCurrency(d.income)}</title>
        </rect>

        <!-- Barra de Despesas -->
        <rect
          x="${groupX + (groupWidth / 2) + 2}"
          y="${expenseY}"
          width="${barWidth}"
          height="${Math.max(2, expenseHeight)}"
          rx="3"
          fill="#D96868"
        >
          <title>Despesas (${d.short}): ${formatCurrency(d.expense)}</title>
        </rect>

        <!-- Rótulo do mês -->
        <text
          x="${groupX + (groupWidth / 2)}"
          y="${height - 10}"
          font-size="11"
          fill="var(--color-text-secondary)"
          text-anchor="middle"
          font-family="'Playfair Display', serif"
        >
          ${d.short}
        </text>
      </g>
    `;
  }).join('');

  return `
    <svg viewBox="0 0 ${width} ${height}" class="chart-svg" role="img" aria-label="Comparativo mensal de receitas e despesas">
      <!-- Linhas de grade -->
      <line x1="${paddingX}" y1="${paddingY}" x2="${width - paddingX}" y2="${paddingY}" stroke="var(--color-border-subtle)" stroke-dasharray="3,3" />
      <line x1="${paddingX}" y1="${paddingY + chartHeight / 2}" x2="${width - paddingX}" y2="${paddingY + chartHeight / 2}" stroke="var(--color-border-subtle)" stroke-dasharray="3,3" />
      <line x1="${paddingX}" y1="${height - paddingY}" x2="${width - paddingX}" y2="${height - paddingY}" stroke="var(--color-border)" />

      ${barsHTML}

      <!-- Legenda Superior -->
      <g transform="translate(${width - 180}, 10)">
        <rect x="0" y="0" width="10" height="10" rx="2" fill="#76B8B2" />
        <text x="14" y="9" font-size="11" fill="var(--color-text-secondary)" font-family="'Playfair Display', serif">Receitas</text>
        <rect x="75" y="0" width="10" height="10" rx="2" fill="#D96868" />
        <text x="90" y="9" font-size="11" fill="var(--color-text-secondary)" font-family="'Playfair Display', serif">Despesas</text>
      </g>
    </svg>
  `;
}



export function renderReportsView() {
  const totals = getPeriodTotals(selectedPeriodMonths);
  const flow = getMonthlyCashFlow(selectedPeriodMonths);
  const expensesByCat = getExpensesByCategory(selectedPeriodMonths);

  const periodSelect = document.getElementById('reports-period-select');
  if (periodSelect && parseInt(periodSelect.value, 10) !== selectedPeriodMonths) {
    periodSelect.value = selectedPeriodMonths.toString();
  }

  const incomeKpi = document.getElementById('reports-kpi-income');
  if (incomeKpi) incomeKpi.textContent = formatCurrency(totals.totalIncome);

  const expenseKpi = document.getElementById('reports-kpi-expense');
  if (expenseKpi) expenseKpi.textContent = formatCurrency(totals.totalExpense);

  const savingsKpi = document.getElementById('reports-kpi-savings');
  if (savingsKpi) {
    savingsKpi.textContent = formatCurrency(totals.totalSavings);
    savingsKpi.className = `metric-value ${totals.totalSavings >= 0 ? 'positive' : 'negative'}`;
  }

  const chartContainer = document.getElementById('reports-chart-container');
  if (chartContainer) {
    chartContainer.innerHTML = renderComparisonBarChartSVG(flow);
  }

  const catContainer = document.getElementById('reports-categories-container');
  if (catContainer) {
    catContainer.innerHTML = expensesByCat.length > 0
      ? expensesByCat.map(cat => `
          <div class="cat-bar-item" style="margin-bottom: var(--spacing-4);">
            <div class="cat-bar-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-1);">
              <span class="cat-bar-label" style="display: flex; align-items: center; gap: var(--spacing-2);">
                <span class="category-dot" style="background-color: ${cat.categoryColor};"></span>
                ${escapeHTML(cat.categoryName)}
              </span>
              <span class="cat-bar-value">
                <strong>${cat.percentage}%</strong> (${formatCurrency(cat.totalAmount)})
              </span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${cat.percentage}%; background-color: ${cat.categoryColor};"></div>
            </div>
          </div>
        `).join('')
      : '<p style="color: var(--color-text-secondary); text-align: center; padding: 24px 0;">Nenhuma despesa registrada para o período selecionado.</p>';
  }

  const container = document.getElementById('view-reports');
  return container ? container.innerHTML : '';
}

/**
 * Registra os eventos da tela de Relatórios
 * @param {HTMLElement} container
 */
export function initReportsEvents(container = document.getElementById('view-reports')) {
  if (!container) return;
  if (container.dataset.eventsInit === 'true') return;
  container.dataset.eventsInit = 'true';

  const periodSelect = container.querySelector('#reports-period-select');
  if (periodSelect) {
    periodSelect.addEventListener('change', (e) => {
      selectedPeriodMonths = parseInt(e.target.value, 10);
      renderReportsView();
    });
  }
}

