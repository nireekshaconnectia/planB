"use client";
import { useEffect, useState } from "react";
import styles from "./studyroom.module.css";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const StudyRoomCheckoutForm = ({ bookingData }) => {
  const { roomId, roomName, date, startTime, endTime, duration, price } = bookingData;
  const t = useTranslations();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      alert(t("not-authenticated"));
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const { name, email, phoneNumber } = data.data;
          setFormData({ name: name || "", phone: phoneNumber || "" });
          setUserEmail(email || "");
        } else {
          alert(t("profile-load-failed"));
        }
      })
      .catch(() => alert(t("profile-fetch-error")))
      .finally(() => setLoading(false));
  }, [router, t]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("userToken");
    if (!token) {
      alert(t("not-authenticated"));
      router.push("/login");
      return;
    }

    try {
      // 1. Create booking
      const bookingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room-bookings/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room: roomId,
          bookingDate: date,
          startTime,
          endTime,
          purpose: "Group Study Session",
          status: "pending",
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: userEmail,
          amount: Number(price),
          paymentStatus: "pending"
        }),
      });

      const bookingJson = await bookingRes.json();
      if (!bookingRes.ok || !bookingJson?.data?._id) {
        throw new Error("Booking failed");
      }

      const bookingId = bookingJson.data._id;

      // 2. Create payment
      const paymentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(price),
          orderId: bookingId,
          firstName: formData.name?.split(" ")[0] || "First",
          lastName: formData.name?.split(" ")[1] || "Last",
          phone: formData.phone,
          email: userEmail,
          bookingId: bookingId,
          type: "study_room"
        }),
      });

      const paymentJson = await paymentRes.json();
      if (!paymentRes.ok || !paymentJson?.data?.payUrl) {
        throw new Error("Payment initiation failed");
      }

      // 3. Redirect to payment URL
      window.location.href = paymentJson.data.payUrl;
    } catch (err) {
      console.error(err);
      alert(t("booking-error"));
    }
  };

  if (loading) return <p>{t("loading-user-data")}</p>;

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

      <form className={styles.formDetails} onSubmit={handleSubmit}>
        <div>
          <label>{t("name")}:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>{t("phone")}:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
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