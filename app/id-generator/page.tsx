'use client'
import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useLang } from '@/contexts/LangContext'
import { generateUsername, generateUUIDs, type Style, type Separator } from '@/lib/idGenerator'
import PrivacyBadge from '@/components/PrivacyBadge'

const STYLES: { value: Style; label: string; labelKo: string; emoji: string; color: string; activeColor: string }[] = [
  { value: 'cool', label: 'Cool', labelKo: '쿨', emoji: '🔥', color: 'border-slate-700 text-slate-400 hover:border-orange-500/50 hover:text-orange-400', activeColor: 'border-orange-500 bg-orange-500/10 text-orange-400' },
  { value: 'cute', label: 'Cute', labelKo: '귀여운', emoji: '🌸', color: 'border-slate-700 text-slate-400 hover:border-pink-500/50 hover:text-pink-400', activeColor: 'border-pink-500 bg-pink-500/10 text-pink-400' },
  { value: 'funny', label: 'Funny', labelKo: '웃긴', emoji: '😂', color: 'border-slate-700 text-slate-400 hover:border-yellow-500/50 hover:text-yellow-400', activeColor: 'border-yellow-500 bg-yellow-500/10 text-yellow-400' },
  { value: 'tech', label: 'Tech', labelKo: '테크', emoji: '💻', color: 'border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400', activeColor: 'border-cyan-500 bg-cyan-500/10 text-cyan-400' },
]

const SEPARATORS: { value: Separator; label: string }[] = [
  { value: '-', label: 'dash  cool-wolf' },
  { value: '_', label: 'underscore  cool_wolf' },
  { value: '.', label: 'dot  cool.wolf' },
]

const UUID_COUNT = 8

interface UsernameCard {
  id: number
  value: string
  copied: boolean
}

let cardId = 0

export default function IdGeneratorPage() {
  const { lang } = useLang()
  const isKo = lang === 'ko'

  const [style, setStyle] = useState<Style>('cool')
  const [separator, setSeparator] = useState<Separator>('-')
  const [includeNumber, setIncludeNumber] = useState(false)
  const [showUUID, setShowUUID] = useState(false)
  const [cards, setCards] = useState<UsernameCard[]>([])

  const makeCards = useCallback((s: Style, sep: Separator, num: boolean) => {
    return Array.from({ length: 12 }, () => ({
      id: ++cardId,
      value: generateUsername({ style: s, separator: sep, includeNumber: num }),
      copied: false,
    }))
  }, [])

  const makeUUIDs = useCallback(() => {
    return generateUUIDs(UUID_COUNT).map(v => ({ id: ++cardId, value: v, copied: false }))
  }, [])

  useEffect(() => {
    setCards(makeCards(style, separator, includeNumber))
  }, [])

  const generate = () => {
    if (showUUID) setCards(makeUUIDs())
    else setCards(makeCards(style, separator, includeNumber))
  }

  const refreshOne = (targetId: number) => {
    setCards(prev => prev.map(c =>
      c.id === targetId
        ? { id: ++cardId, value: showUUID ? generateUUIDs(1)[0] : generateUsername({ style, separator, includeNumber }), copied: false }
        : c
    ))
  }

  const copyOne = async (targetId: number, value: string) => {
    await navigator.clipboard.writeText(value)
    setCards(prev => prev.map(c => c.id === targetId ? { ...c, copied: true } : c))
    setTimeout(() => setCards(prev => prev.map(c => c.id === targetId ? { ...c, copied: false } : c)), 2000)
  }

  const activeStyle = STYLES.find(s => s.value === style)!

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/" className="text-slate-500 hover:text-cyan-400 text-sm transition-colors">
        {isKo ? '← 홈으로' : '← Back to Home'}
      </Link>

      <div className="mt-6 mb-2">
        <h1 className="text-3xl font-bold">{isKo ? '아이디 생성기' : 'Username Generator'}</h1>
        <p className="text-slate-400 mt-1">{isKo ? '마음에 드는 아이디를 바로 복사하세요' : 'Find the perfect username and copy it instantly'}</p>
      </div>

      <div className="mt-6 mb-6">
        <PrivacyBadge />
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => { setShowUUID(false); setCards(makeCards(style, separator, includeNumber)) }}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${!showUUID ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}>
          {isKo ? '사용자명' : 'Username'}
        </button>
        <button onClick={() => { setShowUUID(true); setCards(makeUUIDs()) }}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${showUUID ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}>
          UUID v4
        </button>
      </div>

      {!showUUID && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 space-y-5">
          {/* Style */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">{isKo ? '스타일' : 'Style'}</p>
            <div className="grid grid-cols-4 gap-2">
              {STYLES.map(s => (
                <button key={s.value}
                  onClick={() => { setStyle(s.value); setCards(makeCards(s.value, separator, includeNumber)) }}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${style === s.value ? s.activeColor : s.color}`}>
                  <span className="block text-lg mb-0.5">{s.emoji}</span>
                  {isKo ? s.labelKo : s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">{isKo ? '구분자' : 'Separator'}</p>
            <div className="flex gap-2">
              {SEPARATORS.map(sep => (
                <button key={sep.value}
                  onClick={() => { setSeparator(sep.value); setCards(makeCards(style, sep.value, includeNumber)) }}
                  className={`flex-1 py-2 rounded-xl text-xs font-mono border transition-all ${separator === sep.value ? 'bg-slate-700 border-slate-500 text-white' : 'border-slate-700 text-slate-500 hover:border-slate-600'}`}>
                  {sep.label}
                </button>
              ))}
            </div>
          </div>

          {/* Include number */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">{isKo ? '숫자 포함' : 'Include numbers'}</span>
            <button
              onClick={() => { const next = !includeNumber; setIncludeNumber(next); setCards(makeCards(style, separator, next)) }}
              className={`w-11 h-6 rounded-full transition-colors relative ${includeNumber ? 'bg-cyan-500' : 'bg-slate-700'}`}>
              <span className={`absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform ${includeNumber ? 'translate-x-[23px]' : 'translate-x-[3px]'}`} />
            </button>
          </div>
        </div>
      )}

      {/* Generate button */}
      <button onClick={generate}
        className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-white font-bold text-base transition-colors mb-8">
        {isKo ? '🎲 새로 생성' : '🎲 Generate New'}
      </button>

      {/* Cards grid */}
      {cards.length > 0 && (
        <>
          <p className="text-xs text-slate-600 mb-3 uppercase tracking-widest">
            {showUUID ? 'UUID v4' : (isKo ? `${activeStyle.emoji} ${activeStyle.labelKo} 스타일` : `${activeStyle.emoji} ${activeStyle.label} Style`)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {cards.map(card => (
              <div key={card.id}
                className="group bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl px-4 py-4 flex items-center justify-between gap-2 transition-all">
                <span className={`font-mono text-sm font-medium truncate ${showUUID ? 'text-xs text-slate-400' : 'text-white'}`}>
                  {card.value}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Refresh single */}
                  <button onClick={() => refreshOne(card.id)}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-500 hover:text-slate-300 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </button>
                  {/* Copy */}
                  <button onClick={() => copyOne(card.id, card.value)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${card.copied ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50'}`}>
                    {card.copied ? (isKo ? '복사됨' : 'Copied!') : (isKo ? '복사' : 'Copy')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
