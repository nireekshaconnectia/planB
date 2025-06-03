"use client";
import { useDispatch, useSelector } from "react-redux";
import styles from "./languagemodal.module.css"; // Import module CSS
import Backdrop from "../backdrop/backdrop";
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

const LanguageModal = ({ showModal, setShowModal }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const lang = useSelector((state) => state.language.lang); // Get current language from Redux
  const cartItems = useSelector((state) => state.cart.items);
  const t = useTranslations(); // Initialize translations

  const fetchDataWithLanguage = async (language) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Only add language header for Arabic
      const headers =
        language === "ar"
          ? {
              "Accept-Language": language,
            }
          : {};

      const [menuResponse, categoriesResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorey`, { headers }),
      ]);

      if (!menuResponse.ok || !categoriesResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const menuData = await menuResponse.json();
      const categoriesData = await categoriesResponse.json();

      // Create a map of category slugs to their translated versions
      const categoryMap = categoriesData.data.categories.reduce(
        (acc, category) => {
          acc[category.slug] = category;
          return acc;
        },
        {}
      );

      // Update menu items with translated categories
      const updatedMenuData = menuData.data.map((item) => ({
        ...item,
        categories: item.categories.map((cat) => categoryMap[cat.slug] || cat),
      }));

      dispatch(setMenuData(updatedMenuData));
      dispatch(setCategoriesData(categoriesData.data.categories));

      // Update cart items with new language data
      Object.entries(cartItems).forEach(([slug, cartItem]) => {
        const updatedItem = updatedMenuData.find((item) => item.slug === slug);
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
      console.error("Error fetching data:", error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const changeLanguage = async (newLang) => {
    dispatch(setLanguage(newLang));
    await fetchDataWithLanguage(newLang);

    // Set <html> attributes
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    }

    router.refresh();
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <>
          <Backdrop onClick={() => setShowModal(false)} />
          <div className={styles.langModal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHead}>
                <h2 className={styles.modalTitle}>{t("select-language")}</h2>
                <span
                  className={styles.close}
                  onClick={() => setShowModal(false)}
                >
                  {t("cancel")}
                </span>
              </div>
              <ul className={styles.languageList}>
                <li
                  onClick={() => changeLanguage("en")}
                  className={lang === "en" ? styles.active : ""}
                >
                  {t("english")}
                </li>
                <li
                  onClick={() => changeLanguage("ar")}
                  className={lang === "ar" ? styles.active : ""}
                >
                  {t("arabic")}
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LanguageModal;
