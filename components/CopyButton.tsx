'use client'
import { useState } from 'react'

interface Props {
  text: string
  label?: string
  copiedLabel?: string
  className?: string
}

export default function CopyButton({ text, label = 'Copy', copiedLabel = 'Copied!', className = '' }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
        copied
          ? 'bg-green-500/20 text-green-400 border border-green-500/40'
          : 'bg-slate-700 text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-400 border border-slate-600 hover:border-indigo-500/50'
      } ${className}`}
    >
      {copied ? copiedLabel : label}
    </button>
  )
}
