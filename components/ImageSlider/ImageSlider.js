"use client";

import { useState, useEffect } from "react";
import styles from "./ImageSlider.module.css";

export default function ImageSlider({ images = [], autoPlay = false, autoPlayTime = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto play effect
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayTime);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayTime, images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div className={styles.slider}>
      <div className={styles.imageWrapper}>
        <img src={`${process.env.NEXT_PUBLIC_API_UPLOADS}public/${images[currentIndex]}`} alt={`Slide ${currentIndex + 1}`} className={styles.image} />
      </div>

      {/* Dot pagination */}
      {images.length > 1 && (
        <div className={styles.dots}>
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`${styles.dot} ${currentIndex === idx ? styles.active : ""}`}
              onClick={() => setCurrentIndex(idx)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
}
