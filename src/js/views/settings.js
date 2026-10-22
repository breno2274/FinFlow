/**
 * VIEW DE CONFIGURAÇÕES E BACKUP — FINFLOW (Tela 09)
 * Ajuste de preferências do usuário (nome, moeda, tema) e administração de dados
 * com exportação/importação JSON validada, restauração de demonstração e limpeza segura.
 */

import {
  getPreferences,
  savePreferences,
  exportBackup,
  importBackup,
  resetToDemo,
  clearAllData
} from '../core/storage.js';
import { confirmAction } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { getTodayISO } from '../utils/dates.js';
import { escapeHTML } from '../utils/format.js';

/**
 * Renderiza o HTML da tela de Configurações e Backup
 * @returns {string}
 */
export function renderSettingsView() {
  const prefs = getPreferences();

  const usernameInput = document.getElementById('pref-username');
  if (usernameInput) usernameInput.value = prefs.userName || 'UserTest';

  const currencySelect = document.getElementById('pref-currency');
  if (currencySelect) currencySelect.value = prefs.currency || 'BRL';

  const dateFormatSelect = document.getElementById('pref-dateformat');
  if (dateFormatSelect) dateFormatSelect.value = prefs.dateFormat || 'DD/MM/AAAA';

  const themeSwitch = document.getElementById('theme-toggle-switch');
  const themeText = document.getElementById('theme-switch-text');
  if (themeSwitch) {
    const isDark = prefs.theme === 'dark';
    themeSwitch.checked = isDark;
    if (themeText) {
      themeText.textContent = isDark ? 'Modo Escuro' : 'Modo Claro';
    }
  }

  const container = document.getElementById('view-settings');
  return container ? container.innerHTML : '';
}

/**
 * Dispara o download de um arquivo JSON no navegador
 */
function downloadJSONFile(jsonString, filename) {
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Registra os eventos da tela de Configurações
 * @param {HTMLElement} container
 */
export function initSettingsEvents(container = document.getElementById('view-settings')) {
  if (!container) return;
  if (container.dataset.eventsInit === 'true') return;
  container.dataset.eventsInit = 'true';

  const formPrefs = container.querySelector('#form-preferences');
  const themeSwitch = container.querySelector('#theme-toggle-switch');
  const themeText = container.querySelector('#theme-switch-text');
  const exportBtn = container.querySelector('#btn-export-backup');
  const fileImportInput = container.querySelector('#file-import-backup');
  const resetDemoBtn = container.querySelector('#btn-reset-demo');
  const clearAllBtn = container.querySelector('#btn-clear-all');

  let activeTheme = getPreferences().theme || 'light';

  if (themeSwitch) {
    const isDark = activeTheme === 'dark';
    themeSwitch.checked = isDark;
    if (themeText) {
      themeText.textContent = isDark ? 'Modo Escuro' : 'Modo Claro';
    }

    themeSwitch.addEventListener('change', () => {
      const isChecked = themeSwitch.checked;
      activeTheme = isChecked ? 'dark' : 'light';

      if (isChecked) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }

      if (themeText) {
        themeText.textContent = isChecked ? 'Modo Escuro' : 'Modo Claro';
      }

      // Persiste imediatamente a alteração de tema no LocalStorage
      const currentPrefs = getPreferences();
      savePreferences({ ...currentPrefs, theme: activeTheme });
    });
  }

  // Sincronização e salvamento imediato do nome de exibição no LocalStorage
  const usernameInput = container.querySelector('#pref-username');
  if (usernameInput) {
    const handleImmediateNameSave = () => {
      const newName = usernameInput.value.trim();
      if (newName) {
        const currentPrefs = getPreferences();
        if (currentPrefs.userName !== newName) {
          savePreferences({ ...currentPrefs, userName: newName });

          // Atualiza avatares e nome no cabeçalho e sidebar imediatamente
          const initial = newName.charAt(0).toUpperCase();
          document.querySelectorAll('.user-avatar').forEach(el => { el.textContent = initial; });
          document.querySelectorAll('.sidebar-footer .user-name').forEach(el => { el.textContent = newName; });

          const greeting = document.getElementById('dashboard-greeting');
          if (greeting) greeting.textContent = `Olá, ${newName}!`;
        }
      }
    };

    usernameInput.addEventListener('input', handleImmediateNameSave);
    usernameInput.addEventListener('change', handleImmediateNameSave);
    usernameInput.addEventListener('blur', handleImmediateNameSave);
  }

  // Salvar preferências completas via formulário
  if (formPrefs) {
    formPrefs.addEventListener('submit', (e) => {
      e.preventDefault();
      const userName = (container.querySelector('#pref-username')?.value || '').trim() || 'UserTest';
      const currency = container.querySelector('#pref-currency')?.value || 'BRL';
      const dateFormat = container.querySelector('#pref-dateformat')?.value || 'DD/MM/AAAA';

      savePreferences({ userName, currency, dateFormat, theme: activeTheme });

      // Atualiza avatares e nome no cabeçalho e sidebar imediatamente
      const initial = userName.charAt(0).toUpperCase();
      document.querySelectorAll('.user-avatar').forEach(el => { el.textContent = initial; });
      document.querySelectorAll('.sidebar-footer .user-name').forEach(el => { el.textContent = userName; });

      const greeting = document.getElementById('dashboard-greeting');
      if (greeting) greeting.textContent = `Olá, ${userName}!`;

      showToast('Preferências salvas com sucesso!', 'success');
    });
  }

  // Exportar backup
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const backupJSON = exportBackup();
      const filename = `finflow-backup-${getTodayISO()}.json`;
      downloadJSONFile(backupJSON, filename);
      showToast('Backup exportado com sucesso!', 'success');
    });
  }

  // Importar backup
  if (fileImportInput) {
    fileImportInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const jsonContent = event.target.result;

        confirmAction({
          title: 'Confirmar importação de backup',
          message: 'A importação deste arquivo substituirá as transações, categorias e orçamentos atuais. Deseja prosseguir?',
          confirmText: 'Importar e substituir',
          confirmDanger: true,
          onConfirm: () => {
            const result = importBackup(jsonContent);
            if (result.success) {
              showToast(result.message, 'success');
            } else {
              showToast(result.message, 'error', 5000);
            }
          }
        });
      };

      reader.onerror = () => {
        showToast('Não foi possível ler o arquivo selecionado.', 'error');
      };

      reader.readAsText(file);
    });
  }

  // Restaurar dados demo
  if (resetDemoBtn) {
    resetDemoBtn.addEventListener('click', () => {
      confirmAction({
        title: 'Restaurar dados de demonstração',
        message: 'Deseja repovoar a aplicação com as transações, categorias e metas de exemplo do Finflow?',
        confirmText: 'Restaurar demonstração',
        onConfirm: () => {
          resetToDemo();
          showToast('Dados de demonstração restaurados com sucesso!', 'success');
        }
      });
    });
  }

  // Limpeza completa
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      confirmAction({
        title: 'Atenção: Apagar todos os dados',
        message: 'Esta ação apagará todas as suas transações, orçamentos e metas permanentemente. Deseja realmente zerar os registros?',
        confirmText: 'Sim, apagar tudo',
        confirmDanger: true,
        onConfirm: () => {
          clearAllData();
          showToast('Todos os registros locais foram apagados.', 'info');
        }
      });
    });
  }
}

