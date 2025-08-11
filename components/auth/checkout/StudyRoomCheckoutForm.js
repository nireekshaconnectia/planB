"use client";
import { useState } from "react";
import styles from "./studyroom.module.css";
import { PhoneField } from "@/components/forms/fields/PhoneField";
import { useTranslations } from "next-intl";

const StudyRoomCheckoutForm = ({ bookingData }) => {
  const { roomId, roomName, date, startTime, endTime, duration, price } =
    bookingData;
  const t = useTranslations();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const bookingPayload = {
        room: roomId,
        bookingDate: date,
        startTime,
        endTime,
        purpose: "Group Study Session",
        status: "pending",
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: "", // No email if not logged in
        amount: Number(price),
        paymentStatus: "pending",
      };

      console.log("📦 Booking Payload:", bookingPayload);

      const bookingRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/room-bookings/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingPayload),
        }
      );

      const bookingJson = await bookingRes.json();
      console.log("📨 Booking Response:", bookingJson);

      if (!bookingRes.ok || !bookingJson?.data?.booking?._id) {
        console.error("❌ Booking failed", bookingJson);
        alert("Booking failed: " + (bookingJson.message || "Unknown error"));
        return;
      }

      const paymentPayload = bookingJson.data.paymentInfo;

      console.log("💸 Payment Payload:", paymentPayload);

      const paymentRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentPayload),
        }
      );

      const paymentJson = await paymentRes.json();
      console.log("💰 Payment Response:", paymentJson);

      if (!paymentRes.ok || !paymentJson?.data?.payUrl) {
        throw new Error(
          "Payment initiation failed: " + (paymentJson.message || "No payUrl")
        );
      }

      window.location.href = paymentJson.data.payUrl;
    } catch (err) {
      console.error("🔥 Booking or Payment error:", err);
      alert(t("booking-error"));
    }
  };

  return (
    <div className={styles.checkoutForm}>
      <div className={styles.details}>
        <h2>{t("study-room-booking-details")}</h2>
        <p>
          <strong>{t("room")}:</strong> {roomName}
        </p>
        <p>
          <strong>{t("date")}:</strong> {date}
        </p>
        <p>
          <strong>{t("duration")}:</strong> {duration}{" "}
          {duration > 1 ? t("hours") : t("hour")}
        </p>
        <br />
        <p>
          <strong>{t("from")}:</strong> {startTime}
        </p>
        <p>
          <strong>{t("to")}:</strong> {endTime}
        </p>

        <p>
          <strong>{t("total-price")}:</strong> {price} QAR
        </p>
      </div>

      <form className={styles.formDetails} onSubmit={handleSubmit}>
        <div>
          <label>{t("name")}:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.inputField}
            placeholder={t("name")}
          />
        </div>

        <div>
          <label>{t("phone")}:</label>
          {/* <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          /> */}
          <PhoneField
            name="phone"
            value={formData.phone}
            onChange={({ countryCode, phoneNumber }) =>
              setFormData((prev) => ({
                ...prev,
                phone: `${countryCode}${phoneNumber}`, // store full number
              }))
            }
            error={null}
            required
            countryCode="+974"
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          {t("confirm-booking")}
        </button>
      </form>
    </div>
  );
};

export default StudyRoomCheckoutForm;
