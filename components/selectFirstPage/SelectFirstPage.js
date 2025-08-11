"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SelectFirstPage.module.css";
import DeliveryOptions from "@/components/DeliveryOptions/DeliveryOptions";
import { useTranslations } from "next-intl";
import Image from 'next/image';
import LanguageModal from "@/components/languagemodal/languagemodal";
import { useSelector } from "react-redux";
import { TbWorld } from "react-icons/tb";
import { FaCaretDown } from "react-icons/fa";

const SelectFirstPage = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const [showLangPopup, setShowLangPopup] = useState(false);
  const t = useTranslations(); // ✅ Initialize translations here
  const selectedLang = useSelector((state) => state.language.lang) || "en";

  const languageMap = {
    en: "English",
    ar: "العربية",
  };

  const location = () => window.open("https://maps.app.goo.gl/aSjhu1mveHaVqtKq5", "_blank");
  const loyalty = () => window.open("https://loyalty.is/j3aifc", "_blank");

  const handleSelect = (option) => {
    if (option === "menu") {
      onClose();
      router.push("/");
    } else if (option === "study-room") {
      onClose();
      router.push("/study-room");
    }
    else if (option === "catering") {
      onClose();
      router.push("/catering");
    }
  };

  if (!isOpen) return null;
  

  return (
    <>
      <div className={styles.langModal}>
        <div className={styles.modalHead}>
          
          <div className={styles.logoContainer}>
            <Image
              src="/logo.png"
              alt="Site Logo"
              className="logo-image m-auto"
              width={100}
              height={100}
            />
          </div>
          <div className={styles.modalTitle}>PLAN B<div> coffee</div></div>
          <div className={styles.langTopBar}>
            <div
              className={styles.languageSwitcher}
              onClick={() => setShowLangPopup(true)}
              aria-label="Change language"
              role="button"
              tabIndex="0"
            >
              <TbWorld />
              <p className={styles.languageText}>{languageMap[selectedLang]}</p>
              <FaCaretDown />
            </div>
            <LanguageModal showLpopup={showLangPopup} closeLpopup={() => setShowLangPopup(false)} />
          </div>
        </div>
        <ul className={styles.languageList}>
          {/* <li onClick={() => handleSelect("menu")}>
            {t("menu")}
          </li> */}
          <li onClick={() => handleSelect("catering")}>
            {t("catering")}
          </li>
          <li onClick={() => handleSelect("study-room")}>
            {t("study-room")}
          </li>
          <li onClick={location}>{t("location")}</li>
          <li onClick={loyalty}>{t("loyalty card")}</li>
          <li onClick={() => setShowDeliveryPopup(true)} style={{ cursor: "pointer" }}>{t("delivery platforms")}</li>
        </ul>
        
      </div>
      
      <DeliveryOptions
        showDPopup={showDeliveryPopup}
        closeDPopup={() => setShowDeliveryPopup(false)}
      />
    </>
  );
};

export default SelectFirstPage;