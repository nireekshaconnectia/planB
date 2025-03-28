"use client";
import { useDispatch, useSelector } from "react-redux";
import styles from "./languagemodal.module.css"; // Import module CSS
import Backdrop from "../backdrop/backdrop";
import { setLanguage } from "../../store/store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const LanguageModal = ({ showModal, setShowModal }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const lang = useSelector((state) => state.language.lang); // Get current language from Redux
  const t = useTranslations(); // Initialize translations

  const changeLanguage = (newLang) => {
    dispatch(setLanguage(newLang)); // Update Redux state
    router.refresh(); // Refresh the page to apply changes
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
                <span className={styles.close} onClick={() => setShowModal(false)}>
                {t("cancel")}
                </span>
              </div>
              <ul className={styles.languageList}>
                <li onClick={() => changeLanguage("en")} className={lang === "en" ? styles.active : ""}>{t("english")}</li>
                <li onClick={() => changeLanguage("ar")} className={lang === "ar" ? styles.active : ""}>{t("arabic")}</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LanguageModal;
