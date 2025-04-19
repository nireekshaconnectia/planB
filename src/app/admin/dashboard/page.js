"use client";
import styles from "./dashboard.module.css";
import DashboardCard from "@/components/admin/dashboardCard/dashboardCard";

export default function Dashboard() {
    return (
        <div className={styles.dashboardWrapper}>
            <h1 className={styles.title}>Dashboard</h1>
            <DashboardCard />  
        </div>
    );
}
