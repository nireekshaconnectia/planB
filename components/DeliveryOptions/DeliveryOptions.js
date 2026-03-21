"use client";
import styles from "./DeliveryOptions.module.css"; // Import CSS module
import PopupWrapper from "@/components/popup/popupWrapper";
import Image from "next/image";

const DeliveryOptions = ({ showDPopup, closeDPopup }) => {
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
    <PopupWrapper 
      isOpen={showDPopup}
      onClose={() => closeDPopup(false)} 
      title='Select delivery platform'
      >
        <ul className={styles.languageList}>
          <li onClick={talabat} className={styles.deliveryOption}>Talabat 
            <Image src="/images/talabat.jpg" alt="Talabat" width={24} height={24} className={styles.deliveryImage} />
          </li>
          <li onClick={Snoonu} className={styles.deliveryOption}>Snoonu
            <Image src="/images/snoonu.jpg" alt="Snoonu" width={24} height={24} className={styles.deliveryImage} />
          </li>
          <li onClick={rafeeq} className={styles.deliveryOption}>Rafeeq
            <Image src="/images/rafeeq.png" alt="Rafeeq" width={24} height={24} className={styles.deliveryImage} />
          </li>
          <li onClick={deliveroo} className={styles.deliveryOption}>Keeta
            <Image src="/images/deliveroo.png" alt="Deliveroo" width={24} height={24} className={styles.deliveryImage} />
          </li>
        </ul>
    </PopupWrapper>
  );
};

export default DeliveryOptions;