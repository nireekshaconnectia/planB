'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./checkout.module.css";
import BackButton from "@/components/backbutton/backbutton";
import StudyRoomCheckoutForm from "@/components/auth/checkout/StudyRoomCheckoutForm";
import CartCheckoutForm from "@/components/auth/checkout/CartCheckoutForm";
import YouAreNotAllowed from "@/components/errors/youAreNotAllowed";
import SelectTable from "@/components/selectStoreTable/selectStoreTable";
import { useTranslations } from "next-intl";

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const t = useTranslations();

  const [hasValidCafeTable, setHasValidCafeTable] = useState(false);

  // ✅ Check localStorage for valid cafeTableData
  useEffect(() => {
    const stored = localStorage.getItem('cafeTableData');
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      const isValid = parsed?.value && Date.now() - parsed.timestamp < SIX_HOURS_MS;

      if (isValid) {
        setHasValidCafeTable(true);
      }
    } catch {
      // Do nothing if JSON parsing fails
    }
  }, []);

  // 🧠 Room Booking
  const bookingData = {
    roomId: searchParams.get("roomId"),
    roomName: searchParams.get("roomName"),
    date: searchParams.get("date"),
    startTime: searchParams.get("startTime"),
    endTime: searchParams.get("endTime"),
    duration: searchParams.get("duration"),
    price: searchParams.get("price"),
  };
  const hasRoomBooking = Boolean(bookingData.roomId);

  // 🛍️ Order Type & Table
  const orderType = searchParams.get("orderType");
  const table = searchParams.get("table");

  const shouldShowCartCheckout =
    hasValidCafeTable && (orderType === "takeaway" || (orderType === "Dine In" && Boolean(table)));

  return (
    <div className={styles.checkout}>
      <div className={styles.pageHead}>
        <div>
          <BackButton />
        </div>
        <h1 className={styles.title}>{t("checkout")}</h1>
      </div>

      {hasRoomBooking ? (
        <StudyRoomCheckoutForm bookingData={bookingData} />
      ) : shouldShowCartCheckout ? (
        <CartCheckoutForm />
      ) : hasValidCafeTable ? (
        <SelectTable />
      ) : (
        <YouAreNotAllowed />
      )}
    </div>
  );
};

export default CheckoutPage;
