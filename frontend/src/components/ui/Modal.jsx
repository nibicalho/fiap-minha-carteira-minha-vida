import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

/**
 * Modal Genérico (com overlay escurecido e blur).
 * Usa React Portals para renderizar no <body>.
 *
 * Props:
 * - isOpen {boolean}: controla visibilidade
 * - onClose {function}: callback para fechar
 * - title {string}: título do modal
 * - children {ReactNode}: conteúdo
 */
export default function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);

  // Fecha ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // trava scroll
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Fecha ao clicar fora do modal
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className={styles.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modalContainer} ref={modalRef}>
        <header className={styles.header}>
          <h2 id="modal-title" className={styles.title}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar modal">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
