"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./catering.module.css";
import { useTranslations } from "next-intl";
import Link from "next/link";

const fallbackPackages = [
  { persons: 20, price: 700 },
  { persons: 40, price: 1400 },
  { persons: 60, price: 2100 },
  { persons: 80, price: 2800 },
  { persons: 100, price: 3300 },
];

export default function CateringPackages( { onNextStep }) {
  const [packages, setPackages] = useState([]);
  const router = useRouter();
  const t = useTranslations();
  useEffect(() => {
    fetch("/api/catering-packages")
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then(setPackages)
      .catch(() => setPackages(fallbackPackages));
  }, []);

  const handleSelect = (pkg) => {
    localStorage.setItem("selectedPackage", JSON.stringify(pkg));
    onNextStep(); // ✅ Call parent function to go to next step
  };

  return (
    <section className={styles.container}>
      <ul className={styles.packageList}>
        {packages.map((pkg, idx) => (
          <li
            key={idx}
            className={styles.packageItem}
            onClick={() => handleSelect(pkg)}
          >
            <h3>{pkg.persons} {t("person")}</h3>
            {/* <p>{pkg.price} QR</p> */}
          </li>
        ))}
      </ul>
      <div className={styles.note}>
          <h3>{t("note")}</h3>
          <Link href="tel:+97430187770">
            {t("note-text")}
          </Link>
        </div>
    </section>
  );
}
