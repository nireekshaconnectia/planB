"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import styles from "./studyRooms.module.css";

export default function RoomForm({ onSave, onClose, initialData }) {
  const { data: session } = useSession();

  // Existing images from DB
  const [existingImages, setExistingImages] = useState(initialData?.images || []);
  // Newly selected images
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    capacity: initialData?.capacity || 1,
    price: initialData?.price || 1,
    amenities: initialData?.amenities || [],
    isAvailable: initialData?.isAvailable ?? true,
  });

  const [amenityInput, setAmenityInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add amenity
  const handleAddAmenity = (e) => {
    e.preventDefault();
    const trimmed = amenityInput.trim();
    if (trimmed && !formData.amenities.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, trimmed] }));
    }
    setAmenityInput("");
  };

  // Remove amenity
  const handleRemoveAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  // New images selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  // Remove existing image
  const handleRemoveExistingImage = (img) => {
    setExistingImages((prev) => prev.filter((i) => i !== img));
  };

  // Remove newly added image
  const handleRemoveNewImage = (idx) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // Create image URL for preview
  const createImageUrl = (img) => {
    if (img.startsWith('blob:')) return img;
    if (img.startsWith('http')) return img;
    return `${process.env.NEXT_PUBLIC_API_UPLOADS}/${img}`;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Build the room data
      const roomData = {
        name: formData.name,
        description: formData.description,
        capacity: Number(formData.capacity),
        price: Number(formData.price),
        amenities: formData.amenities,
        isAvailable: formData.isAvailable,
        images: [...existingImages, ...selectedFiles.map(f => URL.createObjectURL(f))]
      };

      if (initialData) {
        roomData._id = initialData._id;
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      onSave(roomData);
    } catch (err) {
      console.error(err);
      setError("Failed to save room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <form className={styles.roomForm} onSubmit={handleSubmit}>
        <h2>{initialData ? "Edit Room" : "Add Room"}</h2>
        {error && <div className={styles.error}>{error}</div>}

        {/* Name */}
        <div className={styles.fieldGroup}>
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        {/* Description */}
        <div className={styles.fieldGroup}>
          <label>Description</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Capacity */}
        <div className={styles.fieldGroup}>
          <label>Capacity</label>
          <input type="number" name="capacity" min="1" value={formData.capacity} onChange={handleChange} required />
        </div>

        {/* Price */}
        <div className={styles.fieldGroup}>
          <label>Price (QR per hour)</label>
          <input type="number" name="price" min="1" value={formData.price} onChange={handleChange} required />
        </div>

        {/* Amenities */}
        <div className={styles.fieldGroup}>
          <label>Amenities</label>
          <div className={styles.amenityInput}>
            <input type="text" value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} placeholder="Type and press Add" />
            <button type="button" onClick={handleAddAmenity} className={styles.addButton}>Add</button>
          </div>
          <div className={styles.amenitiesList}>
            {formData.amenities.map((amenity, idx) => (
              <span key={idx} className={styles.amenityItem}>
                {amenity}
                <button type="button" className={styles.removeButton} onClick={() => handleRemoveAmenity(amenity)}>×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className={styles.fieldGroup}>
          <div className={styles.checkbox}>
            <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} />
            <label>Available</label>
          </div>
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className={styles.fieldGroup}>
            <label>Existing Images</label>
            <div className={styles.imagePreviewGrid}>
              {existingImages.map((img, idx) => (
                <div key={idx} className={styles.imagePreview}>
                  <img
                    src={createImageUrl(img)}
                    alt="existing"
                    onClick={() => handleRemoveExistingImage(img)}
                    className={styles.clickableImage}
                  />
                  <span className={styles.removeImageHint}>Click to remove</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images */}
        <div className={styles.fieldGroup}>
          <label>Upload New Room Photos</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          {selectedFiles.length > 0 && (
            <div className={styles.imagePreviewGrid}>
              {selectedFiles.map((file, idx) => (
                <div key={idx} className={styles.imagePreview}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="new upload"
                    onClick={() => handleRemoveNewImage(idx)}
                    className={styles.clickableImage}
                  />
                  <span className={styles.removeImageHint}>Click to remove</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
          <button type="submit" disabled={isLoading} className={styles.submitButton}>
            {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}