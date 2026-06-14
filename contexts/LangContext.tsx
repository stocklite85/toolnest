'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Lang = 'en' | 'ko'

interface LangContextType {
  lang: Lang
  toggleLang: () => void
}

const LangContext = createContext<LangContextType>({ lang: 'ko', toggleLang: () => {} })

function detectLang(): Lang {
  // localStorage에 저장된 사용자 선택 우선
  const saved = localStorage.getItem('toolnest-lang')
  if (saved === 'ko' || saved === 'en') return saved

  // 브라우저 언어 감지 — ko, ko-KR 등이면 한국어
  const browserLang = navigator.language || ''
  return browserLang.toLowerCase().startsWith('ko') ? 'ko' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ko')

  useEffect(() => {
    setLang(detectLang())
  }, [])

  const toggleLang = () => {
    setLang(prev => {
      const next = prev === 'en' ? 'ko' : 'en'
      localStorage.setItem('toolnest-lang', next)
      return next
    })
  }

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
