import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import styles from './Cadastro.module.css';

/* ── Ícones SVG inline ── */
const IconWallet = ({ size = 32 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
);

const IconPerson = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

const IconEmail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
  </svg>
);

const IconEyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75C21.27 7.11 17 4 12 4c-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 6.63 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
  </svg>
);

const IconEyeOn = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

const IconBack = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

const IconCheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

function Cadastro() {
  const navigate = useNavigate();

  /* ── Estado do formulário ── */
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail]             = useState('');
  const [senha, setSenha]             = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  /* ── Visibilidade das senhas ── */
  const [senhaVisivel, setSenhaVisivel]               = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);

  /* ── Feedback de UI ── */
  const [carregando, setCarregando] = useState(false);
  const [erroGeral, setErroGeral]   = useState('');
  const [sucesso, setSucesso]       = useState(false);

  /* ── Validação client-side antes do POST ── */
  const validar = () => {
    if (!nomeCompleto.trim()) return 'O nome completo é obrigatório.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return 'Informe um e-mail válido.';
    if (senha.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
    if (senha !== confirmarSenha) return 'As senhas não coincidem.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroGeral('');

    const erroValidacao = validar();
    if (erroValidacao) {
      setErroGeral(erroValidacao);
      return;
    }

    setCarregando(true);
    try {
      await api.post('/usuarios', {
        nomeCompleto: nomeCompleto.trim(),
        email: email.trim(),
        senha,
      });

      /* Sucesso: exibe feedback e redireciona para Login após 1,8 s */
      setSucesso(true);
      setTimeout(() => navigate('/'), 1800);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409 || status === 400) {
        setErroGeral('Este e-mail já está cadastrado. Tente fazer login.');
      } else {
        setErroGeral('Não foi possível criar a conta. Verifique se o servidor está ativo.');
      }
    } finally {
      setCarregando(false);
    }
  };

  /* ── Botões de toggle de senha ── */
  const toggleSenhaBtn = (visivel, setVisivel) => (
    <button
      type="button"
      className={styles.toggleBtn}
      onClick={() => setVisivel((v) => !v)}
      aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
      tabIndex="-1"
    >
      {visivel ? <IconEyeOn /> : <IconEyeOff />}
    </button>
  );

  return (
    <div className={styles.pageWrapper}>

      {/* ════════════════════════════════════════
          PAINEL ESQUERDO — Marca (só desktop)
          ════════════════════════════════════════ */}
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

      {/* ════════════════════════════════════════
          PAINEL DIREITO — Formulário
          ════════════════════════════════════════ */}
      <main className={styles.formPanel}>

        {/* ── Cabeçalho mobile (oculto no desktop) ── */}
        <header className={styles.mobileHeader} aria-label="Cabeçalho mobile">
          {/* Blobs decorativos */}
          <div className={styles.mobileHeaderBlob1} aria-hidden="true" />
          <div className={styles.mobileHeaderBlob2} aria-hidden="true" />

          {/* Botão voltar */}
          <Link to="/" className={styles.backBtn} aria-label="Voltar para o login">
            <IconBack />
          </Link>

          {/* Logo */}
          <div className={styles.mobileLogoArea}>
            <div className={styles.mobileIconBox} aria-hidden="true">
              <IconWallet size={28} />
            </div>
            <h1 className={styles.mobileBrandTitle}>Minha Carteira</h1>
          </div>
        </header>

        {/* ── Seção do formulário ── */}
        <section className={styles.formSection}>
          <div className={styles.formHeading}>
            {/* No mobile o heading fica centralizado; no desktop alinhado à esquerda */}
            <h2 className={styles.formTitle}>Criar sua conta</h2>
            <p className={styles.formSubtitle}>Preencha os dados abaixo para começar.</p>
          </div>

          {/* Toast de sucesso */}
          {sucesso && (
            <div className={styles.successAlert} role="status" aria-live="polite">
              <IconCheckCircle />
              <span>Conta criada! Redirecionando para o login…</span>
            </div>
          )}

          {/* Alerta de erro geral */}
          {erroGeral && (
            <div className={styles.erroAlert} role="alert" aria-live="assertive">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span>{erroGeral}</span>
            </div>
          )}

          <form
            id="cadastro-form"
            onSubmit={handleSubmit}
            className={styles.form}
            noValidate
          >
            {/* Nome Completo */}
            <Input
              id="cadastro-nome"
              label="Nome Completo"
              type="text"
              placeholder="Nome Completo"
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              leftIcon={<IconPerson />}
              required
              autoComplete="name"
              maxLength={255}
            />

            {/* E-mail */}
            <Input
              id="cadastro-email"
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

            {/* Senha */}
            <Input
              id="cadastro-senha"
              label="Senha"
              type={senhaVisivel ? 'text' : 'password'}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              leftIcon={<IconLock />}
              rightAction={toggleSenhaBtn(senhaVisivel, setSenhaVisivel)}
              required
              autoComplete="new-password"
              maxLength={255}
            />

            {/* Confirmar Senha */}
            <Input
              id="cadastro-confirmar-senha"
              label="Confirmar Senha"
              type={confirmarSenhaVisivel ? 'text' : 'password'}
              placeholder="Confirmar Senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              leftIcon={<IconLock />}
              rightAction={toggleSenhaBtn(confirmarSenhaVisivel, setConfirmarSenhaVisivel)}
              required
              autoComplete="new-password"
              maxLength={255}
            />

            {/* Botão de submissão */}
            <div className={styles.submitWrapper}>
              <Button
                type="submit"
                loading={carregando}
                loadingText="Criando conta…"
                fullWidth
                disabled={sucesso}
              >
                Criar Conta
              </Button>
            </div>
          </form>

          {/* Link de voltar ao login */}
          <div className={styles.formFooter}>
            <p className={styles.formFooterText}>
              Já tem uma conta?{' '}
              <Link to="/" className={styles.formFooterLink}>
                Entrar
              </Link>
            </p>
          </div>


        </section>
      </main>
    </div>
  );
}

export default Cadastro;
