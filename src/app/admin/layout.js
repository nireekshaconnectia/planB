"use client";
import styles from "./adminStyle.module.css";
import SideMenu from "@/components/admin/adminSidebar/sideMenu"
import { AdminThemeProvider } from "./AdminThemeContext";
import ThemeToggle from "@/components/admin/ThemeToggle/ThemeToggle";
export default function AdminLayout({ children }) {
    return (
        <html>
            <AdminThemeProvider>
            <body className={styles.body}>
                    <main><SideMenu /><div className={styles.adminPanel}>{children}</div>
                        <ThemeToggle />
                    </main>
                
            </body>
            </AdminThemeProvider>
        </html>
    );
}