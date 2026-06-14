'use client'
import { useLang } from '@/contexts/LangContext'

export default function PrivacyBadge() {
  const { lang } = useLang()
  return (
    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 mb-6">
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
      <span>
        {lang === 'ko'
          ? '모든 처리는 브라우저에서만 이루어집니다. 입력한 정보는 서버로 전송되거나 저장되지 않습니다.'
          : 'Everything runs in your browser. No data is sent to or stored on any server.'}
      </span>
    </div>
  )
}
