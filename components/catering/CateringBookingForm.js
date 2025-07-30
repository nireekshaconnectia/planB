"use client";

import React, { useEffect, useState, useRef } from "react";
import { TextField } from "@/components/forms/fields/TextField";
import { PhoneField } from "@/components/forms/fields/PhoneField";
import styles from "./catering.module.css";
import { IoLocationOutline } from "react-icons/io5";
import { SecondaryButton } from "@/components/buttons/Buttons";

const DELIVERY_CHARGE = 170;

export default function BookingForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState({ countryCode: "+974", phoneNumber: "" });
  const [currentLocation, setCurrentLocation] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  const autocompleteRef = useRef(null);
  const detailedAddressRef = useRef(null);
  function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `CTR-${timestamp}-${random}`;
  }
  useEffect(() => {
    const pkg = localStorage.getItem("selectedPackage");
    const policies = localStorage.getItem("acceptedPolicies");

    if (pkg) setSelectedPackage(JSON.parse(pkg));
    setAcceptedPolicies(policies === "true");
  }, []);

  const handleUseCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;

      if (!window.google?.maps?.Geocoder) {
        alert("Google Maps API not loaded");
        return;
      }

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
        if (status === "OK" && results[0]) {
          setCurrentLocation(results[0].formatted_address);
        } else {
          alert("Couldn't fetch address. Please enter manually.");
        }
      });
    },
    (err) => {
      console.error("Geo error:", err);
      alert("We couldn't get your location. Please enter it manually.");
    }
  );
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !fullName.trim() ||
      !phone.phoneNumber.trim() ||
      !detailedAddress.trim()
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (!selectedPackage) {
      alert("Please select a package first");
      return;
    }

    if (!acceptedPolicies) {
      alert("Please accept the policies before booking");
      return;
    }

    const subtotal = selectedPackage.price;
    const total = subtotal + DELIVERY_CHARGE;
    const orderId = generateOrderId(); // ✅ Generate client-side order ID
    const fixedEmail = "john@planB.com";

    const paymentPayload = {
      orderId,
      firstName: fullName,
      phone: phone.countryCode + phone.phoneNumber,
      email: fixedEmail,
      location: currentLocation,
      address: {
        line1: detailedAddress,
        city: "Doha",
        state: "",
        postalCode: "",
        country: "Qatar",
      },
      policyAccepted: true,
      numberOfPeople: selectedPackage.persons,
      deliveryCharge: DELIVERY_CHARGE,
      subtotal,
      total,
      amount: total,
      items: [], // add menu items if needed
      user: {
        name: fullName,
        email: fixedEmail,
        phone: phone.countryCode + phone.phoneNumber,
      },
      specialInstructions: "",
      deliveryDate: new Date().toISOString(),
      deliveryTime: "12:00 PM",
      paymentDetails: {
        paymentMethod: "online",
        amountPaid: total,
        status: "pending",
      },
    };

    try {
      // 1. Create order in backend
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentPayload),
        }
      );

      const result = await res.json();

      if (!result.success) {
        alert("Order creation failed");
        return;
      }

      // 2. Create payment request
      const paymentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          firstName: fullName.split(" ")[0],
          lastName: fullName.split(" ").slice(1).join(" ") || "",
          phone: phone.countryCode + phone.phoneNumber,
          email: fixedEmail,
          orderId,
        }),
      });

      const paymentResult = await paymentRes.json();

      if (!paymentResult.success || !paymentResult.data?.payUrl) {
        alert("Failed to initiate payment");
        return;
      }

      // 3. Redirect to payment URL
      window.location.href = paymentResult.data.payUrl;
    } catch (err) {
      console.error("Booking/Payment error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.bookingForm}>
        <TextField
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          style={{ position: "relative", marginBottom: "1rem" }}
        />

        <PhoneField value={phone} onChange={setPhone} />

        {/* Current Location (readonly) */}
        <div style={{ position: "relative", marginBottom: "1rem" }}>
          <TextField
            value={currentLocation}
            onChange={() => {}} // readonly, no change allowed
            placeholder="Click 'Use Current Location'"
            readOnly
          />
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className={styles.currentLocationBtn}
            style={{ position: "absolute", right: 0, top: 0, height: "100%" }}
          >
            <IoLocationOutline />
          </button>
        </div>

        {/* Detailed Address (manual input) */}
        <TextField
          placeholder="Detailed Address (Zone, Street, House No)"
          value={detailedAddress}
          onChange={(e) => setDetailedAddress(e.target.value)}
          required
          style={{ position: "relative", marginBottom: "1rem" }}
        />

        <div
          className={styles.priceSummary}
          style={{ position: "relative", marginBottom: "1rem" }}
        >
          <h3>Price Summary</h3>
          <p>Item: {selectedPackage ? selectedPackage.price : 0} QR</p>
          <p>Delivery: {DELIVERY_CHARGE} QR</p>
          <hr />
          <p>
            <strong>
              Total:{" "}
              {selectedPackage ? selectedPackage.price + DELIVERY_CHARGE : 0} QR
            </strong>
          </p>
        </div>
        <SecondaryButton
          text="Confirm Booking"
          onClick={handleSubmit}
          style={{ width: "100%" }}
        />
      </form>
      
    </section>
  );
}
