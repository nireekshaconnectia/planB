"use client";
import { useTranslations } from 'next-intl';
import styles from './customers.module.css';

export default function Customers() {
    const t = useTranslations();
    
    return (
        <div className={styles.container}>
            <h1>{t("customers")}</h1>
            {/* Components will be added here later */}
        </div>
    );
}
