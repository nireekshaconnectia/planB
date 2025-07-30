'use client';

import styles from './catering.module.css';
import Image from 'next/image';
import { SecondaryButton } from '@/components/buttons/Buttons';

const fallbackPolicies = [
  "Coffee cart must be on Ground floor and in an appropriate setting.",
  "For quality purposes, no cups other than Plan B paper cups can be used.",
  "Our standard service duration is 4 hours, any extra hour will be charged 150 per hour.",
  "Installation of the cart will take up to 30 min which will be excluded from the agreed hours.",
  "Payment of full amount must be paid if reservation was made within 48hrs from the expected date of the event, through “skip cash”.",
  "In case of cancelation up to two days before the event, a service charge of 30% will be deducted.",
  "Delivery charge is 150QR for inside Doha & 200QR outside Doha.",
];

export default function CateringPolicies({ onNextStep }) {
  const handleAccept = () => {
    localStorage.setItem('acceptedPolicies', 'true');
    onNextStep(); // ✅ Go to Step 4 (Booking Form)
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.heading}>Catering Policies</h2>
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
            Please read and accept our policies before proceeding.
        </p>
      <SecondaryButton text="I Accept & Continue" onClick={handleAccept} />
    </section>
  );
}
