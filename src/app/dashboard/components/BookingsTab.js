// app/dashboard/components/BookingsTab.js
"use client";

import Link from "next/link";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaCheckCircle, 
  FaHourglassHalf, 
  FaTimesCircle 
} from "react-icons/fa";
import styles from "../dashboard.module.css";

const BookingsTab = ({ bookings, onCancelBooking }) => {
  const getBookingStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "completed":
        return <FaCheckCircle className={styles.statusIconConfirmed} />;
      case "pending":
        return <FaHourglassHalf className={styles.statusIconPending} />;
      case "cancelled":
        return <FaTimesCircle className={styles.statusIconCancelled} />;
      default:
        return <FaClock className={styles.statusIconDefault} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString;
  };

  if (bookings.length === 0) {
    return (
      <div className={styles.bookingsSection}>
        <div className={styles.sectionHeader}>
          <h2>Study Room Bookings</h2>
        </div>
        <div className={styles.emptyState}>
          <FaCalendarAlt className={styles.emptyIcon} />
          <p>You have no room bookings yet.</p>
          <Link href="/study-room" className={styles.bookNowButton}>
            Book a Room
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bookingsSection}>
      <div className={styles.sectionHeader}>
        <h2>Study Room Bookings</h2>
      </div>
      <div className={styles.bookingsList}>
        {bookings.map((booking) => (
          <div key={booking._id} className={styles.bookingCard}>
            <div className={styles.bookingHeader}>
              <h3>{booking.roomName || "Study Room"}</h3>
              <div className={styles.bookingStatus}>
                {getBookingStatusIcon(booking.status)}
                <span className={styles.statusText}>
                  {booking.status || "Confirmed"}
                </span>
              </div>
            </div>
            <div className={styles.bookingDetails}>
              <div className={styles.detailItem}>
                <FaCalendarAlt />
                <span>{formatDate(booking.date)}</span>
              </div>
              <div className={styles.detailItem}>
                <FaClock />
                <span>
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <strong>Duration:</strong>
                <span>{booking.duration} hours</span>
              </div>
              <div className={styles.detailItem}>
                <strong>Total:</strong>
                <span>{booking.totalPrice || booking.price} QR</span>
              </div>
            </div>
            {booking.status?.toLowerCase() === "pending" && (
              <div className={styles.bookingActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => onCancelBooking(booking._id)}
                >
                  Cancel Booking
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsTab; 