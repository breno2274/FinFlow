/**
 * UTILITÁRIO DE FORMATAÇÃO — FINFLOW
 * Centraliza a formatação de moedas, porcentagens e higienização segura de dados.
 */

/**
 * Formata um valor numérico para a moeda brasileira (BRL)
 * @param {number} value - Valor numérico a ser formatado
 * @param {string} [currency='BRL'] - Código ISO da moeda
 * @returns {string} Valor formatado (ex.: "R$ 5.420,00")
 */
export function formatCurrency(value, currency = 'BRL') {
  const numericValue = typeof value === 'number' ? value : Number(value) || 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericValue);
}

/**
 * Formata um valor numérico para exibição de porcentagem inteira ou com 1 casa
 * @param {number} value - Valor percentual (ex: 72 ou 0.72)
 * @param {boolean} [isDecimal=false] - Se o número está na escala 0-1
 * @returns {string} String percentual (ex: "72%")
 */
export function formatPercent(value, isDecimal = false) {
  const num = Number(value) || 0;
  const pct = isDecimal ? num * 100 : num;
  return `${Math.round(pct)}%`;
}

/**
 * Converte entradas de texto em formato numérico monetário seguro
 * Suporta formatos como "1.250,50", "1250.50", "R$ 150,00"
 * @param {string|number} input - Entrada do usuário
 * @returns {number} Valor numérico em ponto flutuante
 */
export function parseCurrencyInput(input) {
  if (typeof input === 'number') return isNaN(input) ? 0 : input;
  if (!input) return 0;

  // Remove caracteres que não sejam dígitos, vírgula ou ponto
  const cleaned = String(input)
    .replace(/[^\d.,-]/g, '')
    .trim();

  // Se houver vírgula como separador decimal (padrão brasileiro)
  if (cleaned.includes(',') && cleaned.includes('.')) {
    // Caso 1.250,50 -> remove os pontos e troca a vírgula por ponto
    return parseFloat(cleaned.replace(/\./g, '').replace(',', '.')) || 0;
  } else if (cleaned.includes(',')) {
    // Caso 1250,50
    return parseFloat(cleaned.replace(',', '.')) || 0;
  }

  return parseFloat(cleaned) || 0;
}

/**
 * Sanitiza texto para evitar injeção de tags HTML maliciosas (XSS)
 * @param {string} str - Texto original
 * @returns {string} Texto seguro com entidades HTML escapadas
 */
export function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
