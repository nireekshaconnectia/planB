"use client";
import { useEffect, useState } from 'react';
import styles from './catering.module.css';
import { SecondaryButton } from '@/components/buttons/Buttons';
import { useTranslations } from 'next-intl';
import Header from '../layout/Header';

export default function CateringMenu({ onNextStep }) {
  const [menu, setMenu] = useState({ mainItems: [], optionalItems: [] });
  const [selectedOptional, setSelectedOptional] = useState([]);
  const t = useTranslations();

  useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  useEffect(() => {
    fetch('/api/catering-menu')
      .then((res) => res.json())
      .then((data) => setMenu(data))
      .catch(() => setMenu({
        mainItems: ['B signature', 'Espresso', 'Spanish latte', 'Americano', 'Tiramisu latte', 'Cappuccino', 'Matcha latte', 'Flat white'],
        optionalItems: ['Passion iced tea', 'Acai lemonade', 'Hot chocolate']
      }));
  }, []);

  const toggleOptional = (item) => {
    setSelectedOptional((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleContinue = () => {
    
    localStorage.setItem('selectedMenuItems', JSON.stringify(selectedOptional));
    onNextStep();
  };

  return (
    <section className={styles.pageContainer}>
      <Header />
      
      <div className={styles.titleWrapper}>
        <h1 className={styles.mainTitle}>{t("catering_menu")}</h1>
      </div>

      {/* Main Menu - Staggered Pills */}
      <div className={styles.menuGrid}>
        {menu.mainItems.map((item, idx) => (
          <div 
            key={idx} 
            className={styles.menuPillStatic}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            {t(item)}
          </div>
        ))}
      </div>

      {/* Optional Items Section */}
      <div className={styles.sectionDivider}>
        <h3 className={styles.subHeader}>{t('optional')}</h3>
        <div className={styles.optionalGrid}>
          {menu.optionalItems.map((item, idx) => (
            <div
              key={idx}
              className={`${styles.menuPillSelectable} ${selectedOptional.includes(item) ? styles.selectedPill : ''}`}
              onClick={() => toggleOptional(item)}
              style={{ animationDelay: `${(idx + menu.mainItems.length) * 0.05}s` }}
            >
              {t(item)}
              {selectedOptional.includes(item) && <span className={styles.checkBadge}>✓</span>}
            </div>
          ))}
        </div>
      </div>

 
      

      <div className={styles.bottomAction}>
        <SecondaryButton
          text={t('book-now')}
          onClick={handleContinue}
          style={{ width: "100%", maxWidth: "500px" }}
        />
      </div>
    </section>
  );
}