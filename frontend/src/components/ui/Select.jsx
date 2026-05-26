import { forwardRef } from 'react';
import styles from './Select.module.css';

/**
 * Componente Select customizado.
 *
 * Props:
 * - icon {string}: Nome do ícone Material Symbols para exibir à esquerda (ex: 'category')
 * - placeholder {string}: Texto placeholder (primeira option desativada)
 * - options {Array}: Array de opções [{ value: '1', label: 'Alimentação' }]
 * - ...props: rest props (value, onChange, name, id, required, etc)
 */
const Select = forwardRef(({ icon, placeholder, options = [], className = '', ...props }, ref) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {icon && (
        <span className={`material-symbols-outlined ${styles.icon}`} aria-hidden="true">
          {icon}
        </span>
      )}
      
      <select
        ref={ref}
        className={`${styles.select} ${icon ? styles.withIcon : ''}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Ícone de chevron customizado para o select */}
      <div className={styles.chevronWrapper} aria-hidden="true">
        <span className="material-symbols-outlined">expand_more</span>
      </div>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
