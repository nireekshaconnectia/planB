"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Auth
import styles from "./verifyOTP.module.css"; // Import CSS module

const OTPPopup = ({ onClose, onResend, phoneNumber, confirmationResult }) => {
  const [otp, setOtp] = useState(""); 
  const [error, setError] = useState("");
  const router = useRouter(); // Initialize Next.js router
  const auth = getAuth(); // Get Firebase auth instance

  // ✅ Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ User already logged in:", user);
        router.push("/"); // Redirect to home if user is logged in
      }
    });

    return () => unsubscribe(); // Cleanup function
  }, [auth, router]);

  // Function to handle OTP verification
  const handleVerify = async () => {
    if (!confirmationResult) {
      console.error("❌ Error: confirmationResult is undefined.");
      setError("Something went wrong. Please try again.");
      return;
    }
  
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
  
    try {
      const result = await confirmationResult.confirm(otp); // Verify OTP
      console.log("✅ OTP Verified Successfully:", result.user);
      alert("🎉 Login Successful!");
      onClose(); // Close popup after successful verification
      router.push("/"); // Redirect to home page
    } catch (error) {
      console.error("❌ Error verifying OTP:", error);
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className={styles.otpOverlay}>
      <div className={styles.otpPopup}>
        <div className={styles.otpheader}>
          <h2 className={styles.otpTitle}>Verify Phone</h2>
          <span onClick={onClose} className={styles.otpcancel}>Cancel</span>
        </div>
        <div className={styles.otpverifyForm}>
          <p>
            A verification code has been sent to <strong>{phoneNumber}</strong>.
            <span onClick={onClose}> Change phone number</span>
          </p>
          <div>
            <label>Enter the code</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={styles.otpInput}
              maxLength={6}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}

          <button onClick={handleVerify} className={styles.verifyButton}>
            Submit
          </button>
          <div>
            <label>You haven't received a code? </label>
            <button onClick={onResend} className={styles.otpresend}>
              Resend
            </button>
          </div>          
        </div>
      </div>
    </div>
  );
};

export default OTPPopup;
