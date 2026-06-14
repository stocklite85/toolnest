'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/contexts/LangContext'
import PrivacyBadge from '@/components/PrivacyBadge'

function encodeBase64(str: string): string {
  return btoa(Array.from(new TextEncoder().encode(str), b => String.fromCharCode(b)).join(''))
}

function decodeBase64(str: string): string {
  return new TextDecoder().decode(Uint8Array.from(atob(str), c => c.charCodeAt(0)))
}

export default function Base64Page() {
  const { lang } = useLang()
  const isKo = lang === 'ko'
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const encode = () => {
    try {
      setOutput(encodeBase64(input))
      setError('')
    } catch {
      setError(isKo ? '인코딩 실패' : 'Encoding failed')
    }
  }

  const decode = () => {
    try {
      setOutput(decodeBase64(input.trim()))
      setError('')
    } catch {
      setError(isKo ? '유효하지 않은 Base64 문자열입니다' : 'Invalid Base64 string')
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
      <Link href="/" className="text-slate-500 hover:text-orange-400 text-sm transition-colors">
        {isKo ? '← 홈으로' : '← Back to Home'}
      </Link>

      <div className="mt-6 mb-6">
        <h1 className="text-3xl font-bold">{isKo ? 'Base64 인코더 / 디코더' : 'Base64 Encoder / Decoder'}</h1>
        <p className="text-slate-400 mt-1 text-sm">
          {isKo ? 'Base64로 인코딩하거나 디코딩하세요' : 'Encode or decode Base64 strings instantly'}
        </p>
      </div>

      <PrivacyBadge />

      <div className="space-y-4">
        <div>
          <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">
            {isKo ? '입력' : 'Input'}
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={isKo ? '인코딩할 텍스트 또는 디코딩할 Base64 문자열...' : 'Enter text to encode or Base64 string to decode...'}
            rows={6}
            className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-colors resize-none font-mono"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={encode}
            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 active:scale-[0.98] text-white font-semibold text-sm transition-all">
            {isKo ? '인코딩' : 'Encode'}
          </button>
          <button onClick={decode}
            className="px-6 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-[0.98] text-white font-semibold text-sm transition-all">
            {isKo ? '디코딩' : 'Decode'}
          </button>
          <button onClick={clear}
            className="px-6 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-white text-sm transition-all">
            {isKo ? '지우기' : 'Clear'}
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{error}</p>
        )}

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-slate-500 uppercase tracking-wider">
              {isKo ? '결과' : 'Output'}
            </label>
            {output && (
              <button onClick={copy}
                className={`text-xs px-3 py-1 rounded-lg transition-all ${copied ? 'text-orange-400 bg-orange-500/10' : 'text-slate-500 hover:text-white'}`}>
                {copied ? (isKo ? '복사됨!' : 'Copied!') : (isKo ? '복사' : 'Copy')}
              </button>
            )}
          </div>
          <textarea
            readOnly
            value={output}
            placeholder={isKo ? '결과가 여기에 표시됩니다' : 'Output will appear here'}
            rows={6}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-600 outline-none resize-none font-mono"
          />
        </div>
      </div>
    </div>
  )
}
