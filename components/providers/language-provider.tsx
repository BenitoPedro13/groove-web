"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

import { dictionaries, type Language } from "@/lib/i18n/dictionaries"

type Translation = Record<keyof typeof dictionaries.pt, string>

type LanguageContextValue = {
  language: Language
  setLanguage: (next: Language) => void
  t: Translation
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = "Goove-language"

type LanguageProviderProps = {
  children: React.ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved === "pt" || saved === "en") {
        return saved
      }
    }

    return "pt"
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: dictionaries[language] as Translation,
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
