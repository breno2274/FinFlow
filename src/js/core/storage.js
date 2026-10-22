/**
 * NÚCLEO DE ARMAZENAMENTO — FINFLOW (storage.js)
 * Gerencia a persistência local com LocalStorage, versionamento de esquema,
 * carga inicial de demonstração, validação e eventos reativos de atualização.
 */

import { validateBackupJSON } from '../utils/validators.js';

export const SCHEMA_VERSION = '1.0.0';
const STORAGE_PREFIX = 'finflow_v1_';

const KEYS = {
  SCHEMA: `${STORAGE_PREFIX}schema`,
  TRANSACTIONS: `${STORAGE_PREFIX}transactions`,
  CATEGORIES: `${STORAGE_PREFIX}categories`,
  BUDGETS: `${STORAGE_PREFIX}budgets`,
  GOALS: `${STORAGE_PREFIX}goals`,
  PREFERENCES: `${STORAGE_PREFIX}preferences`
};

/**
 * Categorias pré-configuradas fiéis à identidade do Finflow
 */
const INITIAL_CATEGORIES = [
  // Receitas
  { id: 'cat-rec-1', name: 'Salário', type: 'receita', color: '#329B76' },
  { id: 'cat-rec-2', name: 'Bônus e Prêmios', type: 'receita', color: '#76B8B2' },
  { id: 'cat-rec-3', name: 'Investimentos', type: 'receita', color: '#6E9BD9' },
  { id: 'cat-rec-4', name: 'Outras entradas', type: 'receita', color: '#A9DDBA' },

  // Despesas
  { id: 'cat-desp-1', name: 'Moradia', type: 'despesa', color: '#4D9690' },
  { id: 'cat-desp-2', name: 'Alimentação', type: 'despesa', color: '#76B8B2' },
  { id: 'cat-desp-3', name: 'Transporte', type: 'despesa', color: '#6E9BD9' },
  { id: 'cat-desp-4', name: 'Saúde', type: 'despesa', color: '#D96868' },
  { id: 'cat-desp-5', name: 'Lazer', type: 'despesa', color: '#E5A83B' }
];

/**
 * Transações de demonstração baseadas no protótipo visual:
 * No mês corrente (Outubro de 2026):
 * Receitas: R$ 6.800,00 | Despesas: R$ 1.380,00 | Saldo: R$ 5.420,00
 */
const INITIAL_TRANSACTIONS = [
  // Transações de Outubro de 2026 (Mês principal do protótipo)
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

  // Transações de meses anteriores para alimentar o gráfico histórico de 6 meses
  // Setembro 2026
  { id: 'tx-hist-set-1', description: 'Salário', amount: 4500, type: 'receita', categoryId: 'cat-rec-1', date: '2026-09-05' },
  { id: 'tx-hist-set-2', description: 'Bônus trimestral', amount: 850, type: 'receita', categoryId: 'cat-rec-2', date: '2026-09-18' },
  { id: 'tx-hist-set-3', description: 'Despesas gerais', amount: 1620, type: 'despesa', categoryId: 'cat-desp-1', date: '2026-09-20' },

  // Agosto 2026
  { id: 'tx-hist-ago-1', description: 'Salário', amount: 4500, type: 'receita', categoryId: 'cat-rec-1', date: '2026-08-05' },
  { id: 'tx-hist-ago-2', description: 'Despesas gerais', amount: 1780, type: 'despesa', categoryId: 'cat-desp-2', date: '2026-08-15' },

  // Julho 2026
  { id: 'tx-hist-jul-1', description: 'Salário', amount: 4500, type: 'receita', categoryId: 'cat-rec-1', date: '2026-07-05' },
  { id: 'tx-hist-jul-2', description: 'Despesas gerais', amount: 1450, type: 'despesa', categoryId: 'cat-desp-1', date: '2026-07-22' },

  // Junho 2026
  { id: 'tx-hist-jun-1', description: 'Salário', amount: 4500, type: 'receita', categoryId: 'cat-rec-1', date: '2026-06-05' },
  { id: 'tx-hist-jun-2', description: 'Despesas gerais', amount: 1530, type: 'despesa', categoryId: 'cat-desp-3', date: '2026-06-19' },

  // Maio 2026
  { id: 'tx-hist-mai-1', description: 'Salário', amount: 4500, type: 'receita', categoryId: 'cat-rec-1', date: '2026-05-05' },
  { id: 'tx-hist-mai-2', description: 'Despesas gerais', amount: 1390, type: 'despesa', categoryId: 'cat-desp-2', date: '2026-05-18' }
];

/**
 * Orçamentos mensais conforme Tela 06 do PDF
 */
const INITIAL_BUDGETS = [
  { id: 'bg-01', categoryId: 'cat-desp-2', limitAmount: 900.00, monthKey: '2026-10' }, // Alimentação
  { id: 'bg-02', categoryId: 'cat-desp-3', limitAmount: 350.00, monthKey: '2026-10' }, // Transporte
  { id: 'bg-03', categoryId: 'cat-desp-5', limitAmount: 250.00, monthKey: '2026-10' }, // Lazer
  { id: 'bg-04', categoryId: 'cat-desp-1', limitAmount: 1500.00, monthKey: '2026-10' } // Moradia
];

/**
 * Metas de economia conforme Tela 06 do PDF
 */
const INITIAL_GOALS = [
  {
    id: 'goal-01',
    name: 'Viagem de férias',
    targetAmount: 5000.00,
    currentAmount: 3000.00, // 60% concluído
    targetDate: '2026-12-31',
    color: '#76B8B2'
  },
  {
    id: 'goal-02',
    name: 'Reserva de emergência',
    targetAmount: 10000.00,
    currentAmount: 7200.00, // 72% concluído
    targetDate: '2027-06-30',
    color: '#4D9690'
  }
];

const INITIAL_PREFERENCES = {
  userName: 'UserTest',
  currency: 'BRL',
  dateFormat: 'DD/MM/AAAA',
  theme: 'light'
};

/**
 * Dispara evento personalizado para avisar componentes sobre alterações nos dados
 */
function emitChange(entityName) {
  window.dispatchEvent(new CustomEvent('finflow-data-changed', {
    detail: { entity: entityName, timestamp: Date.now() }
  }));
}

/**
 * Inicializa o armazenamento local, aplicando dados de demonstração caso esteja vazio
 */
export function initStorage() {
  try {
    const existingSchema = localStorage.getItem(KEYS.SCHEMA);
    if (!existingSchema) {
      resetToDemo();
    } else {
      // Migração de compatibilidade: se houver nome legado com 'breno' no localStorage, migra para 'UserTest'
      const rawPrefs = localStorage.getItem(KEYS.PREFERENCES);
      if (rawPrefs) {
        try {
          const parsed = JSON.parse(rawPrefs);
          if (parsed && (parsed.userName === 'brenom' || parsed.userName === 'breno')) {
            parsed.userName = 'UserTest';
            localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(parsed));
          }
        } catch (_) {}
      }

      // Migração de compatibilidade: atualiza transações legadas que continham Freelance / Consultoria
      const rawTxs = localStorage.getItem(KEYS.TRANSACTIONS);
      if (rawTxs && (rawTxs.includes('Freelance') || rawTxs.includes('Consultoria'))) {
        try {
          const txs = JSON.parse(rawTxs);
          let txsChanged = false;
          txs.forEach(t => {
            if (t.description === 'Freelance frontend') {
              t.description = 'Bônus de desempenho';
              t.notes = 'Premiação por metas da equipe';
              txsChanged = true;
            }
            if (t.description === 'Consultoria UI/UX') {
              t.description = 'Participação nos Lucros (PLR)';
              t.notes = 'Pagamento semestral de PLR';
              txsChanged = true;
            }
            if (t.description === 'Freelance') {
              t.description = 'Bônus trimestral';
              txsChanged = true;
            }
          });
          if (txsChanged) {
            localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(txs));
          }
        } catch (_) {}
      }

      // Migração de compatibilidade: atualiza categoria legada Freelance para Bônus e Prêmios
      const rawCats = localStorage.getItem(KEYS.CATEGORIES);
      if (rawCats && rawCats.includes('Freelance')) {
        try {
          const cats = JSON.parse(rawCats);
          let catChanged = false;
          cats.forEach(c => {
            if (c.id === 'cat-rec-2' && c.name === 'Freelance') {
              c.name = 'Bônus e Prêmios';
              catChanged = true;
            }
          });
          if (catChanged) {
            localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(cats));
          }
        } catch (_) {}
      }
    }
  } catch (error) {
    console.warn('LocalStorage inacessível ou desabilitado pelo navegador:', error);
  }
}

/**
 * Restaura todos os dados para o estado inicial de demonstração
 */
export function resetToDemo() {
  localStorage.setItem(KEYS.SCHEMA, SCHEMA_VERSION);
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
  localStorage.setItem(KEYS.BUDGETS, JSON.stringify(INITIAL_BUDGETS));
  localStorage.setItem(KEYS.GOALS, JSON.stringify(INITIAL_GOALS));
  localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(INITIAL_PREFERENCES));
  emitChange('all');
}

/**
 * Limpa todos os dados de transações, orçamentos e metas, mantendo apenas categorias básicas
 */
export function clearAllData() {
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify([]));
  localStorage.setItem(KEYS.BUDGETS, JSON.stringify([]));
  localStorage.setItem(KEYS.GOALS, JSON.stringify([]));
  emitChange('all');
}

// ============================================================================
// OPERAÇÕES DE TRANSAÇÕES
// ============================================================================

export function getTransactions() {
  try {
    const data = localStorage.getItem(KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Falha ao ler transações:', err);
    return [];
  }
}

export function saveTransactions(transactions) {
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  emitChange('transactions');
}

// ============================================================================
// OPERAÇÕES DE CATEGORIAS
// ============================================================================

export function getCategories() {
  try {
    const data = localStorage.getItem(KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Falha ao ler categorias:', err);
    return [];
  }
}

export function saveCategories(categories) {
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  emitChange('categories');
}

// ============================================================================
// OPERAÇÕES DE ORÇAMENTOS
// ============================================================================

export function getBudgets() {
  try {
    const data = localStorage.getItem(KEYS.BUDGETS);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Falha ao ler orçamentos:', err);
    return [];
  }
}

export function saveBudgets(budgets) {
  localStorage.setItem(KEYS.BUDGETS, JSON.stringify(budgets));
  emitChange('budgets');
}

// ============================================================================
// OPERAÇÕES DE METAS
// ============================================================================

export function getGoals() {
  try {
    const data = localStorage.getItem(KEYS.GOALS);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Falha ao ler metas:', err);
    return [];
  }
}

export function saveGoals(goals) {
  localStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
  emitChange('goals');
}

// ============================================================================
// PREFERÊNCIAS DO USUÁRIO
// ============================================================================

export function getPreferences() {
  try {
    const data = localStorage.getItem(KEYS.PREFERENCES);
    return data ? JSON.parse(data) : INITIAL_PREFERENCES;
  } catch (err) {
    return INITIAL_PREFERENCES;
  }
}

export function savePreferences(preferences) {
  localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(preferences));
  emitChange('preferences');
}

// ============================================================================
// BACKUP E RESTAURAÇÃO JSON
// ============================================================================

/**
 * Exporta todos os dados da aplicação como uma string JSON formatada
 * @returns {string}
 */
export function exportBackup() {
  const backupObject = {
    app: 'Finflow',
    schemaVersion: SCHEMA_VERSION,
    exportDate: new Date().toISOString(),
    preferences: getPreferences(),
    categories: getCategories(),
    transactions: getTransactions(),
    budgets: getBudgets(),
    goals: getGoals()
  };

  return JSON.stringify(backupObject, null, 2);
}

/**
 * Importa e valida dados de backup com integridade garantida
 * @param {string} jsonString - Conteúdo do arquivo JSON importado
 * @returns {{ success: boolean, message: string }}
 */
export function importBackup(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    const validation = validateBackupJSON(data);

    if (!validation.isValid) {
      return { success: false, message: validation.error || 'Arquivo de backup inválido.' };
    }

    // Gravação segura no LocalStorage
    localStorage.setItem(KEYS.SCHEMA, data.schemaVersion || SCHEMA_VERSION);
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(data.categories));
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
    localStorage.setItem(KEYS.BUDGETS, JSON.stringify(data.budgets));
    localStorage.setItem(KEYS.GOALS, JSON.stringify(data.goals));

    if (data.preferences) {
      localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(data.preferences));
    }

    emitChange('all');
    return { success: true, message: 'Dados importados com sucesso!' };
  } catch (error) {
    return { success: false, message: `Erro ao analisar o arquivo JSON: ${error.message}` };
  }
}
