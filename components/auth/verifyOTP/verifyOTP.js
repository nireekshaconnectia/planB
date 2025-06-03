"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Auth
import styles from "./verifyOTP.module.css"; // Import CSS module
import { useSearchParams } from "next/navigation";

const OTPPopup = ({ onClose, onResend, phoneNumber, confirmationResult }) => {
  const [otp, setOtp] = useState(""); 
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const router = useRouter(); // Initialize Next.js router
  const auth = getAuth(); // Get Firebase auth instance

  // ✅ Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ User already logged in:", user);
       router.push(redirectTo);
      }
    });

    return () => unsubscribe(); // Cleanup function
  }, [auth, router]);

  // Function to handle OTP verification
  const handleVerify = async () => {
    if (!confirmationResult) {
      setError("Something went wrong. Please try again.");
      return;
    }
  
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
  
    try {
      // Confirm the OTP code using Firebase's confirmation result
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      // Fetch the Firebase ID token (this is the correct token to use)
      const firebaseToken = await user.getIdToken(); // Get Firebase ID token
  
      console.log("Firebase ID Token:", firebaseToken); // Log to ensure it's correct
  
      const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseToken}`, // Send the token in Authorization header
        },
        body: JSON.stringify({ phoneNumber: user.phoneNumber }),
      });
  
      const userData = await loginResponse.json();
      console.log("User created or fetched:", userData);
  
      if (userData.success) {
        // Save Firebase token and user data in localStorage
        localStorage.setItem("userToken", firebaseToken); // Store the actual Firebase ID token
        localStorage.setItem("userData", JSON.stringify(userData.user)); // Store user data
  
        onClose(); // Close the OTP popup
        router.push(redirectTo);  // Redirect Back
      } else {
        setError("User verification failed. Try again.");
      }
  
    } catch (error) {
      console.error("OTP verification error:", error);
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
            <label>You haven&apos;t received a code? </label>
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
