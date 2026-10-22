/**
 * COMPONENTE TOAST — FINFLOW
 * Notificações visuais flutuantes desativadas conforme solicitação do usuário
 * para manter a interface limpa e sem interrupções de verificação de ação.
 */

/**
 * Função mantida para compatibilidade de assinatura, sem disparar toasts na tela.
 * @param {string} _message
 * @param {'success'|'error'|'info'|'warning'} [_type='info']
 * @param {number} [_duration=3500]
 */
export function showToast(_message, _type = 'info', _duration = 3500) {
  // Desativado: as ações agora ocorrem de forma fluida e direta na tela
}
