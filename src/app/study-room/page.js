"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./studyroom.module.css";
import { HiUsers } from "react-icons/hi2";
import { IoIosBriefcase } from "react-icons/io";
import BackButton from "@/components/backbutton/backbutton";

const studyRooms = [
  { id: 1, name: "Study Room 1", capacity: 1, price: 40, icon: HiUsers },
  { id: 2, name: "Study Room 2", capacity: 2, price: 55, icon: HiUsers },
  { id: 3, name: "Meeting Room", capacity: 12, price: 110, icon: IoIosBriefcase },
];

const BookStudyRoom = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const router = useRouter();

  // Calculate the duration in hours, with validation for minimum 1 hour
  const calculateDuration = () => {
    if (!startTime || !endTime) return 0;
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const start = startHour + startMin / 60;
    const end = endHour + endMin / 60;
    const duration = end - start;

    // Ensure minimum duration is 1 hour
    return duration >= 1 ? duration : 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const duration = calculateDuration();

    if (!selectedRoom || !date || duration < 1) {
      alert("Please select a valid room, date, and time range with a minimum of 1 hour.");
      return;
    }

    const query = new URLSearchParams({
      roomId: selectedRoom.id.toString(),
      roomName: selectedRoom.name,
      date,
      startTime,
      endTime,
      duration: duration.toString(),
      price: (selectedRoom.price * duration).toString(),
    });

    router.push(`/checkout?${query.toString()}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHead}>
        <div>
          <BackButton />
        </div>
        <h1 className={styles.title}>Book a Room</h1>
      </div>

      <div className={styles.grid}>
        {studyRooms.map((room) => {
          const Icon = room.icon;
          const isSelected = selectedRoom?.id === room.id;
          return (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`${styles.roomCard} ${isSelected ? styles.selected : ""}`}
            >
              <div className={styles.roomContent}>
                <Icon className={styles.icon} />
                <h2 className={styles.roomName}>{room.name}</h2>
                <p className={styles.capacity}>Capacity: {room.capacity} person{room.capacity > 1 ? "s" : ""}</p>
                <p className={styles.price}>{room.price} QAR / hr</p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>Select Date:</label>
        <input
          type="date"
          className={styles.input}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />

        <div className={styles.timeRow}>
          <div>
            <label className={styles.label}>From:</label>
            <input
              type="time"
              className={styles.input}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              min="09:00"
              max="23:00"
            />
          </div>
          <div>
            <label className={styles.label}>To:</label>
            <input
              type="time"
              className={styles.input}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              min={startTime || "09:00"}
              max="23:00"
            />
          </div>
        </div>

        {calculateDuration() > 0 && (
          <p className={styles.durationInfo}>
            Selected Duration: {calculateDuration()} hour{calculateDuration() > 1 ? "s" : ""}
          </p>
        )}

        {calculateDuration() === 0 && (
          <p className={styles.errorMessage}>Duration must be at least 1 hour.</p>
        )}

        <button type="submit" className={styles.submitButton}>
          Proceed to Checkout
        </button>
      </form>
    </div>
  );
};

export default BookStudyRoom;
