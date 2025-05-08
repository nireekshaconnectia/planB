"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { useRequireAuth } from "@/lib/auth/useRequireAuth"; // Ensure this is the correct path to your hook

function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}

const ConfirmOrder = () => {
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.items);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get("table") || "A1"; // fallback if missing
  const orderType = searchParams.get("orderType") || "delivery"; // fallback if missing
  useRequireAuth(); // Ensure user is authenticated before proceeding

  // Calculate total price for all items in the cart
  const totalPrice = Object.values(cartItems).reduce(
    (acc, item) => acc + item.foodPrice * item.quantity,
    0
  );

  const handleConfirmOrder = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userProfile") || "{}");
    const orderId = generateOrderId();

    const items = Object.values(cartItems).map((item) => ({
      menuItem: item._id || item.menuItem, // ✅ MongoDB ID (ensure it's set correctly)
      foodSlug: item.foodSlug, // optional, useful for internal display/debug
      foodName: item.foodName,
      foodPrice: item.foodPrice,
      quantity: item.quantity,
      totalPrice: (item.foodPrice * item.quantity).toFixed(2), // Calculate totalPrice for each item
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
      // Step 1: Retrieve Firebase token from localStorage
      const firebaseToken = localStorage.getItem("userToken"); // Ensure you have stored the Firebase token earlier

      if (!firebaseToken) {
        throw new Error("User is not authenticated");
      }

      // Step 2: Create payment
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseToken}`, // Pass the token in the Authorization header
          },
          body: JSON.stringify(paymentPayload),
        }
      );

      const result = await res.json();

      if (!res.ok || result.status !== "success") {
        throw new Error("Payment initiation failed");
      }

      const paymentData = result.data;

      // Step 3: Save order (store in DB)
      const orderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseToken}`, // Pass the token again to authenticate order creation
          },
          body: JSON.stringify({
            orderId,
            items,
            orderTotal: totalPrice.toFixed(2), // Add orderTotal field
            orderType, // ✅ from URL params
            tableNumber, // ✅ from URL params
            paymentMethod: "online", // Set a valid payment method (e.g., "online")
            deliveryAddress: "123 Main St", // You can replace this with actual address
            specialInstructions: "",
            user: {
              name: userInfo.name,
              email: userInfo.email,
              phone: userInfo.phone,
            },
            payment: {
              transactionId: paymentData.transactionId,
              payUrl: paymentData.payUrl,
              status: "pending", // Payment status is pending initially
            },
            status: "pending", // Order status is pending
          }),
        }
      );

      const orderResult = await orderResponse.json();

      if (!orderResponse.ok || !orderResult.success) {
        throw new Error("Order creation failed");
      }

      // Step 4: Redirect to payment URL
      window.location.href = paymentData.payUrl;
    } catch (error) {
      console.error("Order confirmation error:", error);

      // Check for authentication error or specific error code
      const errorMessage = error.message?.toLowerCase() || "";

      if (
        errorMessage.includes("not authenticated") || 
        errorMessage.includes("unauthorized") || 
        errorMessage.includes("200")
      ) {
        router.push("/logout");
      } else {
        alert(error , "❌ Failed to confirm order. Please try again.");
      }
    }
  };

  return (
    <div className="confirm-order-btn">
      <button onClick={handleConfirmOrder} disabled={isLoading}>
        {isLoading ? "Processing..." : "Confirm Order"}
      </button>
    </div>
  );
};

export default ConfirmOrder;
