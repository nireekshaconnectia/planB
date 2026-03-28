// app/dashboard/components/EditProfileModal.js
"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaMapPin } from "react-icons/fa";
import styles from "../dashboard.module.css";

const EditProfileModal = ({ isOpen, onClose, user, onSuccess }) => {
  // Initialize form with user data when modal opens
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "", // Changed from phone to phoneNumber to match API
    address: {
      street: "",
      city: "",
      state: "",
      pincode: ""
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addressId, setAddressId] = useState(null); // Store address ID if exists

  // Update form data when user prop changes or modal opens
  useEffect(() => {
    if (isOpen && user) {
      // Find default address or first address
      const defaultAddress = user.addresses?.find(addr => addr.isDefault) || user.addresses?.[0];
      
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "", // Using phoneNumber from API
        address: {
          street: defaultAddress?.street || "",
          city: defaultAddress?.city || "",
          state: defaultAddress?.state || "",
          pincode: defaultAddress?.pincode || ""
        }
      });
      setAddressId(defaultAddress?._id || null);
      // Clear any previous messages
      setError("");
      setSuccess("");
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
    
    // Validate address if any address field is filled
    const hasAnyAddressField = Object.values(formData.address).some(value => value && value.trim());
    if (hasAnyAddressField) {
      // If any address field is filled, validate all fields
      if (!formData.address.street?.trim()) {
        setError("Street address is required when providing address");
        return false;
      }
      if (!formData.address.city?.trim()) {
        setError("City is required when providing address");
        return false;
      }
      if (!formData.address.state?.trim()) {
        setError("State is required when providing address");
        return false;
      }
      if (!formData.address.pincode?.trim()) {
        setError("Pincode is required when providing address");
        return false;
      }
      if (!/^\d{5,6}$/.test(formData.address.pincode.trim())) {
        setError("Please enter a valid pincode (5-6 digits)");
        return false;
      }
    }
    
    return true;
  };

  const updateUserProfile = async (token) => {
    // Update basic user info - using phoneNumber to match API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber // Changed from phone to phoneNumber
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update profile");
    }
    
    return await response.json();
  };

  const updateAddress = async (token) => {
    const hasAddressData = Object.values(formData.address).some(value => value && value.trim());
    
    if (!hasAddressData) {
      // If no address data, return null (no address to update)
      return null;
    }
    
    const addressData = {
      type: "home",
      street: formData.address.street,
      city: formData.address.city,
      state: formData.address.state,
      pincode: formData.address.pincode,
      isDefault: true
    };
    
    let response;
    
    if (addressId) {
      // Update existing address
      response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/addresses/${addressId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });
    } else {
      // Create new address
      response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });
    }
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || "Failed to update address");
    }
    
    return result.data;
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
      
      // Update user profile
      const userResponse = await updateUserProfile(token);
      
      if (!userResponse.success) {
        throw new Error(userResponse.message || "Failed to update profile");
      }
      
      // Update or create address
      let updatedAddress = null;
      try {
        updatedAddress = await updateAddress(token);
      } catch (addressError) {
        console.error("Address update error:", addressError);
        // Don't fail the whole profile update if address update fails
        setError(`Profile updated but address update failed: ${addressError.message}`);
      }
      
      setSuccess("Profile updated successfully!");
      
      // Prepare the updated user data
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber, // Using phoneNumber to match API
        addresses: updatedAddress 
          ? (user.addresses?.filter(addr => addr._id !== addressId) || []).concat([updatedAddress])
          : user.addresses
      };
      
      // Wait a moment to show success message before closing
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(updatedUser);
        }
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error("Profile update error:", error);
      setError(error.message || "Network error. Please try again.");
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
          
          {/* Basic Information Section */}
          <div className={styles.formSection}>
            <h4 className={styles.sectionTitle}>Basic Information</h4>
            
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
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
                className={styles.formInput}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
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
                className={styles.formInput}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phoneNumber" className={styles.formLabel}>
                <FaPhone className={styles.formIcon} />
                <span>Phone Number</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                disabled={loading}
                className={styles.formInput}
              />
            </div>
          </div>
          
          {/* Address Information Section */}
          <div className={styles.formSection}>
            <h4 className={styles.sectionTitle}>Address Information</h4>
            
            <div className={styles.formGroup}>
              <label htmlFor="address.street" className={styles.formLabel}>
                <FaMapMarkerAlt className={styles.formIcon} />
                <span>Street Address</span>
              </label>
              <textarea
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="Enter your street address"
                disabled={loading}
                rows={2}
                className={styles.formTextarea}
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="address.city" className={styles.formLabel}>
                  <FaCity className={styles.formIcon} />
                  <span>City</span>
                </label>
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="City"
                  disabled={loading}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="address.state" className={styles.formLabel}>
                  <FaMapPin className={styles.formIcon} />
                  <span>State</span>
                </label>
                <input
                  type="text"
                  id="address.state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="State"
                  disabled={loading}
                  className={styles.formInput}
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="address.pincode" className={styles.formLabel}>
                <FaMapPin className={styles.formIcon} />
                <span>Pincode</span>
              </label>
              <input
                type="text"
                id="address.pincode"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleChange}
                placeholder="Pincode (5-6 digits)"
                disabled={loading}
                maxLength={6}
                className={styles.formInput}
              />
            </div>
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