'use client';
import React, { useState } from "react";
import styles from "./catering.module.css";
import CateringPackages from "@/components/catering/CateringPackages";
import CateringMenu from "@/components/catering/CateringMenu";
import CateringBookingForm from "@/components/catering/CateringBookingForm";
import { useTranslations } from "next-intl";
export default function Catering() {
  const [step, setStep] = useState(1);
  const t = useTranslations();
  return (
    <section className={styles.catering}>

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
          <CateringBookingForm />
          {/* Optional: Back button */}
          {/* <SecondaryButton text="Back to menu" onClick={() => setStep(2)} /> */}
        </>
      )}

    </section>
  );
}
