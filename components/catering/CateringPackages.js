'use client';
import { useEffect, useState } from 'react';
import styles from './catering.module.css';

const fallbackPackages = [
  { persons: 20, price: 700 },
  { persons: 40, price: 1400 },
  { persons: 60, price: 2100 },
  { persons: 80, price: 2800 },
  { persons: 100, price: 3300 },
];

export default function CateringPackages() {
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/catering-packages')
      .then((res) => {
        if (!res.ok) throw new Error('API failed');
        return res.json();
      })
      .then((data) => setPackages(data))
      .catch(() => {
        setError(true);
        setPackages(fallbackPackages);
      });
  }, []);

  return (
    <section className={styles.container}>
      <ul>
        {packages.map((pkg, idx) => (
          <li key={idx}>
            {pkg.persons} Person - {pkg.price} QR
          </li>
        ))}
      </ul>
      
    </section>
  );
}
