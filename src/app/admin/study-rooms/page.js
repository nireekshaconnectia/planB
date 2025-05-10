"use client";
import { useTranslations } from 'next-intl';
import styles from './studyRooms.module.css';

export default function StudyRooms() {
    const t = useTranslations();
    
    return (
        <div className={styles.container}>
            <h1>{t("study-rooms")}</h1>
            {/* Components will be added here later */}
        </div>
    );
}
