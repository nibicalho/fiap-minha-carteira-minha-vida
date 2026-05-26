import styles from './ExpenseList.module.css';
import { formatarMoeda, formatarData } from '../../utils/formatters';

/* Ícones por categoria (resolução por slug) */
const ICONES = {
  moradia: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  ),
  alimentacao: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-8-15.03-8-15.03 0h15.03zM1.02 17h15v2h-15z" />
    </svg>
  ),
  transporte: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
  ),
  saude: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
    </svg>
  ),
  lazer: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
    </svg>
  ),
  educacao: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z" />
    </svg>
  ),
  outros: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  ),
};

function resolverIcone(nomeCategoria) {
  if (!nomeCategoria) return ICONES.outros;
  const slug = nomeCategoria
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');
  for (const key of Object.keys(ICONES)) {
    if (slug.includes(key)) return ICONES[key];
  }
  return ICONES.outros;
}

/**
 * ExpenseList — lista de despesas do usuário.
 *
 * Props:
 *  - despesas      {Array}    Array de objetos despesa (filtradas para o usuário logado)
 *  - categorias    {Array}    Array de categorias para resolução de nome
 *  - carregando    {boolean}  Exibe skeleton loader
 *  - onLinkAll     {function} Callback para o link "Ver todas" (opcional)
 */
function ExpenseList({ despesas = [], categorias = [], carregando = false, onLinkAll }) {

  const getNomeCategoria = (despesa) => {
    if (despesa.categoria?.nomeCategoria) return despesa.categoria.nomeCategoria;
    const catId = despesa.categoria?.idCategoria || despesa.categoriaId;
    const cat = categorias.find(
      (c) => c.idCategoria === catId || c.id === catId
    );
    return cat?.nomeCategoria || cat?.nome || 'Outros';
  };

  if (carregando) {
    return (
      <div className={styles.wrapper}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.skeleton} aria-hidden="true">
            <div className={styles.skeletonAvatar} />
            <div className={styles.skeletonLines}>
              <div className={styles.skeletonLine} />
              <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
            </div>
            <div className={styles.skeletonValor} />
          </div>
        ))}
      </div>
    );
  }

  if (despesas.length === 0) {
    return (
      <div className={styles.vazio}>
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.5-13H13v6l5.25 3.15-.75 1.23L11.5 14V7z" />
        </svg>
        <p className={styles.vazioMsg}>Nenhuma despesa registrada.</p>
        {onLinkAll && (
          <button className={styles.linkAdicionar} onClick={onLinkAll} type="button">
            Adicionar despesa
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.wrapper} aria-label="Lista de despesas recentes">
      {despesas.map((despesa) => {
        const tId = despesa.idDespesa || despesa.id;
        const nomeCategoria = getNomeCategoria(despesa);
        const descricao = despesa.motivo || despesa.descricao || despesa.nome || 'Despesa';
        const isReceita = despesa.categoria?.tipoCategoria === 'RECEITA';

        return (
          <div key={tId} className={styles.item}>
            {/* Avatar da categoria */}
            <div className={styles.avatar} aria-hidden="true">
              {resolverIcone(nomeCategoria)}
            </div>

            {/* Descrição + categoria */}
            <div className={styles.info}>
              <span className={styles.descricao}>{descricao}</span>
              <span className={styles.categoria}>{nomeCategoria}</span>
            </div>

            {/* Valor + data */}
            <div className={styles.valores}>
              <span className={`${styles.valor} ${isReceita ? styles.valorReceita : styles.valorDespesa}`}>
                {isReceita ? '+' : '-'} {formatarMoeda(Math.abs(despesa.valor))}
              </span>
              {despesa.data && (
                <span className={styles.data}>{formatarData(despesa.data)}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ExpenseList;
