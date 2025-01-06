import React from 'react';
import styles from './CountryCodeSelector.module.css';

const CountryCodeSelector = ({ countryCode, onChange }) => {
  return (
    <select 
      value={countryCode} 
      onChange={onChange}
      className={styles.countryCodeSelector}
    >
      <option value="+91">+91 India</option>
      <option value="+1">+1 USA</option>
      <option value="+44">+44 UK</option>
      {/* Add more country codes as needed */}
    </select>
  );
};

export default CountryCodeSelector;
