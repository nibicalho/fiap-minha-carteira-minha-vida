import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import styles from './Login.module.css';

/* ── Ícones SVG inline (sem dependências externas) ── */
const IconEmail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
  </svg>
);

const IconEyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
  </svg>
);

const IconEyeOn = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
);

const IconWallet = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
  </svg>
);

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erroGeral, setErroGeral] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroGeral('');
    setCarregando(true);

    try {
      const { data: usuarios } = await api.get('/usuarios');
      const usuarioEncontrado = usuarios.find(
        (u) => u.email === email && u.senha === senha
      );

      if (usuarioEncontrado) {
        sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
        navigate('/home');
      } else {
        setErroGeral('E-mail ou senha incorretos. Verifique seus dados e tente novamente.');
      }
    } catch {
      setErroGeral('Não foi possível conectar ao servidor. Certifique-se de que o backend está rodando.');
    } finally {
      setCarregando(false);
    }
  };

  /* Botão de toggle de visibilidade da senha */
  const toggleSenhaBtn = (
    <button
      type="button"
      className={styles.toggleSenhaBtn}
      onClick={() => setSenhaVisivel((v) => !v)}
      aria-label={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
      tabIndex="-1"
    >
      {senhaVisivel ? <IconEyeOn /> : <IconEyeOff />}
    </button>
  );

  return (
    <div className={styles.pageWrapper}>
      {/* ══════════════════════════════════════
          LADO ESQUERDO — painel da marca
          Visível apenas em telas ≥ md (768px)
          ══════════════════════════════════════ */}
      <aside className={styles.brandPanel} aria-label="Painel da marca">
        <div className={styles.brandContent}>
          <div className={styles.brandIconBox} aria-hidden="true">
            <IconWallet />
          </div>
          <h1 className={styles.brandTitle}>Minha Carteira Minha Vida</h1>
          <p className={styles.brandSubtitle}>
            Gestão financeira simplificada para o seu dia a dia.<br/>
            Acompanhe, planeje e alcance seus objetivos com clareza<br/>
            e segurança.
          </p>
        </div>
      </aside>

      {/* ══════════════════════════════════════
          LADO DIREITO — área do formulário
          ══════════════════════════════════════ */}
      <main className={styles.formPanel}>
        {/* Blob decorativo no canto superior direito */}
        <div className={styles.formGlowBlob} aria-hidden="true" />

        <div className={styles.formCard}>
          {/* ── Cabeçalho mobile (oculto no desktop) ── */}
          <header className={styles.mobileHeader} aria-label="Marca — mobile">
            <div className={styles.mobileHeaderInner}>
              <div className={styles.mobileIconBox} aria-hidden="true">
                <IconWallet />
              </div>
              <h1 className={styles.mobileBrandTitle}>Minha Carteira</h1>
              <p className={styles.mobileBrandSub}>Gestão Financeira Descomplicada</p>
            </div>
          </header>

          {/* ── Seção do formulário ── */}
          <section className={styles.formSection}>
            <div className={styles.formHeading}>
              <h2 className={styles.formTitle}>Acesse sua conta</h2>
              <p className={styles.formSubtitle}>Bem-vindo de volta! Por favor, insira seus dados.</p>
            </div>

            <form
              id="login-form"
              onSubmit={handleSubmit}
              className={styles.form}
              noValidate
            >
              {/* Campo de e-mail */}
              <Input
                id="login-email"
                label="E-mail"
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<IconEmail />}
                required
                autoComplete="email"
                maxLength={255}
              />

              {/* Campo de senha */}
              <Input
                id="login-senha"
                label="Senha"
                type={senhaVisivel ? 'text' : 'password'}
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                leftIcon={<IconLock />}
                rightAction={toggleSenhaBtn}
                required
                autoComplete="current-password"
                maxLength={255}
              />



              {/* Feedback de erro geral */}
              {erroGeral && (
                <div className={styles.erroAlert} role="alert" aria-live="assertive">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  <span>{erroGeral}</span>
                </div>
              )}

              {/* Botão de submissão */}
              <div className={styles.submitWrapper}>
                <Button
                  type="submit"
                  loading={carregando}
                  loadingText="Entrando..."
                  fullWidth
                >
                  Entrar
                </Button>
              </div>
            </form>

            {/* Rodapé do formulário */}
            <div className={styles.formFooter}>
              <p className={styles.formFooterText}>
                Ainda não tem uma conta?{' '}
                <Link to="/cadastro" className={styles.formFooterLink}>
                  Criar Conta
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Login;
