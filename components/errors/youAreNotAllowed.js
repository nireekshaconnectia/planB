"use client";
import React from "react";
import styles from "./YouAreNotAllowed.module.css"; // optional: if using CSS Modules

const YouAreNotAllowed = () => {
  return (
    <div className={styles.container || "not-allowed-container"}>
      <div className={styles.card || "not-allowed-card"}>
        <h1 className={styles.title || "not-allowed-title"}>
          🚫 You Are Not Allowed
        </h1>
        <p className={styles.message || "not-allowed-message"}>
          Please scan a valid QR code from any QR scanner app to order with us.
        </p>
      </div>
    </div>
  );
};

export default YouAreNotAllowed;
