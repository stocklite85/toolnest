'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/contexts/LangContext'
import { t } from '@/lib/translations'

export default function Header() {
  const { lang, toggleLang } = useLang()
  const pathname = usePathname()

  const navLinks = [
    { href: '/password-generator', key: 'nav.password' },
    { href: '/id-generator', key: 'nav.id' },
    { href: '/subnet-calculator', key: 'nav.subnet' },
  ]

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">
          Tool<span className="text-indigo-400">Nest</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === link.href
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t(lang, link.key)}
            </Link>
          ))}
        </nav>

        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-slate-300 hover:border-indigo-500 hover:text-indigo-400 transition-colors"
        >
          <span>{lang === 'en' ? '🇰🇷' : '🇺🇸'}</span>
          <span>{lang === 'en' ? '한국어' : 'English'}</span>
        </button>
      </div>
    </header>
  )
}
