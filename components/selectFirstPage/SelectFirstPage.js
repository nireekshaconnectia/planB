"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SelectFirstPage.module.css";
import DeliveryOptions from "@/components/DeliveryOptions/DeliveryOptions";
import SupportPopup from "@/components/support/supportPopup";
import { useTranslations } from "next-intl";
import Header from "../layout/Header";

const SelectFirstPage = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const [showSupportPopup, setShowSupportPopup] = useState(false);
  const t = useTranslations();

  const location = () => window.open("https://maps.app.goo.gl/aSjhu1mveHaVqtKq5", "_blank");
  const loyalty = () => window.open("https://loyalty.is/j3aifc", "_blank");

  const handleSelect = (option) => {
    if (option === "menu") {
      onClose();
      router.push("/");
    } else if (option === "study-room") {
      onClose();
      router.push("/study-room");
    } else if (option === "catering") {
      onClose();
      router.push("/catering");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.headerFadeIn}>
          <Header />
        </div>
        
        <div className={styles.gridWrapper}>

          <div className={styles.imageSquare}>
            <img src="/home/logo1.jpg" alt="Coffee" />
          </div>

          <div className={styles.textSquare}>
            <p>
              Premium specialty coffee spotoffering stunning skyline views, a Modern ambiance, and a curated menu of coffee, breakfast, and desserts—perfect for relaxing, working, or casual meetups.
            </p>
          </div>

          <div className={styles.imageSquare}>
            <img src="/home/logo2.jpg" alt="Coffee" />
          </div>

          <div className={styles.actionSquare} onClick={() => handleSelect("catering")}>
            <h3>{t("catering")}</h3>
            <button className={styles.pillBtn}>CLICK HERE</button>
          </div>

          <div className={styles.imageSquare}>
            <img src="/home/logo3.jpg" alt="Coffee" />
          </div>

          <div className={styles.actionSquare} onClick={() => handleSelect("study-room")}>
            <h3>{t("study-room")}</h3>
            <button className={styles.pillBtn}>CLICK HERE</button>
          </div>

          <div className={styles.imageSquare}>
            <img src="/home/logo4.jpg" alt="Coffee" />
          </div>

          <div className={styles.actionSquare} onClick={loyalty}>
            <h3>{t("loyalty card")}</h3>
            <button className={styles.pillBtn}>CLICK HERE</button>
          </div>

          <div className={styles.imageSquare}>
            <img src="/home/logo5.jpg" alt="Coffee" />
          </div>

          <div className={styles.actionSquare} onClick={() => setShowDeliveryPopup(true)}>
            <h3>{t("delivery platforms")}</h3>
            <button className={styles.pillBtn}>CLICK HERE</button>
          </div>

          <div className={styles.imageSquare}>
            <img src="/home/logo6.jpg" alt="Coffee" />
          </div>

          <div className={styles.actionSquare} onClick={location}>
            <h3>{t("location")}</h3>
            <button className={styles.pillBtn}>CLICK HERE</button>
          </div>
        </div>

        <div className={styles.supportFooter} onClick={() => setShowSupportPopup(true)}>
            {t("support")}
        </div>
      </div>

      <DeliveryOptions
        showDPopup={showDeliveryPopup}
        closeDPopup={() => setShowDeliveryPopup(false)}
      />
      <SupportPopup 
        showSupportPopup={showSupportPopup} 
        closeSupportPopup={() => setShowSupportPopup(false)} 
      />
    </>
  );
};

export default SelectFirstPage;