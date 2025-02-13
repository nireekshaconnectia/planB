"use client";
import { useState } from "react";
import Flags from "country-flag-icons/react/3x2";
import BackButton from "@/components/backbutton/backbutton";
import OTPPopup from "@/components/auth/verifyOTP/verifyOTP";
import Recaptcha from "@/components/auth/recaptcha/Recaptcha";
import styles from "./login.module.css";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";

const countries = {
  "+974": { name: "QA", flag: Flags.QA }, // Qatar
  "+971": { name: "AE", flag: Flags.AE }, // UAE
  "+91": { name: "IN", flag: Flags.IN },  // India
  "+1": { name: "US", flag: Flags.US },   // USA
  "+44": { name: "GB", flag: Flags.GB },  // UK
  "+33": { name: "FR", flag: Flags.FR },  // France
  "+49": { name: "DE", flag: Flags.DE },  // Germany
};

const LoginPage = () => {
  const [countryCode, setCountryCode] = useState("+971"); // Default UAE
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOTPPopup, setShowOTPPopup] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

  const handleCountryCodeChange = (e) => {
    const inputCode = e.target.value.replace(/[^0-9+]/g, ""); // Allow only numbers & '+'
    setCountryCode(inputCode || "+"); // Ensure there's always at least '+'
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    try {
      if (!recaptchaVerifier) {
        alert("reCAPTCHA not ready. Please wait.");
        return;
      }

      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, recaptchaVerifier);

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

  const currentCountry = countries[countryCode] || { name: "Unknown", flag: () => <span>🌍</span> }; // Show globe emoji or default

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
              <currentCountry.flag className="w-6 h-4 mr-2" />
              <input
                type="text"
                value={countryCode}
                onChange={handleCountryCodeChange}
                className={styles.countryCodeInput}
                maxLength="4"
              />
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

        <Recaptcha onReady={setRecaptchaVerifier} />
      </div>
    </div>
  );
};

export default LoginPage;
