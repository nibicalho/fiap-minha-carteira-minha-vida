import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import BalanceCard from '../components/ui/BalanceCard';
import SummaryCard from '../components/ui/SummaryCard';
import DiagnosticCard from '../components/ui/DiagnosticCard';
import Modal from '../components/ui/Modal';
import TransactionForm from '../components/features/TransactionForm';
import { formatarMoeda } from '../utils/formatters';
import styles from './Home.module.css';

import useDashboardMetrics from '../hooks/useDashboardMetrics';

function Home() {
  const navigate = useNavigate();

  const [usuario] = useState(() => {
    const raw = sessionStorage.getItem('usuarioLogado');
    return raw ? JSON.parse(raw) : null;
  });
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  
  const dataAtual = new Date();
  const mesAtual = String(dataAtual.getMonth() + 1).padStart(2, '0');
  const anoAtual = dataAtual.getFullYear();
  const [mesAno, setMesAno] = useState(`${anoAtual}-${mesAtual}`);

  /* ── 1. Proteção de sessão ── */
  useEffect(() => {
    if (!usuario) {
      navigate('/');
    }
  }, [navigate, usuario]);

  /* ── 2. Hook de Métricas do Dashboard ── */
  const {
    carregando,
    erro,
    carregarDados,
    despesasDoUsuario,
    saldoGeral,
    totalReceitasMes,
    totalDespesasMes,
    pctEntradas,
    pctSaidas,
    despesasPorCategoria
  } = useDashboardMetrics(usuario, mesAno);

  const handleSair = () => {
    sessionStorage.removeItem('usuarioLogado');
    navigate('/');
  };

  return (
    <div className={styles.appShell}>
      {/* ══════════════════════════════════════
          SIDEBAR / NAVEGAÇÃO (componente)
          ══════════════════════════════════════ */}
      <Sidebar
        menuAberto={menuAberto}
        onFechar={() => setMenuAberto(false)}
        onSair={handleSair}
        onNovoClick={() => setModalAberto(true)}
      />

      {/* Modal Nova Transação */}
      <Modal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        title="Nova Transação"
      >
        <TransactionForm
          usuarioId={usuario?.id}
          onSuccess={() => {
            setModalAberto(false);
            carregarDados();
          }}
        />
      </Modal>

      {/* ══════════════════════════════════════
          ÁREA DE CONTEÚDO PRINCIPAL
          ══════════════════════════════════════ */}
      <div className={styles.mainArea}>

        {/* ── Top App Bar ── */}
        <TopBar 
          onOpenMenu={() => setMenuAberto(true)}
          showAddButton={false}
          onAddClick={() => setModalAberto(true)}
          mesAno={mesAno}
          onMesAnoChange={setMesAno}
        />

        {/* ── Canvas do Dashboard ── */}
        <main className={styles.canvas} id="dashboard-main">

          {/* ── Feedback de erro ── */}
          {erro && !carregando && (
            <div className={styles.erroAlert} role="alert">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span>{erro}</span>
              <button className={styles.btnRetentar} onClick={carregarDados} type="button">
                Tentar novamente
              </button>
            </div>
          )}

          {/* ════════ GRID SUPERIOR: Saldo + Resumo Mensal ════════ */}
          <div className={styles.gridTopo}>

            {/* Card Saldo */}
            <BalanceCard
              valor={formatarMoeda(saldoGeral)}
              sublabel={
                carregando
                  ? 'Carregando...'
                  : `${despesasDoUsuario.length} transaç${despesasDoUsuario.length === 1 ? 'ão' : 'ões'} cadastradas`
              }
            />

            <SummaryCard
              totalReceitas={totalReceitasMes}
              totalDespesas={totalDespesasMes}
              pctEntradas={pctEntradas}
              pctSaidas={pctSaidas}
              carregando={carregando}
            />
          </div>

          <DiagnosticCard 
            categorias={despesasPorCategoria} 
            carregando={carregando} 
          />

        </main>
      </div>
    </div>
  );
}

export default Home;
