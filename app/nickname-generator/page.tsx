'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/contexts/LangContext'
import PrivacyBadge from '@/components/PrivacyBadge'
import { generateNicknames, type NickStyle, type NickLang } from '@/lib/nicknameGenerator'

const STYLES: { value: NickStyle; labelKo: string; labelEn: string }[] = [
  { value: 'any',       labelKo: '전체',   labelEn: 'Any' },
  { value: 'funny',     labelKo: '웃김',   labelEn: 'Funny' },
  { value: 'fantasy',   labelKo: '판타지', labelEn: 'Fantasy' },
  { value: 'martial',   labelKo: '무협',   labelEn: 'Martial' },
  { value: 'character', labelKo: '캐릭터', labelEn: 'Character' },
  { value: 'general',   labelKo: '일반',   labelEn: 'General' },
  { value: 'concept',   labelKo: '컨셉',   labelEn: 'Concept' },
]

const LANGS: { value: NickLang; labelKo: string; labelEn: string }[] = [
  { value: 'ko',       labelKo: '한글',       labelEn: '한글' },
  { value: 'en_lower', labelKo: '영어 소문자', labelEn: 'English' },
  { value: 'en_upper', labelKo: '영어 대문자', labelEn: 'ENGLISH' },
  { value: 'mixed',    labelKo: '혼합',       labelEn: 'Mixed' },
]

const LENGTHS: { value: number | null; label: string }[] = [
  { value: null, label: '제한없음' },
  { value: 2, label: '2자' },
  { value: 3, label: '3자' },
  { value: 4, label: '4자' },
  { value: 5, label: '5자' },
  { value: 6, label: '6자' },
]

const COUNTS = [5, 10, 20, 30]

interface Card { id: number; value: string; copied: boolean }
let uid = 0

export default function NicknameGeneratorPage() {
  const { lang } = useLang()
  const isKo = lang === 'ko'

  const [style, setStyle]       = useState<NickStyle>('any')
  const [nickLang, setNickLang] = useState<NickLang>('ko')
  const [targetLen, setLen]     = useState<number | null>(null)
  const [count, setCount]       = useState(20)
  const [cards, setCards]       = useState<Card[]>([])
  const [allCopied, setAllCopied] = useState(false)

  const generate = () => {
    const nicks = generateNicknames(style, nickLang, targetLen, count)
    setCards(nicks.map(v => ({ id: ++uid, value: v, copied: false })))
  }

  const copyCard = async (cardId: number, value: string) => {
    await navigator.clipboard.writeText(value)
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, copied: true } : c))
    setTimeout(() => setCards(prev => prev.map(c => c.id === cardId ? { ...c, copied: false } : c)), 2000)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(cards.map(c => c.value).join('\n'))
    setAllCopied(true)
    setTimeout(() => setAllCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/" className="text-slate-500 hover:text-pink-400 text-sm transition-colors">
        {isKo ? '← 홈으로' : '← Back to Home'}
      </Link>

      <div className="mt-6 mb-6">
        <h1 className="text-3xl font-bold">{isKo ? '닉네임 생성기' : 'Nickname Generator'}</h1>
        <p className="text-slate-400 mt-1 text-sm">
          {isKo ? '나만의 닉네임을 즉시 생성하세요' : 'Generate unique nicknames instantly'}
        </p>
      </div>

      <PrivacyBadge />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 space-y-5">
        {/* Style */}
        <div>
          <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
            {isKo ? '스타일' : 'Style'}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {STYLES.map(s => (
              <button key={s.value} onClick={() => setStyle(s.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  style === s.value
                    ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                    : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                }`}>
                {isKo ? s.labelKo : s.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
            {isKo ? '언어' : 'Language'}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {LANGS.map(l => (
              <button key={l.value} onClick={() => setNickLang(l.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  nickLang === l.value
                    ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                    : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                }`}>
                {isKo ? l.labelKo : l.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Length + Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
              {isKo ? '글자 수' : 'Length'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {LENGTHS.map(l => (
                <button key={String(l.value)} onClick={() => setLen(l.value)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    targetLen === l.value
                      ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                      : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                  }`}>
                  {l.value === null ? (isKo ? '제한없음' : 'Any') : (isKo ? `${l.value}자` : `${l.value}`)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
              {isKo ? '생성 개수' : 'Count'}
            </label>
            <div className="flex gap-1.5">
              {COUNTS.map(c => (
                <button key={c} onClick={() => setCount(c)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    count === c
                      ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                      : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generate button */}
      <button onClick={generate}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 active:scale-[0.99] text-white font-bold text-lg tracking-wide transition-all shadow-lg shadow-pink-500/20 mb-8">
        {isKo ? '✨  닉네임 생성!' : '✨  Generate!'}
      </button>

      {/* Results */}
      {cards.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-600 uppercase tracking-widest">
              {isKo ? `${cards.length}개 — 클릭하면 복사` : `${cards.length} results — click to copy`}
            </p>
            <button onClick={copyAll}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                allCopied
                  ? 'border-pink-500 text-pink-400 bg-pink-500/10'
                  : 'border-slate-700 text-slate-500 hover:text-white hover:border-slate-600'
              }`}>
              {allCopied ? (isKo ? '복사됨!' : 'Copied!') : (isKo ? '전체 복사' : 'Copy All')}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {cards.map(card => (
              <button key={card.id} onClick={() => copyCard(card.id, card.value)}
                className={`text-left px-4 py-3 rounded-xl border text-sm transition-all truncate ${
                  card.copied
                    ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-pink-500/50 hover:text-white hover:bg-slate-800'
                }`}>
                {card.copied ? (isKo ? '✓ 복사됨!' : '✓ Copied!') : card.value}
              </button>
            ))}
          </div>
        </>
      )}

      {cards.length === 0 && (
        <div className="text-center py-20 text-slate-700">
          <p className="text-5xl mb-4">✨</p>
          <p className="text-sm">{isKo ? '위 버튼을 눌러 닉네임을 생성하세요' : 'Press the button above to generate nicknames'}</p>
        </div>
      )}
    </div>
  )
}
