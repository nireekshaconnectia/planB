// /hooks/useStudyRoomBooking.js
import { useRouter } from "next/navigation";
import { getIdToken } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { useEffect, useState } from "react";

export const StudyRoomBooking = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const user = auth.currentUser;
      if (user) {
        const idToken = await getIdToken(user, true);
        setToken(idToken);
      }
    };

    fetchToken();
  }, []);

  const bookRoomAndPay = async ({ room, date, startTime, endTime, user, purpose = "Study Session" }) => {
    if (!token) {
      alert("User not authenticated.");
      return;
    }

    try {
      // 1. Create booking
      const bookingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room-bookings/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room: room._id,
          bookingDate: date.toISOString(),
          startTime,
          endTime,
          purpose,
          status: "pending",
        }),
      });

      const bookingData = await bookingRes.json();

      if (!bookingRes.ok || !bookingData?.data?._id) {
        throw new Error("Booking failed.");
      }

      const bookingId = bookingData.data._id;
      const amount = room.price; // Or room.price * duration if needed

      // 2. Initiate payment
      const paymentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          orderId: bookingId,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          email: user.email,
        }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok || !paymentData?.data?.payUrl) {
        throw new Error("Payment initiation failed.");
      }

      // 3. Redirect to pay URL
      window.location.href = paymentData.data.payUrl;
    } catch (err) {
      console.error("Booking or payment error:", err);
      alert("Something went wrong while booking or initiating payment.");
    }
  };

  return { bookRoomAndPay };
};
