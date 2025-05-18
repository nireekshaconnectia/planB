"use client";
import { useSelector } from "react-redux";
import { NextIntlClientProvider } from "next-intl";

const LanguageWrapper = ({ children }) => {
  const lang = useSelector((state) => state?.language?.lang) || "en";

  let messages;
  try {
    messages = require(`/messages/${lang}.json`);
  } catch (error) {
    messages = require(`/messages/en.json`); // Fallback to English
  }

  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      <div className={lang === "ar" ? "rtl" : ""}>
        {children}
      </div>
    </NextIntlClientProvider>
  );
};

export default LanguageWrapper;
