"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./SelectFirstPage.module.css"; // Import CSS module
import Backdrop from "../backdrop/backdrop"; // Import Backdrop component
import DeliveryOptions from "@/components/DeliveryOptions/DeliveryOptions";

const SelectFirstPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const location = () => {
    window.open("https://maps.app.goo.gl/aSjhu1mveHaVqtKq5");
  };
  useEffect(() => {
    // Show popup only if there are no query parameters
    if (!searchParams.toString()) {
      setShowPopup(true);
    }
  }, [searchParams]);

  const handleSelect = (option) => {
    if (option === "menu") {
      setShowPopup(false); // Close the popup, stay on the page
    } else if (option === "study-room") {
      router.push("/study-room"); // Redirect to study-room
    }
  };

  if (!showPopup) return null; // Don't render the popup if it's hidden

  return (
    <>
      <Backdrop onClick={() => setShowPopup(false)} />
      <div className={styles.langModal}>
        <div className={styles.modalHead}>
        <div className={styles.logoContainer}>
          <img src="http://planb.weblexia.in/wp-content/uploads/2024/11/planB-logo.png" alt="Site Logo" className="logo-image m-auto" />
        </div>
          <div className={styles.modalTitle}>PLAN B<div> coffee</div></div>
        </div>
        <ul className={styles.languageList}>
          <li onClick={() => handleSelect("menu")}>Menu</li>
          <li onClick={() => handleSelect("study-room")}>Meeting room</li>
          <li onClick={location}>Location</li>
          <li >Loyalty card</li>
          <li onClick={() => setShowDeliveryPopup(true)} style={{ cursor: "pointer" }}>Delivery platforms</li>
        </ul>
      </div>
      {/* Delivery Options Popup */}
      <DeliveryOptions 
        isOpen={showDeliveryPopup} 
        onClose={() => setShowDeliveryPopup(false)} 
      />
    </>
  );
};

export default SelectFirstPage;
