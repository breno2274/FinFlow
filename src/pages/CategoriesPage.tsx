// Gerenciamento e organizacao de categorias com protecao de integridade referencial

import React, { useState } from 'react';
import { listCategories, deleteCategory, canDeleteCategory } from '../services/categoryService';
import { Category, TransactionType } from '../types';
import { CategoryModal } from '../components/modals/CategoryModal';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import { Modal } from '../components/common/Modal';
import { useFinflowData } from '../hooks/useFinflowData';

// Exibe as categorias divididas entre receitas e despesas com opcao de personalizacao
export const CategoriesPage: React.FC = () => {
  useFinflowData();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [defaultType, setDefaultType] = useState<TransactionType>('despesa');

  // Estados para exclusao e aviso de integridade
  const [catToDelete, setCatToDelete] = useState<Category | null>(null);
  const [integrityWarning, setIntegrityWarning] = useState<{ category: Category; count: number } | null>(null);

  const allCategories = listCategories();
  const filtered = search.trim()
    ? allCategories.filter((c: Category) => c.name.toLowerCase().includes(search.toLowerCase()))
    : allCategories;

  const incomeCats = filtered.filter((c: Category) => c.type === 'receita');
  const expenseCats = filtered.filter((c: Category) => c.type === 'despesa');

  const handleNew = (type: TransactionType = 'despesa') => {
    setDefaultType(type);
    setCategoryToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cat: Category) => {
    setCategoryToEdit(cat);
    setDefaultType(cat.type);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (cat: Category) => {
    const check = canDeleteCategory(cat.id);
    if (!check.canDelete) {
      setIntegrityWarning({ category: cat, count: check.usageCount });
    } else {
      setCatToDelete(cat);
    }
  };

  const handleConfirmDelete = () => {
    if (catToDelete) {
      deleteCategory(catToDelete.id);
      setCatToDelete(null);
    }
  };

  return (
    <div className="categories-view">
      <div className="dashboard-toolbar">
        <div>
          <p className="card-subtitle">Organize os lançamentos para relatórios e filtros consistentes.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
          <div className="search-input-wrap">
            <span className="search-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              id="search-category"
              className="form-input"
              placeholder="Buscar categoria..."
              aria-label="Buscar categoria"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary"
            id="btn-new-category"
            onClick={() => handleNew('despesa')}
          >
            + Nova categoria
          </button>
        </div>
      </div>

      <div className="categories-columns">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Receitas</h3>
            <span className="badge badge-income" id="badge-count-income">
              {incomeCats.length} categorias
            </span>
          </div>
          <div className="category-list-card" id="categories-income-list">
            {incomeCats.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', padding: '16px' }}>Nenhuma categoria de receita encontrada.</p>
            ) : (
              incomeCats.map((cat: Category) => (
                <div key={cat.id} className="category-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="category-dot" style={{ backgroundColor: cat.color, width: '12px', height: '12px', borderRadius: '50%' }} />
                    <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{cat.name}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEdit(cat)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--color-negative)' }}
                      onClick={() => handleDeleteClick(cat)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Despesas</h3>
            <span className="badge badge-expense" id="badge-count-expense">
              {expenseCats.length} categorias
            </span>
          </div>
          <div className="category-list-card" id="categories-expense-list">
            {expenseCats.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', padding: '16px' }}>Nenhuma categoria de despesa encontrada.</p>
            ) : (
              expenseCats.map((cat: Category) => (
                <div key={cat.id} className="category-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="category-dot" style={{ backgroundColor: cat.color, width: '12px', height: '12px', borderRadius: '50%' }} />
                    <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{cat.name}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEdit(cat)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--color-negative)' }}
                      onClick={() => handleDeleteClick(cat)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCategoryToEdit(null);
        }}
        categoryToEdit={categoryToEdit}
        defaultType={defaultType}
      />

      <ConfirmModal
        isOpen={Boolean(catToDelete)}
        onClose={() => setCatToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir categoria"
        message={`Deseja realmente apagar a categoria "${catToDelete?.name}"? Esta ação removerá a opção de novos lançamentos.`}
      />

      <Modal
        isOpen={Boolean(integrityWarning)}
        onClose={() => setIntegrityWarning(null)}
        title="Categoria em uso ativo"
        footer={
          <button type="button" className="btn btn-primary" onClick={() => setIntegrityWarning(null)}>
            Entendido
          </button>
        }
      >
        <p style={{ fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
          A categoria <strong>{integrityWarning?.category.name}</strong> não pode ser excluída diretamente pois possui{' '}
          <strong>{integrityWarning?.count} movimentação(ões) vinculada(s)</strong>.
        </p>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-2)' }}>
          Para proteger a consistência dos seus relatórios, reclassifique essas transações para outra categoria antes de removê-la.
        </p>
      </Modal>
    </div>
  );
};

