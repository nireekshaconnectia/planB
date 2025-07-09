import styles from "../field.module.css";
export const InputWrapper = ({ label, error, children }) => (
  <div className="form-group">
    {label && <label className={styles.label}>{label}</label>}
    {children}
    {error && <span className="error">{error}</span>}
  </div>
);
