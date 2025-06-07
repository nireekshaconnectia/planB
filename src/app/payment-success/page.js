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

  const [token, setToken] = useState(null);
  const [status, setStatus] = useState("loading");
  const [orderData, setOrderData] = useState(null); // 🆕 hold fetched order details

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    setToken(userToken);
  }, []);

  useEffect(() => {
    const orderId = searchParams.get("transId");

    if (!orderId || !token) {
      setStatus("error");
      return;
    }

    const fetchOrderStatus = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok && data?.success) {
          setOrderData(data.order); // 🆕 Store order data
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
  }, [dispatch, searchParams, token]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      {status === "loading" && <p>{t("verifying-payment")}</p>}

      {status === "success" && (
        <PaymentSuccess order={orderData} /> // Pass order data to your component
      )}

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
