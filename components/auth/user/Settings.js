'use client';
import { useState } from 'react';
import styles from './user.module.css';

export default function Settings() {
  const [editing, setEditing] = useState(false);
  const [settings, setSettings] = useState({
    password: '',
    emailNotifications: true,
    smsNotifications: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const handleSave = () => {
    // Save logic here (API call etc.)
    setEditing(false);
  };

  return (
    <div className={styles.settingsPage}>
      <div className={styles.settingsDetails}>
        {/* Change Password Section */}
        <div className={styles.settingsItem}>
          <div>
            <div className={styles.label}>Change Password</div>
            {editing ? (
              <input
                name="password"
                type="password"
                value={settings.password}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            ) : (
              <p>{settings.password ? '••••••' : 'Not set'}</p>
            )}
          </div>
          <button className={styles.editBtn} onClick={toggleEdit}>
            {editing ? 'Save' : 'Change Password'}
          </button>
        </div>

        {/* Notification Preferences Section */}
        <div className={styles.settingsItem}>
          <div>
            <div className={styles.label}>Email Notifications</div>
            <input
              type="checkbox"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
            />
            <label>Receive email notifications</label>
          </div>
        </div>

        <div className={styles.settingsItem}>
          <div>
            <div className={styles.label}>SMS Notifications</div>
            <input
              type="checkbox"
              name="smsNotifications"
              checked={settings.smsNotifications}
              onChange={handleChange}
            />
            <label>Receive SMS notifications</label>
          </div>
        </div>
      </div>
    </div>
  );
}
