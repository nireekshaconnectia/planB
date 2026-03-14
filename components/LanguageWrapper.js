"use client";
import { useSelector } from "react-redux";
import { NextIntlClientProvider } from "next-intl";
import { useMemo } from "react";

const LanguageWrapper = ({ children }) => {
  const lang = useSelector((state) => state?.language?.lang) || "en";

  // Memoize messages loading to prevent unnecessary re-imports
  const messages = useMemo(() => {
    try {
      return require(`../messages/${lang}.json`);
    } catch (error) {
      return require(`../messages/en.json`); // Fallback to English
    }
  }, [lang]);

  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      <div className={lang === "ar" ? "rtl" : ""}>
        {children}
      </div>
    </NextIntlClientProvider>
  );
};

export default LanguageWrapper;