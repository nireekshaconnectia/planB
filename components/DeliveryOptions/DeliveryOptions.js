"use client";
import { useState } from "react";
import styles from "./DeliveryOptions.module.css"; // Import CSS module
import Backdrop from "@/components/backdrop/backdrop"; // Import Backdrop component

const DeliveryOptions = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Don't render if popup is not open

  const talabat = () => {
    window.open("https://www.talabat.com/qatar/plan-b-cafe");
  };
  const Snoonu = () => {
    window.open("https://snoonu.com/restaurants/plan-b-cafe");
  };
  const rafeeq = () => {
    window.open("https://gorafeeq.com/en/qa/vendor/22464");
  };
  const deliveroo = () => {
    window.open("https://deliveroo.com.qa/en/menu/Doha/lusail-marina-promenade/plan-b-cafe-lusail");
  };
  return (
    <>
      <Backdrop onClick={onClose} />
      <div className={styles.langModal}>
        <div className={styles.modalHead}>
          <span className={styles.modalTitle}>Select delivery platform</span>
          <span className={styles.close} onClick={onClose}>Cancel</span>
        </div>
        <ul className={styles.languageList}>
          <li onClick={talabat}>Talabat</li>
          <li onClick={Snoonu}>Snoonu</li>
          <li onClick={rafeeq}>Rafeeq</li>
          <li onClick={deliveroo}>Deliveroo</li>
        </ul>
      </div>
    </>
  );
};

export default DeliveryOptions;