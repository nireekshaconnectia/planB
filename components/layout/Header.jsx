"use client";
import { useState } from "react";
import styles from "./Header.module.css";
import Image from 'next/image';
import { useSelector } from "react-redux";
import { TbWorld } from "react-icons/tb";
import { FaCaretDown, FaArrowLeft } from "react-icons/fa"; // Added FaArrowLeft
import { usePathname, useRouter } from "next/navigation"; // Added hooks
import LanguageModal from "@/components/languagemodal/languagemodal";

const Header = () => {
  const [showLangPopup, setShowLangPopup] = useState(false);
  const selectedLang = useSelector((state) => state.language.lang) || "en";
  
  const pathname = usePathname(); // Get current route
  const router = useRouter(); // For navigation

  const languageMap = {
    en: "English",
    ar: "العربية",
  };

  // Check if we are NOT on the homepage
  const isNotHomePage = pathname !== "/";

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          {isNotHomePage && (
            <button 
              className={styles.backButton} 
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <FaArrowLeft size={20} />
            </button>
          )}
        </div>

        <div className={styles.brandSection}>
          <div className={styles.logoContainer}>
            <Image
              src="/logo.png"
              alt="Site Logo"
              width={120}
              height={120}
              className={styles.logoImage}
            />
          </div>
          <div className={styles.brandText}>
            <span className={styles.mainTitle}>PLAN B</span>
            <span className={styles.subTitle}>Speciality coffee</span>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div
            className={styles.languageSwitcher}
            onClick={() => setShowLangPopup(true)}
            aria-label="Change language"
            role="button"
            tabIndex={0}
          >
            <TbWorld size={20} />
            <p className={styles.languageText}>{languageMap[selectedLang]}</p>
            <FaCaretDown />
          </div>
          <LanguageModal 
            showLpopup={showLangPopup} 
            closeLpopup={() => setShowLangPopup(false)} 
          />
        </div>
      </div>
    </header>
  );
};

export default Header;