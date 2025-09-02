import React from 'react';
import styles from "../field.module.css";
import { SecondaryButton } from "@/components/buttons/Buttons";

const AdditionalNote = ({ note, setNote, setShowAdditionalNotePopup, ...props }) => {
  return (
    <div className={styles.additionalNote}>
      <textarea
        id="order-note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Leave a note for your order (optional)"
        rows={4}
        className={styles.textInput}
      />
      <SecondaryButton
        text="Save"
        onClick={() => setNote(note) || setShowAdditionalNotePopup(false)}
      />
    </div>
  );
};

export default AdditionalNote;
