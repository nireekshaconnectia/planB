"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./SelectFirstPage.module.css";
import Backdrop from "../backdrop/backdrop";
import DeliveryOptions from "@/components/DeliveryOptions/DeliveryOptions";
import { useTranslations } from "next-intl";
import Image from 'next/image';

const SelectFirstPage = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const t = useTranslations(); // ✅ Initialize translations here

  const location = () => window.open("https://maps.app.goo.gl/aSjhu1mveHaVqtKq5", "_blank");
  const loyalty = () => window.open("https://loyalty.is/j3aifc", "_blank");

  const handleSelect = (option) => {
    if (option === "menu") {
      onClose();
    } else if (option === "study-room") {
      onClose();
      router.push("/study-room");
    }
  };

  if (!isOpen) return null;
  

  return (
    <>
      <Backdrop onClick={onClose} />
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
        </div>
        <ul className={styles.languageList}>
          <li onClick={() => handleSelect("menu")}>
            {t("menu")}
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
        isOpen={showDeliveryPopup}
        onClose={() => setShowDeliveryPopup(false)}
      />
    </>
  );
};

export default SelectFirstPage;
