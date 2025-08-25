'use client';

import { useEffect, useState } from 'react';
import styles from './catering.module.css';
import { SecondaryButton } from '@/components/buttons/Buttons';
import { useTranslations } from 'next-intl';

const fallbackData = {
  mainItems: [
    'B signature',
    'Espresso',
    'Spanish latte',
    'Americano',
    'Tiramisu latte',
    'Cappuccino',
    'Matcha latte',
    'Flat white',
  ],
  optionalItems: ['Passion iced tea', 'Acai lemonade', 'Hot chocolate'],
};

export default function CateringMenu({ onNextStep }) {
  const [menu, setMenu] = useState({ mainItems: [], optionalItems: [] });
  const [selectedOptional, setSelectedOptional] = useState(null); // 👈 single value
  const t = useTranslations();

  useEffect(() => {
    fetch('/api/catering-menu')
      .then((res) => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then((data) => setMenu(data))
      .catch(() => setMenu(fallbackData));
  }, []);

  const toggleOptional = (item) => {
    setSelectedOptional((prev) => (prev === item ? null : item)); 
    // 👆 same item select → deselect, otherwise select new one
  };

  const handleContinue = () => {
    localStorage.setItem(
      'selectedMenuItems',
      JSON.stringify(selectedOptional ? [selectedOptional] : []) // 👈 save as array for consistency
    );
    onNextStep(); // 👉 Move to next step (policies)
  };

  return (
    <section className={styles.container}>
      <ul className={styles.menuGrid}>
        {menu.mainItems.map((item, idx) => (
          <li className={styles.menuListItem} key={idx}>
            {t(item)}
          </li>
        ))}
      </ul>

      <div className={styles.optionalSection}>
        <h3>{t('optional')}</h3>
        <hr />
        <ul className={styles.optionalList}>
          {menu.optionalItems.map((item, idx) => (
            <li
              key={idx}
              className={`${styles.menuListItem} ${
                selectedOptional === item ? styles.selected : ''
              }`}
              onClick={() => toggleOptional(item)}
            >
              {t(item)}
            </li>
          ))}
        </ul>
      </div>

      <SecondaryButton text={t('book-now')} onClick={handleContinue} />
    </section>
  );
}
