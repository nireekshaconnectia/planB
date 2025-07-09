"use client";
import { useDispatch, useSelector } from "react-redux";
import styles from "./languagemodal.module.css"; // Import module CSS
import PopupWrapper from "@/components/popup/popupWrapper";
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

    if (typeof document !== "undefined") {
      document.documentElement.lang = newLang;

      const dirValue = newLang === "ar" ? "rtl" : "ltr";

      // List of class names to apply the dir attribute to
      const classNames = [
        "Items-List",
        "cartItems",
        "cartItem",
        "cartItemName",
        "cart-item",
        "cart-checkout",
        "cartItemPrice",
        "cartItemQuantity",
        "cartItemTotal",
        "categorey-grid",
        "categorey-card",
        "categorey-card-title",
        "categorey-card-description",
        "categorey-card-image",
        "categorey-card-button",
      ];

      classNames.forEach((className) => {
        const elements = document.querySelectorAll(`.${className}`);
        elements.forEach((el) => {
          el.setAttribute("dir", dirValue);
        });
      });
    }

    router.refresh();
    closeLpopup(false);
  };

  return (
    <PopupWrapper
      isOpen={showLpopup}
      onClose={() => closeLpopup(false)}
      title={t("select-language")}
    >
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
    </PopupWrapper>
  );
};

export default LanguageModal;