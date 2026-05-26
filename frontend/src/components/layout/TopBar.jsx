import styles from './TopBar.module.css';

/**
 * TopBar Component
 * Barra superior padronizada para as páginas do painel.
 *
 * Props:
 * - onOpenMenu {function}: Callback para abrir a gaveta no mobile
 * - showAddButton {boolean}: Exibe ou não o botão "+ Nova Transação"
 * - onAddClick {function}: Callback ao clicar em Nova Transação
 * - addLabel {string}: Label para o botão (default: 'Nova Transação')
 */
export default function TopBar({ onOpenMenu, showAddButton = false, onAddClick, mesAno, onMesAnoChange, addLabel = 'Nova Transação' }) {
  const formatMonthYear = (str) => {
    if (!str) return '';
    const [year, month] = str.split('-');
    const date = new Date(year, parseInt(month) - 1);
    const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
    const formatted = formatter.format(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  return (
    <header className={styles.topBar}>
      <div className={styles.leftSide}>
        <button
          className={styles.menuBtn}
          onClick={onOpenMenu}
          aria-label="Abrir menu"
          type="button"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <h1 className={styles.titulo}>Minha Carteira Minha Vida</h1>
      </div>

      {(showAddButton || mesAno) && (
        <div className={styles.rightSide}>
          {mesAno && (
            <div className={styles.monthPickerContainer}>
              <button 
                type="button" 
                className={styles.btnMonthPicker}
                onClick={() => {
                  const input = document.getElementById('hidden-month-input');
                  if (input && input.showPicker) input.showPicker();
                }}
              >
                {formatMonthYear(mesAno)}
                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
              </button>
              <input 
                id="hidden-month-input"
                type="month" 
                value={mesAno} 
                onChange={(e) => onMesAnoChange && onMesAnoChange(e.target.value)} 
                className={styles.hiddenInputMes}
              />
            </div>
          )}

          {showAddButton && (
            <button 
              className={styles.btnNovaTransacao} 
              onClick={onAddClick}
              type="button"
            >
              <span className="material-symbols-outlined" aria-hidden="true">add</span>
              {addLabel}
            </button>
          )}
        </div>
      )}
    </header>
  );
}
