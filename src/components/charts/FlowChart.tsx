// Grafico nativo em SVG com curvas suaves para acompanhamento do fluxo de receitas e despesas

import React from 'react';
import { CashFlowPoint } from '../../types';
import { formatCurrency } from '../../utils/format';

interface FlowChartProps {
  data: CashFlowPoint[];
}

// Renderiza o grafico vetorial de fluxo financeiro com preenchimento gradiente e linhas suaves
export const FlowChart: React.FC<FlowChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '40px 0' }}>
        Sem dados de fluxo para o período.
      </p>
    );
  }

  const width = 560;
  const height = 200;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(...data.map(d => Math.max(d.income, d.expense, 1000)), 7000);

  // Mapeia as coordenadas dos pontos da curva de receitas
  const pointsIncome = data.map((d, i) => {
    const x = paddingX + (i * ((width - paddingX * 2) / (data.length - 1 || 1)));
    const y = height - paddingY - (d.income / maxVal) * (height - paddingY * 2);
    return { x, y, val: d.income, label: d.short };
  });

  // Mapeia as coordenadas dos pontos da curva de despesas
  const pointsExpense = data.map((d, i) => {
    const x = paddingX + (i * ((width - paddingX * 2) / (data.length - 1 || 1)));
    const y = height - paddingY - (d.expense / maxVal) * (height - paddingY * 2);
    return { x, y, val: d.expense, label: d.short };
  });

  // Gera o caminho de curva Bezier continua unindo os pontos
  const createSmoothPath = (pts: Array<{ x: number; y: number }>) => {
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

  const areaPath = pointsIncome.length > 0
    ? `${incomePath} L ${pointsIncome[pointsIncome.length - 1].x} ${height - paddingY} L ${pointsIncome[0].x} ${height - paddingY} Z`
    : '';

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg" role="img" aria-label="Gráfico de fluxo financeiro dos últimos meses">
      <defs>
        <linearGradient id="chartGradientTeal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#76B8B2" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#76B8B2" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="var(--color-border-subtle)" strokeDasharray="3,3" />
      <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="var(--color-border-subtle)" strokeDasharray="3,3" />
      <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="var(--color-border)" />

      {areaPath && <path d={areaPath} fill="url(#chartGradientTeal)" />}

      <path d={expensePath} fill="none" stroke="#D96868" strokeWidth="2" strokeLinecap="round" strokeDasharray="4,4" />
      <path d={incomePath} fill="none" stroke="#76B8B2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {pointsIncome.map((p, idx) => (
        <g key={`point-${idx}`}>
          <circle cx={p.x} cy={p.y} r="4" fill="#FFFFFF" stroke="#4D9690" strokeWidth="2">
            <title>{`Receitas (${p.label}): ${formatCurrency(p.val)}`}</title>
          </circle>
          <text x={p.x} y={height - 10} fontSize="11" fill="var(--color-text-secondary)" textAnchor="middle" fontFamily="'Playfair Display', serif">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

