import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import TransactionTable from '../components/features/TransactionTable';
import Modal from '../components/ui/Modal';
import TransactionForm from '../components/features/TransactionForm';
import api from '../services/api';
import styles from './Historico.module.css';

export default function Historico() {
  const navigate = useNavigate();
  const [usuario] = useState(() => {
    const salvo = sessionStorage.getItem('usuarioLogado');
    return salvo ? JSON.parse(salvo) : null;
  });
  
  const [transacoesGlobais, setTransacoesGlobais] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('todas'); // 'todas', 'receitas', 'despesas'
  const [modalAberto, setModalAberto] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [transacaoEditando, setTransacaoEditando] = useState(null);

  const abrirModalNovo = () => {
    setTransacaoEditando(null);
    setModalAberto(true);
  };

  const abrirModalEditar = (transacao) => {
    setTransacaoEditando(transacao);
    setModalAberto(true);
  };

  // 1. Verificação de Segurança (Auth)
  useEffect(() => {
    if (!usuario) {
      navigate('/');
    }
  }, [navigate, usuario]);

  const handleSair = () => {
    sessionStorage.removeItem('usuarioLogado');
    navigate('/');
  };

  // 2. Carregar Dados da API
  const carregarDados = useCallback(async () => {
    if (!usuario) return;
    setCarregando(true);
    try {
      const [resDespesas, resCats] = await Promise.all([
        api.get('/despesas'),
        api.get('/categorias'),
      ]);
      
      // Filtrar apenas do usuário atual
      const currentUserId = usuario.idUsuario || usuario.id;
      const dataDespesas = resDespesas.data.filter((d) => {
        const transUserId = d.usuario?.idUsuario || d.usuario?.id || d.usuarioId;
        return transUserId && currentUserId && transUserId === currentUserId;
      });
      
      // Ordenar por data mais recente
      dataDespesas.sort((a, b) => new Date(b.data) - new Date(a.data));

      setTransacoesGlobais(dataDespesas);
      setCategorias(resCats.data);
    } catch (error) {
      console.error('Erro ao carregar dados do histórico:', error);
    } finally {
      setCarregando(false);
    }
  }, [usuario]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarDados();
  }, [carregarDados]);

  // 3. Aplicar Filtros (Derived State)
  const transacoesFiltradas = transacoesGlobais.filter(t => {
    if (filtro === 'receitas') return (t.categoria?.tipoCategoria || '').toUpperCase() === 'RECEITA';
    if (filtro === 'despesas') return (t.categoria?.tipoCategoria || '').toUpperCase() !== 'RECEITA';
    return true;
  });

  // 4. Callback para atualizar a lista local após apagar
  const handleItemApagado = (idApagado) => {
    setTransacoesGlobais(prev => prev.filter(t => (t.idDespesa || t.id) !== idApagado));
  };

  if (!usuario) return null; // Previne renderização vazia antes do redirect

  return (
    <div className={styles.appShell}>
      {/* ── Sidebar Desktop / Mobile ── */}
      <Sidebar 
        usuario={usuario} 
        activePath="/historico" 
        menuAberto={menuAberto}
        onFechar={() => setMenuAberto(false)}
        onSair={handleSair}
        onNovoClick={abrirModalNovo}
      />

      {/* Modal Nova Transação */}
      <Modal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        title={transacaoEditando ? "Editar Transação" : "Nova Transação"}
      >
        <TransactionForm
          usuarioId={usuario?.id}
          initialData={transacaoEditando}
          onSuccess={() => {
            setModalAberto(false);
            carregarDados();
          }}
        />
      </Modal>

      {/* ── Área de Conteúdo ── */}
      <main className={styles.mainArea}>
        
        {/* ── Top App Bar ── */}
        <TopBar 
          onOpenMenu={() => setMenuAberto(true)}
          showAddButton={true}
          onAddClick={abrirModalNovo}
        />

        {/* ── Canvas ── */}
        <div className={styles.canvas}>
          <div className={styles.pageHeader}>
            <div>
              <h2 className={styles.pageTitulo}>Histórico</h2>
              <p className={styles.pageSubtitulo}>Acompanhe suas movimentações financeiras recentes.</p>
            </div>
            
            {/* Filtros Tonal Segmented Control */}
            <div className={styles.segmentControl}>
              <button 
                className={`${styles.segmentBtn} ${filtro === 'todas' ? styles.segmentBtnAtivo : ''}`}
                onClick={() => setFiltro('todas')}
              >
                Todas
              </button>
              <button 
                className={`${styles.segmentBtn} ${filtro === 'receitas' ? styles.segmentBtnAtivo : ''}`}
                onClick={() => setFiltro('receitas')}
              >
                Receitas
              </button>
              <button 
                className={`${styles.segmentBtn} ${filtro === 'despesas' ? styles.segmentBtnAtivo : ''}`}
                onClick={() => setFiltro('despesas')}
              >
                Despesas
              </button>
            </div>
          </div>

          {/* Componente Reutilizado de Tabela/Lista */}
          <TransactionTable 
            transacoes={transacoesFiltradas} 
            categorias={categorias} 
            carregando={carregando} 
            onDelete={handleItemApagado}
            onEdit={abrirModalEditar}
          />
          
        </div>
      </main>
    </div>
  );
}
