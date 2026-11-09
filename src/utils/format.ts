// Funcoes de formatacao monetaria, percentual e sanitizacao textual

// Formata valores numericos no padrao de moeda brasileira (R$)
export function formatCurrency(value: number | string, currency = 'BRL'): string {
  const numericValue = typeof value === 'number' ? value : Number(value) || 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericValue);
}

// Converte um valor numerico em string percentual arredondada (exemplo: 75%)
export function formatPercent(value: number | string, isDecimal = false): string {
  const num = Number(value) || 0;
  const pct = isDecimal ? num * 100 : num;
  return `${Math.round(pct)}%`;
}

// Converte texto digitado pelo usuario com virgula ou ponto para numero float valido
export function parseCurrencyInput(input: string | number): number {
  if (typeof input === 'number') return isNaN(input) ? 0 : input;
  if (!input) return 0;

  const cleaned = String(input)
    .replace(/[^\d.,-]/g, '')
    .trim();

  if (cleaned.includes(',') && cleaned.includes('.')) {
    return parseFloat(cleaned.replace(/\./g, '').replace(',', '.')) || 0;
  } else if (cleaned.includes(',')) {
    return parseFloat(cleaned.replace(',', '.')) || 0;
  }

  return parseFloat(cleaned) || 0;
}

