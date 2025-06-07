"use client";
import { useEffect, useState } from "react";
import styles from "./studyroom.module.css";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";

const StudyRoomCheckoutForm = ({ bookingData }) => {
  const { roomId, roomName, date, startTime, endTime, duration, price } =
    bookingData;
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPath =
    pathname + (searchParams ? `?${searchParams.toString()}` : "");
  useRequireAuth(currentPath);

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
          setLoading(false);
        } else if (data.code === "AUTH_TOKEN_INVALID") {
          router.push("/login");
        }
        // else {
        //   // alert(t("profile-load-failed"));
        //   alert(data.message);
        //   console.log("Profile load failed:", data);
        // }
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
    const bookingPayload = {
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
      paymentStatus: "pending",
    };

    console.log("📦 Booking Payload:", bookingPayload);

    const bookingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room-bookings/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingPayload),
    });

    const bookingJson = await bookingRes.json();
    console.log("📨 Booking Response:", bookingJson);

    // ✅ Use correct path to booking ID
    if (!bookingRes.ok || !bookingJson?.data?.booking?._id) {
      console.error("❌ Booking failed", bookingJson);
      alert("Booking failed: " + (bookingJson.message || "Unknown error"));
      return;
    }

    const bookingId = bookingJson.data.booking._id;
    console.log("✅ Booking created. ID:", bookingId);

    // ✅ Use paymentInfo directly from response
    const paymentPayload = bookingJson.data.paymentInfo;

    console.log("💸 Payment Payload:", paymentPayload);

    const paymentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentPayload),
    });

    const paymentJson = await paymentRes.json();
    console.log("💰 Payment Response:", paymentJson);

    if (!paymentRes.ok || !paymentJson?.data?.payUrl) {
      throw new Error("Payment initiation failed: " + (paymentJson.message || "No payUrl"));
    }

    window.location.href = paymentJson.data.payUrl;
  } catch (err) {
    console.error("🔥 Booking or Payment error:", err);
    alert(t("booking-error"));
  }
};


  if (loading) return <p>{t("loading-user-data")}</p>;

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
          <strong>{t("from")}:</strong> {startTime}
        </p>
        <p>
          <strong>{t("to")}:</strong> {endTime}
        </p>
        <p>
          <strong>{t("duration")}:</strong> {duration}{" "}
          {duration > 1 ? t("hours") : t("hour")}
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
