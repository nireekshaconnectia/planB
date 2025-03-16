import React from 'react';
import styles from './sidemenu.module.css';
import Backdrop from "@/components/backdrop/backdrop";
import { FaUserAlt, FaClipboardList, FaCaretRight } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdPayment, MdOutlineSupportAgent } from "react-icons/md";
import { IoExit } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase"; // Ensure you have Firebase auth initialized

export default function SideMenu({ onClose }) {
  const router = useRouter();

  const handleMenuClick = (path) => {
    router.push(path);
    onClose(); // Close menu after navigation
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign out
      onClose(); // Close menu
      router.push("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <Backdrop onClick={onClose} /> {/* Close menu when clicking on backdrop */}
      <div className={styles.sideMenu}>
        <div className={styles.menuItem}>
          <div>
            <p>Hello,<br /><span className={styles.userName}>User</span> </p>
          </div>
          <ul>
            <li onClick={() => handleMenuClick("/user-details")}>
              <div><FaUserAlt /> Profile </div><FaCaretRight />
            </li>
            <li onClick={() => handleMenuClick("/order-history")}>
              <div><FaClipboardList /> History</div> <FaCaretRight />
            </li>
            <li onClick={() => handleMenuClick("/addresses")}>
              <div><FaLocationDot /> Addresses </div><FaCaretRight />
            </li>
            <li onClick={() => handleMenuClick("/payments")}>
              <div><MdPayment /> Payment methods</div> <FaCaretRight />
            </li>
            <li onClick={() => handleMenuClick("/support")}>
              <div><MdOutlineSupportAgent /> Support</div>  <FaCaretRight />
            </li>
          </ul>
        </div>
        <div className={styles.logout}>
          <button onClick={handleLogout}><IoExit /> Logout</button>
        </div>
      </div>
    </>
  );
}
