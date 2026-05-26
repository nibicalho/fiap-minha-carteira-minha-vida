import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{
      minHeight: '100svh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      background: '#F5F7FA',
      fontFamily: "'Inter', system-ui, sans-serif",
      color: '#2F4858',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <span style={{ fontSize: '4rem' }}>🗺️</span>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>404 — Página não encontrada</h1>
      <p style={{ color: '#6c757d', margin: 0 }}>A rota acessada não existe.</p>
      <Link
        to="/"
        style={{
          marginTop: '0.5rem',
          background: '#2F4858',
          color: '#fff',
          padding: '0.65rem 1.75rem',
          borderRadius: '10px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          transition: 'background 0.2s',
        }}
      >
        Voltar ao início
      </Link>
    </div>
  );
}

export default NotFound;
