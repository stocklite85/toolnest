'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useLang } from '@/contexts/LangContext'
import PrivacyBadge from '@/components/PrivacyBadge'

const COLORS = [
  '#FF6B6B', '#4FC3F7', '#81C784', '#FFB74D', '#CE93D8',
  '#F06292', '#4DB6AC', '#FFF176', '#80CBC4', '#90CAF9',
  '#FFAB40', '#EF9A9A', '#B39DDB', '#80DEEA', '#A5D6A7',
]

const DEFAULTS = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']
const SIZE = 380

export default function SpinWheelPage() {
  const { lang } = useLang()
  const isKo = lang === 'ko'

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotRef    = useRef(0)
  const rafRef    = useRef<number>(0)

  const [names, setNames]         = useState<string[]>(DEFAULTS)
  const [input, setInput]         = useState('')
  const [isSpinning, setSpinning] = useState(false)
  const [winner, setWinner]       = useState<string | null>(null)

  const draw = useCallback((rot?: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const r = rot ?? rotRef.current
    const cx = SIZE / 2
    const cy = SIZE / 2
    const radius = cx - 12
    const N = names.length

    ctx.clearRect(0, 0, SIZE, SIZE)
    if (N === 0) return

    const seg = (2 * Math.PI) / N

    names.forEach((name, i) => {
      const s = i * seg + r
      const e = (i + 1) * seg + r

      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, radius, s, e)
      ctx.closePath()
      ctx.fillStyle = COLORS[i % COLORS.length]
      ctx.fill()
      ctx.strokeStyle = 'rgba(15,23,42,0.25)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(s + seg / 2)
      ctx.textAlign = 'right'
      const fs = Math.max(10, Math.min(15, 280 / N))
      ctx.font = `bold ${fs}px system-ui, sans-serif`
      ctx.fillStyle = 'rgba(15,23,42,0.9)'
      const max = Math.max(4, Math.floor(20 - N * 0.6))
      const label = name.length > max ? name.slice(0, max) + '…' : name
      ctx.fillText(label, radius - 14, fs / 3)
      ctx.restore()
    })

    // outer ring
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 3
    ctx.stroke()

    // center cap
    ctx.beginPath()
    ctx.arc(cx, cy, 16, 0, Math.PI * 2)
    ctx.fillStyle = '#0f172a'
    ctx.fill()
    ctx.strokeStyle = '#475569'
    ctx.lineWidth = 2
    ctx.stroke()

    // pointer triangle at top
    const tip = cy - radius - 1
    ctx.beginPath()
    ctx.moveTo(cx, tip)
    ctx.lineTo(cx - 11, tip - 24)
    ctx.lineTo(cx + 11, tip - 24)
    ctx.closePath()
    ctx.fillStyle = '#f43f5e'
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }, [names])

  useEffect(() => {
    if (!isSpinning) draw()
  }, [draw, isSpinning])

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const spin = () => {
    if (isSpinning || names.length < 2) return
    cancelAnimationFrame(rafRef.current)
    setSpinning(true)
    setWinner(null)

    const N = names.length
    const seg = (2 * Math.PI) / N
    const targetIdx = Math.floor(Math.random() * N)
    const offset = 0.15 + Math.random() * 0.7
    const targetRot = -Math.PI / 2 - (targetIdx + offset) * seg

    const startRot = rotRef.current
    const startNorm  = ((startRot  % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
    const targetNorm = ((targetRot % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
    let delta = (targetNorm - startNorm + 2 * Math.PI) % (2 * Math.PI)
    if (delta < 0.01) delta = 2 * Math.PI
    const total = (4 + Math.floor(Math.random() * 4)) * 2 * Math.PI + delta

    const duration = 3500 + Math.random() * 1000
    const t0 = performance.now()

    const animate = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 4)
      rotRef.current = startRot + total * eased
      draw(rotRef.current)

      if (p < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setSpinning(false)
        setWinner(names[targetIdx])
      }
    }

    rafRef.current = requestAnimationFrame(animate)
  }

  const addName = () => {
    const v = input.trim()
    if (!v || names.length >= 20) return
    setNames(p => [...p, v])
    setInput('')
    setWinner(null)
  }

  const removeName = (i: number) => {
    setNames(p => p.filter((_, j) => j !== i))
    setWinner(null)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link href="/" className="text-slate-500 hover:text-rose-400 text-sm transition-colors">
        {isKo ? '← 홈으로' : '← Back to Home'}
      </Link>

      <div className="mt-6 mb-6">
        <h1 className="text-3xl font-bold">{isKo ? '이름 추첨기' : 'Spin the Wheel'}</h1>
        <p className="text-slate-400 mt-1 text-sm">
          {isKo ? '참가자를 입력하고 휠을 돌려 당첨자를 뽑으세요' : 'Add names and spin the wheel to pick a winner'}
        </p>
      </div>

      <PrivacyBadge />

      <div className="flex flex-col lg:flex-row gap-8 mt-4">
        {/* Wheel */}
        <div className="flex flex-col items-center gap-4">
          <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            className="w-full max-w-sm"
          />

          <button
            onClick={spin}
            disabled={isSpinning || names.length < 2}
            className="w-full max-w-sm py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99] text-white font-bold text-lg tracking-wide transition-all shadow-lg shadow-rose-500/20">
            {isSpinning
              ? (isKo ? '돌아가는 중...' : 'Spinning...')
              : (isKo ? '🎯  돌리기!' : '🎯  Spin!')}
          </button>

          {winner && (
            <div className="w-full max-w-sm text-center bg-rose-500/10 border border-rose-500/30 rounded-2xl py-5 px-6">
              <p className="text-xs text-rose-400 uppercase tracking-widest mb-2">
                {isKo ? '🎉 당첨!' : '🎉 Winner!'}
              </p>
              <p className="text-2xl font-bold">{winner}</p>
            </div>
          )}
        </div>

        {/* Name list */}
        <div className="flex-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-3 block">
              {isKo ? `참가자 (${names.length}/20)` : `Participants (${names.length}/20)`}
            </label>

            <div className="flex gap-2 mb-4">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addName()}
                disabled={isSpinning}
                placeholder={isKo ? '이름 입력 후 Enter' : 'Type a name and press Enter'}
                maxLength={20}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 disabled:opacity-50 transition-colors"
              />
              <button
                onClick={addName}
                disabled={!input.trim() || names.length >= 20 || isSpinning}
                className="px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 text-sm font-medium hover:bg-rose-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                {isKo ? '추가' : 'Add'}
              </button>
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {names.map((name, i) => (
                <div key={`${name}-${i}`}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800 group">
                  <div className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm text-slate-300 flex-1 truncate">{name}</span>
                  <button
                    onClick={() => removeName(i)}
                    disabled={isSpinning}
                    className="text-slate-600 hover:text-rose-400 text-sm leading-none transition-colors opacity-0 group-hover:opacity-100 disabled:pointer-events-none">
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setNames(DEFAULTS); setWinner(null) }}
              disabled={isSpinning}
              className="mt-3 w-full py-2 rounded-xl border border-slate-700 text-slate-600 text-xs hover:text-slate-400 hover:border-slate-600 disabled:opacity-40 transition-all">
              {isKo ? '초기화' : 'Reset'}
            </button>
          </div>

          {names.length < 2 && (
            <p className="text-xs text-slate-600 mt-2 text-center">
              {isKo ? '최소 2명 이상 입력해야 돌릴 수 있습니다' : 'Add at least 2 names to spin'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
