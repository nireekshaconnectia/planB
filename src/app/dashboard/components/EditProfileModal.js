// app/dashboard/components/EditProfileModal.js
"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import styles from "../dashboard.module.css";

const EditProfileModal = ({ isOpen, onClose, user, onSuccess }) => {
  // Initialize form with user data when modal opens
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Update form data when user prop changes or modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || ""
      });
      // Clear any previous messages
      setError("");
      setSuccess("");
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
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
        return;
      }
      
      // Send updated data to PUT /user/me
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuccess("Profile updated successfully!");
        
        // Prepare the updated user data
        const updatedUser = {
          ...user,
          ...formData
        };
        
        // Wait a moment to show success message before closing
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(updatedUser);
          }
          onClose();
        }, 1500);
      } else {
        setError(data.message || "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Edit Profile</h3>
          <button className={styles.modalClose} onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.editProfileForm}>
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
          
          <div className={styles.formGroup}>
            <label htmlFor="name">
              <FaUserCircle className={styles.formIcon} />
              <span>Full Name *</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={loading}
              required
              className={styles.darkTextInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email">
              <FaEnvelope className={styles.formIcon} />
              <span>Email Address *</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              disabled={loading}
              required
              className={styles.darkTextInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="phone">
              <FaPhone className={styles.formIcon} />
              <span>Phone Number</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              disabled={loading}
              className={styles.darkTextInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="address">
              <FaMapMarkerAlt className={styles.formIcon} />
              <span>Address</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              disabled={loading}
              rows={3}
              className={styles.darkTextInput}
            />
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;