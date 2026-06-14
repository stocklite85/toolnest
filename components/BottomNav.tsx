'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/contexts/LangContext'

const NAV = [
  { href: '/',                   icon: '🏠', labelKo: '홈',       labelEn: 'Home' },
  { href: '/password-generator', icon: '🔐', labelKo: '비밀번호', labelEn: 'Password' },
  { href: '/id-generator',       icon: '🎲', labelKo: '아이디',   labelEn: 'ID' },
  { href: '/subnet-calculator',  icon: '🌐', labelKo: '서브넷',   labelEn: 'Subnet' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { lang } = useLang()
  const isKo = lang === 'ko'

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-t border-slate-800">
      <div className="flex">
        {NAV.map(item => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs transition-colors ${
                active ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span>{isKo ? item.labelKo : item.labelEn}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
