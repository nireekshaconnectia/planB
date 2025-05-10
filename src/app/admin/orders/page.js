"use client";
import { useTranslations } from 'next-intl';
import styles from './orders.module.css';

export default function Orders() {
    const t = useTranslations();
    
    return (
        <div className={styles.container}>
            <h1>{t("orders")}</h1>
            {/* Components will be added here later */}
        </div>
    );
}
