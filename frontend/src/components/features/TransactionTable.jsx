import { useState } from 'react';
import styles from './TransactionTable.module.css';
import api from '../../services/api';
import { formatarMoeda, formatarData } from '../../utils/formatters';

/* Ícones por categoria */
const ICONES = {
  moradia: 'home',
  alimentacao: 'restaurant',
  transporte: 'directions_car',
  saude: 'favorite',
  lazer: 'celebration',
  educacao: 'school',
  salario: 'work',
  rendimentos: 'show_chart',
  investimentos: 'show_chart',
  servicos: 'code',
  outros: 'shopping_cart',
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
 * TransactionTable — lista de histórico responsiva (tabela desktop, cartões agrupados mobile).
 *
 * Props:
 *  - transacoes   {Array}   Lista de transações
 *  - categorias   {Array}   Lista de categorias (para buscar nome/cor)
 *  - carregando   {boolean}
 *  - onDelete     {function} Callback após deletar sucesso (passa o id)
 *  - onEdit       {function} Callback para editar (passa a transação inteira)
 */
function TransactionTable({ transacoes = [], categorias = [], carregando = false, onDelete, onEdit }) {
  const [apagandoId, setApagandoId] = useState(null);
  const [sortField, setSortField] = useState('data');
  const [sortDirection, setSortDirection] = useState('desc');

  const getCategoriaInfo = (transacao) => {
    if (transacao.categoria) return transacao.categoria;
    const catId = transacao.categoria?.idCategoria || transacao.categoriaId;
    const cat = categorias.find((c) => c.idCategoria === catId || c.id === catId);
    return cat || { nomeCategoria: 'Outros' };
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTransacoes = [...transacoes].sort((a, b) => {
    let valA, valB;
    if (sortField === 'desc') {
      const catA = getCategoriaInfo(a);
      const catB = getCategoriaInfo(b);
      valA = (catA.nomeCategoria || catA.nome || 'Outros').toLowerCase();
      valB = (catB.nomeCategoria || catB.nome || 'Outros').toLowerCase();
    } else if (sortField === 'cat') {
      const catA = getCategoriaInfo(a);
      const catB = getCategoriaInfo(b);
      valA = (catA.nomeCategoria || catA.nome || 'Outros').toLowerCase();
      valB = (catB.nomeCategoria || catB.nome || 'Outros').toLowerCase();
    } else if (sortField === 'data') {
      valA = new Date(a.data).getTime();
      valB = new Date(b.data).getTime();
    } else if (sortField === 'valor') {
      valA = a.valor;
      valB = b.valor;
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const renderHeader = (field, label, className) => {
    const isActive = sortField === field;
    return (
      <div 
        className={`${className} ${styles.sortableHeader} ${isActive ? styles.headerActive : ''}`}
        style={{ gap: '4px' }}
        onClick={() => handleSort(field)}
      >
        {label}
        {isActive && (
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
          </span>
        )}
      </div>
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja apagar esta transação?')) return;
    setApagandoId(id);
    try {
      await api.delete(`/despesas/${id}`);
      if (onDelete) onDelete(id);
    } catch (error) {
      alert('Erro ao apagar a transação. Tente novamente.');
      console.error(error);
    } finally {
      setApagandoId(null);
    }
  };

  if (carregando) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.vazio}>Carregando transações...</div>
      </div>
    );
  }

  if (transacoes.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.vazio}>Nenhuma transação encontrada para os filtros atuais.</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* ── Cabeçalho Tabela Desktop ── */}
      <div className={styles.tableHeader}>
        {renderHeader('desc', 'Transação', styles.colDesc)}
        {renderHeader('cat', 'Categoria', styles.colCat)}
        {renderHeader('data', 'Data', styles.colData)}
        {renderHeader('valor', 'Valor', styles.colValor)}
        <div className={styles.colAcoesHeader}>AÇÕES</div>
      </div>

      {/* ── Lista de Transações ── */}
      <div className={styles.tableBody}>
        {sortedTransacoes.map((t) => {
          const tId = t.idDespesa || t.id;
          const cat = getCategoriaInfo(t);
          const nomeCategoria = cat.nomeCategoria || cat.nome || 'Outros';
          const iconeName = resolverIcone(nomeCategoria);
          const descricao = t.motivo || t.descricao || t.nome || 'Transação';
          const isReceita = (t.categoria?.tipoCategoria || '').toUpperCase() === 'RECEITA';

          return (
            <div key={tId} className={styles.row}>
              {/* Descrição */}
              <div className={styles.colDesc}>
                <div className={`${styles.avatar} ${isReceita ? styles.avatarReceita : styles.avatarDespesa}`} aria-hidden="true">
                  <span className="material-symbols-outlined">{iconeName}</span>
                </div>
                <div className={styles.textContainer}>
                  <span className={styles.descTexto}>{nomeCategoria}</span>
                  <span className={styles.descSubTexto}>{descricao}</span>
                </div>
              </div>

              {/* Categoria */}
              <div className={styles.colCat}>
                <span className={styles.badgeCategoria}>{nomeCategoria}</span>
              </div>

              {/* Data */}
              <div className={styles.colData}>
                <span className={styles.dataTexto}>{formatarData(t.data)}</span>
              </div>

              {/* Valor */}
              <div className={styles.colValor}>
                <span className={`${styles.valorTexto} ${isReceita ? styles.valorPositivo : styles.valorNegativo}`}>
                  {isReceita ? '+' : '-'} {formatarMoeda(Math.abs(t.valor))}
                </span>
                {/* Mobile exibe a data junto do valor */}
                <span className={styles.mobileDataTexto}>{formatarData(t.data)}</span>
              </div>

              {/* Ações */}
              <div className={styles.colAcoes}>
                {onEdit && (
                  <button
                    className={styles.btnAcao}
                    onClick={() => onEdit(t)}
                    title="Editar transação"
                    aria-label="Editar transação"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                )}
                <button
                  className={`${styles.btnAcao} ${styles.btnDelete}`}
                  onClick={() => handleDelete(tId)}
                  disabled={apagandoId === tId}
                  title="Apagar transação"
                  aria-label="Apagar transação"
                >
                  <span className="material-symbols-outlined">
                    {apagandoId === tId ? 'hourglass_empty' : 'delete'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TransactionTable;
