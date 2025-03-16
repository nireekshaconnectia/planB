'use client';
import { useState } from 'react';
import styles from './user.module.css';

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const handleSave = () => {
    // Save logic here (API call etc.)
    setEditing(false);
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileDetails}>
        <div className={styles.profileItem}>
          <div>
            <div className={styles.label}>Name</div>
            {editing ? (
              <input name="name" value={userData.name} onChange={handleChange} />
            ) : (
              <p>{userData.name}</p>
            )}
          </div>
          <button className={styles.editBtn} onClick={toggleEdit}>{editing ? 'Save' : 'Edit'}</button>
        </div>
        <div className={styles.profileItem}>
          <div>
            <div className={styles.label}>Email</div>
            {editing ? (
              <input name="email" value={userData.email} onChange={handleChange} />
            ) : (
              <p>{userData.email}</p>
            )}
          </div>
          <button className={styles.editBtn} onClick={toggleEdit}>{editing ? 'Save' : 'Edit'}</button>
        </div>
        <div className={styles.profileItem}>
          <div>
            <div className={styles.label}>Phone</div>
            {editing ? (
              <input name="phone" value={userData.phone} onChange={handleChange} />
            ) : (
              <p>{userData.phone}</p>
            )}
          </div>
          <button className={styles.editBtn} onClick={toggleEdit}>{editing ? 'Save' : 'Edit'}</button>
        </div>
      </div>
    </div>
  );
}
