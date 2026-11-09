// Ilustracao e texto explicativo para listas que ainda nao possuem itens cadastrados

import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  imageSrc?: string;
}

// Apresenta mensagem amigavel incentivando o
//  usuario a criar o primeiro registro
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  imageSrc = 'img/ilustracao-sem-transacoes.svg'
}) => {
  return (
    <div className="empty-state">
      <img src={imageSrc} alt="" className="empty-state-img" aria-hidden="true" />
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionText && onAction && (
        <button type="button" className="btn btn-primary btn-sm" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

