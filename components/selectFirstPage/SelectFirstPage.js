"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SelectFirstPage.module.css";
import DeliveryOptions from "@/components/DeliveryOptions/DeliveryOptions";
import SupportPopup from "@/components/support/supportPopup";
import { useTranslations } from "next-intl";
import Header from "../layout/Header";

const SelectFirstPage = ({ isOpen, onClose }) => {
  const router = useRouter();
  const t = useTranslations();

  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const [showSupportPopup, setShowSupportPopup] = useState(false);

  const cardRefs = useRef([]);
  const [visibleCards, setVisibleCards] = useState([]);

  const location = () =>
    window.open("https://maps.app.goo.gl/aSjhu1mveHaVqtKq5", "_blank");

  const loyalty = () =>
    window.open("https://loyalty.is/j3aifc", "_blank");

  const handleSelect = (option) => {
    onClose();
    if (option === "menu") router.push("/");
    if (option === "study-room") router.push("/study-room");
    if (option === "catering") router.push("/catering");
  };

  // 🔥 Scroll Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index);
          if (entry.isIntersecting) {
            setVisibleCards((prev) =>
              prev.includes(index) ? prev : [...prev, index]
            );
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  if (!isOpen) return null;

  // 🔥 Grid Data (clean structure)
  const gridItems = [
    { type: "image", src: "/home/logo1.jpg" },
    {
      type: "text",
      content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    },
    { type: "image", src: "/home/logo2.jpg" },

    { type: "action", title: t("catering"), action: () => handleSelect("catering") },
    { type: "image", src: "/home/logo3.jpg" },

    { type: "action", title: t("study-room"), action: () => handleSelect("study-room") },
    { type: "image", src: "/home/logo4.jpg" },

    { type: "action", title: t("loyalty card"), action: loyalty },
    { type: "image", src: "/home/logo5.jpg" },

    { type: "action", title: t("delivery platforms"), action: () => setShowDeliveryPopup(true) },
    { type: "image", src: "/home/logo6.jpg" },

    { type: "action", title: t("location"), action: location },
  ];

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.headerFadeIn}>
          <Header />
        </div>

        <div className={styles.gridWrapper}>
          {gridItems.map((item, index) => {
            const isVisible = visibleCards.includes(index);

            if (item.type === "image") {
              return (
                <div
                  key={index}
                  ref={(el) => (cardRefs.current[index] = el)}
                  data-index={index}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                  className={`${styles.imageSquare} ${isVisible ? styles.showCard : ""}`}
                >
                  <img src={item.src} alt="Coffee" />
                </div>
              );
            }

            if (item.type === "text") {
              return (
                <div
                  key={index}
                  ref={(el) => (cardRefs.current[index] = el)}
                  data-index={index}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                  className={`${styles.textSquare} ${isVisible ? styles.showCard : ""}`}
                >
                  <p>{item.content}</p>
                </div>
              );
            }

            if (item.type === "action") {
              return (
                <div
                  key={index}
                  ref={(el) => (cardRefs.current[index] = el)}
                  data-index={index}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                  className={`${styles.actionSquare} ${isVisible ? styles.showCard : ""}`}
                  onClick={item.action}
                >
                  <h3>{item.title}</h3>
                  <button className={styles.pillBtn}>CLICK HERE</button>
                </div>
              );
            }

            return null;
          })}
        </div>

        <div
          className={styles.supportFooter}
          onClick={() => setShowSupportPopup(true)}
        >
          {t("support")}
        </div>
      </div>

      <DeliveryOptions
        showDPopup={showDeliveryPopup}
        closeDPopup={() => setShowDeliveryPopup(false)}
      />

      <SupportPopup
        showSupportPopup={showSupportPopup}
        closeSupportPopup={() => setShowSupportPopup(false)}
      />
    </>
  );
};

export default SelectFirstPage;