import styles from './SummaryCard.module.css';
import { formatarMoeda } from '../../utils/formatters';

/**
 * SummaryCard — exibe o resumo mensal de receitas e despesas com barra de proporção.
 */
export default function SummaryCard({
  totalReceitas,
  totalDespesas,
  pctEntradas,
  pctSaidas,
  carregando,
}) {


  return (
    <div className={styles.cardResumo}>
      <div className={styles.cardResumoHeader}>
        <h2 className={styles.cardResumoTitulo}>Resumo Mensal</h2>
      </div>

      <div className={styles.resumoGrid}>
        {/* Receitas */}
        <div className={styles.resumoItem}>
          <span className={styles.resumoItemLabel}>
            <span className={styles.dotVerde} aria-hidden="true" />
            Receitas
          </span>
          <span className={styles.resumoItemValor}>
            {carregando ? '—' : formatarMoeda(totalReceitas)}
          </span>
        </div>

        {/* Despesas */}
        <div className={styles.resumoItem}>
          <span className={styles.resumoItemLabel}>
            <span className={styles.dotVermelho} aria-hidden="true" />
            Despesas
          </span>
          <span className={styles.resumoItemValor}>
            {carregando ? '—' : formatarMoeda(totalDespesas)}
          </span>
        </div>
      </div>

      {/* Barra de proporção */}
      <div className={styles.proporcaoWrapper}>
        <div
          className={styles.proporcaoBarra}
          role="img"
          aria-label={`${pctEntradas}% entradas, ${pctSaidas}% saídas`}
        >
          <div
            className={styles.proporcaoEntradas}
            style={{ width: `${pctEntradas}%` }}
          />
          <div
            className={styles.proporcaoSaidas}
            style={{ width: `${pctSaidas}%` }}
          />
        </div>
        <div className={styles.proporcaoLabels}>
          <span>{pctEntradas}% Entradas</span>
          <span>{pctSaidas}% Saídas</span>
        </div>
      </div>
    </div>
  );
}
