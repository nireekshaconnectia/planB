'use client';
import React from 'react';
import styles from './support.module.css';

export default function Support() {
  const supportEmail = 'support@example.com';
  const supportPhone = '+1234567890';
  const whatsappNumber = '1234567890'; // in international format without "+"
  const developerEmail = 'developer@example.com';

  return (
    <div className={styles.supportContainer}>
      <div className={styles.buttonGroup}>
        <a href={`mailto:${supportEmail}`} className={styles.supportBtn}>
          📧 Email Support
        </a>
        <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className={styles.supportBtn}>
          💬 WhatsApp
        </a>
        <a href={`tel:${supportPhone}`} className={styles.supportBtn}>
          📞 Call Support
        </a>
        <a href={`mailto:${developerEmail}`} className={styles.supportBtn}>
          👨‍💻 Contact Developer
        </a>
      </div>
    </div>
  );
}
