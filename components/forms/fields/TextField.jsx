import { InputWrapper } from '../ui/InputWrapper';
import { TextInput } from '../ui/TextInput';
import styles from "../field.module.css";
export const TextField = ({ label, value, onChange, error, ...props }) => (
  <InputWrapper label={label} error={error}>
    <TextInput
      type="text"
      value={value}
      onChange={onChange}
      placeholder={label}
      className={styles.textInput}
      {...props}
    />
  </InputWrapper>
);
