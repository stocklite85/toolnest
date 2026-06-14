'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/contexts/LangContext'
import { generateUsernames, generateUUID, type Style } from '@/lib/idGenerator'
import PrivacyBadge from '@/components/PrivacyBadge'

const STYLES: { value: Style; label: string; labelKo: string }[] = [
  { value: 'any',   label: 'Any',   labelKo: '전체' },
  { value: 'cool',  label: 'Cool',  labelKo: '쿨' },
  { value: 'cute',  label: 'Cute',  labelKo: '귀여운' },
  { value: 'funny', label: 'Funny', labelKo: '웃긴' },
  { value: 'tech',  label: 'Tech',  labelKo: '테크' },
]

type LengthFilter = 'any' | 'short' | 'medium' | 'long'
const LENGTHS: { value: LengthFilter; label: string; labelKo: string; hint: string }[] = [
  { value: 'any',    label: 'Any',    labelKo: '전체', hint: '' },
  { value: 'short',  label: 'Short',  labelKo: '짧게', hint: '≤8' },
  { value: 'medium', label: 'Medium', labelKo: '보통', hint: '9-13' },
  { value: 'long',   label: 'Long',   labelKo: '길게', hint: '14+' },
]

function filterByLength(names: string[], f: LengthFilter): string[] {
  if (f === 'any')    return names
  if (f === 'short')  return names.filter(n => n.length <= 8)
  if (f === 'medium') return names.filter(n => n.length >= 9 && n.length <= 13)
  return names.filter(n => n.length >= 14)
}

interface Card { id: number; value: string; copied: boolean }
let uid = 0

export default function IdGeneratorPage() {
  const { lang } = useLang()
  const isKo = lang === 'ko'

  const [name, setName]           = useState('')
  const [hobbies, setHobbies]     = useState('')
  const [numbers, setNumbers]     = useState('')
  const [style, setStyle]         = useState<Style>('any')
  const [lengthFilter, setLength] = useState<LengthFilter>('any')
  const [cards, setCards]         = useState<Card[]>([])
  const [mode, setMode]           = useState<'username' | 'uuid'>('username')

  const spin = () => {
    if (mode === 'uuid') {
      setCards(Array.from({ length: 30 }, () => ({ id: ++uid, value: generateUUID(), copied: false })))
      return
    }
    const isShort = lengthFilter === 'short'
    const batch = generateUsernames({
      name, hobbies,
      numbers: isShort ? '' : numbers,
      style,
      shortOnly: isShort,
    }, isShort ? 500 : 120)
    const filtered = filterByLength(batch, lengthFilter).slice(0, 30)
    setCards(filtered.map(v => ({ id: ++uid, value: v, copied: false })))
  }

  const copyCard = async (cardId: number, value: string) => {
    await navigator.clipboard.writeText(value)
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, copied: true } : c))
    setTimeout(() => setCards(prev => prev.map(c => c.id === cardId ? { ...c, copied: false } : c)), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/" className="text-slate-500 hover:text-cyan-400 text-sm transition-colors">
        {isKo ? '← 홈으로' : '← Back to Home'}
      </Link>

      <div className="mt-6 mb-6">
        <h1 className="text-3xl font-bold">{isKo ? '아이디 생성기' : 'Username Generator'}</h1>
        <p className="text-slate-400 mt-1 text-sm">
          {isKo ? '정보를 입력할수록 나에게 맞는 아이디가 생성됩니다' : 'The more you fill in, the more personalised your usernames'}
        </p>
      </div>

      <PrivacyBadge />

      {/* Mode tabs */}
      <div className="flex gap-2 mb-6">
        {(['username', 'uuid'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all ${mode === m ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'}`}>
            {m === 'username' ? (isKo ? '사용자명' : 'Username') : 'UUID v4'}
          </button>
        ))}
      </div>

      {mode === 'username' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 space-y-4">
          {/* Name + hobbies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">
                {isKo ? '이름 또는 닉네임' : 'Your name or nickname'}
              </label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder={isKo ? '예: 지수, alex' : 'e.g. alex, jisu'}
                className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-colors" />
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">
                {isKo ? '관심사 / 취미' : 'Hobbies or interests'}
              </label>
              <input value={hobbies} onChange={e => setHobbies(e.target.value)}
                placeholder={isKo ? '예: 음악, 게임, 고양이' : 'e.g. music, gaming, cats'}
                className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-colors" />
            </div>
          </div>

          {/* Numbers + style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">
                {isKo ? '좋아하는 숫자' : 'Favourite numbers'}
              </label>
              <input value={numbers} onChange={e => setNumbers(e.target.value)}
                placeholder={isKo ? '예: 7, 99' : 'e.g. 7, 99'}
                disabled={lengthFilter === 'short'}
                className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-500/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-colors disabled:opacity-40" />
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">
                {isKo ? '스타일' : 'Style'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {STYLES.map(s => (
                  <button key={s.value} onClick={() => setStyle(s.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${style === s.value ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'}`}>
                    {isKo ? s.labelKo : s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Length */}
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">
              {isKo ? '아이디 길이' : 'Length'}
            </label>
            <div className="flex gap-2">
              {LENGTHS.map(l => (
                <button key={l.value} onClick={() => setLength(l.value)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${lengthFilter === l.value ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'}`}>
                  <span className="block font-semibold">{isKo ? l.labelKo : l.label}</span>
                  {l.hint && <span className="text-[10px] opacity-60">{l.hint}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spin button */}
      <button onClick={spin}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 active:scale-[0.99] text-white font-bold text-lg tracking-wide transition-all shadow-lg shadow-cyan-500/20 mb-8">
        {mode === 'uuid' ? '⚙️  Generate UUIDs' : (isKo ? '🎲  생성하기!' : '🎲  Spin!')}
      </button>

      {/* Results grid */}
      {cards.length > 0 && (
        <>
          <p className="text-xs text-slate-600 uppercase tracking-widest mb-3">
            {isKo ? `${cards.length}개 생성됨 — 클릭하면 복사` : `${cards.length} generated — click to copy`}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {cards.map(card => (
              <button key={card.id} onClick={() => copyCard(card.id, card.value)}
                className={`text-left px-4 py-3 rounded-xl border font-mono text-sm transition-all truncate ${
                  card.copied
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-white hover:bg-slate-800'
                }`}>
                {card.copied ? (isKo ? '✓ 복사됨!' : '✓ Copied!') : card.value}
              </button>
            ))}
          </div>
        </>
      )}

      {cards.length === 0 && (
        <div className="text-center py-20 text-slate-700">
          <p className="text-5xl mb-4">🎲</p>
          <p className="text-sm">{isKo ? '위 버튼을 눌러 아이디를 생성하세요' : 'Press the button above to generate usernames'}</p>
        </div>
      )}
    </div>
  )
}
