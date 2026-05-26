import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import api from '../services/api';
import styles from './Categorias.module.css';

export default function Categorias() {
  const navigate = useNavigate();
  const [usuario] = useState(() => {
    const raw = sessionStorage.getItem('usuarioLogado');
    return raw ? JSON.parse(raw) : null;
  });
  const [menuAberto, setMenuAberto] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [formData, setFormData] = useState({ nomeCategoria: '', tipoCategoria: 'Despesa' });

  const [filtro, setFiltro] = useState('TODAS');
  const [sortField, setSortField] = useState('nome');
  const [sortDirection, setSortDirection] = useState('asc');

  const carregarCategorias = async (user) => {
    const id = user.idUsuario || user.id;
    try {
      const res = await api.get(`/categorias/usuario/${id}`);
      const sortedData = res.data.sort((a, b) => 
        (a.nomeCategoria || '').localeCompare(b.nomeCategoria || '', 'pt-BR')
      );
      setCategorias(sortedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!usuario) {
      navigate('/');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarCategorias(usuario);
  }, [navigate, usuario]);

  const handleSair = () => {
    sessionStorage.removeItem('usuarioLogado');
    navigate('/');
  };

  const abrirModal = (cat = null) => {
    if (cat) {
      setCategoriaEditando(cat);
      setFormData({ nomeCategoria: cat.nomeCategoria, tipoCategoria: cat.tipoCategoria });
    } else {
      setCategoriaEditando(null);
      setFormData({ nomeCategoria: '', tipoCategoria: 'Despesa' });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setCategoriaEditando(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...formData,
        usuario: { idUsuario: usuario.idUsuario || usuario.id }
      };

      let novasCategorias;
      if (categoriaEditando) {
        await api.put(`/categorias/${categoriaEditando.idCategoria}`, payload);
        novasCategorias = categorias.map(c => 
          c.idCategoria === categoriaEditando.idCategoria ? { ...c, ...formData } : c
        );
      } else {
        const res = await api.post('/categorias', payload);
        novasCategorias = [...categorias, res.data];
      }
      
      novasCategorias.sort((a, b) => 
        (a.nomeCategoria || '').localeCompare(b.nomeCategoria || '', 'pt-BR')
      );
      
      setCategorias(novasCategorias);
      fecharModal();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar categoria.');
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Excluir esta categoria apagará em cascata todas as transações associadas a ela. Tem certeza absoluta?')) return;
    try {
      await api.delete(`/categorias/${id}`);
      carregarCategorias(usuario);
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir categoria.');
    }
  };

  if (!usuario) return null;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const categoriasFiltradas = categorias.filter(c => {
    if (filtro === 'TODAS') return true;
    return (c.tipoCategoria || '').toUpperCase() === filtro;
  });

  const sortedCategorias = [...categoriasFiltradas].sort((a, b) => {
    let valA, valB;
    if (sortField === 'nome') {
      valA = (a.nomeCategoria || '').toLowerCase();
      valB = (b.nomeCategoria || '').toLowerCase();
    } else if (sortField === 'tipo') {
      valA = (a.tipoCategoria || '').toLowerCase();
      valB = (b.tipoCategoria || '').toLowerCase();
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

  return (
    <div className={styles.appShell}>
      <Sidebar 
        usuario={usuario} 
        activePath="/categorias" 
        menuAberto={menuAberto}
        onFechar={() => setMenuAberto(false)}
        onSair={handleSair}
      />

      <main className={styles.mainArea}>
        <TopBar 
          onOpenMenu={() => setMenuAberto(true)}
          showAddButton={true}
          onAddClick={() => abrirModal()}
          addLabel="Nova Categoria"
        />

        <div className={styles.canvas}>
          <div className={styles.header}>
            <div className={styles.titleContainer}>
              <h1 className={styles.titulo}>Gerenciar Categorias</h1>
              <p className={styles.subtitle}>Crie e edite as categorias de suas transações.</p>
            </div>
            
            <div className={styles.filterGroup}>
              <button 
                className={`${styles.filterBtn} ${filtro === 'TODAS' ? styles.filterActive : ''}`}
                onClick={() => setFiltro('TODAS')}
              >
                Todas
              </button>
              <button 
                className={`${styles.filterBtn} ${filtro === 'RECEITA' ? styles.filterActive : ''}`}
                onClick={() => setFiltro('RECEITA')}
              >
                Receitas
              </button>
              <button 
                className={`${styles.filterBtn} ${filtro === 'DESPESA' ? styles.filterActive : ''}`}
                onClick={() => setFiltro('DESPESA')}
              >
                Despesas
              </button>
            </div>
          </div>

          <div className={styles.tableCard}>
            {loading ? (
              <div className={styles.vazio}>Carregando...</div>
            ) : sortedCategorias.length === 0 ? (
              <div className={styles.vazio}>Nenhuma categoria encontrada.</div>
            ) : (
              <div className={styles.wrapper}>
                <div className={styles.tableHeader}>
                  {renderHeader('nome', 'CATEGORIA', styles.colNome)}
                  {renderHeader('tipo', 'TIPO', styles.colTipo)}
                  <div className={styles.colAcoesHeader}>AÇÕES</div>
                </div>

                <div className={styles.tableBody}>
                  {sortedCategorias.map(cat => {
                    const id = cat.idCategoria || cat.id;
                    const isReceita = (cat.tipoCategoria || '').toUpperCase() === 'RECEITA';
                    return (
                      <div className={styles.row} key={id}>
                        <div className={styles.colNome}>
                          <span className={styles.nomeTexto}>{cat.nomeCategoria}</span>
                        </div>
                        <div className={styles.colTipo}>
                          <span className={`${styles.badge} ${isReceita ? styles.badgeReceita : styles.badgeDespesa}`}>
                            {isReceita ? 'Receita' : 'Despesa'}
                          </span>
                        </div>
                        <div className={styles.colAcoes}>
                          <button 
                            className={styles.btnAcao} 
                            onClick={() => abrirModal(cat)} 
                            title="Editar"
                            aria-label="Editar categoria"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                          </button>
                          <button 
                            className={`${styles.btnAcao} ${styles.btnDelete}`} 
                            onClick={() => handleExcluir(id)} 
                            title="Excluir"
                            aria-label="Excluir categoria"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Modal isOpen={modalAberto} onClose={fecharModal} title={categoriaEditando ? 'Editar Categoria' : 'Nova Categoria'}>
        <form onSubmit={handleSalvar} className={styles.form}>
          <div className={styles.segmentControl}>
            <button
              type="button"
              className={`${styles.segmentBtn} ${formData.tipoCategoria === 'Despesa' ? styles.segmentBtnAtivo : ''}`}
              onClick={() => setFormData({ ...formData, tipoCategoria: 'Despesa' })}
            >
              Despesa
            </button>
            <button
              type="button"
              className={`${styles.segmentBtn} ${formData.tipoCategoria === 'Receita' ? styles.segmentBtnAtivo : ''}`}
              onClick={() => setFormData({ ...formData, tipoCategoria: 'Receita' })}
            >
              Receita
            </button>
          </div>

          <Input 
            icon="category"
            placeholder="Nome da categoria"
            name="nomeCategoria" 
            value={formData.nomeCategoria} 
            onChange={handleChange} 
            required 
          />

          <Button type="submit" className={styles.submitBtn}>
            <span className="material-symbols-outlined" aria-hidden="true">check</span>
            {categoriaEditando ? 'Salvar Alterações' : 'Criar Categoria'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
