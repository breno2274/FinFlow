// Modal de formulario para cadastro e edicao de receitas ou despesas com validacao de campos

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Transaction, TransactionType } from '../../types';
import { listCategories } from '../../services/categoryService';
import { createTransaction, updateTransaction } from '../../services/transactionService';
import { getTodayISO } from '../../utils/dates';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction | null;
  defaultType?: TransactionType;
}

// Controla o estado interno do formulario de lancamentos validando valores obrigatorios
export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transactionToEdit,
  defaultType = 'despesa'
}) => {
  const [type, setType] = useState<TransactionType>(defaultType);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayISO());
  const [categoryId, setCategoryId] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Categorias disponiveis filtradas conforme o tipo de movimentacao selecionado
  const availableCategories = listCategories(type);

  // Preenche os campos caso esteja em modo de edicao ou reseta para um novo registro
  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setDescription(transactionToEdit.description);
      setAmount(String(transactionToEdit.amount));
      setDate(transactionToEdit.date);
      setCategoryId(transactionToEdit.categoryId);
      setNotes(transactionToEdit.notes || '');
      setErrorMsg('');
    } else {
      setType(defaultType);
      setDescription('');
      setAmount('');
      setDate(getTodayISO());
      setNotes('');
      setErrorMsg('');
      const defaultCats = listCategories(defaultType);
      if (defaultCats.length > 0) {
        setCategoryId(defaultCats[0].id);
      }
    }
  }, [transactionToEdit, defaultType, isOpen]);

  // Atualiza a categoria padrao sempre que o usuario alternar entre receita e despesa
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const cats = listCategories(newType);
    if (cats.length > 0) {
      setCategoryId(cats[0].id);
    } else {
      setCategoryId('');
    }
  };

  // Valida a digitacao da descricao limitando a no maximo 5 digitos numericos
  const handleDescriptionChange = (val: string) => {
    const digitCount = (val.match(/\d/g) || []).length;
    if (digitCount > 5) {
      setErrorMsg('A descrição pode conter no máximo 5 dígitos numéricos.');
      return;
    }
    setErrorMsg('');
    setDescription(val);
  };

  // Valida e grava a transacao no armazenamento local
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!description.trim()) {
      setErrorMsg('Informe a descrição da movimentação.');
      return;
    }

    const digitCount = (description.match(/\d/g) || []).length;
    if (digitCount > 5) {
      setErrorMsg('A descrição pode conter no máximo 5 dígitos numéricos.');
      return;
    }

    const numAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Informe um valor monetário positivo maior que zero.');
      return;
    }

    if (!categoryId) {
      setErrorMsg('Selecione uma categoria para a transação.');
      return;
    }

    if (transactionToEdit) {
      updateTransaction(transactionToEdit.id, {
        description: description.trim(),
        amount: numAmount,
        type,
        categoryId,
        date,
        notes: notes.trim()
      });
    } else {
      createTransaction({
        description: description.trim(),
        amount: numAmount,
        type,
        categoryId,
        date,
        notes: notes.trim()
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transactionToEdit ? 'Editar transação' : 'Nova transação'}
      footer={
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end', width: '100%' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="transaction-form" className="btn btn-primary" onClick={handleSubmit}>
            {transactionToEdit ? 'Salvar alterações' : 'Salvar transação'}
          </button>
        </div>
      }
    >
      <form id="transaction-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label">Tipo de movimentação</label>
          <div className="segmented-control" role="radiogroup" aria-label="Tipo de transação">
            <button
              type="button"
              className={`segmented-btn ${type === 'despesa' ? 'active type-expense' : ''}`}
              role="radio"
              aria-checked={type === 'despesa'}
              onClick={() => handleTypeChange('despesa')}
            >
              Despesa
            </button>
            <button
              type="button"
              className={`segmented-btn ${type === 'receita' ? 'active type-income' : ''}`}
              role="radio"
              aria-checked={type === 'receita'}
              onClick={() => handleTypeChange('receita')}
            >
              Receita
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tx-description" className="form-label">
            Descrição <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="tx-description"
            className="form-input"
            placeholder="Ex.: Supermercado, Salário, Internet"
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            required
          />
          <span style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Apenas texto ou com no máximo 5 dígitos numéricos.
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
          <div className="form-group">
            <label htmlFor="tx-amount" className="form-label">
              Valor (R$) <span className="required" aria-hidden="true">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              id="tx-amount"
              className="form-input"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tx-date" className="form-label">
              Data <span className="required" aria-hidden="true">*</span>
            </label>
            <input
              type="date"
              id="tx-date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tx-category" className="form-label">
            Categoria <span className="required" aria-hidden="true">*</span>
          </label>
          <select
            id="tx-category"
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {availableCategories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tx-notes" className="form-label">
            Observações (opcional)
          </label>
          <textarea
            id="tx-notes"
            className="form-textarea"
            rows={2}
            placeholder="Anotações contextuais sobre esta movimentação..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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

