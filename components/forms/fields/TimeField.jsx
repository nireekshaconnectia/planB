import { TimePicker } from '../ui/TimePicker';
import { InputWrapper } from '../ui/InputWrapper';

export const TimeField = ({ value, onChange, error }) => (
  <InputWrapper label="Start Time" error={error}>
    <TimePicker value={value} onChange={onChange} placeholder="Start time" />
  </InputWrapper>
);
