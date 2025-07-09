import { useForm, Controller } from "react-hook-form";
import { TextField, PhoneField } from "@/components/forms/fields/Fields";
import styles from "../field.module.css";
import { useEffect, useState } from "react";
import PopupWrapper from "@/components/popup/popupWrapper";

export default function GuestInfoForm({showGiPopup, closeGiPopup}) {
  const { handleSubmit, control, setValue } = useForm();
  const onSubmit = (data) => {
    console.log("✅ Submitted data:", data);
  };

  const onSkip = () => {
    console.log("⏭️ Skipped. No data submitted.");
  };

  return (
    <PopupWrapper 
      isOpen={showGiPopup}
      onClose={() => closeGiPopup(false)} 
      title='Add Info for Reciept'
      >
        <form onSubmit={handleSubmit(onSubmit)} className={`flex col g-20 ${styles.formWrapper}`}>
      {/* Name */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            placeholder="Name"
            value={field.value || ""}
            onChange={field.onChange}
          />
        )}
      />

      {/* Mobile / Phone */}
      <Controller
        name="phoneNumber"
        control={control}
        render={({ field }) => (
          <PhoneField
            onChange={({ countryCode, phoneNumber }) => {
              setValue("countryCode", countryCode);
              field.onChange(phoneNumber);
            }}
          />
        )}
      />

      {/* Buttons */}
      <div className={`flex g-20`}>
        <button type="submit" className={`${styles.submitButton}`}>Submit</button>
        <button type="button" onClick={onSkip} className={`${styles.skipButton}`}>
          Skip
        </button>
      </div>
    </form>
    </PopupWrapper>
    
  );
}
