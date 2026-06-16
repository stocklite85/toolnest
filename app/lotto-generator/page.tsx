'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/contexts/LangContext'
import PrivacyBadge from '@/components/PrivacyBadge'
import { generateLottoNumbers, getBallStyle } from '@/lib/lottoGenerator'

const COUNTS = [1, 5, 10]

interface Game { id: number; numbers: number[]; copied: boolean }
let uid = 0

export default function LottoGeneratorPage() {
  const { lang } = useLang()
  const isKo = lang === 'ko'

  const [count, setCount]       = useState(5)
  const [games, setGames]       = useState<Game[]>([])
  const [allCopied, setAllCopied] = useState(false)

  const generate = () => {
    setGames(Array.from({ length: count }, () => ({
      id: ++uid,
      numbers: generateLottoNumbers(),
      copied: false,
    })))
  }

  const copyGame = async (gameId: number, numbers: number[]) => {
    await navigator.clipboard.writeText(numbers.join(', '))
    setGames(prev => prev.map(g => g.id === gameId ? { ...g, copied: true } : g))
    setTimeout(() => setGames(prev => prev.map(g => g.id === gameId ? { ...g, copied: false } : g)), 2000)
  }

  const copyAll = async () => {
    const text = games
      .map((g, i) => `${isKo ? `${i + 1}게임` : `Game ${i + 1}`}: ${g.numbers.join(', ')}`)
      .join('\n')
    await navigator.clipboard.writeText(text)
    setAllCopied(true)
    setTimeout(() => setAllCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="text-slate-500 hover:text-yellow-400 text-sm transition-colors">
        {isKo ? '← 홈으로' : '← Back to Home'}
      </Link>

      <div className="mt-6 mb-6">
        <h1 className="text-3xl font-bold">{isKo ? '로또 번호 생성기' : 'Lotto Number Generator'}</h1>
        <p className="text-slate-400 mt-1 text-sm">
          {isKo ? '로또 6/45 번호를 무작위로 생성합니다' : 'Generate random Lotto 6/45 numbers'}
        </p>
      </div>

      <PrivacyBadge />

      {/* 볼 색상 안내 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: '1–10', cls: 'bg-yellow-400 text-yellow-900' },
          { label: '11–20', cls: 'bg-blue-500 text-white' },
          { label: '21–30', cls: 'bg-red-500 text-white' },
          { label: '31–40', cls: 'bg-slate-500 text-white' },
          { label: '41–45', cls: 'bg-green-500 text-white' },
        ].map(b => (
          <div key={b.label} className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-full ${b.cls} text-[10px] font-bold flex items-center justify-center`}>
              {b.label.split('–')[0]}
            </div>
            <span className="text-xs text-slate-500">{b.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <label className="text-xs text-slate-500 uppercase tracking-wider mb-3 block">
          {isKo ? '게임 수' : 'Games'}
        </label>
        <div className="flex gap-2">
          {COUNTS.map(c => (
            <button key={c} onClick={() => setCount(c)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                count === c
                  ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                  : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
              }`}>
              {c}{isKo ? '게임' : ' games'}
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button onClick={generate}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 active:scale-[0.99] text-slate-900 font-bold text-lg tracking-wide transition-all shadow-lg shadow-yellow-500/20 mb-8">
        {isKo ? '🎰  번호 생성!' : '🎰  Generate!'}
      </button>

      {/* Results */}
      {games.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-600 uppercase tracking-widest">
              {isKo ? `${games.length}게임 생성됨` : `${games.length} games generated`}
            </p>
            <button onClick={copyAll}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                allCopied
                  ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10'
                  : 'border-slate-700 text-slate-500 hover:text-white hover:border-slate-600'
              }`}>
              {allCopied ? (isKo ? '복사됨!' : 'Copied!') : (isKo ? '전체 복사' : 'Copy All')}
            </button>
          </div>

          <div className="space-y-3">
            {games.map((game, i) => (
              <div key={game.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-10 shrink-0">
                    {isKo ? `${i + 1}게임` : `G${i + 1}`}
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {game.numbers.map(n => (
                      <div key={n}
                        className={`w-10 h-10 rounded-full ${getBallStyle(n)} font-bold text-sm flex items-center justify-center shadow-sm`}>
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => copyGame(game.id, game.numbers)}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    game.copied
                      ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10'
                      : 'border-slate-700 text-slate-500 hover:text-white hover:border-slate-600'
                  }`}>
                  {game.copied ? (isKo ? '복사됨!' : 'Copied!') : (isKo ? '복사' : 'Copy')}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {games.length === 0 && (
        <div className="text-center py-20 text-slate-700">
          <p className="text-5xl mb-4">🎱</p>
          <p className="text-sm">{isKo ? '위 버튼을 눌러 번호를 생성하세요' : 'Press the button above to generate numbers'}</p>
        </div>
      )}
    </div>
  )
}
