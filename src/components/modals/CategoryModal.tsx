// Modal para criacao e edicao de categorias com selecao de paleta de cores

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Category, TransactionType } from '../../types';
import { createCategory, updateCategory } from '../../services/categoryService';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: Category | null;
  defaultType?: TransactionType;
}

const PALETTE = ['#329B76', '#4D9690', '#76B8B2', '#6E9BD9', '#A9DDBA', '#E5A83B', '#D96868', '#9B51E0'];

// Permite cadastrar categorias personalizadas escolhendo o tipo e o tom de cor de destaque
export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categoryToEdit,
  defaultType = 'despesa'
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>(defaultType);
  const [color, setColor] = useState(PALETTE[0]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setType(categoryToEdit.type);
      setColor(categoryToEdit.color || PALETTE[0]);
      setErrorMsg('');
    } else {
      setName('');
      setType(defaultType);
      setColor(PALETTE[0]);
      setErrorMsg('');
    }
  }, [categoryToEdit, defaultType, isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!name.trim()) {
      setErrorMsg('Informe o nome da categoria.');
      return;
    }

    if (categoryToEdit) {
      updateCategory(categoryToEdit.id, {
        name: name.trim(),
        type,
        color
      });
    } else {
      createCategory({
        name: name.trim(),
        type,
        color
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={categoryToEdit ? 'Editar categoria' : 'Nova categoria'}
      footer={
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end', width: '100%' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="category-form" className="btn btn-primary" onClick={handleSubmit}>
            Salvar categoria
          </button>
        </div>
      }
    >
      <form id="category-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="cat-name" className="form-label">
            Nome da categoria <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="cat-name"
            className="form-input"
            placeholder="Ex.: Educação, Assinaturas, Freelance"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tipo da categoria</label>
          <div className="segmented-control" role="radiogroup">
            <button
              type="button"
              className={`segmented-btn ${type === 'despesa' ? 'active type-expense' : ''}`}
              role="radio"
              aria-checked={type === 'despesa'}
              onClick={() => setType('despesa')}
            >
              Despesa
            </button>
            <button
              type="button"
              className={`segmented-btn ${type === 'receita' ? 'active type-income' : ''}`}
              role="radio"
              aria-checked={type === 'receita'}
              onClick={() => setType('receita')}
            >
              Receita
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Cor de destaque</label>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-1)', flexWrap: 'wrap' }}>
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
                aria-label={`Cor ${c}`}
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

