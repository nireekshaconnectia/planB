import React from "react";
import styles from "./popup.module.css";
import Backdrop from "../backdrop/backdrop";

const PopupModal = ({ show, onClose, heading, content }) => {
  if (!show) return null; // Don't render if show is false

  return (
    <>
      <Backdrop onClick={onClose} />
      <div className={styles.popupModal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHead}>
            <h2 className={styles.modalTitle}>{heading}</h2>
            <span className={styles.close} onClick={onClose}>
              Cancel
            </span>
          </div>
          <div className={styles.modalBody}>{content}</div>
        </div>
      </div>
    </>
  );
};

export default PopupModal;
