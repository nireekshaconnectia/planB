"use client";
import { useEffect, useRef } from "react";
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";

export default function Recaptcha({ onReady }) {
  const recaptchaVerifierRef = useRef(null);

  useEffect(() => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA solved:", response);
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired. Please try again.");
        },
      });

      recaptchaVerifierRef.current.render().then((widgetId) => {
        if (onReady) onReady(recaptchaVerifierRef.current);
      });
    }
  }, [onReady]);

  return <div id="recaptcha-container"></div>;
}
