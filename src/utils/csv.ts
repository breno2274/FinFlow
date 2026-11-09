// Utilitario para geracao e download de extrato financeiro em formato CSV para planilhas

import { Transaction, Category } from '../types';
import { formatDate } from './dates';

// Converte a lista de transacoes em uma planilha CSV com delimitador compativel com o Excel
export function exportTransactionsToCSV(transactions: Transaction[], categories: Category[]): void {
  const catMap = new Map(categories.map(c => [c.id, c.name]));

  const headers = ['Data', 'Descricao', 'Categoria', 'Tipo', 'Valor (R$)', 'Notas'];

  const rows = transactions.map(t => {
    const formattedDate = formatDate(t.date, 'full');
    const categoryName = catMap.get(t.categoryId) || 'Sem categoria';
    const tipo = t.type === 'receita' ? 'Receita' : 'Despesa';
    const valor = t.amount.toFixed(2).replace('.', ',');
    const notas = (t.notes || '').replace(/"/g, '""');
    const desc = t.description.replace(/"/g, '""');

    return `"${formattedDate}";"${desc}";"${categoryName}";"${tipo}";"${valor}";"${notas}"`;
  });

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `finflow-extrato-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

