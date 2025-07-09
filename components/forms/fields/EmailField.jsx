import { InputWrapper } from '../ui/InputWrapper';
import { TextInput } from '../ui/TextInput';

export const EmailField = ({ value, onChange, error }) => (
  <InputWrapper label="Email" error={error}>
    <TextInput
      type="email"
      placeholder="your@email.com"
      value={value}
      onChange={onChange}
    />
  </InputWrapper>
);
