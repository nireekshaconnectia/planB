"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./studyroom.module.css";
import { HiUsers } from "react-icons/hi2";
import { IoIosBriefcase } from "react-icons/io";
import BackButton from "@/components/backbutton/backbutton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslations } from "next-intl";

const studyRooms = [
  { id: 1, name: "Study Room 1", capacity: 1, price: 40, icon: HiUsers },
  { id: 2, name: "Study Room 2", capacity: 2, price: 55, icon: HiUsers },
  { id: 3, name: "Meeting Room", capacity: 12, price: 110, icon: IoIosBriefcase },
];

const BookStudyRoom = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const router = useRouter();
  const t = useTranslations(); // ✅ Initialize translations here

  const calculateDuration = () => {
    if (!startTime || !endTime) return 0;
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const start = startHour + startMin / 60;
    const end = endHour + endMin / 60;
    const duration = end - start;
    return duration >= 1 ? duration : 0;
  };

  const handleStartTimeChange = (value) => {
    setStartTime(value);
    const [hour, min] = value.split(":").map(Number);
    const minEndHour = hour + 1;
    if (!endTime || parseInt(endTime.split(":")[0]) < minEndHour) {
      const paddedHour = String(minEndHour).padStart(2, "0");
      setEndTime(`${paddedHour}:${min.toString().padStart(2, "0")}`);
    }
  };

  const getMinEndTime = () => {
    if (!startTime) {
      return new Date(1970, 0, 1, 10, 0);
    }
    const [h, m] = startTime.split(":").map(Number);
    return new Date(1970, 0, 1, h + 1, m);
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
      date: date.toISOString().split("T")[0],
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
        <h1 className={styles.title}>{t('book-a-room')}</h1>
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
        <label className={styles.label}>{t('select-date')}:</label>
        <DatePicker
          selected={date}
          onChange={(d) => setDate(d)}
          dateFormat="yyyy-MM-dd"
          minDate={new Date()}
          className={styles.input}
          placeholderText={t('select-date')}
        />

        <div className={styles.timeRow}>
          <div>
            <label className={styles.label}>{t('from')}:</label>
            <DatePicker
              selected={startTime ? new Date(`1970-01-01T${startTime}`) : null}
              onChange={(date) => {
                const hours = date.getHours().toString().padStart(2, "0");
                const mins = date.getMinutes().toString().padStart(2, "0");
                handleStartTimeChange(`${hours}:${mins}`);
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="Start Time"
              dateFormat="HH:mm"
              minTime={new Date(1970, 0, 1, 9, 0)}
              maxTime={new Date(1970, 0, 1, 22, 0)}
              className={styles.input}
              placeholderText="Start Time"
            />
          </div>
          <div>
            <label className={styles.label}>{t('to')}:</label>
            <DatePicker
              selected={endTime ? new Date(`1970-01-01T${endTime}`) : null}
              onChange={(date) => {
                const hours = date.getHours().toString().padStart(2, "0");
                const mins = date.getMinutes().toString().padStart(2, "0");
                setEndTime(`${hours}:${mins}`);
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="End Time"
              dateFormat="HH:mm"
              minTime={getMinEndTime()}
              maxTime={new Date(1970, 0, 1, 23, 0)}
              className={styles.input}
              placeholderText="End Time"
            />
          </div>
        </div>

        {calculateDuration() > 0 && (
          <p className={styles.durationInfo}>
            {t('selected-duration')}: {calculateDuration()} hour{calculateDuration() > 1 ? "s" : ""}
          </p>
        )}

        {calculateDuration() === 0 && startTime && endTime && (
          <p className={styles.errorMessage}>Duration must be at least 1 hour.</p>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={calculateDuration() < 1}
        >
          {t('proceed-to-checkout')}
        </button>
      </form>
    </div>
  );
};

export default BookStudyRoom;