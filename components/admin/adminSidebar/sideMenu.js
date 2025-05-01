import React from 'react';
import styles from './sidemenu.module.css';
import { useRouter } from 'next/navigation';
import { useTranslations } from "next-intl";
import { useLogout } from '@/lib/hooks/useLogout';
// Icons
import { 
    MdDashboard, 
    MdOutlineSupportAgent,
    MdOutlineRestaurantMenu,
    MdOutlineMeetingRoom,
    MdOutlineSettings,
    MdOutlinePeople,
    MdOutlineCategory,
    MdOutlineFastfood
} from "react-icons/md";
import { IoExit } from "react-icons/io5";
import { FaClipboardList, FaUsers } from "react-icons/fa";

export default function SideMenu({ onClose }) {
    const router = useRouter();
    const t = useTranslations();
    const handleLogout = useLogout();

    const handleMenuClick = (path) => {
        router.push(path);
        if (onClose) onClose();
    };

    return (
        <div className={styles.sideMenu}>
            <div className={styles.logo}>Plan B Cafe</div>
            <div className={styles.menuItem}>
                <p>{t('hello')},<br /><span className={styles.userName}>{t('user')}</span></p>
                <ul className={styles.menuList}>
                    <li onClick={() => handleMenuClick("/admin/dashboard")}>
                        <div><MdDashboard /> {t('Dashboard')}</div>
                    </li>
                    <li onClick={() => handleMenuClick("/admin/menu/categories")}>
                        <div><MdOutlineCategory /> {t('Categories')}</div>
                    </li>
                    <li onClick={() => handleMenuClick("/admin/menu/items")}>
                        <div><MdOutlineFastfood /> {t('Menu Items')}</div>
                    </li>
                    <li onClick={() => handleMenuClick("/admin/study-rooms")}>
                        <div><MdOutlineMeetingRoom /> {t('Study Rooms')}</div>
                    </li>
                    <li onClick={() => handleMenuClick("/admin/orders")}>
                        <div><FaClipboardList /> {t('Orders')}</div>
                    </li>
                    <li onClick={() => handleMenuClick("/admin/customers")}>
                        <div><FaUsers /> {t('Customers')}</div>
                    </li>
                    <li onClick={() => handleMenuClick("/admin/settings")}>
                        <div><MdOutlineSettings /> {t('Settings')}</div>
                    </li>
                    <li onClick={() => handleMenuClick("/admin/support")}>
                        <div><MdOutlineSupportAgent /> {t('Support')}</div>
                    </li>
                </ul>
            </div>
            <div className={styles.logout}>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    <IoExit /> {t('Logout')}
                </button>
            </div>
        </div>
    );
}
