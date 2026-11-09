// Listagem completa de movimentacoes financeiras com filtros multifatoriais, paginacao e extrato em CSV

import React, { useState } from 'react';
import { listTransactions, deleteTransaction } from '../services/transactionService';
import { getCategories } from '../services/storage';
import { Transaction, TransactionType, Category } from '../types';
import { formatCurrency } from '../utils/format';
import { formatDate, getLastNMonths } from '../utils/dates';
import { exportTransactionsToCSV } from '../utils/csv';
import { EmptyState } from '../components/common/EmptyState';
import { TransactionModal } from '../components/modals/TransactionModal';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import { useFinflowData } from '../hooks/useFinflowData';

// Exibe a tabela interativa de transacoes com busca em tempo real e acoes de edicao
export const TransactionsPage: React.FC = () => {
  useFinflowData();

  const [search, setSearch] = useState('');
  const [type, setType] = useState<'todos' | TransactionType>('todos');
  const [categoryId, setCategoryId] = useState('todos');
  const [monthKey, setMonthKey] = useState('todos');
  const [page, setPage] = useState(1);

  // Estados de controle para modais de formulario e exclusao
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [txToEdit, setTxToEdit] = useState<Transaction | null>(null);
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);

  const categories = getCategories();
  const catMap = new Map<string, Category>(categories.map((c: Category) => [c.id, c]));
  const monthOptions = getLastNMonths(12);

  const { items, totalItems, totalPages, page: currentPage } = listTransactions({
    search,
    type,
    categoryId,
    monthKey,
    page,
    pageSize: 10
  });

  // Limpa todos os filtros retornando aos parametros padrao
  const handleClearFilters = () => {
    setSearch('');
    setType('todos');
    setCategoryId('todos');
    setMonthKey('todos');
    setPage(1);
  };

  const handleEdit = (tx: Transaction) => {
    setTxToEdit(tx);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setTxToEdit(null);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (txToDelete) {
      deleteTransaction(txToDelete.id);
      setTxToDelete(null);
    }
  };

  const handleExportCSV = () => {
    const allFiltered = listTransactions({
      search,
      type,
      categoryId,
      monthKey,
      page: 1,
      pageSize: 9999
    }).items;
    exportTransactionsToCSV(allFiltered, categories);
  };

  return (
    <div className="transactions-view">
      <div className="dashboard-toolbar">
        <div>
          <p className="card-subtitle">Encontre, filtre e gerencie suas movimentações financeiras.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExportCSV}
            title="Baixar extrato para Excel"
          >
            Exportar CSV
          </button>
          <button
            type="button"
            className="btn btn-primary"
            id="btn-add-transaction"
            onClick={handleNew}
          >
            + Nova transação
          </button>
        </div>
      </div>

      <div className="transactions-filter-bar">
        <div className="filter-group-left">
          <div className="search-input-wrap">
            <span className="search-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              id="filter-search"
              className="form-input"
              placeholder="Buscar transação..."
              aria-label="Buscar movimentações"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            id="filter-month"
            className="form-select"
            style={{ width: 'auto', minWidth: '150px' }}
            aria-label="Filtrar por data"
            value={monthKey}
            onChange={(e) => {
              setMonthKey(e.target.value);
              setPage(1);
            }}
          >
            <option value="todos">Todas as datas</option>
            {monthOptions.map((m: { key: string; label: string }) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>

          <select
            id="filter-type"
            className="form-select"
            style={{ width: 'auto' }}
            aria-label="Filtrar por tipo"
            value={type}
            onChange={(e) => {
              setType(e.target.value as any);
              setPage(1);
            }}
          >
            <option value="todos">Todos os tipos</option>
            <option value="receita">Receitas</option>
            <option value="despesa">Despesas</option>
          </select>

          <select
            id="filter-category"
            className="form-select"
            style={{ width: 'auto' }}
            aria-label="Filtrar por categoria"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
          >
            <option value="todos">Todas as categorias</option>
            {categories.map((c: Category) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          id="btn-clear-filters"
          title="Limpar todos os filtros"
          onClick={handleClearFilters}
        >
          Limpar filtros
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Nenhuma movimentação encontrada"
          description="Tente ajustar ou limpar os filtros de busca para visualizar suas transações."
          actionText="Nova transação"
          onAction={handleNew}
        />
      ) : (
        <>
          <div className="table-responsive" id="transactions-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Descrição</th>
                  <th scope="col">Categoria</th>
                  <th scope="col">Data</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Valor</th>
                  <th scope="col" style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody id="transactions-tbody">
                {items.map((t: Transaction) => {
                  const category = catMap.get(t.categoryId);
                  const isIncome = t.type === 'receita';
                  return (
                    <tr key={t.id}>
                      <td>
                        <span style={{ fontWeight: 600 }}>{t.description}</span>
                        {t.notes && (
                          <span style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                            {t.notes}
                          </span>
                        )}
                      </td>
                      <td>
                        {category ? (
                          <span className="category-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span className="category-dot" style={{ backgroundColor: category.color, width: '8px', height: '8px', borderRadius: '50%' }}></span>
                            {category.name}
                          </span>
                        ) : (
                          'Outras'
                        )}
                      </td>
                      <td>{formatDate(t.date, 'full')}</td>
                      <td>
                        <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
                          {isIncome ? 'Receita' : 'Despesa'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: isIncome ? 'var(--color-positive)' : 'var(--color-negative)' }}>
                        {isIncome ? `+${formatCurrency(t.amount)}` : `-${formatCurrency(t.amount)}`}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 'var(--spacing-2)' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEdit(t)}
                            title="Editar transação"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--color-negative)' }}
                            onClick={() => setTxToDelete(t)}
                            title="Excluir transação"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination-container" id="transactions-pagination-wrap" style={{ marginTop: 'var(--spacing-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                Mostrando {items.length} de {totalItems} movimentações
              </span>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={currentPage <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Anterior
                </button>
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 8px', fontSize: 'var(--font-size-sm)' }}>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTxToEdit(null);
        }}
        transactionToEdit={txToEdit}
      />

      <ConfirmModal
        isOpen={Boolean(txToDelete)}
        onClose={() => setTxToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Excluir transação"
        message={`Deseja realmente apagar a transação "${txToDelete?.description}" no valor de ${txToDelete ? formatCurrency(txToDelete.amount) : ''}? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
      />
    </div>
  );
};

