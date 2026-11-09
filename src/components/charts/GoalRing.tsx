// Anel circular percentual em SVG para acompanhamento de metas de economia

import React from 'react';

interface GoalRingProps {
  percentage: number;
  color?: string;
  size?: number;
}

// Renderiza o circulo com preenchimento proporcional e texto centralizado
export const GoalRing: React.FC<GoalRingProps> = ({
  percentage,
  color = '#76B8B2',
  size = 130
}) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const offset = circumference - (clampedPct / 100) * circumference;

  return (
    <div className="goal-ring-wrap" style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-border-subtle)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset var(--transition-normal)' }}
        />
      </svg>
      <div
        className="goal-ring-text"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span className="goal-ring-pct" style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>
          {clampedPct}%
        </span>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
          concluído
        </span>
      </div>
    </div>
  );
};

