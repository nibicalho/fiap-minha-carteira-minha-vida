import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

/* ── Ícones ── */
const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const IconWallet = ({ filled = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    {filled
      ? <path d="M21 18v1c0 1.1-.9 2-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14c1.1 0 2 .9 2 2v1h-9a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9zm-9-2h10V8H12v8zm4-2.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
      : <path d="M21 18v1c0 1.1-.9 2-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14c1.1 0 2 .9 2 2v1h-9a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9zm-9-2h10V8H12v8zm4-2.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />}
  </svg>
);

const IconPerson = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </svg>
);

const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const IconTag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
  </svg>
);

const IconAdd = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const NAV_ITEMS = [
  { to: '/home',     label: 'Home',       icon: IconHome },
  { to: '/historico', label: 'Transações', icon: IconWallet },
  { to: '/categorias', label: 'Categorias', icon: IconTag },
  { to: '/perfil',   label: 'Perfil',     icon: IconPerson },
];

/**
 * Sidebar — navegação lateral fixa no desktop, gaveta + barra inferior no mobile.
 *
 * Props:
 *  - menuAberto  {boolean}   Controla a gaveta móvel
 *  - onFechar    {function}  Fecha a gaveta
 *  - onSair      {function}  Callback de logout
 *  - onNovoClick {function}  Callback para abrir modal nova transação
 */
function Sidebar({ menuAberto, onFechar, onSair, onNovoClick }) {
  const { pathname } = useLocation();

  /* Fecha a gaveta ao pressionar Esc */
  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') onFechar(); };
    if (menuAberto) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [menuAberto, onFechar]);

  /* Trava o scroll do body quando a gaveta está aberta */
  useEffect(() => {
    document.body.style.overflow = menuAberto ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuAberto]);

  const isAtivo = (to) => pathname === to || (to === '/home' && pathname === '/');

  return (
    <>
      {/* ════════════════════════════════════════
          SIDEBAR DESKTOP — fixa à esquerda
          ════════════════════════════════════════ */}
      <nav className={styles.sidebarDesktop} aria-label="Navegação principal">
        {/* Marca */}
        <div className={styles.marca}>
          <span className={styles.marcaTitulo}>Minha Carteira</span>
          <span className={styles.marcaSub}>Gestão Financeira</span>
        </div>

        {/* Links de navegação */}
        <ul className={styles.navList} role="list">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`${styles.navLink} ${isAtivo(to) ? styles.navLinkAtivo : ''}`}
                aria-current={isAtivo(to) ? 'page' : undefined}
              >
                <Icon filled={isAtivo(to)} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Sair */}
        <div className={styles.sairWrapper}>
          <button className={styles.navLinkBtn} onClick={onSair} type="button">
            <IconLogout />
            <span>Sair</span>
          </button>
        </div>
      </nav>

      {/* ════════════════════════════════════════
          GAVETA MOBILE — slide-in da esquerda
          ════════════════════════════════════════ */}
      {/* Overlay escuro */}
      <div
        className={`${styles.overlay} ${menuAberto ? styles.overlayVisivel : ''}`}
        onClick={onFechar}
        aria-hidden="true"
      />

      {/* Painel da gaveta */}
      <nav
        className={`${styles.gaveta} ${menuAberto ? styles.gavetaAberta : ''}`}
        aria-label="Menu de navegação"
        aria-hidden={!menuAberto}
      >
        <div className={styles.gavetaHeader}>
          <span className={styles.gavetaTitulo}>Menu</span>
          <button
            className={styles.btnFechar}
            onClick={onFechar}
            aria-label="Fechar menu"
            type="button"
          >
            <IconClose />
          </button>
        </div>

        <ul className={styles.gavetaNavList} role="list">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`${styles.gavetaLink} ${isAtivo(to) ? styles.gavetaLinkAtivo : ''}`}
                onClick={onFechar}
                aria-current={isAtivo(to) ? 'page' : undefined}
              >
                <Icon filled={isAtivo(to)} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.gavetaSairWrapper}>
          <button
            className={styles.gavetaLinkBtn}
            onClick={() => { onFechar(); onSair(); }}
            type="button"
          >
            <IconLogout />
            <span>Sair</span>
          </button>
        </div>
      </nav>

      {/* ════════════════════════════════════════
          BARRA INFERIOR MOBILE (Bottom Nav)
          ════════════════════════════════════════ */}
      <nav className={styles.bottomNav} aria-label="Navegação inferior">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const ativo = isAtivo(to);
          return (
            <Link
              key={to}
              to={to}
              className={`${styles.bottomNavItem} ${ativo ? styles.bottomNavItemAtivo : ''}`}
              aria-current={ativo ? 'page' : undefined}
            >
              <div className={`${styles.bottomNavIconBox} ${ativo ? styles.bottomNavIconBoxAtivo : ''}`}>
                <Icon filled={ativo} />
              </div>
              <span className={styles.bottomNavLabel}>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* FAB Mobile — Nova Transação */}
      <button
        type="button"
        className={styles.fab}
        aria-label="Nova Transação"
        title="Nova Transação"
        onClick={onNovoClick}
      >
        <IconAdd />
      </button>
    </>
  );
}

export default Sidebar;
