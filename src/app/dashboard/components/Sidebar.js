// app/dashboard/components/Sidebar.js
"use client";

import { FaUserCircle, FaCalendarAlt, FaUtensils, FaSignOutAlt } from "react-icons/fa";
import styles from "../dashboard.module.css";

const Sidebar = ({ user, activeTab, onTabChange, onSignOut }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.userAvatar}>
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className={styles.avatarImage} />
        ) : (
          <FaUserCircle className={styles.avatarIcon} />
        )}
        <h3 className={styles.userName}>{user.name || user.email}</h3>
        <p className={styles.userEmail}>{user.email}</p>
      </div>

      <nav className={styles.sidebarNav}>
        <button
          className={`${styles.navButton} ${activeTab === "profile" ? styles.activeNav : ""}`}
          onClick={() => onTabChange("profile")}
        >
          <FaUserCircle />
          <span>Profile</span>
        </button>
        <button
          className={`${styles.navButton} ${activeTab === "bookings" ? styles.activeNav : ""}`}
          onClick={() => onTabChange("bookings")}
        >
          <FaCalendarAlt />
          <span>Room Bookings</span>
        </button>
        <button
          className={`${styles.navButton} ${activeTab === "catering" ? styles.activeNav : ""}`}
          onClick={() => onTabChange("catering")}
        >
          <FaUtensils />
          <span>Catering Orders</span>
        </button>
      </nav>

      <button className={styles.signOutButton} onClick={onSignOut}>
        <FaSignOutAlt />
        <span>Sign Out</span>
      </button>
    </aside>
  );
};

export default Sidebar;