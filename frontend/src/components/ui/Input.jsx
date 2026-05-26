import { forwardRef } from 'react';
import styles from './Input.module.css';

/**
 * Input — componente reutilizável para campos de formulário.
 *
 * Props:
 *  - id          {string}    ID único para acessibilidade
 *  - label       {string}    Texto do label (visualmente oculto, para screen-readers)
 *  - type        {string}    Tipo do input (text, email, password…)
 *  - placeholder {string}    Placeholder exibido no campo
 *  - value       {string}    Valor controlado
 *  - onChange    {function}  Handler de mudança
 *  - leftIcon    {ReactNode} Ícone exibido à esquerda dentro do campo
 *  - rightAction {ReactNode} Elemento interativo à direita (ex: botão olho)
 *  - error       {string}    Mensagem de erro associada ao campo
 *  - required    {boolean}   Marca o campo como obrigatório
 *  - autoComplete{string}    Valor do atributo autocomplete
 */
const Input = forwardRef(function Input(
  {
    id,
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    leftIcon,
    rightAction,
    error,
    required = false,
    autoComplete,
    ...rest
  },
  ref
) {
  return (
    <div className={styles.wrapper}>
      {/* Label visualmente oculto — essencial para acessibilidade */}
      {label && (
        <label htmlFor={id} className={styles.srOnly}>
          {label}
        </label>
      )}

      <div className={`${styles.inputRow} ${error ? styles.inputRowError : ''}`}>
        {/* Ícone esquerdo */}
        {leftIcon && (
          <span className={styles.leftIcon} aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className={`${styles.input} ${leftIcon ? styles.inputWithLeft : ''} ${rightAction ? styles.inputWithRight : ''}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />

        {/* Ação direita (ex: toggle de visibilidade da senha) */}
        {rightAction && (
          <span className={styles.rightAction}>
            {rightAction}
          </span>
        )}
      </div>

      {/* Mensagem de erro inline por campo */}
      {error && (
        <p id={`${id}-error`} className={styles.errorMsg} role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
