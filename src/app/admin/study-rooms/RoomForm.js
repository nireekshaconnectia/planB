"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import styles from "./studyRooms.module.css";

export default function RoomForm({ onSave, onClose, initialData }) {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        capacity: initialData?.capacity || 1,
        price: initialData?.price || 1,
        isAvailable: initialData?.isAvailable ?? true,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const url = initialData
                ? `${process.env.NEXT_PUBLIC_API_URL}/rooms/${initialData._id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/rooms`;
            const method = initialData ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: {
                    "Authorization": `Bearer ${session.user.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    capacity: Number(formData.capacity),
                    price: Number(formData.price),
                    isAvailable: formData.isAvailable,
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                onSave();
            } else {
                setError(data.message || "Failed to save room");
            }
        } catch (err) {
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
                <div className={styles.fieldGroup}>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.fieldGroup}>
                    <label>Capacity</label>
                    <input
                        type="number"
                        name="capacity"
                        min="1"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.fieldGroup}>
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        min="1"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.fieldGroup}>
                    <label>
                        <input
                            type="checkbox"
                            name="isAvailable"
                            checked={formData.isAvailable}
                            onChange={handleChange}
                        />
                        Available
                    </label>
                </div>
                <div className={styles.buttonGroup}>
                    <button type="button" onClick={onClose} className={styles.cancelButton}>
                        Cancel
                    </button>
                    <button type="submit" disabled={isLoading} className={styles.submitButton}>
                        {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
} 