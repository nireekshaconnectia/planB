"use client";
import { useTranslations } from 'next-intl';
import styles from './settings.module.css';

export default function Settings() {
    const t = useTranslations();
    
    return (
        <div className={styles.container}>
            <h1>{t("settings")}</h1>
            {/* Components will be added here later */}
        </div>
    );
}
