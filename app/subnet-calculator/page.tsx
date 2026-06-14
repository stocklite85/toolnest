'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/contexts/LangContext'
import { t } from '@/lib/translations'
import { calculateSubnet, parseCIDR, type SubnetInfo } from '@/lib/subnet'
import CopyButton from '@/components/CopyButton'

const EXAMPLES = ['192.168.1.0/24', '10.0.0.0/8', '172.16.0.0/12', '10.10.5.100/27']

export default function SubnetCalculatorPage() {
  const { lang } = useLang()
  const [input, setInput] = useState('')
  const [result, setResult] = useState<SubnetInfo | null>(null)
  const [error, setError] = useState(false)

  const calculate = () => {
    setError(false)
    const parsed = parseCIDR(input)
    if (!parsed) { setError(true); setResult(null); return }
    const info = calculateSubnet(parsed.ip, parsed.cidr)
    if (!info) { setError(true); setResult(null); return }
    setResult(info)
  }

  const reset = () => { setInput(''); setResult(null); setError(false) }

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') calculate() }

  const rows = result ? [
    { key: 'subnet.networkAddress', value: result.networkAddress },
    { key: 'subnet.broadcastAddress', value: result.broadcastAddress },
    { key: 'subnet.subnetMask', value: result.subnetMask },
    { key: 'subnet.wildcardMask', value: result.wildcardMask },
    { key: 'subnet.firstHost', value: result.firstHost },
    { key: 'subnet.lastHost', value: result.lastHost },
    { key: 'subnet.totalHosts', value: result.totalHosts.toLocaleString() },
    { key: 'subnet.usableHosts', value: result.usableHosts.toLocaleString() },
    { key: 'subnet.ipClass', value: result.ipClass },
    { key: 'subnet.privateIp', value: result.isPrivate ? t(lang, 'subnet.yes') : t(lang, 'subnet.no') },
    { key: 'subnet.binaryMask', value: result.binaryMask },
  ] : []

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/" className="text-slate-500 hover:text-emerald-400 text-sm transition-colors">
        {t(lang, 'common.backHome')}
      </Link>

      <div className="flex items-center gap-3 mt-6 mb-8">
        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-xl">🌐</div>
        <div>
          <h1 className="text-2xl font-bold">{t(lang, 'subnet.title')}</h1>
          <p className="text-slate-400 text-sm">{t(lang, 'subnet.description')}</p>
        </div>
      </div>

      {/* Input */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-5">
        <label className="text-sm text-slate-400 mb-2 block">{t(lang, 'subnet.input')}</label>
        <div className="flex gap-3">
          <input
            value={input}
            onChange={e => { setInput(e.target.value); setError(false) }}
            onKeyDown={handleKey}
            placeholder={t(lang, 'subnet.inputPlaceholder')}
            className={`flex-1 bg-slate-800 border rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-slate-600 outline-none transition-colors ${
              error ? 'border-red-500/70' : 'border-slate-700 focus:border-emerald-500/60'
            }`}
          />
          <button onClick={calculate}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold rounded-xl transition-colors text-sm whitespace-nowrap"
          >{t(lang, 'subnet.calculate')}</button>
        </div>

        {error && (
          <p className="text-red-400 text-xs mt-2">{t(lang, 'subnet.error')}</p>
        )}

        {/* Quick examples */}
        <div className="flex flex-wrap gap-2 mt-4">
          {EXAMPLES.map(ex => (
            <button key={ex} onClick={() => { setInput(ex); setError(false); setResult(null) }}
              className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg font-mono transition-colors border border-slate-700"
            >{ex}</button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <span className="font-mono text-sm text-emerald-400">
              {result.ip}/{result.cidr}
            </span>
            <button onClick={reset}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >{t(lang, 'subnet.reset')}</button>
          </div>

          <div className="divide-y divide-slate-800/60">
            {rows.map(({ key, value }) => (
              <div key={key} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800/30">
                <span className="w-44 text-xs text-slate-500 shrink-0">{t(lang, key)}</span>
                <span className="flex-1 font-mono text-sm text-slate-200 break-all">{value}</span>
                {!/^(Yes|No|예|아니오|Class [A-E]|[A-E] .*)$/.test(value) && (
                  <CopyButton text={value} label={t(lang, 'subnet.copy')} copiedLabel={t(lang, 'subnet.copied')} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
