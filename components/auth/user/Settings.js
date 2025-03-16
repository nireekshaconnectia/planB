'use client';
import { useState } from 'react';
import styles from './user.module.css';

export default function Settings() {
  const [editing, setEditing] = useState(false);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  return (
    <div className={styles.settingsPage}>
      <div className={styles.settingsDetails}>
        {/* Add your settings sections here */}

        <div className={styles.settingsItem}>
          <div>
            <div className={styles.label}>Section 1</div>
            {/* Placeholder for setting 1 */}
          </div>
          <button className={styles.editBtn} onClick={toggleEdit}>
            {editing ? 'Save' : 'Edit'}
          </button>
        </div>

        <div className={styles.settingsItem}>
          <div>
            <div className={styles.label}>Section 2</div>
            {/* Placeholder for setting 2 */}
          </div>
          <button className={styles.editBtn} onClick={toggleEdit}>
            {editing ? 'Save' : 'Edit'}
          </button>
        </div>

        <div className={styles.settingsItem}>
          <div>
            <div className={styles.label}>Section 3</div>
            {/* Placeholder for setting 3 */}
          </div>
          <button className={styles.editBtn} onClick={toggleEdit}>
            {editing ? 'Save' : 'Edit'}
          </button>
        </div>

        {/* Add more sections as needed */}
      </div>
    </div>
  );
}
