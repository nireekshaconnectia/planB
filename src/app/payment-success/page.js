"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/cartSlice";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import PaymentSuccess from "@/components/payment-success/PaymentSuccess";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const t = useTranslations();

  const [status, setStatus] = useState("loading");
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const orderId = searchParams.get("transId");

    if (!orderId) {
      setStatus("error");
      return;
    }

    const fetchOrderStatus = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/status/${orderId}`,
          {
            cache: "no-store",
          }
        );

        const data = await res.json();
        {
          console.log("✅ Order Data:", data);
        }
        if (res.ok && data?.success) {
          setOrderData(data.data);
          setStatus("success");
          dispatch(clearCart());
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Error fetching order status:", err);
        setStatus("error");
      }
    };

    fetchOrderStatus();
  }, [dispatch, searchParams]);

  return (
    <div style={{ padding: "1rem", textAlign: "center" }}>
      {status === "loading" && <p>{t("verifying-payment")}</p>}

      {status === "success" && <PaymentSuccess orderData={orderData} />}

      {status === "error" && (
        <>
          <h2>{t("payment-failed")}</h2>
          <p>{t("payment-error")}</p>
          <button onClick={() => router.push("/")}>{t("try-again")}</button>
        </>
      )}
    </div>
  );
}
