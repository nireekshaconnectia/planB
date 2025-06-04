'use client';

import { useSearchParams } from "next/navigation";
import styles from "./checkout.module.css";
import BackButton from "@/components/backbutton/backbutton";
import StudyRoomCheckoutForm from "@/components/auth/checkout/StudyRoomCheckoutForm";
import CartCheckoutForm from "@/components/auth/checkout/CartCheckoutForm";
import SelectTable from "@/components/selectStoreTable/selectStoreTable";
import YouAreNotAllowed from "@/components/errors/youAreNotAllowed";
import { useTranslations } from "next-intl";

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const t = useTranslations();

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
  const orderType = searchParams.get("orderType");
  const table = searchParams.get("table");

  // ✅ Proper logic to determine if we should show the cart checkout form
  const shouldShowCartCheckout =
    orderType === "takeaway" || (orderType === "Dine In" && Boolean(table));

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
      ) : (
        <YouAreNotAllowed />
      )}
    </div>
  );
};

export default CheckoutPage;
