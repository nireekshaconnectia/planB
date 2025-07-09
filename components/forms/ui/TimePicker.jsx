import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const TimePicker = ({ value, onChange, placeholder }) => (
  <DatePicker
    selected={value ? new Date(`1970-01-01T${value}`) : null}
    onChange={(date) => {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      onChange(`${hours}:${minutes}`);
    }}
    showTimeSelect
    showTimeSelectOnly
    timeIntervals={15}
    dateFormat="HH:mm"
    placeholderText={placeholder}
    className="input"
  />
);
