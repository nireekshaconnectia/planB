"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./catering.module.css";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Header from "../layout/Header";
import Image from "next/image";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5"; // Add close icon

const fallbackPackages = [
  { persons: 20, price: 700 },
  { persons: 40, price: 1400 },
  { persons: 60, price: 2100 },
  { persons: 80, price: 2800 },
  { persons: 100, price: 3300 },
];

export default function CateringPackages({ onNextStep }) {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/catering-packages`)
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then(setPackages)
      .catch(() => setPackages(fallbackPackages));
  }, []);

  const handleSelect = (pkg) => {
    
    setSelectedPackage(pkg);
    setShowPopup(true);
   
  };
console.log(handleSelect);
  const handleConfirm = () => {
    localStorage.setItem("selectedPackage", JSON.stringify(selectedPackage));
    setShowPopup(false);
    if (onNextStep) {
      onNextStep();
    }
  };

  const handleClose = () => {
    setShowPopup(false);
    setSelectedPackage(null);
  };

  return (
    <>
      <section className={styles.pageContainer}>
        <Header />
        
        <div className={styles.titleWrapper}>
          <h1 className={styles.mainTitle}>{t("catering")}</h1>
        </div>

        <div className={styles.listWrapper}>
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className={styles.packagePill}
              onClick={() => handleSelect(pkg)}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className={styles.iconContainer}>
                <IoPersonCircleOutline />
              </div>
              <div className={styles.pillText}>
                <span className={styles.number}>{pkg.persons}</span>
                <span className={styles.label}>{t("persons")}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.noteCard}>
          <h3 className={styles.noteTitle}>{t("note")}</h3>
          <p className={styles.noteDescription}>
            {t("for_more_than_100_cups")}
          </p>
          <Link href="tel:+97430187770" className={styles.phoneLink}>
            ( +974 30187770 )
          </Link>
        </div>
      </section>

      {/* Popup Modal */}
      {showPopup && selectedPackage && (
        <div className={styles.popupOverlay} onClick={handleClose}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={handleClose}>
              <IoClose />
            </button>
            
            <h2 className={styles.popupTitle}>{t("confirm_package")}</h2>
            
            <div className={styles.popupDetails}>
              <p>
                <strong>{t("persons")}:</strong> {selectedPackage.persons}
              </p>
              <p>
                <strong>{t("price")}:</strong> ${selectedPackage.price}
              </p>
            </div>
            
            <div className={styles.popupActions}>
              <button 
                className={styles.cancelButton} 
                onClick={handleClose}
              >
                {t("cancel")}
              </button>
              <button 
                className={styles.confirmButton} 
                onClick={handleConfirm}
              >
                {t("confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}