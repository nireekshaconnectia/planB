"use client";
import styles from "../DeliveryOptions/DeliveryOptions.module.css"; // Import CSS module
import PopupWrapper from "@/components/popup/popupWrapper";
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { MdCall } from "react-icons/md";
import Image from "next/image";

const SupportPopup = ({ showSupportPopup, closeSupportPopup }) => {
  const whatsapp = () => {
    window.open("https://wa.me/97430187770");
  };
  const email = () => {
    window.open("mailto:support@planbqa.shop");
  };
  const call = () => {
    window.open("tel:+97430187770");
  };

  return (
    <PopupWrapper 
      isOpen={showSupportPopup}
      onClose={() => closeSupportPopup(false)} 
      title='Support'
      >
        <ul className={styles.languageList}>
          <li onClick={whatsapp} className={styles.deliveryOption}>Whatsapp 
            <FaWhatsapp />
          </li>
          <li onClick={email} className={styles.deliveryOption}>Email
            <MdEmail />
          </li>
          <li onClick={call} className={styles.deliveryOption}>Call
            <MdCall />
          </li>
        </ul>
    </PopupWrapper>
  );
};

export default SupportPopup;