"use client";

import { createContext, useContext } from "react";
import { getMessages, type Locale, type Messages } from "./index";

const LocaleContext = createContext<Locale>("tr");

/** Provides the page language to client components. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useMessages(): Messages {
  return getMessages(useContext(LocaleContext));
}
