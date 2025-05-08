'use client';
import { useSearchParams } from "next/navigation";
import styles from "./checkout.module.css";
import BackButton from "@/components/backbutton/backbutton";
import StudyRoomCheckoutForm from "@/components/auth/checkout/StudyRoomCheckoutForm";
import CartCheckoutForm from "@/components/auth/checkout/CartCheckoutForm";
import SelectTable from "@/components/selectStoreTable/selectStoreTable";
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
        price: searchParams.get("price"), // also fix key here if needed
    };

    const hasRoomBooking = Boolean(bookingData.roomId);
    const hasTable = Boolean(searchParams.get("table"));

    return (
        <div className={styles.checkout}>
            <div className={styles.pageHead}>
                <div>
                    <BackButton />
                </div><h1 className={styles.title}>{t("checkout")}</h1></div>
            {hasRoomBooking ? (
                <StudyRoomCheckoutForm bookingData={bookingData} />
            ) : hasTable ? (
                <CartCheckoutForm />
            ) : (
                <>
                    <SelectTable />
                </>
            )}

        </div>
    );
};

export default CheckoutPage;

