'use client'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useLang } from '@/contexts/LangContext'
import { t } from '@/lib/translations'
import { generateIds, type IdType, type Separator } from '@/lib/idGenerator'
import CopyButton from '@/components/CopyButton'

export default function IdGeneratorPage() {
  const { lang } = useLang()
  const [type, setType] = useState<IdType>('wordcombo')
  const [separator, setSeparator] = useState<Separator>('-')
  const [includeNumber, setIncludeNumber] = useState(true)
  const [count, setCount] = useState(5)
  const [ids, setIds] = useState<string[]>([])

  const generate = useCallback(() => {
    setIds(generateIds({ type, separator, includeNumber, count }))
  }, [type, separator, includeNumber, count])

  const allText = ids.join('\n')

  const types: { value: IdType; labelKey: string }[] = [
    { value: 'wordcombo', labelKey: 'id.wordCombo' },
    { value: 'alphanumeric', labelKey: 'id.alphanumeric' },
    { value: 'uuid', labelKey: 'id.uuid' },
  ]

  const separators: { value: Separator; labelKey: string }[] = [
    { value: '-', labelKey: 'id.dash' },
    { value: '_', labelKey: 'id.underscore' },
    { value: '.', labelKey: 'id.dot' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/" className="text-slate-500 hover:text-cyan-400 text-sm transition-colors">
        {t(lang, 'common.backHome')}
      </Link>

      <div className="flex items-center gap-3 mt-6 mb-8">
        <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center text-xl">🎲</div>
        <div>
          <h1 className="text-2xl font-bold">{t(lang, 'id.title')}</h1>
          <p className="text-slate-400 text-sm">{t(lang, 'id.description')}</p>
        </div>
      </div>

      {/* Options */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-5 space-y-5">
        {/* Type */}
        <div>
          <label className="text-sm text-slate-400 mb-2 block">{t(lang, 'id.type')}</label>
          <div className="flex gap-2">
            {types.map(({ value, labelKey }) => (
              <button key={value} onClick={() => setType(value)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  type === value
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >{t(lang, labelKey)}</button>
            ))}
          </div>
        </div>

        {/* Separator (only for non-UUID) */}
        {type !== 'uuid' && (
          <div>
            <label className="text-sm text-slate-400 mb-2 block">{t(lang, 'id.separator')}</label>
            <div className="flex gap-2">
              {separators.map(({ value, labelKey }) => (
                <button key={value} onClick={() => setSeparator(value)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    separator === value
                      ? 'bg-slate-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >{t(lang, labelKey)}</button>
              ))}
            </div>
          </div>
        )}

        {/* Include number toggle */}
        {type !== 'uuid' && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">{t(lang, 'id.includeNumber')}</span>
            <button
              onClick={() => setIncludeNumber(p => !p)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                includeNumber ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                includeNumber ? 'translate-x-[22px]' : 'translate-x-[2px]'
              }`} />
            </button>
          </div>
        )}

        {/* Count */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-slate-300">{t(lang, 'id.count')}</label>
          <div className="flex items-center gap-2">
            {[1, 3, 5, 10].map(n => (
              <button key={n} onClick={() => setCount(n)}
                className={`w-9 h-8 rounded-lg text-sm font-medium transition-colors ${
                  count === n ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >{n}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate */}
      <button
        onClick={generate}
        className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white font-semibold transition-colors mb-5"
      >
        {t(lang, 'id.generate')}
      </button>

      {/* Results */}
      {ids.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="divide-y divide-slate-800/60">
            {ids.map((id, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800/30">
                <span className="w-5 text-xs text-slate-600 shrink-0">{i + 1}</span>
                <span className="flex-1 font-mono text-sm text-slate-200 break-all">{id}</span>
                <CopyButton text={id} label={t(lang, 'id.copy')} copiedLabel={t(lang, 'id.copied')} />
              </div>
            ))}
          </div>
          {ids.length > 1 && (
            <div className="px-5 py-3 border-t border-slate-800 flex justify-end">
              <CopyButton text={allText} label={t(lang, 'id.copyAll')} copiedLabel={t(lang, 'id.copied')} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
