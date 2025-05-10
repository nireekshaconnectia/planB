"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/cartSlice"; // ✅ Make sure you have this action
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import PaymentSuccess from "@/components/payment-success/PaymentSuccess"; // Import your success component

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const t = useTranslations();
  const [token, setToken] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    // Move localStorage access inside useEffect
    const userToken = localStorage.getItem('userToken');
    setToken(userToken);
  }, []);

  useEffect(() => {
    const orderId = searchParams.get("transId");
    const paymentStatus = searchParams.get("status");

    if (!orderId || !paymentStatus || !token) {
      setStatus("error");
      return;
    }

    const saveFinalOrder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              paymentStatus,
              paymentDetails: {
                transId: searchParams.get("transId") || "",
                statusId: searchParams.get("statusId") || "",
                custom1: searchParams.get("custom1") || "",
              },
            }),
          }
        );

        const result = await res.json();

        if (res.ok && result.success) {
          setStatus("success");
          dispatch(clearCart());
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Error saving payment status:", err);
        setStatus("error");
      }
    };

    saveFinalOrder();
  }, [dispatch, searchParams, token]); // Added token to dependencies

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      {status === "loading" && <p>{t("verifying-payment")}</p>}{" "}
      {/* Loading state */}
      {status === "success" && (
        <PaymentSuccess /> // Render your success component here
      )}
      {status === "error" && (
        <>
          <h2>{t("payment-failed")}</h2>
          <p>{t("payment-error")}</p>
          <button onClick={() => router.push("/")}>{t("try-again")}</button>{" "}
          {/* Retry option */}
        </>
      )}
    </div>
  );
}
