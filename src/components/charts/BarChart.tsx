// Grafico comparativo de barras mensais entre receitas e despesas em SVG nativo

import React from 'react';
import { CashFlowPoint } from '../../types';
import { formatCurrency } from '../../utils/format';

interface BarChartProps {
  data: CashFlowPoint[];
}

// Renderiza barras verticais emparelhadas comparando receitas e despesas por mes
export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '40px 0' }}>
        Sem dados suficientes para gerar o gráfico.
      </p>
    );
  }

  const width = 500;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(...data.map(d => Math.max(d.income, d.expense, 500)), 5000);
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;
  const groupWidth = chartWidth / data.length;
  const barWidth = Math.min(18, groupWidth * 0.32);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg" role="img" aria-label="Comparativo mensal de receitas e despesas">
      <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="var(--color-border-subtle)" strokeDasharray="3,3" />
      <line x1={paddingX} y1={paddingY + chartHeight / 2} x2={width - paddingX} y2={paddingY + chartHeight / 2} stroke="var(--color-border-subtle)" strokeDasharray="3,3" />
      <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="var(--color-border)" />

      {data.map((d, i) => {
        const groupX = paddingX + (i * groupWidth);
        const incomeHeight = (d.income / maxVal) * chartHeight;
        const incomeY = height - paddingY - incomeHeight;

        const expenseHeight = (d.expense / maxVal) * chartHeight;
        const expenseY = height - paddingY - expenseHeight;

        return (
          <g key={d.monthKey}>
            <rect
              x={groupX + (groupWidth / 2) - barWidth - 2}
              y={incomeY}
              width={barWidth}
              height={Math.max(2, incomeHeight)}
              rx="3"
              fill="#76B8B2"
            >
              <title>{`Receitas (${d.short}): ${formatCurrency(d.income)}`}</title>
            </rect>

            <rect
              x={groupX + (groupWidth / 2) + 2}
              y={expenseY}
              width={barWidth}
              height={Math.max(2, expenseHeight)}
              rx="3"
              fill="#D96868"
            >
              <title>{`Despesas (${d.short}): ${formatCurrency(d.expense)}`}</title>
            </rect>

            <text
              x={groupX + (groupWidth / 2)}
              y={height - 10}
              fontSize="11"
              fill="var(--color-text-secondary)"
              textAnchor="middle"
              fontFamily="'Playfair Display', serif"
            >
              {d.short}
            </text>
          </g>
        );
      })}

      <g transform={`translate(${width - 180}, 10)`}>
        <rect x="0" y="0" width="10" height="10" rx="2" fill="#76B8B2" />
        <text x="14" y="9" fontSize="11" fill="var(--color-text-secondary)" fontFamily="'Playfair Display', serif">Receitas</text>
        <rect x="75" y="0" width="10" height="10" rx="2" fill="#D96868" />
        <text x="90" y="9" fontSize="11" fill="var(--color-text-secondary)" fontFamily="'Playfair Display', serif">Despesas</text>
      </g>
    </svg>
  );
};

