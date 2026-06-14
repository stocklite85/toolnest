'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/contexts/LangContext'
import PrivacyBadge from '@/components/PrivacyBadge'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map(c => c + c).join('')
  const m = h.match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (!m) return null
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
    else if (max === gn) h = ((bn - rn) / d + 2) / 6
    else h = ((rn - gn) / d + 4) / 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export default function ColorConverterPage() {
  const { lang } = useLang()
  const isKo = lang === 'ko'
  const [hex, setHex] = useState('#6366f1')
  const [copied, setCopied] = useState('')

  const rgb = hexToRgb(hex) ?? { r: 99, g: 102, b: 241 }
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const isValid = hexToRgb(hex) !== null

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const outputs = [
    { key: 'hex',  label: 'HEX',     value: hex.toUpperCase() },
    { key: 'rgb',  label: 'RGB',     value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { key: 'hsl',  label: 'HSL',     value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { key: 'css',  label: 'CSS Var', value: `--color: ${hex.toUpperCase()};` },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="text-slate-500 hover:text-violet-400 text-sm transition-colors">
        {isKo ? '← 홈으로' : '← Back to Home'}
      </Link>

      <div className="mt-6 mb-6">
        <h1 className="text-3xl font-bold">{isKo ? '색상 변환기' : 'Color Converter'}</h1>
        <p className="text-slate-400 mt-1 text-sm">
          {isKo ? 'HEX, RGB, HSL 색상 코드를 변환하세요' : 'Convert colors between HEX, RGB, and HSL'}
        </p>
      </div>

      <PrivacyBadge />

      {/* Picker */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={isValid ? (hex.startsWith('#') ? hex : '#' + hex) : '#6366f1'}
            onChange={e => setHex(e.target.value)}
            className="w-14 h-14 rounded-xl cursor-pointer border-0 bg-transparent p-0.5"
          />
          <div className="flex-1">
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">HEX</label>
            <input
              value={hex}
              onChange={e => setHex(e.target.value)}
              placeholder="#6366f1"
              maxLength={7}
              className={`w-full bg-slate-800 border rounded-xl px-4 py-2.5 text-sm font-mono outline-none transition-colors ${
                isValid
                  ? 'border-slate-700 focus:border-violet-500/60 text-white'
                  : 'border-red-500/40 text-red-400'
              }`}
            />
          </div>
          {isValid && (
            <div
              className="w-14 h-14 rounded-xl border border-slate-700 flex-shrink-0 shadow-lg"
              style={{ background: hex }}
            />
          )}
        </div>
      </div>

      {/* Output cards */}
      {isValid && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {outputs.map(item => (
            <button
              key={item.key}
              onClick={() => copyText(item.value, item.key)}
              className={`text-left bg-slate-900 border rounded-xl px-4 py-3.5 transition-all hover:border-violet-500/50 hover:bg-slate-800 ${
                copied === item.key ? 'border-violet-500 bg-violet-500/10' : 'border-slate-800'
              }`}
            >
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{item.label}</div>
              <div className="font-mono text-sm text-slate-200 break-all">{item.value}</div>
              <div className={`text-xs mt-1.5 transition-all ${copied === item.key ? 'text-violet-400' : 'text-slate-600'}`}>
                {copied === item.key
                  ? (isKo ? '복사됨!' : 'Copied!')
                  : (isKo ? '클릭해서 복사' : 'Click to copy')}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
