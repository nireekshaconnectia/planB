'use client';
import React, { useState } from "react";
import styles from "./catering.module.css";
import SecondHeader from "@/components/header/secondHeader";
import CateringPackages from "@/components/catering/CateringPackages";
import CateringMenu from "@/components/catering/CateringMenu";
import CateringPolicies from "@/components/catering/CateringPolicies";
import CateringBookingForm from "@/components/catering/CateringBookingForm";
import { SecondaryButton } from "@/components/buttons/Buttons";

export default function Catering() {
  const [step, setStep] = useState(1);

  return (
    <section className={styles.catering}>
      <SecondHeader />

      {step === 1 && <CateringPackages onNextStep={() => setStep(2)} />}

      {step === 2 && (
        <>
          <CateringMenu onNextStep={() => setStep(3)} />
          {/* Optional: If you want a back button */}
          {/* <SecondaryButton text="Back to packages" onClick={() => setStep(1)} /> */}
        </>
      )}

      {step === 3 && (
        <>
          <CateringPolicies onNextStep={() => setStep(4)} />
          {/* Optional: Back button */}
          {/* <SecondaryButton text="Back to menu" onClick={() => setStep(2)} /> */}
        </>
      )}

      {step === 4 && (
        <>
          <CateringBookingForm />
          {/* <BookingForm /> */}
        </>
      )}
    </section>
  );
}
