"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./catering.module.css";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Header from "../layout/Header";
import Image from "next/image";
import { IoPersonCircleOutline } from "react-icons/io5";

const fallbackPackages = [
  { persons: 20, price: 700 },
  { persons: 40, price: 1400 },
  { persons: 60, price: 2100 },
  { persons: 80, price: 2800 },
  { persons: 100, price: 3300 },
];

export default function CateringPackages({ onNextStep }) {
  const [packages, setPackages] = useState([]);
  const t = useTranslations();

  useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/catering-packages`)
    .then((res) => {
      if (!res.ok) throw new Error("API failed");
      return res.json();
    })
    .then(setPackages)
    .catch(() => setPackages(fallbackPackages));
}, []);

  const handleSelect = (pkg) => {
    localStorage.setItem("selectedPackage", JSON.stringify(pkg));
    onNextStep();
  };

  return (
    <section className={styles.pageContainer}>
      <Header />
      
      {/* Banner Section */}
      <div className={styles.bannerWrapper}>
        <Image 
          src="/banner.jpg" 
          alt="Catering Banner" 
          fill
          className={styles.bannerImage}
          priority
        />
      
      </div>

        <div className={styles.titleWrapper}>
         <h1 className={styles.mainTitle}>{t("catering")}</h1>
      </div>

       <div className={styles.listWrapper}>
        {packages.map((pkg, idx) => (
          <div
            key={idx}
            className={styles.packagePill}
            onClick={() => handleSelect(pkg)}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className={styles.iconContainer}>
                <IoPersonCircleOutline />
            </div>
            <div className={styles.pillText}>
                <span className={styles.number}>{pkg.persons}</span>
                <span className={styles.label}>{t("persons")}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Note Section - White Card Styling */}
      <div className={styles.noteCard}>
          <h3 className={styles.noteTitle}>{t("note")}</h3>
          <p className={styles.noteDescription}>
            {t("for_more_than_100_cups")}
          </p>
          <Link href="tel:+97430187770" className={styles.phoneLink}>
            ( +974 30187770 )
          </Link>
      </div>
    </section>
  );
}