'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useLang } from '@/contexts/LangContext'
import { t } from '@/lib/translations'

const mainLinks = [
  { href: '/password-generator', key: 'nav.password' },
  { href: '/id-generator',       key: 'nav.id' },
  { href: '/subnet-calculator',  key: 'nav.subnet' },
]

const moreLinks = [
  { href: '/base64',          labelKo: 'Base64 인코더',  labelEn: 'Base64' },
  { href: '/json-formatter',  labelKo: 'JSON 포매터',    labelEn: 'JSON Formatter' },
  { href: '/url-encoder',     labelKo: 'URL 인코더',     labelEn: 'URL Encoder' },
  { href: '/color-converter',      labelKo: '색상 변환기',    labelEn: 'Color Converter' },
  { href: '/nickname-generator',   labelKo: '닉네임 생성기', labelEn: 'Nickname Generator' },
  { href: '/lotto-generator',      labelKo: '로또 번호 생성기', labelEn: 'Lotto Generator' },
]

export default function Header() {
  const { lang, toggleLang } = useLang()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isMoreActive = moreLinks.some(l => pathname === l.href)

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">
          Tool<span className="text-indigo-400">Nest</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {mainLinks.map(link => (
            <Link key={link.href} href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === link.href
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}>
              {t(lang, link.key)}
            </Link>
          ))}

          {/* More dropdown */}
          <div ref={dropRef} className="relative">
            <button
              onClick={() => setOpen(o => !o)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1 ${
                isMoreActive
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}>
              {lang === 'ko' ? '더보기' : 'More'}
              <span className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
            </button>

            {open && (
              <div className="absolute top-full right-0 mt-1 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
                {moreLinks.map(link => (
                  <Link key={link.href} href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      pathname === link.href
                        ? 'text-indigo-400 bg-indigo-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}>
                    {lang === 'ko' ? link.labelKo : link.labelEn}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <button onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-slate-300 hover:border-indigo-500 hover:text-indigo-400 transition-colors">
          <span>{lang === 'en' ? '🇰🇷' : '🇺🇸'}</span>
          <span>{lang === 'en' ? '한국어' : 'English'}</span>
        </button>
      </div>
    </header>
  )
}
