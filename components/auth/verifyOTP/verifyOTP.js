"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./verifyOTP.module.css"; // Use same CSS module

const OTPPopup = ({ onClose, onResend }) => {
  const [otp, setOtp] = useState(""); // Local state to store OTP

  // Function to handle OTP verification
  const handleVerify = () => {
    if (otp.length === 6) {
      // Call onVerify if you have this function in the parent component
      alert(`OTP Verified: ${otp}`);  // You can replace this with actual verification logic
    } else {
      alert("Please enter a valid OTP");
    }
  };

  // Function to trigger OTP resend in parent component
  const handleResend = () => {
    if (onResend) {
      onResend(); // Trigger OTP resend in parent
    }
  };

  return (
    <div className={styles.otpOverlay}>
      <div className={styles.otpPopup}>
        <div className={styles.otpheader}>
          <h2 className={styles.otpTitle}>Verify phone</h2>
          <span onClick={onClose} className={styles.otpcancel}>Cancel</span>
        </div>
        <div className={styles.otpverifyForm}>
          <p>
            A verification code has been sent to your phone +97470657208.
            <span onClick={onClose}> Change phone number</span>
          </p>
          <div>
            <label htmlFor="">Enter the code</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={styles.otpInput}
              maxLength={6} // Limit OTP to 6 digits
            />
          </div>

          <button onClick={handleVerify} className={styles.verifyButton}>
            Submit
          </button>
          <div>
            <label htmlFor="">You haven&apos;t received a code? </label>
            <button
              onClick={handleResend} 
              className={styles.otpresend}>
              Resend
            </button>
          </div>          
        </div>
      </div>
    </div>
  );
};

export default OTPPopup;
