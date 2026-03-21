"use client";
import { useEffect, useState } from 'react';
import styles from './catering.module.css';
import { SecondaryButton } from '@/components/buttons/Buttons';
import { useTranslations } from 'next-intl';
import Header from '../layout/Header';
import Image from 'next/image';

const fallbackPolicies = ["policy1", "policy2", "policy3", "policy4", "policy5", "policy6", "policy7"];

export default function CateringMenu({ onNextStep }) {
  const [menu, setMenu] = useState({ mainItems: [], optionalItems: [] });
  const [selectedOptional, setSelectedOptional] = useState([]);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
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
    if (!acceptedPolicies) {
      alert(t('accept_policies_warning') || 'Please accept policies to continue');
      return;
    }
    localStorage.setItem('selectedMenuItems', JSON.stringify(selectedOptional));
    localStorage.setItem('acceptedPolicies', 'true');
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

      {/* Policies Note Card */}
      <div className={styles.noteCard}>
        <h3 className={styles.noteTitle}>{t("policies.title")}</h3>
        <ul className={styles.policyList}>
          {fallbackPolicies.map((policy, index) => (
            <li key={index} className={styles.policyItem}>
              <div className={styles.policyIconWrapper}>
                 <Image src="/option.png" alt="icon" width={18} height={18} />
              </div>
              <span>{t(`policies.${policy}`)}</span>
            </li>
          ))}
        </ul>

        <div className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            id="acceptPolicy"
            checked={acceptedPolicies}
            onChange={(e) => setAcceptedPolicies(e.target.checked)}
            className={styles.hiddenCheckbox}
          />
          <label htmlFor="acceptPolicy" className={styles.customCheckboxLabel}>
            <div className={`${styles.checkboxBox} ${acceptedPolicies ? styles.checked : ''}`}>
                {acceptedPolicies && "✓"}
            </div>
            <span>{t("policies.iaccept")}</span>
          </label>
        </div>
      </div>

      <div className={styles.bottomAction}>
        <SecondaryButton
          text={t('book-now')}
          onClick={handleContinue}
          disabled={!acceptedPolicies}
          style={{ width: "100%", maxWidth: "500px" }}
        />
      </div>
    </section>
  );
}