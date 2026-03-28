// app/dashboard/components/AddPaymentMethodModal.js
"use client";

import { useState } from "react";
import { FaTimes, FaCreditCard, FaMobileAlt, FaWallet } from "react-icons/fa";
import styles from "../dashboard.module.css";

const AddPaymentMethodModal = ({ isOpen, onClose, onSuccess }) => {
  const [paymentType, setPaymentType] = useState("card");
  const [formData, setFormData] = useState({
    // Card details
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    // UPI details
    upiId: "",
    // Common
    isDefault: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setError("");
    setSuccess("");
  };

  const validateCard = () => {
    if (!formData.cardNumber.trim()) {
      setError("Card number is required");
      return false;
    }
    const cardNumberClean = formData.cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cardNumberClean)) {
      setError("Please enter a valid card number (13-19 digits)");
      return false;
    }
    
    if (!formData.cardHolder.trim()) {
      setError("Card holder name is required");
      return false;
    }
    
    if (!formData.expiryMonth.trim()) {
      setError("Expiry month is required");
      return false;
    }
    const month = parseInt(formData.expiryMonth);
    if (month < 1 || month > 12) {
      setError("Please enter a valid expiry month (1-12)");
      return false;
    }
    
    if (!formData.expiryYear.trim()) {
      setError("Expiry year is required");
      return false;
    }
    const currentYear = new Date().getFullYear();
    const year = parseInt(formData.expiryYear);
    if (year < currentYear || year > currentYear + 10) {
      setError(`Please enter a valid expiry year (${currentYear}-${currentYear + 10})`);
      return false;
    }
    
    return true;
  };

  const validateUPI = () => {
    if (!formData.upiId.trim()) {
      setError("UPI ID is required");
      return false;
    }
    // Basic UPI ID validation (format: something@provider)
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(formData.upiId)) {
      setError("Please enter a valid UPI ID (e.g., username@bank)");
      return false;
    }
    return true;
  };

  const validateForm = () => {
    if (paymentType === "card") {
      return validateCard();
    } else if (paymentType === "upi") {
      return validateUPI();
    }
    return false;
  };

  const fetchUpdatedUserData = async (token) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch updated user data");
    }
    
    const data = await response.json();
    return data.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        setError("Authentication failed. Please login again.");
        setLoading(false);
        return;
      }
      
      let paymentData;
      if (paymentType === "card") {
        paymentData = {
          type: "card",
          details: {
            cardNumber: formData.cardNumber.replace(/\s/g, ''),
            cardHolder: formData.cardHolder,
            expiryMonth: formData.expiryMonth.padStart(2, '0'),
            expiryYear: formData.expiryYear
          },
          isDefault: formData.isDefault
        };
      } else {
        paymentData = {
          type: "upi",
          details: {
            upiId: formData.upiId
          },
          isDefault: formData.isDefault
        };
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/payment-methods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to add payment method");
      }
      
      setSuccess("Payment method added successfully!");
      
      // Fetch updated user data
      const updatedUser = await fetchUpdatedUserData(token);
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(updatedUser);
        }
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error("Add payment method error:", error);
      setError(error.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Add Payment Method</h3>
          <button className={styles.modalClose} onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.addPaymentForm}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
          
          {success && (
            <div className={styles.successMessage}>
              {success}
            </div>
          )}
          
          {/* Payment Type Selection */}
          <div className={styles.paymentTypeSelector}>
            <button
              type="button"
              className={`${styles.paymentTypeButton} ${paymentType === "card" ? styles.activePaymentType : ""}`}
              onClick={() => setPaymentType("card")}
            >
              <FaCreditCard />
              <span>Card</span>
            </button>
            <button
              type="button"
              className={`${styles.paymentTypeButton} ${paymentType === "upi" ? styles.activePaymentType : ""}`}
              onClick={() => setPaymentType("upi")}
            >
              <FaMobileAlt />
              <span>UPI</span>
            </button>
          </div>
          
          {paymentType === "card" && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="cardNumber" className={styles.formLabel}>
                  <FaCreditCard className={styles.formIcon} />
                  <span>Card Number *</span>
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  disabled={loading}
                  maxLength={19}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="cardHolder" className={styles.formLabel}>
                  <FaWallet className={styles.formIcon} />
                  <span>Card Holder Name *</span>
                </label>
                <input
                  type="text"
                  id="cardHolder"
                  name="cardHolder"
                  value={formData.cardHolder}
                  onChange={handleChange}
                  placeholder="Name as on card"
                  disabled={loading}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="expiryMonth" className={styles.formLabel}>
                    <span>Expiry Month *</span>
                  </label>
                  <input
                    type="text"
                    id="expiryMonth"
                    name="expiryMonth"
                    value={formData.expiryMonth}
                    onChange={handleChange}
                    placeholder="MM"
                    disabled={loading}
                    maxLength={2}
                    className={styles.formInput}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="expiryYear" className={styles.formLabel}>
                    <span>Expiry Year *</span>
                  </label>
                  <input
                    type="text"
                    id="expiryYear"
                    name="expiryYear"
                    value={formData.expiryYear}
                    onChange={handleChange}
                    placeholder="YYYY"
                    disabled={loading}
                    maxLength={4}
                    className={styles.formInput}
                  />
                </div>
              </div>
            </>
          )}
          
          {paymentType === "upi" && (
            <div className={styles.formGroup}>
              <label htmlFor="upiId" className={styles.formLabel}>
                <FaMobileAlt className={styles.formIcon} />
                <span>UPI ID *</span>
              </label>
              <input
                type="text"
                id="upiId"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                placeholder="username@bank"
                disabled={loading}
                className={styles.formInput}
              />
              <small className={styles.formHelper}>
                Example: john@okhdfcbank, user@ybl, etc.
              </small>
            </div>
          )}
          
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                disabled={loading}
              />
              <span>Set as default payment method</span>
            </label>
          </div>
          
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Payment Method"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentMethodModal;