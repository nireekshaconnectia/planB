import React from "react";
import styles from "./languagemodal.module.css"; // Import module CSS

const LanguageModal = ({ showModal, setShowModal }) => {
  return (
    <>
      {showModal && (
        <div className={styles.langModal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHead}>
            <h2 className={styles.modalTitle}>Select Language</h2>
            <span className={styles.close} onClick={() => setShowModal(false)}>
              Cancle
            </span>
            </div>
            
            
            <ul className={styles.languageList}>
              <li>
                <a href="?lang=en" className={styles.languageLink}>English</a>
              </li>
              <li>
                <a href="?lang=ar" className={styles.languageLink}>Arabic</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default LanguageModal;
