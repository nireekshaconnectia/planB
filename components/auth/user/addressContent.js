'use client';
import { useState, useEffect } from 'react';
import styles from './user.module.css'; // Assuming you have styles for the address component

export default function AddressContent() {
  const [addresses, setAddresses] = useState([]); // Store saved addresses
  const [address, setAddress] = useState({
    type: 'home',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // For opening/closing the modal
  const [isEditMode, setIsEditMode] = useState(false); // To check if we're editing an address

  // Fetch addresses when the component mounts or when adding/editing an address
  const fetchAddresses = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch addresses');
      const data = await response.json();
      setAddresses(data.data.addresses); // Fetching the addresses from 'data.addresses'
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  // Call fetchAddresses when the component mounts
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for adding or editing address
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('userToken');
    if (!token) return alert('You must be logged in to add an address.');

    setLoading(true);
    setError(null);
    setSuccess(null);

    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode
      ? `${process.env.NEXT_PUBLIC_API_URL}/users/addresses/${address._id}` // Assuming address has an ID for editing
      : `${process.env.NEXT_PUBLIC_API_URL}/users/addresses`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      });

      if (!response.ok) throw new Error('Failed to save address');

      const data = await response.json();
      if (data.success) {
        setSuccess(isEditMode ? '✅ Address updated successfully!' : '✅ Address added successfully!');
        setIsModalOpen(false);
        setAddress({
          type: 'home',
          street: '',
          city: '',
          state: '',
          pincode: '',
          isDefault: false,
        }); // Reset the form
        setIsEditMode(false); // Reset edit mode

        // Re-fetch addresses after adding or editing
        fetchAddresses();
      } else {
        throw new Error('Failed to save address');
      }
    } catch (err) {
      setError('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Open the modal for adding a new address
  const openAddModal = () => {
    setIsModalOpen(true);
    setIsEditMode(false);
    setAddress({
      type: 'home',
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    }); // Reset the form for adding new address
  };

  // Open the modal for editing an existing address
  const openEditModal = (addressToEdit) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    setAddress(addressToEdit); // Pre-fill the form with the address to edit
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setAddress({
      type: 'home',
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    }); // Reset the form
  };

  return (
    <div className={styles.addressContent}>

      <button onClick={openAddModal} className={styles.editBtn}>
        Add Address
      </button>

      {/* Display success or error message */}
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {/* Address Cards */}
      <div className={styles.addressCards}>
        {addresses.length === 0 ? (
          <p>No addresses saved yet.</p>
        ) : (
          addresses.map((addressItem) => (
            <div key={addressItem._id} className={styles.addressCard}>
              <h3>{addressItem.type}</h3>
              <p>{addressItem.street}, {addressItem.city}, {addressItem.state} - {addressItem.pincode}</p>
              <button
                className={styles.editBtn}
                onClick={() => openEditModal(addressItem)}
              >
                Edit
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal for Adding or Editing Address */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>{isEditMode ? 'Edit Address' : 'Add Address'}</h3>
            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="type" className={styles.label}>Address Type</label>
                <select
                  id="type"
                  name="type"
                  value={address.type}
                  onChange={handleChange}
                  className={styles.inputField}
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="street" className={styles.label}>Street</label>
                <input
                  id="street"
                  name="street"
                  type="text"
                  value={address.street}
                  onChange={handleChange}
                  placeholder="Enter street address"
                  required
                  className={styles.inputField}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="city" className={styles.label}>City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={address.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                  className={styles.inputField}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="state" className={styles.label}>State</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={address.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  required
                  className={styles.inputField}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="pincode" className={styles.label}>Pincode</label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  value={address.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  required
                  className={styles.inputField}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="isDefault" className={styles.checkboxLabel}>
                  <input
                    id="isDefault"
                    name="isDefault"
                    type="checkbox"
                    checked={address.isDefault}
                    onChange={(e) => setAddress((prev) => ({ ...prev, isDefault: e.target.checked }))}
                    className={styles.checkbox}
                  />
                  Set as default address
                </label>
              </div>

              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'Submitting...' : isEditMode ? 'Save Changes' : 'Add Address'}
              </button>
              <button type="button" onClick={closeModal} className={styles.closeBtn}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
