"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./studyRooms.module.css";
import { useSession } from 'next-auth/react';
import RoomForm from './RoomForm';

// Static room data
const STATIC_ROOMS = [
  {
    _id: "room1",
    name: "Study room 1",
    capacity: 1,
    price: 40,
    description: "A cozy study room perfect for focused work or study sessions.",
    amenities: ["Desk", "Chair", "WiFi", "Power Outlet"],
    isAvailable: true,
    images: []
  },
  {
    _id: "room2",
    name: "Study room 2",
    capacity: 2,
    price: 55,
    description: "A comfortable study room for two, ideal for collaborative work.",
    amenities: ["Desk", "Chairs", "WiFi", "Power Outlet", "Whiteboard"],
    isAvailable: true,
    images: []
  },
  {
    _id: "room3",
    name: "Meeting room",
    capacity: 10,
    price: 110,
    description: "A spacious meeting room equipped for professional gatherings and presentations.",
    amenities: ["Large Table", "Chairs", "WiFi", "Power Outlet", "Projector", "Whiteboard", "Conference Phone"],
    isAvailable: true,
    images: []
  }
];

export default function StudyRooms() {
    const t = useTranslations();
    const { data: session } = useSession();
    const [rooms, setRooms] = useState(STATIC_ROOMS);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [availabilityLoading, setAvailabilityLoading] = useState(null);

    const handleAdd = () => {
        setEditingRoom(null);
        setShowForm(true);
    };

    const handleEdit = (room) => {
        setEditingRoom(room);
        setShowForm(true);
    };

    const handleDelete = async (roomId) => {
        if (!window.confirm('Are you sure you want to delete this room?')) return;
        setRooms(rooms => rooms.filter(r => r._id !== roomId));
    };

    const handleSave = (savedRoom) => {
        if (editingRoom) {
            // Update existing room
            setRooms(rooms => rooms.map(r => r._id === savedRoom._id ? savedRoom : r));
        } else {
            // Add new room with a unique ID
            const newRoom = {
                ...savedRoom,
                _id: `room${Date.now()}`,
                images: savedRoom.images || []
            };
            setRooms(rooms => [...rooms, newRoom]);
        }
        setShowForm(false);
        setEditingRoom(null);
    };

    const handleToggleAvailability = async (roomId, isAvailable) => {
        setAvailabilityLoading(roomId);
        setRooms(rooms => rooms.map(room => 
            room._id === roomId ? { ...room, isAvailable: !isAvailable } : room
        ));
        setAvailabilityLoading(null);
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