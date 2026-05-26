/**
 * formatters.js
 * Utilitários centralizados para formatação de dados em todo o front-end.
 */

/**
 * Formata um valor numérico para Moeda (BRL).
 * @param {number} valor 
 * @returns {string} Valor formatado (ex: R$ 1.500,00)
 */
export function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
}

/**
 * Formata uma data para o padrão pt-BR garantindo o fuso horário correto.
 * @param {string|Date} data 
 * @returns {string} Data formatada (ex: 25 de mai. de 2026)
 */
export function formatarData(data) {
  if (!data) return '';
  try {
    // Adiciona T12:00:00 para forçar o fuso horário a não retroceder um dia
    const dataStr = String(data).includes('T') 
      ? `${String(data).split('T')[0]}T12:00:00` 
      : `${data}T12:00:00`;
    return new Date(dataStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}
