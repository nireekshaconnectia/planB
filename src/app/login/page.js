"use client";
import { useState, useEffect, useRef } from "react";
import Flags from "country-flag-icons/react/3x2";
import BackButton from "@/components/backbutton/backbutton";
import OTPPopup from "@/components/auth/verifyOTP/verifyOTP";
import styles from "./login.module.css";
import { auth } from "@/lib/firebase/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const LoginPage = () => {
  const countries = [
    { code: "+91", name: "IN", flag: Flags.IN },
    { code: "+1", name: "US", flag: Flags.US },
    { code: "+44", name: "GB", flag: Flags.GB },
    { code: "+33", name: "FR", flag: Flags.FR },
    { code: "+49", name: "DE", flag: Flags.DE },
  ];

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOTPPopup, setShowOTPPopup] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Ref to hold reCAPTCHA instance
  const recaptchaVerifierRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA solved:", response);
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired. Try again.");
        },
      });

      recaptchaVerifierRef.current.render().then((widgetId) => {
        console.log("reCAPTCHA Widget ID:", widgetId);
      });
    }
  }, []);

  const handleCountryChange = (e) => {
    const selected = countries.find((c) => c.code === e.target.value);
    setSelectedCountry(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullPhoneNumber = `${selectedCountry.code}${phoneNumber}`;

    try {
      if (!recaptchaVerifierRef.current) {
        alert("reCAPTCHA is not loaded properly. Please refresh the page.");
        return;
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        fullPhoneNumber,
        recaptchaVerifierRef.current
      );
      console.log("OTP Sent Successfully");
      setConfirmationResult(confirmation);
      setShowOTPPopup(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert(`Failed to send OTP: ${error.message}`);
    }
  };

  const handleVerifyOTP = async (otp) => {
    try {
      const result = await confirmationResult.confirm(otp);
      console.log("OTP Verified Successfully:", result.user);
      setShowOTPPopup(false);
      alert("Login Successful!");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.mb4}>
          <BackButton />
        </div>

        <h1 className={styles.loginTitle}>Login</h1>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <label htmlFor="phoneNumber" className={styles.label}>
            Phone Number
          </label>
          <div className={styles.inputGroup}>
            <div className={styles.countrySelector}>
              <selectedCountry.flag className="w-6 h-4 mr-2" />
              <select onChange={handleCountryChange} className={styles.select}>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              id="phoneNumber"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={styles.phoneInput}
            />
          </div>
          <button type="submit" className={styles.continueButton}>
            Continue
          </button>
        </form>

        {showOTPPopup && (
          <OTPPopup onClose={() => setShowOTPPopup(false)} onVerify={handleVerifyOTP} />
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default LoginPage;
