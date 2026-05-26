import styles from './BalanceCard.module.css';

const IconBank = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zM11.5 1 2 6v2h19V6l-9.5-5z" />
  </svg>
);

const IconAlert = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2L1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2" />
  </svg>
);

const IconReceipt = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z"/>
  </svg>
);

function BalanceCard({
  valor,
  sublabel,
}) {
  const isNegative = valor && valor.includes('-');
  // Adiciona um espaço após o negativo: "-R$ 1.250,00" -> "- R$ 1.250,00"
  const formattedValor = isNegative ? valor.replace('-', '- ') : valor;
  
  const variant = isNegative ? 'negative' : 'positive';
  const icon = isNegative ? <IconAlert /> : <IconBank />;

  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.cornerBlob} aria-hidden="true" />

      <div className={styles.header}>
        <span className={styles.label}>SALDO ACUMULADO</span>
        <span className={styles.iconBox} aria-hidden="true">
          {icon}
        </span>
      </div>

      <p className={styles.valor}>{formattedValor}</p>

      <hr className={styles.divider} />

      {sublabel && (
        <p className={styles.sublabel}>
          <span className={styles.subIcon} aria-hidden="true"><IconReceipt /></span>
          {sublabel}
        </p>
      )}
    </div>
  );
}

export default BalanceCard;
