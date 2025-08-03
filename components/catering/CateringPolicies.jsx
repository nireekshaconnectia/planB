'use client';

import styles from './catering.module.css';
import Image from 'next/image';
import { SecondaryButton } from '@/components/buttons/Buttons';

const fallbackPolicies = [
  "Coffee cart must be on Ground floor and in an appropriate setting.",
  "For quality purposes, no cups other than Plan B paper cups can be used.",
  "Our standard service duration is 4 hours, any extra hour will be charged 150 per hour.",
  "Installation of the cart will take up to 30 min which will be excluded from the agreed hours.",
  "Payment of full amount will be taken when checkout.",
  "In case of cancellation within 48 hours from the event, a service charge of 30% will be deducted.",
  "in case of cancellation within 24 hours from the event, the customer will be charged the full amount.",
];

export default function CateringPolicies({ onNextStep }) {
  const handleAccept = () => {
    localStorage.setItem('acceptedPolicies', 'true');
    onNextStep(); // ✅ Go to Step 4 (Booking Form)
  };

  return (
    <section className={styles.container}>
      <ul className={styles.policyList}>
        {fallbackPolicies.map((policy, index) => (
          <li key={index} className={styles.policyItem}>
            <Image
              src="/logo.png"
              alt="Policy Icon"
              width={24}
              height={24}
              className={styles.policyIcon}
            />
            <span>{policy}</span>
          </li>
        ))}
      </ul>
        <p className={styles.note}>
            Please read and accept our policies before proceeding.<br />
            For booking changes or request for customized cups please contact the shop directly.
        </p>
      <SecondaryButton text="I Accept & Continue" onClick={handleAccept} />
    </section>
  );
}
