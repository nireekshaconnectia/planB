"use client";

import React, { useEffect, useState, useRef } from "react";
import { TextField } from "@/components/forms/fields/TextField";
import { PhoneField } from "@/components/forms/fields/PhoneField";
import styles from "./catering.module.css";
import { IoLocationOutline } from "react-icons/io5";
import { SecondaryButton } from "@/components/buttons/Buttons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslations } from "next-intl";

const DELIVERY_CHARGE = 170;

export default function BookingForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState({ countryCode: "+974", phoneNumber: "" });
  const [currentLocation, setCurrentLocation] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const t = useTranslations();

  const autocompleteRef = useRef(null);
  const detailedAddressRef = useRef(null);

  function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `CTR-${timestamp}-${random}`;
  }

  const handleStartTimeChange = (value) => {
    setStartTime(value);
  };

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
        geocoder.geocode(
          { location: { lat: latitude, lng: longitude } },
          (results, status) => {
            if (status === "OK" && results[0]) {
              setCurrentLocation(results[0].formatted_address);
            } else {
              alert("Couldn't fetch address. Please enter manually.");
            }
          }
        );
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
    const orderId = generateOrderId();
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
      user: {
        name: fullName,
        email: fixedEmail,
        phone: phone.countryCode + phone.phoneNumber,
      },
      specialInstructions: "",
      deliveryDate: date ? date.toISOString() : null,
      deliveryTime: startTime || null,
      paymentDetails: {
        paymentMethod: "online",
        amountPaid: total,
        status: "pending",
      },
    };

    try {
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

      const paymentRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/create`,
        {
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
        }
      );

      const paymentResult = await paymentRes.json();

      if (!paymentResult.success || !paymentResult.data?.payUrl) {
        alert("Failed to initiate payment");
        return;
      }

      // ✅ Reset form before redirect
      setFullName("");
      setPhone({ countryCode: "+974", phoneNumber: "" });
      setCurrentLocation("");
      setDetailedAddress("");
      setDate(null);
      setStartTime("");
      localStorage.removeItem("selectedPackage");
      localStorage.removeItem("acceptedPolicies");

      // Redirect to payment page
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
          placeholder={t("full-name")}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          style={{ position: "relative", marginBottom: "1rem" }}
        />

        <PhoneField value={phone} onChange={setPhone} />

        <div style={{ position: "relative", marginBottom: "1rem" }}>
          <TextField
            value={currentLocation}
            onChange={() => {}}
            placeholder={t("current-location")}
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

        <TextField
          placeholder={t("detailed-address")}
          value={detailedAddress}
          onChange={(e) => setDetailedAddress(e.target.value)}
          required
          style={{ position: "relative", marginBottom: "1rem" }}
        />

        <div className={styles.dateTimeRow}>
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
            className={styles.input}
            placeholderText={t("select-date")}
          />
          <DatePicker
            selected={
              startTime
                ? new Date(`1970-01-01T${startTime}`)
                : new Date(1970, 0, 1, 8, 0)
            }
            onChange={(date) => {
              const hours = date.getHours().toString().padStart(2, "0");
              const mins = date.getMinutes().toString().padStart(2, "0");
              handleStartTimeChange(`${hours}:${mins}`);
            }}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            timeCaption={t("select-time")}
            dateFormat="HH:mm"
            minTime={new Date(1970, 0, 1, 8, 0)}
            maxTime={new Date(1970, 0, 1, 22, 0)}
            className={styles.input}
            placeholderText={t("select-time")}
          />
        </div>

        <div
          className={styles.priceSummary}
          style={{ position: "relative", marginBottom: "1rem" }}
        >
          <h3>{t("price-summary")}</h3>
          
          <ul className={styles.priceSummaryli} >
            <li>
              <p>{t("package")}: </p>
              <p>
                {selectedPackage
                  ? `${selectedPackage.persons} ${t("persons")}`
                  : "0"}
              </p>
            </li>
            <li>
              
            <p>{t("price")}:{""}</p>
            <p>{selectedPackage ? selectedPackage.price + " QR": "0 QR"}</p>
          
            </li>
            <li>
              <p>{t("delivery")}:</p><p> {DELIVERY_CHARGE + " QR "} </p>
            </li>
            <br /><hr /><br />
            <li>
              <strong><p>{t("total")}:{""}</p></strong>
              <p>{selectedPackage ? selectedPackage.price + DELIVERY_CHARGE + " QR" : 0}</p>
            </li>
          </ul>

          
          
        </div>

        <SecondaryButton
          text={t("confirm-booking")}
          onClick={handleSubmit}
          style={{ width: "100%" }}
        />
      </form>
    </section>
  );
}
