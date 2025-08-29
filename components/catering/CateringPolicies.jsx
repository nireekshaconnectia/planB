'use client';

import styles from './catering.module.css';
import Image from 'next/image';
import { SecondaryButton } from '@/components/buttons/Buttons';
import { useTranslations } from 'next-intl';

const fallbackPolicies = [
  "policy1",
  "policy2",
  "policy3",
  "policy4",
  "policy5",
  "policy6",
  "policy7"
];

export default function CateringPolicies({ onNextStep }) {
  const handleAccept = () => {
    localStorage.setItem('acceptedPolicies', 'true');
    onNextStep(); // ✅ Go to Step 4 (Booking Form)
  };
  const t = useTranslations();

  return (
    <section className={styles.container}>
      <ul className={styles.policyList}>
        {fallbackPolicies.map((policy, index) => (
          <li key={index} className={styles.policyItem}>
            <Image
              src="/option.png"
              alt="Policy Icon"
              width={34}
              height={34}
              style={{borderRadius: '200px'}}
              className={styles.policyIcon}
            />
            <span>{t(`policies.${policy}`)}</span>
          </li>
        ))}
      </ul>
        <p className={styles.note}>
            {t("policies.accept")}<br />
            {t("policies.terms")}
        </p>
      <SecondaryButton text={t("policies.iaccept")} onClick={handleAccept} />
    </section>
  );
}
