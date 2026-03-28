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
import Header from "../layout/Header";
import AdditionalNote from "@/components/forms/UserForms/additionalNote";
import PopupWrapper from "@/components/popup/popupWrapper";
import Image from 'next/image';

const fallbackPolicies = ["policy1", "policy2", "policy3", "policy4", "policy5", "policy6", "policy7"];
const DELIVERY_CHARGE = 170;

export default function BookingForm() {
  const t = useTranslations();

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState({ countryCode: "+974", phoneNumber: "" });
  const [currentLocation, setCurrentLocation] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");
  
  // Package state
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedOptional, setSelectedOptional] = useState([]);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  // UI state
  const [showAdditionalNotePopup, setShowAdditionalNotePopup] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const pkg = localStorage.getItem("selectedPackage");
    const selectedOptionalRaw = localStorage.getItem("selectedMenuItems");

    if (pkg) setSelectedPackage(JSON.parse(pkg));
    try {
      const parsedOptional = selectedOptionalRaw ? JSON.parse(selectedOptionalRaw) : [];
      setSelectedOptional(parsedOptional);
    } catch {
      setSelectedOptional([]);
    }
  }, []);

  function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `CTR-${timestamp}-${random}`;
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(t("geolocation_not_supported") || "Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        
        if (!window.google?.maps?.Geocoder) {
          alert(t("google_maps_not_loaded") || "Google Maps API not loaded. Please enter location manually.");
          setIsGettingLocation(false);
          return;
        }

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat: latitude, lng: longitude } },
          (results, status) => {
            setIsGettingLocation(false);
            if (status === "OK" && results[0]) {
              setCurrentLocation(results[0].formatted_address);
            } else {
              alert(t("location_fetch_error") || "Couldn't fetch address. Please enter manually.");
            }
          }
        );
      },
      (err) => {
        setIsGettingLocation(false);
        console.error("Geo error:", err);
        
        let errorMessage = t("location_error") || "We couldn't get your location. Please enter it manually.";
        if (err.code === 1) {
          errorMessage = t("location_permission_denied") || "Location permission denied. Please enter your location manually.";
        } else if (err.code === 2) {
          errorMessage = t("location_unavailable") || "Location information is unavailable. Please enter manually.";
        }
        alert(errorMessage);
      }
    );
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Validation
    if (!fullName.trim()) {
      alert(t("full_name_required") || "Please enter your full name");
      return;
    }
    
    if (!phone.phoneNumber.trim()) {
      alert(t("phone_required") || "Please enter your phone number");
      return;
    }
    
    if (!currentLocation.trim()) {
      alert(t("location_required") || "Please enter your current location");
      return;
    }
    
    if (!detailedAddress.trim()) {
      alert(t("detailed_address_required") || "Please enter your detailed address");
      return;
    }

    if (!selectedPackage) {
      alert(t("package_required") || "Please select a package first");
      return;
    }
    
    if (!acceptedPolicies) {
      alert(t("accept_policies_warning") || "Please accept policies to continue");
      return;
    }
    
    if (!date) {
      alert(t("date_required") || "Please select delivery date");
      return;
    }
    
    if (!startTime) {
      alert(t("time_required") || "Please select delivery time");
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
      address: { line1: detailedAddress, city: "Doha", country: "Qatar" },
      policyAccepted: true,
      numberOfPeople: selectedPackage.persons,
      selectedPackage: selectedPackage.name,
      selectedOptional,
      deliveryCharge: DELIVERY_CHARGE,
      subtotal,
      total,
      amount: total,
      user: { name: fullName, email: fixedEmail, phone: phone.countryCode + phone.phoneNumber },
      specialInstructions: additionalNote,
      deliveryDate: date ? date.toISOString() : null,
      deliveryTime: startTime,
      paymentDetails: { paymentMethod: "online", amountPaid: total, status: "pending" },
    };

    try {
      // Step 1: Create Order
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
      });
      const result = await res.json();
      if (!result.success) {
        alert(t("order_creation_failed") || "Order creation failed");
        return;
      }

      // Step 2: Get Payment URL
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
        alert(t("payment_initiation_failed") || "Failed to initiate payment");
        return;
      }

      localStorage.removeItem("selectedPackage");
      localStorage.removeItem("selectedMenuItems");
      window.location.href = paymentResult.data.payUrl;
    } catch (err) {
      console.error("Booking error:", err);
      alert(t("something_went_wrong") || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className={styles.pageContainer}>
      <Header />
      
      <div className={styles.titleWrapper}>
        <h1 className={styles.mainTitle}>{t("booking_details")}</h1>
      </div>

      <form className={styles.formWrapper} onSubmit={handleSubmit}>
        <div className={styles.desktopSplitLayout}>
          
          {/* LEFT COLUMN: INPUTS */}
          <div className={styles.inputColumn}>
            <TextField
              placeholder={t("full-name")}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <PhoneField value={phone} onChange={setPhone} />

            <div className={styles.locationContainer}>
              <div className={styles.locationInputWrapper}>
                <TextField
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  placeholder={t("current-location")}
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className={styles.locationButton}
                disabled={isGettingLocation}
              >
                <IoLocationOutline />
                {isGettingLocation ? t("getting_location") || "Getting..." : t("use-my-location") || "Use My Location"}
              </button>
            </div>

            <TextField
              placeholder={t("detailed-address")}
              value={detailedAddress}
              onChange={(e) => setDetailedAddress(e.target.value)}
              required
            />

            <div className={styles.dateTimeRow}>
              <DatePicker
                selected={date}
                onChange={(d) => setDate(d)}
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
                className={styles.styledDateInput}
                placeholderText={t("select-date")}
                required
              />
              <DatePicker
                selected={startTime ? new Date(`1970-01-01T${startTime}`) : null}
                onChange={(date) => {
                  const hours = date.getHours().toString().padStart(2, "0");
                  const mins = date.getMinutes().toString().padStart(2, "0");
                  setStartTime(`${hours}:${mins}`);
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                dateFormat="HH:mm"
                className={styles.styledDateInput}
                placeholderText={t("select-time")}
                required
              />
            </div>
          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className={styles.summaryColumn}>
            <div className={styles.noteCard}>
              <h3 className={styles.noteTitle}>{t("price-summary")}</h3>
              
              <div className={styles.summaryList}>
                <div className={styles.summaryItem}>
                  <span>{t("package")}</span>
                  <span>{selectedPackage ? `${selectedPackage.persons} ${t("persons")}` : "0"}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>{t("price")}</span>
                  <span>{selectedPackage ? `${selectedPackage.price} QR` : "0 QR"}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>{t("delivery")}</span>
                  <span>{DELIVERY_CHARGE} QR</span>
                </div>
                
                {additionalNote.trim() && (
                  <div className={styles.summaryItem}>
                    <span>{t("note")}</span>
                    <span className={styles.noteText}>{additionalNote}</span>
                  </div>
                )}
                
                <button 
                  type="button"
                  className={styles.textLinkButton}
                  onClick={() => setShowAdditionalNotePopup(true)}
                >
                  {additionalNote.trim() ? t("update-note") : t("add-note")}
                </button>

                <div className={styles.totalRow}>
                  <span>{t("total")}</span>
                  <span>{selectedPackage ? selectedPackage.price + DELIVERY_CHARGE : 0} QR</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.noteCard}>
          <h3 className={styles.noteTitle}>{t("policies.title")}</h3>
          <ul className={`${styles.policyList} ${showAll ? styles.expanded : ""}`}>
            {fallbackPolicies.map((policy, index) => (
              <li key={index} className={styles.policyItem}>
                <div className={styles.policyIconWrapper}>
                  <Image src="/option.png" alt="icon" width={18} height={18} />
                </div>
                <span>{t(`policies.${policy}`)}</span>
              </li>
            ))}
          </ul>

          <div className={styles.checkboxWrapper}>
            <input
              type="checkbox"
              id="acceptPolicy"
              checked={acceptedPolicies}
              onChange={(e) => setAcceptedPolicies(e.target.checked)}
              className={styles.hiddenCheckbox}
            />
            <label htmlFor="acceptPolicy" className={styles.customCheckboxLabel}>
              <div className={`${styles.checkboxBox} ${acceptedPolicies ? styles.checked : ''}`}>
                {acceptedPolicies && "✓"}
              </div>
              <span>{t("policies.iaccept")}</span>
            </label>
          </div>
        </div>

        <div className={styles.bottomAction}>
          <SecondaryButton
            text={t("confirm-booking")}
            onClick={handleSubmit}
            style={{ width: "100%", maxWidth: "500px" }}
          />
        </div>
      </form>

      <PopupWrapper
        isOpen={showAdditionalNotePopup}
        onClose={() => setShowAdditionalNotePopup(false)}
        title={t("add-note")}
      >
        <AdditionalNote
          note={additionalNote} 
          setNote={setAdditionalNote} 
          setShowAdditionalNotePopup={setShowAdditionalNotePopup} 
        />
      </PopupWrapper>
    </section>
  );
}