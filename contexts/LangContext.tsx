'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

export type Lang = 'en' | 'ko'

interface LangContextType {
  lang: Lang
  toggleLang: () => void
}

const LangContext = createContext<LangContextType>({ lang: 'en', toggleLang: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  return (
    <LangContext.Provider value={{ lang, toggleLang: () => setLang(l => l === 'en' ? 'ko' : 'en') }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
