"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SideMenu from '@/components/admin/adminSidebar/sideMenu';
import ThemeToggle from '@/components/admin/ThemeToggle/ThemeToggle';
import LoginForm from '@/components/admin/components/login/login';
import { AdminThemeProvider } from './AdminThemeContext';
import styles from './adminStyle.module.css';
export default function AdminLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <LoginForm />;
    }

    return (
        <AdminThemeProvider>
            <body className={styles.body}>
                <main>
                    <SideMenu />
                    <ThemeToggle />
                    <div className={styles.adminPanel}>
                        {children}
                    </div>
                </main>
            </body>
        </AdminThemeProvider>
    );
}