/**
 * UTILITÁRIO DE DATAS — FINFLOW
 * Padronização de datas, cálculos de meses para orçamentos e relatórios,
 * e formatações amigáveis no padrão brasileiro.
 */

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const MESES_ABREV = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

/**
 * Retorna a data atual no formato ISO YYYY-MM-DD
 * @returns {string}
 */
export function getTodayISO() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Retorna a chave do mês atual no formato YYYY-MM
 * @returns {string} Ex.: "2026-10"
 */
export function getCurrentMonthKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Formata uma data ISO (YYYY-MM-DD) para exibição amigável
 * @param {string} dateStr - Data em formato YYYY-MM-DD
 * @param {'full'|'short'|'relative'} mode - Estilo de formatação
 * @returns {string}
 */
export function formatDate(dateStr, mode = 'full') {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const year = parseInt(parts[0], 10);
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (mode === 'relative') {
    const todayStr = getTodayISO();
    if (dateStr === todayStr) return 'Hoje';

    // Cria objetos sem fuso para comparação diária
    const d = new Date(year, monthIndex, day);
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

    if (d.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    }
    // Caso padrão relativo abreviado: "12 out."
    return `${day} ${MESES_ABREV[monthIndex].toLowerCase()}.`;
  }

  if (mode === 'short') {
    return `${day} ${MESES_ABREV[monthIndex].toLowerCase()}.`;
  }

  // Formato padrão brasileiro DD/MM/AAAA
  const dd = String(day).padStart(2, '0');
  const mm = String(monthIndex + 1).padStart(2, '0');
  return `${dd}/${mm}/${year}`;
}

/**
 * Converte uma chave de mês (YYYY-MM) em texto legível (ex: "Outubro de 2026")
 * @param {string} yearMonthStr - Ex.: "2026-10"
 * @returns {string}
 */
export function formatMonthYear(yearMonthStr) {
  if (!yearMonthStr) return '';
  const [year, month] = yearMonthStr.split('-');
  const monthIdx = parseInt(month, 10) - 1;
  const monthName = MESES[monthIdx] || '';
  return `${monthName} de ${year}`;
}

/**
 * Gera lista dos últimos N meses a partir da data de referência
 * @param {number} count - Quantidade de meses retroativos
 * @returns {Array<{ key: string, label: string, short: string, year: number, month: number }>}
 */
export function getLastNMonths(count = 6) {
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

/**
 * Verifica se uma data pertence a um determinado mês (YYYY-MM)
 * @param {string} dateStr - Ex: "2026-10-15"
 * @param {string} yearMonthKey - Ex: "2026-10"
 * @returns {boolean}
 */
export function isDateInMonth(dateStr, yearMonthKey) {
  if (!dateStr || !yearMonthKey) return false;
  return dateStr.startsWith(yearMonthKey);
}
