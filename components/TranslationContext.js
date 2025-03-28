"use client";
import { createContext, useContext } from "react";
import { NextIntlClientProvider, useTranslations } from "next-intl";

// Context create karo
const TranslationContext = createContext();

export const TranslationProvider = ({ locale, messages, children }) => {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslationContext.Provider value={useTranslations()}>
        {children}
      </TranslationContext.Provider>
    </NextIntlClientProvider>
  );
};

// Custom Hook
export const useTranslation = () => {
  return useContext(TranslationContext);
};
