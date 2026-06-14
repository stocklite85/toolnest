'use client'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useLang } from '@/contexts/LangContext'
import { t } from '@/lib/translations'
import { generatePassword, getStrength, type PasswordOptions } from '@/lib/password'
import CopyButton from '@/components/CopyButton'
import PrivacyBadge from '@/components/PrivacyBadge'

export default function PasswordGeneratorPage() {
  const { lang } = useLang()
  const [opts, setOpts] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  })
  const [count, setCount] = useState(5)
  const [passwords, setPasswords] = useState<string[]>([])

  const generate = useCallback(() => {
    setPasswords(Array.from({ length: count }, () => generatePassword(opts)))
  }, [opts, count])

  const toggle = (key: keyof Omit<PasswordOptions, 'length'>) => {
    setOpts(prev => {
      const next = { ...prev, [key]: !prev[key] }
      const anyOn = next.uppercase || next.lowercase || next.numbers || next.symbols
      return anyOn ? next : prev
    })
  }

  const allText = passwords.join('\n')
  const firstStrength = passwords[0] ? getStrength(passwords[0]) : null

  const strengthLabels: Record<string, string> = {
    weak: t(lang, 'password.weak'),
    fair: t(lang, 'password.fair'),
    good: t(lang, 'password.good'),
    strong: t(lang, 'password.strong'),
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">
        {t(lang, 'common.backHome')}
      </Link>

      <div className="flex items-center gap-3 mt-6 mb-8">
        <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-xl">🔐</div>
        <div>
          <h1 className="text-2xl font-bold">{t(lang, 'password.title')}</h1>
          <p className="text-slate-400 text-sm">{t(lang, 'password.description')}</p>
        </div>
      </div>

      <PrivacyBadge />

      {/* Options */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-5 space-y-5">
        {/* Length */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-slate-300">{t(lang, 'password.length')}</label>
            <span className="text-sm font-mono bg-slate-800 px-2 py-0.5 rounded text-indigo-400">{opts.length}</span>
          </div>
          <input
            type="range" min={4} max={64} value={opts.length}
            onChange={e => setOpts(p => ({ ...p, length: +e.target.value }))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-2 gap-3">
          {([
            ['uppercase', 'password.uppercase'],
            ['lowercase', 'password.lowercase'],
            ['numbers', 'password.numbers'],
            ['symbols', 'password.symbols'],
          ] as const).map(([key, labelKey]) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => toggle(key)}
                className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${
                  opts[key]
                    ? 'bg-indigo-500 border-indigo-500'
                    : 'border-slate-600 group-hover:border-slate-400'
                }`}
              >
                {opts[key] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className="text-sm text-slate-300">{t(lang, labelKey)}</span>
            </label>
          ))}
        </div>

        {/* Count */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-slate-300">{t(lang, 'password.count')}</label>
          <div className="flex items-center gap-2">
            {[1, 3, 5, 10].map(n => (
              <button key={n} onClick={() => setCount(n)}
                className={`w-9 h-8 rounded-lg text-sm font-medium transition-colors ${
                  count === n ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >{n}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generate}
        className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-semibold transition-colors mb-5"
      >
        {t(lang, 'password.generate')}
      </button>

      {/* Results */}
      {passwords.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {/* Strength bar */}
          {firstStrength && (
            <div className="px-5 pt-4 pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-500">{t(lang, 'password.strength')}</span>
                <span className={`text-xs font-medium ${
                  firstStrength.label === 'weak' ? 'text-red-400' :
                  firstStrength.label === 'fair' ? 'text-yellow-400' :
                  firstStrength.label === 'good' ? 'text-blue-400' : 'text-green-400'
                }`}>{strengthLabels[firstStrength.label]}</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${firstStrength.color} ${firstStrength.width}`} />
              </div>
            </div>
          )}

          {/* Password list */}
          <div className="divide-y divide-slate-800/60">
            {passwords.map((pw, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800/30">
                <span className="flex-1 font-mono text-sm text-slate-200 break-all">{pw}</span>
                <CopyButton text={pw} label={t(lang, 'password.copy')} copiedLabel={t(lang, 'password.copied')} />
              </div>
            ))}
          </div>

          {/* Copy all */}
          {passwords.length > 1 && (
            <div className="px-5 py-3 border-t border-slate-800 flex justify-end">
              <CopyButton text={allText} label={t(lang, 'password.copyAll')} copiedLabel={t(lang, 'password.copied')} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
