"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import BackButton from "@/components/backbutton/backbutton"; 
import Flags from "country-flag-icons/react/3x2";
import styles from "./feedback.module.css"; // Using same styles as LoginPage
import { FaStar } from "react-icons/fa"; // Star rating icon

const countries = {
  "+974": { name: "QA", flag: Flags.QA }, // Qatar
  "+971": { name: "AE", flag: Flags.AE }, // UAE
  "+91": { name: "IN", flag: Flags.IN },  // India
  "+1": { name: "US", flag: Flags.US },   // USA
  "+44": { name: "GB", flag: Flags.GB },  // UK
  "+33": { name: "FR", flag: Flags.FR },  // France
  "+49": { name: "DE", flag: Flags.DE },  // Germany
};

const Feedback = () => {
  const [countryCode, setCountryCode] = useState("+974"); // Default Qatar
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const t = useTranslations();

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value.replace(/[^0-9]/g, "");
    setPhoneNumber(input);
  };

  const handleCountryCodeChange = (e) => {
    const inputCode = e.target.value.replace(/[^0-9+]/g, "");
    setCountryCode(inputCode || "+");
  };

  const currentCountry = countries[countryCode] || { name: "Unknown", flag: () => <span>🌍</span> };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = {
      phone: `${countryCode}${phoneNumber}`,
      rating,
      feedback,
    };

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        alert(t("feedback-submitted"));
        setPhoneNumber("");
        setRating(0);
        setFeedback("");
      } else {
        alert(t("feedback-error"));
      }
    } catch (error) {
      console.error("API request failed:", error);
      alert(t("feedback-error-general"));
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        {/* Back Button */}
        <div className={styles.mb4}>
          <BackButton />
        </div>
        <h1 className={styles.loginTitle}>{t("feedback-title")}</h1>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          {/* Star Rating Input */}
          <div className={styles.starRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={24}
                className={styles.star}
                color={star <= rating ? "#ffc107" : "#e4e5e9"}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          {/* Phone Number Input */}
          <label htmlFor="phoneNumber" className={styles.label}>
            {t("your-phone-number")}
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
              placeholder={t("your-phone-number")}
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className={styles.phoneInput}
            />
          </div>

          {/* Feedback Text Field */}
          <label className={styles.label}>{t("feedback")}</label>
          <textarea
            rows="6"
            className={styles.feedbackInput}
            placeholder={t("write-feedback")}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>

          {/* Submit Button (Disabled Until Rating is Selected) */}
          <button
            type="submit"
            className={styles.continueButton}
            disabled={rating === 0} // Button disabled if no star is selected
          >
            {t("submit-feedback")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
