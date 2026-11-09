// Configuracoes do usuario, alternancia de tema visual e gerenciamento de backups locais

import React, { useState, useEffect } from 'react';
import {
  getPreferences,
  savePreferences,
  exportBackupJSON,
  importBackupJSON,
  resetToDemo,
  clearAllData,
  getTransactions,
  getCategories
} from '../services/storage';
import { exportTransactionsToCSV } from '../utils/csv';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import { Modal } from '../components/common/Modal';
import { useFinflowData } from '../hooks/useFinflowData';

// Controla preferencias visuais, exportacao e importacao de backups em JSON e CSV
export const SettingsPage: React.FC = () => {
  useFinflowData();

  const currentPrefs = getPreferences();
  const [userName, setUserName] = useState(currentPrefs.userName || 'UserTest');
  const [currency, setCurrency] = useState(currentPrefs.currency || 'BRL');
  const [dateFormat, setDateFormat] = useState(currentPrefs.dateFormat || 'DD/MM/AAAA');
  const [isDark, setIsDark] = useState(currentPrefs.theme === 'dark');

  // Modais de confirmacao e avisos
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Sincroniza o atributo data-theme no elemento raiz do documento
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDark]);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    savePreferences({
      userName: userName.trim() || 'UserTest',
      currency,
      dateFormat,
      theme: isDark ? 'dark' : 'light'
    });
    setFeedbackMessage('Preferências salvas com sucesso!');
  };

  const handleToggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    savePreferences({
      ...currentPrefs,
      theme: nextDark ? 'dark' : 'light'
    });
  };

  const handleExportBackup = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importBackupJSON(content);
      setFeedbackMessage(res.message);
      if (res.success) {
        const updated = getPreferences();
        setUserName(updated.userName);
        setIsDark(updated.theme === 'dark');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportCSV = () => {
    const txs = getTransactions();
    const cats = getCategories();
    exportTransactionsToCSV(txs, cats);
  };

  const handleConfirmClear = () => {
    clearAllData();
    setFeedbackMessage('Todos os dados foram excluídos com sucesso.');
  };

  const handleConfirmReset = () => {
    resetToDemo();
    setFeedbackMessage('Dados de demonstração restaurados com sucesso.');
  };

  return (
    <div className="settings-view">
      <div className="dashboard-toolbar">
        <div>
          <p className="card-subtitle">Ajuste suas preferências e proteja seus dados contra perda acidental.</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Preferências</h3>
          </div>

          <form id="form-preferences" onSubmit={handleSavePreferences}>
            <div className="form-group">
              <label htmlFor="pref-username" className="form-label">Nome de exibição</label>
              <input
                type="text"
                id="pref-username"
                className="form-input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <span className="form-hint">Usado na saudação e cabeçalho do painel.</span>
            </div>

            <div className="form-group">
              <label htmlFor="pref-currency" className="form-label">Moeda padrão</label>
              <select
                id="pref-currency"
                className="form-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="BRL">Real brasileiro (BRL)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="pref-dateformat" className="form-label">Formato de data</label>
              <select
                id="pref-dateformat"
                className="form-select"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
              >
                <option value="DD/MM/AAAA">DD/MM/AAAA</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="theme-toggle-switch">Tema visual da interface</label>
              <div className="theme-switch-container" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                <label className="toggle-switch" htmlFor="theme-toggle-switch">
                  <input
                    type="checkbox"
                    id="theme-toggle-switch"
                    role="switch"
                    aria-label="Alternar entre modo claro e modo escuro"
                    checked={isDark}
                    onChange={handleToggleTheme}
                  />
                  <span className="toggle-switch-track">
                    <span className="toggle-switch-thumb"></span>
                  </span>
                </label>
                <span className="theme-switch-text" id="theme-switch-text">
                  {isDark ? 'Modo Escuro' : 'Modo Claro'}
                </span>
              </div>
            </div>

            <div style={{ marginTop: 'var(--spacing-6)' }}>
              <button type="submit" className="btn btn-primary" id="btn-save-preferences">
                Salvar preferências
              </button>
            </div>
          </form>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Gerenciamento de dados</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div className="backup-actions">
              <h4>Backup e Restauração</h4>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-3)' }}>
                Seus dados ficam gravados com segurança apenas no seu navegador. Exporte cópias em JSON ou planilhas em CSV regularmente.
              </p>

              <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-secondary" id="btn-export-backup" onClick={handleExportBackup}>
                  Exportar backup (.json)
                </button>

                <label className="btn btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                  Restaurar backup (.json)
                  <input type="file" id="file-import-backup" accept=".json" style={{ display: 'none' }} onChange={handleImportFile} />
                </label>

                <button type="button" className="btn btn-secondary" onClick={handleExportCSV}>
                  Baixar extrato (.csv)
                </button>
              </div>
            </div>

            <hr style={{ border: 0, borderTop: '1px solid var(--color-border-subtle)', margin: 0 }} />

            <div>
              <h4>Dados de Demonstração</h4>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-3)' }}>
                Deseja redefinir os dados para o conjunto inicial de testes do Finflow com transações e metas realistas?
              </p>
              <button
                type="button"
                className="btn btn-secondary"
                id="btn-reset-demo"
                onClick={() => setIsResetModalOpen(true)}
              >
                Restaurar dados de demonstração
              </button>
            </div>

            <hr style={{ border: 0, borderTop: '1px solid var(--color-border-subtle)', margin: 0 }} />

            <div style={{ backgroundColor: 'var(--color-negative-bg)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid #F1B2B2' }}>
              <h4 style={{ color: 'var(--color-negative)', marginBottom: 'var(--spacing-1)' }}>Zona de Perigo</h4>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-3)' }}>
                Esta ação apagará permanentemente todas as suas transações, orçamentos e metas do navegador.
              </p>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                id="btn-clear-all"
                onClick={() => setIsClearModalOpen(true)}
              >
                Limpar todos os dados
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleConfirmClear}
        title="Limpeza total de dados"
        message="Atenção: todos os seus lançamentos, orçamentos e metas serão permanentemente excluídos do dispositivo. Tem certeza que deseja prosseguir?"
        confirmText="Limpar tudo"
      />

      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        title="Restaurar demonstração"
        message="Deseja substituir seus registros atuais pelos dados originais de demonstração do Finflow?"
        confirmText="Restaurar demonstração"
        isDanger={false}
      />

      <Modal
        isOpen={Boolean(feedbackMessage)}
        onClose={() => setFeedbackMessage(null)}
        title="Notificação"
        footer={
          <button type="button" className="btn btn-primary" onClick={() => setFeedbackMessage(null)}>
            OK
          </button>
        }
      >
        <p style={{ fontSize: 'var(--font-size-sm)' }}>{feedbackMessage}</p>
      </Modal>
    </div>
  );
};

