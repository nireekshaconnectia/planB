'use client';
import { useState, useEffect } from 'react';
import styles from './user.module.css';  // Assuming you're using a CSS module for styling

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'User', // Default Name
    email: 'user@gmail.com', // Default Email
    phone: '0000000000', // Default Phone
  });

  // Fetch profile data when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    // Fetch user profile details
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Extract the correct values from the response
          const { name, email, phoneNumber } = data.data; // Use 'data.data' to get the user profile data
          
          // Set the profile data or use defaults if missing
          setUserData({
            name: name || 'User',
            email: email || 'user@gmail.com',
            phone: phoneNumber || '0000000000',  // Ensure phoneNumber is shown
          });
        } else {
          // Handle the case where data isn't returned successfully
          setUserData({
            name: 'User',
            email: 'user@gmail.com',
            phone: '0000000000',
          });
        }
      })
      .catch((err) => {
        console.error('Failed to fetch profile', err);
      });
  }, []);

  // Handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setEditing(!editing);
  };

  // Save updated profile data
  const handleSave = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      alert('✅ Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('❌ Failed to update profile');
    }
  };

  return (
    <div className={styles.profilePage}>
      
      <div className={styles.profileDetails}>
        <div className={styles.profileItem}>
          <label className={styles.label}>Name</label>
          {editing ? (
            <input name="name" value={userData.name} onChange={handleChange} className={styles.inputField} />
          ) : (
            <p>{userData.name}</p>
          )}
        </div>
        <div className={styles.profileItem}>
          <label className={styles.label}>Email</label>
          {editing ? (
            <input name="email" value={userData.email} onChange={handleChange} className={styles.inputField} />
          ) : (
            <p>{userData.email}</p>
          )}
        </div>
        <div className={styles.profileItem}>
          <label className={styles.label}>Phone</label>
          <p>{userData.phone}</p>
        </div>

        <div className={styles.profileActions}>
          {editing ? (
            <button className={styles.saveBtn} onClick={handleSave}>Save</button>
          ) : (
            <button className={styles.editBtn} onClick={toggleEdit}>Edit</button>
          )}
        </div>
      </div>
    </div>
  );
}
