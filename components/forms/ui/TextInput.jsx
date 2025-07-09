
export const TextInput = ({ value, onChange, placeholder, ...props }) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    {...props}
  />
);
