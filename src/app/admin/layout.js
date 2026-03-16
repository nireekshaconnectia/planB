"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SideMenu from '@/components/admin/adminSidebar/sideMenu';
import ThemeToggle from '@/components/admin/ThemeToggle/ThemeToggle';
import LoginForm from '@/components/admin/components/login/login';
import { AdminThemeProvider } from './AdminThemeContext';
import styles from './adminStyle.module.css';

export default function AdminLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const t = useTranslations();

    useEffect(() => {
        if (status === 'loading') {
            return;
        }

        if (status === 'unauthenticated' || !session?.user?.token) {
            router.push('/admin');
        }
    }, [status, session, router]);

    if (status === 'loading') {
        return <div>{t("loading")}</div>;
    }

    if (!session?.user?.token) {
        return <LoginForm />;
    }

    return (
        <AdminThemeProvider>
            <div className={styles.body}>
                <main>
                    <SideMenu />
                    <ThemeToggle />
                    <div className={styles.adminPanel}>
                        {children}
                    </div>
                </main>
            </div>
        </AdminThemeProvider>
    );
}