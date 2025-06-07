"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { usePathname, useSearchParams } from "next/navigation";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";


function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}

const ConfirmOrder = () => {
  const router = useRouter();
  const pathname = usePathname();
  const cartItems = useSelector((state) => state.cart.items);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get("table") || "A1";
  const orderType = searchParams.get("orderType") || "delivery";
  const currentPath = pathname + (searchParams ? `?${searchParams.toString()}` : "");
  useRequireAuth(currentPath);

  const totalPrice = Object.values(cartItems).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleConfirmOrder = async () => {
    setIsLoading(true); // ✅ Set loading to true

    const userInfo = JSON.parse(localStorage.getItem("userProfile") || "{}");
    const orderId = generateOrderId();

    const items = Object.values(cartItems).map((item) => ({
      menuItem: item._id || item.menuItem,
      foodSlug: item.slug,
      foodName: item.name,
      foodPrice: item.price,
      quantity: item.quantity,
      totalPrice: (item.price * item.quantity).toFixed(2),
    }));

    const paymentPayload = {
      amount: totalPrice.toFixed(2),
      firstName: userInfo.name?.split(" ")[0] || "First",
      lastName: userInfo.name?.split(" ")[1] || "Last",
      phone: userInfo.phone || "+971000000000",
      email: userInfo.email || "test@example.com",
      orderId,
    };

    try {
      const firebaseToken = localStorage.getItem("userToken");

      if (!firebaseToken) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseToken}`,
          },
          body: JSON.stringify(paymentPayload),
        }
      );

      const result = await res.json();

      if (!res.ok || result.success !== true || !result.data?.payUrl) {
        console.error("Payment initiation failed:", result);
        throw new Error("Payment initiation failed");
      }

      const paymentData = result.data;

      const orderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseToken}`,
          },
          body: JSON.stringify({
            orderId,
            items,
            orderTotal: totalPrice.toFixed(2),
            orderType,
            tableNumber,
            paymentMethod: "online",
            deliveryAddress: "123 Main St",
            specialInstructions: "",
            user: {
              name: userInfo.name,
              email: userInfo.email,
              phone: userInfo.phone,
            },
            payment: {
              transactionId: paymentData.transactionId,
              payUrl: paymentData.payUrl,
              status: "pending",
            },
            status: "pending",
          }),
        }
      );

      const orderResult = await orderResponse.json();

      if (!orderResponse.ok || !orderResult.success) {
        const errorCode = orderResult?.code?.toUpperCase() || "";
        const errorMsg = orderResult?.message || "Order creation failed";

        if (
          errorCode === "AUTH_TOKEN_INVALID" ||
          errorCode === "AUTH_TOKEN_EXPIRED"
        ) {
          router.push(`/logout?redirectTo=${encodeURIComponent(router.asPath)}`);
          return;
        }

        throw new Error(errorMsg);
      }

      window.location.href = paymentData.payUrl;
    } catch (error) {
      const errorMessage = error.message?.toLowerCase() || "";

      if (
        errorMessage.includes("not authenticated") ||
        errorMessage.includes("unauthorized")
      ) {
        router.push("/logout");
      } else {
        console.error("❌ Order confirmation error:", error);
        alert(
          `❌ Failed to confirm order.\n\nDetails: ${
            error.message || "Unknown error"
          }`
        );
      }
    } finally {
      setIsLoading(false); // ✅ Reset loading if needed
    }
  };

  return (
    <div className="confirm-order-btn">
      <button onClick={handleConfirmOrder} disabled={isLoading}>
        {isLoading ? "Processing..." : "Confirm Order"}
      </button>

      {/* ✅ Show loader only while loading */}
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default ConfirmOrder;
