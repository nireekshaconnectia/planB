"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./languagemodal.module.css";
import { setLanguage } from "../../store/languageSlice";
import {
  setMenuData,
  setCategoriesData,
  setLoading,
  setError,
} from "../../store/apiSlice";
import { addToCart } from "@/store/cartSlice";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const LanguageModal = ({ showLpopup, closeLpopup }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const lang = useSelector((state) => state.language.lang);
  const cartItems = useSelector((state) => state.cart.items);
  const t = useTranslations();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showLpopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLpopup]);

  if (!showLpopup || !mounted) return null;

  const fetchDataWithLanguage = async (language) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const headers =
        language === "ar" ? { "Accept-Language": language } : {};

      const [menuResponse, categoriesResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorey`, { headers }),
      ]);

      if (!menuResponse.ok || !categoriesResponse.ok)
        throw Error("Failed to fetch");

      const menuData = await menuResponse.json();
      const categoriesData = await categoriesResponse.json();

      const categoryMap = categoriesData.data.categories.reduce(
        (acc, cat) => {
          acc[cat.slug] = cat;
          return acc;
        },
        {}
      );

      const updatedMenuData = menuData.data.map((item) => ({
        ...item,
        categories: item.categories.map(
          (cat) => categoryMap[cat.slug] || cat
        ),
      }));

      dispatch(setMenuData(updatedMenuData));
      dispatch(setCategoriesData(categoriesData.data.categories));

      Object.entries(cartItems).forEach(([slug, cartItem]) => {
        const updatedItem = updatedMenuData.find(
          (item) => item.slug === slug
        );
        if (updatedItem) {
          dispatch(
            addToCart({
              ...cartItem,
              name: updatedItem.name,
              description: updatedItem.description,
              categories: updatedItem.categories,
            })
          );
        }
      });
    } catch (error) {
      console.error("Language switch error:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const changeLanguage = async (newLang) => {
    if (newLang === lang) {
      closeLpopup(false);
      return;
    }

    dispatch(setLanguage(newLang));

    if (typeof document !== "undefined") {
      document.documentElement.lang = newLang;
      document.documentElement.dir =
        newLang === "ar" ? "rtl" : "ltr";
    }

    await fetchDataWithLanguage(newLang);
    router.refresh();
    closeLpopup(false);
  };

  return createPortal(
    <>
      <div
        className={styles.backdrop}
        onClick={() => closeLpopup(false)}
      />

      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h3 className={styles.title}>
            {t("select-language")}
          </h3>
          <button
            className={styles.closeX}
            onClick={() => closeLpopup(false)}
          >
            ✕
          </button>
        </div>

        <div className={styles.list}>
          <div
            className={`${styles.item} ${
              lang === "en" ? styles.active : ""
            }`}
            onClick={() => changeLanguage("en")}
          >
            <div>
              <p className={styles.langTitle}>English</p>
              <p className={styles.langSub}>
                United Kingdom
              </p>
            </div>
            {lang === "en" && (
              <span className={styles.check}>✓</span>
            )}
          </div>

          <div
            className={`${styles.item} ${
              lang === "ar" ? styles.active : ""
            }`}
            onClick={() => changeLanguage("ar")}
          >
            <div>
              <p className={styles.langTitle}>العربية</p>
              <p className={styles.langSub}>Arabic</p>
            </div>
            {lang === "ar" && (
              <span className={styles.check}>✓</span>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default LanguageModal;