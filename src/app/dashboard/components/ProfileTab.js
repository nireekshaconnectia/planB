// app/dashboard/components/ProfileTab.js
"use client";

import { useState } from "react";
import { 
  FaUserCircle, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEdit,
  FaKey,
  FaCreditCard,
  FaMobileAlt,
  FaPlus,
  FaTrash,
  FaStar
} from "react-icons/fa";
import ChangePasswordModal from "./ChangePasswordModal";
import EditProfileModal from "./EditProfileModal";
import AddPaymentMethodModal from "./AddPaymentMethodModal";
import styles from "../dashboard.module.css";

const ProfileTab = ({ user, onProfileUpdate, onPasswordUpdate }) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const handleProfileSuccess = (updatedUser) => {
    console.log("Profile updated successfully", updatedUser);
    if (onProfileUpdate) {
      onProfileUpdate(updatedUser);
    }
  };

  const handlePasswordSuccess = () => {
    console.log("Password updated successfully");
    if (onPasswordUpdate) {
      onPasswordUpdate();
    }
  };

  const handleAddPaymentSuccess = (updatedUser) => {
    console.log("Payment method added successfully", updatedUser);
    if (onProfileUpdate) {
      onProfileUpdate(updatedUser);
    }
  };

  // Format address for display
  const formatAddress = (addresses) => {
    if (!addresses || addresses.length === 0) return "—";
    
    const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
    if (!defaultAddress) return "—";
    
    const parts = [defaultAddress.street, defaultAddress.city, defaultAddress.state, defaultAddress.pincode]
      .filter(part => part && part.trim());
    
    return parts.length > 0 ? parts.join(", ") : "—";
  };

  // Format payment method details for display
  const formatPaymentDetails = (paymentMethod) => {
    if (paymentMethod.type === 'card') {
      const lastFour = paymentMethod.details.cardNumber.slice(-4);
      return `•••• ${lastFour}`;
    } else if (paymentMethod.type === 'upi') {
      return paymentMethod.details.upiId;
    }
    return '—';
  };

  // Get payment method icon
  const getPaymentIcon = (type) => {
    if (type === 'card') {
      return <FaCreditCard className={styles.paymentIcon} />;
    } else if (type === 'upi') {
      return <FaMobileAlt className={styles.paymentIcon} />;
    }
    return null;
  };

  // Get card brand from number (simple detection)
  const getCardBrand = (cardNumber) => {
    if (!cardNumber) return 'Card';
    const firstDigit = cardNumber[0];
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'Mastercard';
    if (firstDigit === '3') return 'Amex';
    if (firstDigit === '6') return 'Discover';
    return 'Card';
  };

  // Fetch updated user data
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

  // Handle delete payment method
  const handleDeletePayment = async (paymentId) => {
    if (!confirm('Are you sure you want to remove this payment method?')) return;
    
    setLoadingPayment(true);
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        alert("Authentication failed. Please login again.");
        return;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/payment-methods/${paymentId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete payment method");
      }
      
      // Refresh user data
      const updatedUser = await fetchUpdatedUserData(token);
      if (onProfileUpdate) {
        onProfileUpdate(updatedUser);
      }
      
      // Show success message
      alert("Payment method removed successfully");
      
    } catch (error) {
      console.error("Error deleting payment method:", error);
      alert(error.message || "Network error. Please try again.");
    } finally {
      setLoadingPayment(false);
    }
  };

  // Handle set default payment method
  const handleSetDefaultPayment = async (paymentId) => {
    setLoadingPayment(true);
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        alert("Authentication failed. Please login again.");
        return;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/payment-methods/${paymentId}/default`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to set default payment method");
      }
      
      // Refresh user data
      const updatedUser = await fetchUpdatedUserData(token);
      if (onProfileUpdate) {
        onProfileUpdate(updatedUser);
      }
      
      // Show success message
      alert("Default payment method updated successfully");
      
    } catch (error) {
      console.error("Error setting default payment method:", error);
      alert(error.message || "Network error. Please try again.");
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <>
      <div className={styles.profileSection}>
        <div className={styles.sectionHeader}>
          <h2>Profile Details</h2>
          <div className={styles.headerActions}>
            <button
              className={styles.changePasswordButton}
              onClick={() => setIsPasswordModalOpen(true)}
            >
              <FaKey />
              <span>Change Password</span>
            </button>
            <button
              className={styles.editButton}
              onClick={() => setIsEditModalOpen(true)}
            >
              <FaEdit />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        <div className={styles.profileCard}>
          <div className={styles.profileInfo}>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                <FaUserCircle />
                <span>Full Name</span>
              </div>
              <div className={styles.infoValue}>{user?.name || "—"}</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                <FaEnvelope />
                <span>Email</span>
              </div>
              <div className={styles.infoValue}>{user?.email || "—"}</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                <FaPhone />
                <span>Phone Number</span>
              </div>
              <div className={styles.infoValue}>{user?.phoneNumber || "—"}</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                <FaMapMarkerAlt />
                <span>Address</span>
              </div>
              <div className={styles.infoValue}>{formatAddress(user?.addresses)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className={styles.profileSection}>
        <div className={styles.sectionHeader}>
          <h2>Payment Methods</h2>
          <button
            className={styles.addButton}
            onClick={() => setIsAddPaymentModalOpen(true)}
          >
            <FaPlus />
            <span>Add Payment Method</span>
          </button>
        </div>

        <div className={styles.paymentMethodsContainer}>
          {!user?.paymentMethods || user.paymentMethods.length === 0 ? (
            <div className={styles.emptyPaymentState}>
              <FaCreditCard className={styles.emptyIcon} />
              <p>No payment methods added yet</p>
              <button 
                className={styles.addPaymentButton}
                onClick={() => setIsAddPaymentModalOpen(true)}
              >
                Add your first payment method
              </button>
            </div>
          ) : (
            <div className={styles.paymentMethodsGrid}>
              {user.paymentMethods.map((method) => (
                <div key={method._id} className={styles.paymentMethodCard}>
                  <div className={styles.paymentMethodHeader}>
                    <div className={styles.paymentMethodType}>
                      {getPaymentIcon(method.type)}
                      <span className={styles.paymentTypeText}>
                        {method.type === 'card' ? 'Credit/Debit Card' : 'UPI'}
                      </span>
                    </div>
                    {method.isDefault && (
                      <span className={styles.defaultBadge}>
                        <FaStar />
                        Default
                      </span>
                    )}
                  </div>
                  
                  <div className={styles.paymentMethodDetails}>
                    {method.type === 'card' ? (
                      <>
                        <div className={styles.cardBrand}>
                          {getCardBrand(method.details.cardNumber)}
                        </div>
                        <div className={styles.cardNumber}>
                          {formatPaymentDetails(method)}
                        </div>
                        <div className={styles.cardExpiry}>
                          Expires: {method.details.expiryMonth}/{method.details.expiryYear}
                        </div>
                        <div className={styles.cardHolder}>
                          {method.details.cardHolder}
                        </div>
                      </>
                    ) : (
                      <div className={styles.upiId}>
                        {method.details.upiId}
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.paymentMethodActions}>
                    {!method.isDefault && (
                      <button
                        className={styles.setDefaultButton}
                        onClick={() => handleSetDefaultPayment(method._id)}
                        disabled={loadingPayment}
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      className={styles.deletePaymentButton}
                      onClick={() => handleDeletePayment(method._id)}
                      disabled={loadingPayment}
                    >
                      <FaTrash />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSuccess={handleProfileSuccess}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handlePasswordSuccess}
      />

      <AddPaymentMethodModal
        isOpen={isAddPaymentModalOpen}
        onClose={() => setIsAddPaymentModalOpen(false)}
        onSuccess={handleAddPaymentSuccess}
      />
    </>
  );
};

export default ProfileTab;