import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import api from '../services/api';
import styles from './Perfil.module.css';

/* ── Ícones SVG inline ── */
const IconPerson = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

export default function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(() => {
    const raw = sessionStorage.getItem('usuarioLogado');
    return raw ? JSON.parse(raw) : null;
  });
  const [menuAberto, setMenuAberto] = useState(false);

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ 
    nomeCompleto: usuario?.nomeCompleto || usuario?.nome || '', 
    email: usuario?.email || '', 
    senha: '' 
  });
  const [loading, setLoading] = useState(false);

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

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({ nomeCompleto: usuario.nomeCompleto || usuario.nome, email: usuario.email, senha: '' });
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAtualizar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const id = usuario.idUsuario || usuario.id;
      const payload = {
        idUsuario: id,
        nomeCompleto: formData.nomeCompleto,
        email: formData.email, 
        senha: formData.senha || usuario.senha
      };
      const response = await api.put(`/usuarios/${id}`, payload);
      const updatedUser = response.data;
      sessionStorage.setItem('usuarioLogado', JSON.stringify(updatedUser));
      setUsuario(updatedUser);
      setIsEditing(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async () => {
    if (!window.confirm('TEM CERTEZA? Esta ação apagará sua conta e TODAS as suas transações de forma irreversível.')) return;
    setLoading(true);
    try {
      const id = usuario.idUsuario || usuario.id;
      await api.delete(`/usuarios/${id}`);
      alert('Conta excluída com sucesso.');
      handleSair();
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir conta.');
      setLoading(false);
    }
  };

  if (!usuario) return null;

  return (
    <div className={styles.appShell}>
      <Sidebar 
        usuario={usuario} 
        activePath="/perfil" 
        menuAberto={menuAberto}
        onFechar={() => setMenuAberto(false)}
        onSair={handleSair}
      />

      <main className={styles.mainArea}>
        <TopBar 
          onOpenMenu={() => setMenuAberto(true)}
          showAddButton={false}
        />

        <div className={styles.canvas}>
          <div className={styles.perfilContainer}>
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitulo}>Dados do Perfil</h2>
                <p className={styles.cardSubtitulo}>Gerencie suas informações pessoais</p>
              </div>
              
              <div className={styles.infoList}>
                {/* Nome - Editável */}
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Nome</span>
                  {!isEditing ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className={styles.infoValue}>
                        {usuario.nomeCompleto || usuario.nome}
                      </span>
                      <button 
                        onClick={handleEditToggle} 
                        className={styles.btnAcao}
                        title="Editar Nome"
                        aria-label="Editar Nome"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleAtualizar} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <Input
                        id="perfil-nome"
                        type="text"
                        name="nomeCompleto"
                        placeholder="Nome Completo"
                        value={formData.nomeCompleto}
                        onChange={handleChange}
                        leftIcon={<IconPerson />}
                        required
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Button 
                          type="button" 
                          variant="text" 
                          onClick={handleEditToggle} 
                          disabled={loading}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={loading} 
                        >
                          {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Email - Somente Leitura */}
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>
                    {usuario.email}
                  </span>
                </div>

                {/* Zona de Perigo - Excluir Conta */}
                <div style={{ marginTop: '0.5rem', borderTop: '1px solid #e7e8eb', paddingTop: '1rem' }}>
                  <Button 
                    variant="text"
                    onClick={handleExcluir} 
                    disabled={loading}
                    fullWidth
                    style={{ color: '#ba1a1a', fontWeight: '600' }}
                  >
                    Excluir Conta
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
