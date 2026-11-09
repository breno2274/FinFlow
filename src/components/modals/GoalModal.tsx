// Modal para definicao de novas metas de economia ou edicao de objetivos em andamento

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Goal } from '../../types';
import { createGoal, updateGoal } from '../../services/goalService';
import { getTodayISO } from '../../utils/dates';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: Goal | null;
}

const PALETTE = ['#76B8B2', '#4D9690', '#329B76', '#6E9BD9', '#E5A83B', '#D96868'];

// Permite estipular prazos, metas em dinheiro e cores de identificacao
export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  goalToEdit
}) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [color, setColor] = useState(PALETTE[0]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (goalToEdit) {
      setName(goalToEdit.name);
      setTargetAmount(String(goalToEdit.targetAmount));
      setCurrentAmount(String(goalToEdit.currentAmount));
      setTargetDate(goalToEdit.targetDate);
      setColor(goalToEdit.color || PALETTE[0]);
      setErrorMsg('');
    } else {
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      setTargetDate(getTodayISO());
      setColor(PALETTE[0]);
      setErrorMsg('');
    }
  }, [goalToEdit, isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!name.trim()) {
      setErrorMsg('Informe o nome da meta de economia.');
      return;
    }

    const numTarget = parseFloat(targetAmount.replace(',', '.'));
    if (isNaN(numTarget) || numTarget <= 0) {
      setErrorMsg('Informe um valor pretendido válido e maior que zero.');
      return;
    }

    const numCurrent = parseFloat(currentAmount.replace(',', '.')) || 0;

    if (goalToEdit) {
      updateGoal(goalToEdit.id, {
        name: name.trim(),
        targetAmount: numTarget,
        currentAmount: numCurrent,
        targetDate: targetDate || getTodayISO(),
        color
      });
    } else {
      createGoal({
        name: name.trim(),
        targetAmount: numTarget,
        currentAmount: numCurrent,
        targetDate: targetDate || getTodayISO(),
        color
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goalToEdit ? 'Editar meta' : 'Nova meta de economia'}
      footer={
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end', width: '100%' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="goal-form" className="btn btn-primary" onClick={handleSubmit}>
            Salvar meta
          </button>
        </div>
      }
    >
      <form id="goal-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="goal-name" className="form-label">
            Nome do objetivo <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="goal-name"
            className="form-input"
            placeholder="Ex.: Viagem de férias, Reserva de emergência"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
          <div className="form-group">
            <label htmlFor="goal-target" className="form-label">
              Valor pretendido (R$) <span className="required" aria-hidden="true">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              id="goal-target"
              className="form-input"
              placeholder="Ex.: 5000,00"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="goal-current" className="form-label">
              Valor inicial guardado (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              id="goal-current"
              className="form-input"
              placeholder="0,00"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="goal-date" className="form-label">
            Data limite desejada
          </label>
          <input
            type="date"
            id="goal-date"
            className="form-input"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Cor do marcador visual</label>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-1)' }}>
            {PALETTE.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: c,
                  border: color === c ? '3px solid var(--color-text)' : '2px solid transparent',
                  cursor: 'pointer',
                  outline: 'none'
                }}
                aria-label={`Selecionar cor ${c}`}
              />
            ))}
          </div>
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

