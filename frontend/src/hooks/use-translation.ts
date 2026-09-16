"use client";

import { useTranslation as useI18nTranslation } from "@/lib/i18n";
import { labelsByLocale, Labels } from "../app/(private)/typing/components/constants";

export function useTranslation(): Labels {
  const { locale } = useI18nTranslation();
  return labelsByLocale[locale];
}