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
  const [selectedOptional, setSelectedOptional] = useState([]); // ✅ Array for multi-select
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

  // ✅ Toggle selection (multi-select supported)
  const toggleOptional = (item) => {
    setSelectedOptional((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item) // Deselect if already selected
        : [...prev, item] // Add if not selected
    );
  };

  // ✅ Save selections and go next
  const handleContinue = () => {
    console.log('📋 CateringMenu - Selected Optional Items:', selectedOptional);
    localStorage.setItem('selectedMenuItems', JSON.stringify(selectedOptional));
    console.log('💾 CateringMenu - Saved to localStorage:', JSON.parse(localStorage.getItem('selectedMenuItems')));
    onNextStep();
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
                selectedOptional.includes(item) ? styles.selected : ''
              }`} // ✅ Highlight fix
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
