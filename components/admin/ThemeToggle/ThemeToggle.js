// components/ThemeToggle.js
"use client";

import { useAdminTheme } from "@/app/app/admin/AdminThemeContext";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useAdminTheme();

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className={`${styles.toggleWrapper} ${isDark ? styles.darkMode : styles.lightMode}`}
    >
      <div
        className={`${styles.toggleCircle} ${isDark ? styles.dark : styles.light}`}
      >
        <span className={styles.icon}>{isDark ? "🌙" : "☀️"}</span>
      </div>
    </button>
  );
}
