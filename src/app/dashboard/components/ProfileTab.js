// app/dashboard/components/ProfileTab.js
"use client";

import { useState } from "react";
import { 
  FaUserCircle, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEdit,
  FaKey 
} from "react-icons/fa";
import ChangePasswordModal from "./ChangePasswordModal";
import EditProfileModal from "./EditProfileModal";
import styles from "../dashboard.module.css";

const ProfileTab = ({ user, onProfileUpdate, onPasswordUpdate }) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleProfileSuccess = (updatedUser) => {
    console.log("Profile updated successfully", updatedUser);
    // Call the parent handler to update the user state in dashboard
    if (onProfileUpdate) {
      onProfileUpdate(updatedUser);
    }
  };

  const handlePasswordSuccess = () => {
    console.log("Password updated successfully");
    // Call the parent handler if provided
    if (onPasswordUpdate) {
      onPasswordUpdate();
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
              <div className={styles.infoValue}>{user?.phone || "—"}</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                <FaMapMarkerAlt />
                <span>Address</span>
              </div>
              <div className={styles.infoValue}>{user?.address || "—"}</div>
            </div>
          </div>
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
    </>
  );
};

export default ProfileTab;