// Funcoes para manipulacao de datas, meses retroativos e formatacao amigavel

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const MESES_ABREV = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

// Retorna a data de hoje no formato YYYY-MM-DD para preenchimento de inputs
export function getTodayISO(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Retorna a chave do mes atual no formato YYYY-MM para filtros e orcamentos
export function getCurrentMonthKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

// Converte YYYY-MM-DD para formatos legiveis como Hoje, Ontem ou 15/10/2026
export function formatDate(dateStr: string, mode: 'full' | 'short' | 'relative' = 'full'): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const year = parseInt(parts[0], 10);
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (mode === 'relative') {
    const todayStr = getTodayISO();
    if (dateStr === todayStr) return 'Hoje';

    const d = new Date(year, monthIndex, day);
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

    if (d.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    }
    return `${day} ${MESES_ABREV[monthIndex]?.toLowerCase() || ''}.`;
  }

  if (mode === 'short') {
    return `${day} ${MESES_ABREV[monthIndex]?.toLowerCase() || ''}.`;
  }

  const dd = String(day).padStart(2, '0');
  const mm = String(monthIndex + 1).padStart(2, '0');
  return `${dd}/${mm}/${year}`;
}

// Transforma YYYY-MM no nome por extenso do mes e ano para titulos
export function formatMonthYear(yearMonthStr: string): string {
  if (!yearMonthStr) return '';
  const [year, month] = yearMonthStr.split('-');
  const monthIdx = parseInt(month, 10) - 1;
  const monthName = MESES[monthIdx] || '';
  return `${monthName} de ${year}`;
}

// Retorna lista com os ultimos N meses para alimentar seletores e graficos
export function getLastNMonths(count = 6): Array<{ key: string; label: string; short: string; year: number; month: number }> {
  const result = [];
  const current = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(current.getFullYear(), current.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const key = `${year}-${String(month).padStart(2, '0')}`;
    result.push({
      key,
      label: `${MESES[d.getMonth()]} de ${year}`,
      short: MESES_ABREV[d.getMonth()],
      year,
      month
    });
  }

  return result;
}

// Retorna a chave do mes anterior a uma chave fornecida para comparacoes
export function getPreviousMonthKey(yearMonthKey: string): string {
  const [yearStr, monthStr] = yearMonthKey.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10) - 1;
  if (month < 1) {
    month = 12;
    year -= 1;
  }
  return `${year}-${String(month).padStart(2, '0')}`;
}

// Checa se determinada data pertence ao mes informado
export function isDateInMonth(dateStr: string, yearMonthKey: string): boolean {
  if (!dateStr || !yearMonthKey) return false;
  return dateStr.startsWith(yearMonthKey);
}

