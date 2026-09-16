"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import pt from "./messages/pt.json";
import en from "./messages/en.json";
import fr from "./messages/fr.json";

const missingTranslationWarnings = new Set<string>();

export type Locale = "pt" | "en" | "fr";
type Translations = typeof pt;
type TranslationValue = string | { [key: string]: TranslationValue };

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
  messages: Translations;
}

const translations: Record<Locale, Translations> = {
  pt,
  en: en as Translations,
  fr: fr as Translations,
};

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");

  useEffect(() => {
    const nextLocale = (() => {
      const savedLocale = localStorage.getItem("locale");
      if (savedLocale === "en" || savedLocale === "pt" || savedLocale === "fr") {
        return savedLocale;
      }

      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "en" || browserLang === "pt" || browserLang === "fr") {
        return browserLang;
      }

      return "pt";
    })();

    if (nextLocale === locale) return;

    const frame = window.requestAnimationFrame(() => {
      setLocaleState(nextLocale);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = (path: string): string => {
    const keys = path.split(".");
    let current: TranslationValue | undefined = translations[locale];

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        const warningKey = `${locale}:${path}`;
        if (!missingTranslationWarnings.has(warningKey)) {
          missingTranslationWarnings.add(warningKey);
          console.warn(
            `Translation path not found: ${path} for locale: ${locale}`,
          );
        }
        return path;
      }
    }

    return typeof current === "string" ? current : path;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, messages: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
