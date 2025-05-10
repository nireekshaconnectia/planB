"use client";
import { useTranslations } from 'next-intl';
import styles from './items.module.css';

export default function MenuItems() {
    const t = useTranslations();
    
    return (
        <div className={styles.container}>
            <h1>{t("menu-items")}</h1>
            {/* Components will be added here later */}
        </div>
    );
}
