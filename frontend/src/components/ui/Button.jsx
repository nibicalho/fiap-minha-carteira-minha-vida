import styles from './Button.module.css';

/**
 * Button — botão primário reutilizável do sistema de design.
 *
 * Props:
 *  - children    {ReactNode} Conteúdo do botão
 *  - type        {string}    Tipo do botão (button | submit | reset)
 *  - onClick     {function}  Handler de clique
 *  - disabled    {boolean}   Estado desabilitado
 *  - loading     {boolean}   Estado de carregamento (exibe spinner + texto)
 *  - loadingText {string}    Texto exibido durante o carregamento
 *  - fullWidth   {boolean}   Se true, o botão ocupa 100% da largura
 *  - variant     {string}    'primary' (padrão) — extensível para futuras variantes
 */
function Button({
  children,
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  loadingText = 'Aguarde...',
  fullWidth = true,
  variant = 'primary',
  className = '',
  ...rest
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        styles.btn,
        styles[variant],
        fullWidth ? styles.fullWidth : '',
        isDisabled ? styles.disabled : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-busy={loading ? 'true' : 'false'}
      {...rest}
    >
      {loading ? (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
