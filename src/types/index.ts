// Modelos de dados e contratos de tipos compartilhados em todo o Finflow

// Define se uma movimentacao financeira representa entrada ou saida de dinheiro
export type TransactionType = 'receita' | 'despesa';

// Representa um lancamento financeiro individual registrado pelo usuario
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  notes?: string;
}

// Representa uma categoria usada para classificar receitas e despesas
export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

// Limite maximo de gastos estipulado para uma categoria especifica em determinado mes
export interface Budget {
  id: string;
  categoryId: string;
  limitAmount: number;
  monthKey: string;
}

// Status de consumo de um orcamento baseado na porcentagem utilizada
export type BudgetStatus = 'normal' | 'warning' | 'exceeded';

// Agrega os dados calculados de consumo de um orcamento no mes selecionado
export interface BudgetUsage {
  budget: Budget;
  category: Category | null;
  spent: number;
  remaining: number;
  percentage: number;
  status: BudgetStatus;
}

// Objetivo de economia com acompanhamento de progresso percentual
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  color: string;
}

// Preferencias gerais e customizacoes visuais do usuario
export interface Preferences {
  userName: string;
  currency: string;
  dateFormat: string;
  theme: 'light' | 'dark';
}

// Indicadores consolidados exibidos nos cartoes do painel
export interface FinancialSummary {
  balance: number;
  income: number;
  expense: number;
  goalsPercent: number;
  balanceTrend: number;
  expenseTrend: number;
}

// Ponto individual do grafico de fluxo financeiro mensal em curvas suaves
export interface CashFlowPoint {
  monthKey: string;
  label: string;
  short: string;
  income: number;
  expense: number;
}

// Distribuicao percentual de gastos por categoria para relatorios analiticos
export interface CategoryDistribution {
  categoryId: string;
  categoryName: string;
  color: string;
  amount: number;
  percentage: number;
}

// Estrutura de notificacao temporaria na interface
export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

