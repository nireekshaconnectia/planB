"use client";
import styles from "./studyroom.module.css";
import { useTranslations } from "next-intl";

const StudyRoomCheckoutForm = ({ bookingData }) => {
  const { roomName, date, startTime, endTime, duration, price } = bookingData;
  const t = useTranslations();

  return (
    <div className={styles.checkoutForm}>
      <div className={styles.details}>
        <h2>{t("study-room-booking-details")}</h2>
        <p><strong>{t("room")}:</strong> {roomName}</p>
        <p><strong>{t("date")}:</strong> {date}</p>
        <p><strong>{t("from")}:</strong> {startTime}</p>
        <p><strong>{t("to")}:</strong> {endTime}</p>
        <p><strong>{t("duration")}:</strong> {duration} {duration > 1 ? t("hours") : t("hour")}</p>
        <p><strong>{t("total-price")}:</strong> {price} QAR</p>
      </div>

      <form className={styles.formDetails}>
        <div><label>{t("name")}:</label>
          <input type="text" name="name" placeholder={t("your-name")} required /></div>

        <div><label>{t("phone")}:</label>
          <input type="tel" name="phone" placeholder={t("your-phone-number")} required /></div>


        <button type="submit" className={styles.submitButton}>{t("confirm-booking")}</button>
      </form>
    </div>
  );
};

export default StudyRoomCheckoutForm;
