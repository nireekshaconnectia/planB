import React from "react";
import styles from "./catering.module.css";
import SecondHeader from "@/components/header/secondHeader";
import CateringPackages from "@/components/catering/CateringPackages";

export default function Catering() {
  return (
    <catering className={styles.catering}>
      <SecondHeader />
      <CateringPackages />
    </catering>
  );
}