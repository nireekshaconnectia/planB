"use client";
import styles from "./DeliveryOptions.module.css"; // Import CSS module
import PopupWrapper from "@/components/popup/popupWrapper";

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
          <li onClick={talabat}>Talabat</li>
          <li onClick={Snoonu}>Snoonu</li>
          <li onClick={rafeeq}>Rafeeq</li>
          <li onClick={deliveroo}>Deliveroo</li>
        </ul>
    </PopupWrapper>
  );
};

export default DeliveryOptions;