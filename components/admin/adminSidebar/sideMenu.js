import React from 'react';
import styles from './sidemenu.module.css';
import { useRouter } from 'next/navigation';
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { useTranslations } from "next-intl";

// Icons
import { MdDashboard, MdOutlineSupportAgent } from "react-icons/md";
import { IoIosCafe, IoIosSettings } from "react-icons/io";
import { IoLibrary, IoExit } from "react-icons/io5";
import { FaClipboardList, FaCaretRight, FaUsers } from "react-icons/fa";

export default function SideMenu({ onClose }) {
  const router = useRouter();
  const t = useTranslations();

  const handleMenuClick = (path) => {
    router.push(path);
    onClose();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className={styles.sideMenu}>
      <div>Plan B Cafe</div>
      <div className={styles.menuItem}>
        <p>{t('hello')},<br /><span className={styles.userName}>{t('user')}</span></p>
        <ul>
          <li onClick={() => handleMenuClick("/dashboard")}>
            <div><MdDashboard /> {t('Dashboard')}</div><FaCaretRight />
          </li>
          <li onClick={() => handleMenuClick("/cafe")}>
            <div><IoIosCafe /> {t('Menu')}</div><FaCaretRight />
          </li>
          <li onClick={() => handleMenuClick("/study-rooms")}>
            <div><IoLibrary /> {t('Study Rooms')}</div><FaCaretRight />
          </li>
          <li onClick={() => handleMenuClick("/order-history")}>
            <div><FaClipboardList /> {t('Orders')}</div><FaCaretRight />
          </li>
          <li onClick={() => handleMenuClick("/customers")}>
            <div><FaUsers /> {t('Customers')}</div><FaCaretRight />
          </li>
          <li onClick={() => handleMenuClick("/settings")}>
            <div><IoIosSettings /> {t('Settings')}</div><FaCaretRight />
          </li>
          <li onClick={() => handleMenuClick("/support")}>
            <div><MdOutlineSupportAgent /> {t('Support')}</div><FaCaretRight />
          </li>
        </ul>
      </div>
      <div className={styles.logout}>
        <button onClick={handleLogout}><IoExit /> {t('Logout')}</button>
      </div>
    </div>
  );
}
