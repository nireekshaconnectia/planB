"use client";
import styles from "./studyroom.module.css";

const StudyRoomCheckoutForm = ({ bookingData }) => {
  const { roomName, date, startTime, endTime, duration, price } = bookingData;

  return (
    <div className={styles.checkoutForm}>
      <div className={styles.details}>
        <h2>Study Room Booking Details</h2>
        <p><strong>Room:</strong> {roomName}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>From:</strong> {startTime}</p>
        <p><strong>To:</strong> {endTime}</p>
        <p><strong>Duration:</strong> {duration} hour{duration > 1 ? "s" : ""}</p>
        <p><strong>Total Price:</strong> {price} QAR</p>
      </div>

      <form className={styles.formDetails}>
        <div><label>Name:</label>
        <input type="text" name="name" required /></div>
        
        <div><label>Email:</label>
        <input type="email" name="email" required /></div>
        
        <div><label>Phone:</label>
        <input type="tel" name="phone" required /></div>
        
        <div><label>Optional Notes:</label>
        <textarea name="notes" rows="3"></textarea></div>

        <button type="submit" className={styles.submitButton}>Confirm Booking</button>
      </form>
    </div>
  );
};

export default StudyRoomCheckoutForm;
