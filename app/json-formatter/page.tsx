'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/contexts/LangContext'
import PrivacyBadge from '@/components/PrivacyBadge'

export default function JsonFormatterPage() {
  const { lang } = useLang()
  const isKo = lang === 'ko'
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const format = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, 2))
      setError('')
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }

  const minify = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input)))
      setError('')
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }

  const copy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clear = () => { setInput(''); setOutput(''); setError('') }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/" className="text-slate-500 hover:text-yellow-400 text-sm transition-colors">
        {isKo ? '← 홈으로' : '← Back to Home'}
      </Link>

      <div className="mt-6 mb-6">
        <h1 className="text-3xl font-bold">{isKo ? 'JSON 포매터' : 'JSON Formatter'}</h1>
        <p className="text-slate-400 mt-1 text-sm">
          {isKo ? 'JSON을 보기 좋게 정렬하거나 압축하세요' : 'Format, minify, and validate JSON instantly'}
        </p>
      </div>

      <PrivacyBadge />

      <div className="space-y-4">
        <div>
          <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">Input</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={isKo ? 'JSON을 여기에 붙여넣기...' : 'Paste your JSON here...'}
            rows={8}
            className="w-full bg-slate-900 border border-slate-800 focus:border-yellow-500/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-colors resize-none font-mono"
          />
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={format}
            className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 active:scale-[0.98] text-slate-900 font-semibold text-sm transition-all">
            {isKo ? '정렬하기' : 'Format'}
          </button>
          <button onClick={minify}
            className="px-6 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-[0.98] text-white font-semibold text-sm transition-all">
            {isKo ? '압축하기' : 'Minify'}
          </button>
          <button onClick={clear}
            className="px-6 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-white text-sm transition-all">
            {isKo ? '지우기' : 'Clear'}
          </button>
          {output && !error && (
            <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg">
              ✓ {isKo ? '유효한 JSON' : 'Valid JSON'}
            </span>
          )}
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 font-mono break-all">{error}</p>
        )}

        {output && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Output</label>
              <button onClick={copy}
                className={`text-xs px-3 py-1 rounded-lg transition-all ${copied ? 'text-yellow-400 bg-yellow-500/10' : 'text-slate-500 hover:text-white'}`}>
                {copied ? (isKo ? '복사됨!' : 'Copied!') : (isKo ? '복사' : 'Copy')}
              </button>
            </div>
            <textarea
              readOnly
              value={output}
              rows={12}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 outline-none resize-none font-mono"
            />
          </div>
        )}
      </div>
    </div>
  )
}
