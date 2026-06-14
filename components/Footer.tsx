'use client'
import Link from 'next/link'
import { useLang } from '@/contexts/LangContext'
import { t } from '@/lib/translations'

export default function Footer() {
  const { lang } = useLang()
  return (
    <footer className="border-t border-slate-800 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-slate-500 text-sm">
        <span>© 2025 ToolNest</span>
        <span>{t(lang, 'common.footerText')}</span>
        <Link href="/privacy" className="hover:text-slate-300 transition-colors">
          {lang === 'ko' ? '개인정보 처리방침' : 'Privacy Policy'}
        </Link>
      </div>
    </footer>
  )
}
