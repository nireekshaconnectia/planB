"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styles from "./studyRooms.module.css";
import { useSession } from 'next-auth/react';
import RoomForm from './RoomForm';

export default function StudyRooms() {
    const t = useTranslations();
    const { data: session } = useSession();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [availabilityLoading, setAvailabilityLoading] = useState(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`);
            const data = await res.json();
            if (res.ok && data.success) {
                setRooms(data.data);
            } else {
                setError(data.message || "Failed to load rooms");
            }
        } catch (err) {
            setError("Failed to load rooms");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingRoom(null);
        setShowForm(true);
    };

    const handleEdit = (room) => {
        setEditingRoom(room);
        setShowForm(true);
    };

    const handleDelete = async (roomId) => {
        if (!session?.user?.token) return alert('Not authorized');
        if (!window.confirm('Are you sure you want to delete this room?')) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session.user.token}` }
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setRooms(rooms => rooms.filter(r => r._id !== roomId));
            } else {
                alert(data.message || 'Failed to delete room');
            }
        } catch (err) {
            alert('Failed to delete room');
        }
    };

    const handleSave = () => {
        fetchRooms();
        setShowForm(false);
        setEditingRoom(null);
    };

    const handleToggleAvailability = async (roomId, isAvailable) => {
        if (!session?.user?.token) return alert('Not authorized');
        setAvailabilityLoading(roomId);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/availability`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session.user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isAvailable: !isAvailable })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                fetchRooms();
            } else {
                alert(data.message || 'Failed to update availability');
            }
        } catch (err) {
            alert('Failed to update availability');
        } finally {
            setAvailabilityLoading(null);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>{t("study-rooms")}</h1>
                <button className={styles.addButton} onClick={handleAdd}>Add Room</button>
            </div>
            {loading && <div>Loading...</div>}
            {error && <div className={styles.error}>{error}</div>}
            {!loading && !error && (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Capacity</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map(room => (
                            <tr key={room._id}>
                                <td>{room.name}</td>
                                <td>{room.capacity}</td>
                                <td>{room.price}</td>
                                <td>
                                    <button
                                        className={styles.toggleButton}
                                        disabled={availabilityLoading === room._id}
                                        onClick={() => handleToggleAvailability(room._id, room.isAvailable)}
                                    >
                                        {room.isAvailable ? 'Available' : 'Unavailable'}
                                    </button>
                                </td>
                                <td className={styles.actions}>
                                    <button className={styles.editButton} onClick={() => handleEdit(room)}>Edit</button>
                                    <button className={styles.deleteButton} onClick={() => handleDelete(room._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {showForm && (
                <RoomForm
                    onSave={handleSave}
                    onClose={() => { setShowForm(false); setEditingRoom(null); }}
                    initialData={editingRoom}
                />
            )}
        </div>
    );
}
