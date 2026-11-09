// Camada central de persistencia com LocalStorage e versionamento de esquema

import { Transaction, Category, Budget, Goal, Preferences } from '../types';

export const SCHEMA_VERSION = '2.0.0';
const STORAGE_PREFIX = 'finflow_v1_';

const KEYS = {
  SCHEMA: `${STORAGE_PREFIX}schema`,
  TRANSACTIONS: `${STORAGE_PREFIX}transactions`,
  CATEGORIES: `${STORAGE_PREFIX}categories`,
  BUDGETS: `${STORAGE_PREFIX}budgets`,
  GOALS: `${STORAGE_PREFIX}goals`,
  PREFERENCES: `${STORAGE_PREFIX}preferences`
};

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-rec-1', name: 'Salário', type: 'receita', color: '#329B76' },
  { id: 'cat-rec-2', name: 'Bônus e Prêmios', type: 'receita', color: '#76B8B2' },
  { id: 'cat-rec-3', name: 'Investimentos', type: 'receita', color: '#6E9BD9' },
  { id: 'cat-rec-4', name: 'Outras entradas', type: 'receita', color: '#A9DDBA' },
  { id: 'cat-desp-1', name: 'Moradia', type: 'despesa', color: '#4D9690' },
  { id: 'cat-desp-2', name: 'Alimentação', type: 'despesa', color: '#76B8B2' },
  { id: 'cat-desp-3', name: 'Transporte', type: 'despesa', color: '#6E9BD9' },
  { id: 'cat-desp-4', name: 'Saúde', type: 'despesa', color: '#D96868' },
  { id: 'cat-desp-5', name: 'Lazer', type: 'despesa', color: '#E5A83B' }
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    description: 'Salário mensal',
    amount: 4500.00,
    type: 'receita',
    categoryId: 'cat-rec-1',
    date: '2026-10-15',
    notes: 'Depósito em conta corrente'
  },
  {
    id: 'tx-002',
    description: 'Supermercado',
    amount: 185.40,
    type: 'despesa',
    categoryId: 'cat-desp-2',
    date: '2026-10-14',
    notes: 'Compras da semana'
  },
  {
    id: 'tx-003',
    description: 'Internet fibra',
    amount: 99.90,
    type: 'despesa',
    categoryId: 'cat-desp-1',
    date: '2026-10-12',
    notes: 'Mensalidade da banda larga'
  },
  {
    id: 'tx-004',
    description: 'Bônus de desempenho',
    amount: 700.00,
    type: 'receita',
    categoryId: 'cat-rec-2',
    date: '2026-10-10',
    notes: 'Premiação por metas da equipe'
  },
  {
    id: 'tx-005',
    description: 'Cinema e pipoca',
    amount: 48.00,
    type: 'despesa',
    categoryId: 'cat-desp-5',
    date: '2026-10-08',
    notes: 'Lazer de fim de semana'
  },
  {
    id: 'tx-006',
    description: 'Participação nos Lucros (PLR)',
    amount: 1600.00,
    type: 'receita',
    categoryId: 'cat-rec-2',
    date: '2026-10-05',
    notes: 'Pagamento semestral de PLR'
  },
  {
    id: 'tx-007',
    description: 'Feira hortifrúti',
    amount: 146.70,
    type: 'despesa',
    categoryId: 'cat-desp-2',
    date: '2026-10-05',
    notes: 'Alimentos frescos'
  },
  {
    id: 'tx-008',
    description: 'Condomínio e luz',
    amount: 700.00,
    type: 'despesa',
    categoryId: 'cat-desp-1',
    date: '2026-10-03',
    notes: 'Contas fixas de moradia'
  },
  {
    id: 'tx-009',
    description: 'Combustível',
    amount: 200.00,
    type: 'despesa',
    categoryId: 'cat-desp-3',
    date: '2026-10-02',
    notes: 'Abastecimento mensal'
  },
  { id: 'tx-hist-set-1', description: 'Salário', amount: 4500, type: 'receita', categoryId: 'cat-rec-1', date: '2026-09-05' },
  { id: 'tx-hist-set-2', description: 'Bônus trimestral', amount: 850, type: 'receita', categoryId: 'cat-rec-2', date: '2026-09-18' },
  { id: 'tx-hist-set-3', description: 'Despesas gerais', amount: 1620, type: 'despesa', categoryId: 'cat-desp-1', date: '2026-09-20' },
  { id: 'tx-hist-ago-1', description: 'Salário', amount: 4500, type: 'receita', categoryId: 'cat-rec-1', date: '2026-08-05' },
  { id: 'tx-hist-ago-2', description: 'Despesas gerais', amount: 1780, type: 'despesa', categoryId: 'cat-desp-2', date: '2026-08-15' },
  { id: 'tx-hist-jul-1', description: 'Salário', amount: 4500, type: 'receita', categoryId: 'cat-rec-1', date: '2026-07-05' },
  { id: 'tx-hist-jul-2', description: 'Despesas gerais', amount: 1450, type: 'despesa', categoryId: 'cat-desp-1', date: '2026-07-22' },
  { id: 'tx-hist-jun-1', description: 'Salário', amount: 4500, type: 'receita', categoryId: 'cat-rec-1', date: '2026-06-05' },
  { id: 'tx-hist-jun-2', description: 'Despesas gerais', amount: 1530, type: 'despesa', categoryId: 'cat-desp-3', date: '2026-06-19' },
  { id: 'tx-hist-mai-1', description: 'Salário', amount: 4500, type: 'receita', categoryId: 'cat-rec-1', date: '2026-05-05' },
  { id: 'tx-hist-mai-2', description: 'Despesas gerais', amount: 1390, type: 'despesa', categoryId: 'cat-desp-2', date: '2026-05-18' }
];

const INITIAL_BUDGETS: Budget[] = [
  { id: 'bg-01', categoryId: 'cat-desp-2', limitAmount: 900.00, monthKey: '2026-10' },
  { id: 'bg-02', categoryId: 'cat-desp-3', limitAmount: 350.00, monthKey: '2026-10' },
  { id: 'bg-03', categoryId: 'cat-desp-5', limitAmount: 250.00, monthKey: '2026-10' },
  { id: 'bg-04', categoryId: 'cat-desp-1', limitAmount: 1500.00, monthKey: '2026-10' }
];

const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-01',
    name: 'Viagem de férias',
    targetAmount: 5000.00,
    currentAmount: 3000.00,
    targetDate: '2026-12-31',
    color: '#76B8B2'
  },
  {
    id: 'goal-02',
    name: 'Reserva de emergência',
    targetAmount: 10000.00,
    currentAmount: 7200.00,
    targetDate: '2027-06-30',
    color: '#4D9690'
  }
];

const INITIAL_PREFERENCES: Preferences = {
  userName: 'UserTest',
  currency: 'BRL',
  dateFormat: 'DD/MM/AAAA',
  theme: 'light'
};

// Dispara um evento global no navegador para atualizar qualquer componente que observe mudancas de dados
function emitChange(entityName: string): void {
  window.dispatchEvent(new CustomEvent('finflow-data-changed', {
    detail: { entity: entityName, timestamp: Date.now() }
  }));
}

// Inicializa o banco local do navegador carregando os registros iniciais se for o primeiro acesso
export function initStorage(): void {
  try {
    const existingSchema = localStorage.getItem(KEYS.SCHEMA);
    if (!existingSchema) {
      resetToDemo();
    }
  } catch (error) {
    console.warn('LocalStorage inacessivel no navegador:', error);
  }
}

// Restaura todos os dados do Finflow para a base original de demonstracao
export function resetToDemo(): void {
  localStorage.setItem(KEYS.SCHEMA, SCHEMA_VERSION);
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
  localStorage.setItem(KEYS.BUDGETS, JSON.stringify(INITIAL_BUDGETS));
  localStorage.setItem(KEYS.GOALS, JSON.stringify(INITIAL_GOALS));
  localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(INITIAL_PREFERENCES));
  emitChange('all');
}

// Apaga todas as transacoes, metas e orcamentos para comecar uma conta do zero
export function clearAllData(): void {
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify([]));
  localStorage.setItem(KEYS.BUDGETS, JSON.stringify([]));
  localStorage.setItem(KEYS.GOALS, JSON.stringify([]));
  emitChange('all');
}

// Leitura tipada de transacoes salvas
export function getTransactions(): Transaction[] {
  try {
    const data = localStorage.getItem(KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Gravacao segura de transacoes com notificacao de mudanca
export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  emitChange('transactions');
}

// Leitura de categorias cadastradas
export function getCategories(): Category[] {
  try {
    const data = localStorage.getItem(KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Gravacao de categorias
export function saveCategories(categories: Category[]): void {
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  emitChange('categories');
}

// Leitura de orcamentos mensais
export function getBudgets(): Budget[] {
  try {
    const data = localStorage.getItem(KEYS.BUDGETS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Gravacao de orcamentos
export function saveBudgets(budgets: Budget[]): void {
  localStorage.setItem(KEYS.BUDGETS, JSON.stringify(budgets));
  emitChange('budgets');
}

// Leitura de metas de economia
export function getGoals(): Goal[] {
  try {
    const data = localStorage.getItem(KEYS.GOALS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Gravacao de metas
export function saveGoals(goals: Goal[]): void {
  localStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
  emitChange('goals');
}

// Leitura de preferencias de interface e usuario
export function getPreferences(): Preferences {
  try {
    const data = localStorage.getItem(KEYS.PREFERENCES);
    return data ? JSON.parse(data) : INITIAL_PREFERENCES;
  } catch {
    return INITIAL_PREFERENCES;
  }
}

// Gravacao de preferencias
export function savePreferences(preferences: Preferences): void {
  localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(preferences));
  emitChange('preferences');
}

// Exporta o banco de dados completo do usuario em uma string formatada em JSON
export function exportBackupJSON(): string {
  const backup = {
    app: 'Finflow',
    schemaVersion: SCHEMA_VERSION,
    exportDate: new Date().toISOString(),
    preferences: getPreferences(),
    categories: getCategories(),
    transactions: getTransactions(),
    budgets: getBudgets(),
    goals: getGoals()
  };

  return JSON.stringify(backup, null, 2);
}

// Valida e importa um arquivo JSON substituindo os dados do dispositivo
export function importBackupJSON(jsonString: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!data || !Array.isArray(data.transactions) || !Array.isArray(data.categories)) {
      return { success: false, message: 'O arquivo JSON selecionado nao contem uma estrutura valida do Finflow.' };
    }

    localStorage.setItem(KEYS.SCHEMA, data.schemaVersion || SCHEMA_VERSION);
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(data.categories));
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
    localStorage.setItem(KEYS.BUDGETS, JSON.stringify(data.budgets || []));
    localStorage.setItem(KEYS.GOALS, JSON.stringify(data.goals || []));

    if (data.preferences) {
      localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(data.preferences));
    }

    emitChange('all');
    return { success: true, message: 'Dados restaurados com sucesso!' };
  } catch (error: any) {
    return { success: false, message: `Falha ao processar arquivo: ${error?.message || 'Arquivo corrompido'}` };
  }
}

