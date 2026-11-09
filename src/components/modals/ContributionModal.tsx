// Modal para registrar novos aportes de economia em uma meta ativa

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Goal } from '../../types';
import { addGoalContribution } from '../../services/goalService';
import { formatCurrency } from '../../utils/format';

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
}

// Permite ao usuario somar um novo valor ao total ja acumulado do objetivo
export const ContributionModal: React.FC<ContributionModalProps> = ({
  isOpen,
  onClose,
  goal
}) => {
  const [amount, setAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!goal) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    const numAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Informe um valor de aporte maior que zero.');
      return;
    }

    addGoalContribution(goal.id, numAmount);
    setAmount('');
    setErrorMsg('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Adicionar aporte: ${goal.name}`}
      footer={
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end', width: '100%' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="contrib-form" className="btn btn-primary" onClick={handleSubmit}>
            Confirmar aporte
          </button>
        </div>
      }
    >
      <form id="contrib-form" onSubmit={handleSubmit} noValidate>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
          Progresso atual: <strong>{formatCurrency(goal.currentAmount)}</strong> de {formatCurrency(goal.targetAmount)}
        </p>

        <div className="form-group">
          <label htmlFor="contrib-amount" className="form-label">
            Valor do aporte (R$) <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            id="contrib-amount"
            className="form-input"
            placeholder="Ex.: 250,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
            required
          />
        </div>

        {errorMsg && (
          <div className="form-error" style={{ display: 'block', marginBottom: 'var(--spacing-3)' }} role="alert">
            {errorMsg}
          </div>
        )}
      </form>
    </Modal>
  );
};

