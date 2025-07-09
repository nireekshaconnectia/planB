import { useState } from 'react';

export const usePhoneField = (initialCode = '+91') => {
  const [countryCode, setCountryCode] = useState(initialCode);
  const [phoneNumber, setPhoneNumber] = useState('');

  return {
    countryCode,
    setCountryCode,
    phoneNumber,
    setPhoneNumber,
  };
};
