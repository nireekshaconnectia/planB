"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}

const ConfirmOrder = () => {
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.items);

  // Calculate total price
  const totalPrice = Object.values(cartItems).reduce(
    (acc, item) => acc + item.foodPrice * item.quantity,
    0
  );

  const handleConfirmOrder = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userProfile") || "{}");
    const orderId = generateOrderId();

    const items = Object.values(cartItems).map((item) => ({
      menuItem: item.menuItem,           // ✅ MongoDB ID
      foodSlug: item.foodSlug,           // optional, useful for internal display/debug
      foodName: item.foodName,
      foodPrice: item.foodPrice,
      quantity: item.quantity,
      price: item.foodPrice,             // As per API requirement
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
      // Step 1: Create payment
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentPayload),
      });

      const result = await res.json();

      if (!res.ok || result.status !== "success") {
        throw new Error("Payment initiation failed");
      }

      const paymentData = result.data;

      // Step 2: Save order
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          items,
          totalAmount: totalPrice.toFixed(2),
          orderType: "delivery", // or "pickup"
          paymentMethod: "online",
          deliveryAddress: "123 Main St", // TODO: make this dynamic
          specialInstructions: "",        // TODO: optional input
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
      });

      // Step 3: Redirect to payment URL
      window.location.href = paymentData.payUrl;
    } catch (error) {
      console.error("Order confirmation error:", error);
      alert("❌ Failed to confirm order. Please try again.");
    }
  };

  return (
    <div className="confirm-order-btn">
      <button onClick={handleConfirmOrder}>Confirm Order</button>
    </div>
  );
};

export default ConfirmOrder;
