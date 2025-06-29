"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}

const ConfirmOrder = ({ guestInfo }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cartItems = useSelector((state) => state.cart.items);

  const [isLoading, setIsLoading] = useState(false);

  const tableNumber = searchParams.get("table") || "A1";
  const orderType = searchParams.get("orderType") || "delivery";

  const totalPrice = Object.values(cartItems).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleConfirmOrder = async () => {
    setIsLoading(true);

    const storedProfile = localStorage.getItem("userProfile");
    let userInfo;

    try {
      userInfo = storedProfile ? JSON.parse(storedProfile) : null;
    } catch (e) {
      console.warn("Invalid user profile in localStorage");
      userInfo = null;
    }

    // Prefer userProfile if logged in, else fallback to guestInfo (prop), then dummy
    const name = userInfo?.name || guestInfo?.name || "Guest User";
    const phone = userInfo?.phone || guestInfo?.phone || "+971000000000";
    const email = userInfo?.email || guestInfo?.email || "guest@example.com";

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
      firstName: name.split(" ")[0],
      lastName: name.split(" ")[1] || "",
      phone,
      email,
      orderId,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentPayload),
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success || !result.data?.payUrl) {
        throw new Error("Payment initiation failed");
      }

      const paymentData = result.data;

      const orderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
              name,
              email,
              phone,
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
        throw new Error(orderResult?.message || "Order creation failed");
      }

      window.location.href = paymentData.payUrl;
    } catch (error) {
      alert(`❌ Failed to confirm order.\n\nDetails: ${error.message}`);
      console.error("Order Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="confirm-order-btn">
      <button onClick={handleConfirmOrder} disabled={isLoading}>
        {isLoading ? "Processing..." : "Confirm Order"}
      </button>
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default ConfirmOrder;
