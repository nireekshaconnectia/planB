"use client";
import { useTranslations } from 'next-intl';
import styles from "./dashboard.module.css";
import DashboardCard from "@/components/admin/dashboardCard/dashboardCard";

export default function Dashboard() {
    const t = useTranslations();
    
    return (
        <div className={styles.dashboardWrapper}>
            <h1 className={styles.title}>{t("dashboard")}</h1>
            <DashboardCard />  
        </div>
    );
}
