"use client";
import { useTranslations } from 'next-intl';
import styles from './support.module.css';

export default function Support() {
    const t = useTranslations();
    
    return (
        <div className={styles.container}>
            <h1>{t("support")}</h1>
            {/* Components will be added here later */}
        </div>
    );
}
