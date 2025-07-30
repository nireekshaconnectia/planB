// components/Buttons.jsx

import styles from './buttons.module.css';

export function PrimaryButton({ text, onClick, type = 'button' }) {
  return (
    <button type={type} className={styles.primary} onClick={onClick}>
      {text}
    </button>
  );
}

export function SecondaryButton({ text, onClick, type = 'button' }) {
  return (
    <button type={type} className={styles.secondary} onClick={onClick}>
      {text}
    </button>
  );
}

export function PrimarySmButton({ text, onClick, type = 'button' }) {
  return (
    <button type={type} className={styles.primarySm} onClick={onClick}>
      {text}
    </button>
  );
}
