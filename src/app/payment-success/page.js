"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/cartSlice"; // ✅ Make sure you have this action
import { useSearchParams, useRouter } from "next/navigation";
import PaymentSuccess from "@/components/payment-success/PaymentSuccess"; // Import your success component

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const token = localStorage.getItem('userToken'); // Retrieve the token from localStorage

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const orderId = searchParams.get("transId"); // Correctly get 'id' as orderId
    const paymentStatus = searchParams.get("status"); // Get 'status' parameter from URL

    if (!orderId || !paymentStatus) {
      // If necessary parameters are missing, show error
      setStatus("error");
      return;
    }

    const saveFinalOrder = async () => {
      try {
        // Send payment status to backend to update the order status
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ Include token here
            },
            body: JSON.stringify({
              paymentStatus, // e.g. "Paid"
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
          // If order status updated successfully, show success message
          setStatus("success");
          dispatch(clearCart()); // Clear the cart after successful payment
        } else {
          // If there was an issue with the backend, show error
          setStatus("error");
        }
      } catch (err) {
        // Catch network errors or other issues
        console.error("Error saving payment status:", err);
        setStatus("error");
      }
    };

    // Call the function to save order status
    saveFinalOrder();
  }, [dispatch, searchParams]); // Dependency array to run only once

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      {status === "loading" && <p>Verifying payment...</p>}{" "}
      {/* Loading state */}
      {status === "success" && (
        <PaymentSuccess /> // Render your success component here
      )}
      {status === "error" && (
        <>
          <h2>❌ Payment Failed</h2>
          <p>Something went wrong. Please contact support.</p>
          <button onClick={() => router.push("/")}>Try Again</button>{" "}
          {/* Retry option */}
        </>
      )}
    </div>
  );
}
