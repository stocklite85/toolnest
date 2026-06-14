'use client'
import Link from 'next/link'
import { useLang } from '@/contexts/LangContext'
import { t } from '@/lib/translations'

const tools = [
  {
    href: '/password-generator',
    icon: '🔐',
    titleKey: 'password.title',
    descKey: 'password.description',
    color: 'from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border-indigo-500/20 hover:border-indigo-500/50',
    iconBg: 'bg-indigo-500/20',
  },
  {
    href: '/id-generator',
    icon: '🎲',
    titleKey: 'id.title',
    descKey: 'id.description',
    color: 'from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border-cyan-500/20 hover:border-cyan-500/50',
    iconBg: 'bg-cyan-500/20',
  },
  {
    href: '/subnet-calculator',
    icon: '🌐',
    titleKey: 'subnet.title',
    descKey: 'subnet.description',
    color: 'from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border-emerald-500/20 hover:border-emerald-500/50',
    iconBg: 'bg-emerald-500/20',
  },
]

export default function Home() {
  const { lang } = useLang()

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-4 tracking-tight">
          Tool<span className="text-indigo-400">Nest</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-md mx-auto">{t(lang, 'home.subtitle')}</p>
      </div>

      <p className="text-slate-500 text-sm uppercase tracking-widest mb-6">{t(lang, 'home.toolsTitle')}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tools.map(tool => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`bg-gradient-to-br ${tool.color} border rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 group`}
          >
            <div className={`w-12 h-12 ${tool.iconBg} rounded-xl flex items-center justify-center text-2xl mb-4`}>
              {tool.icon}
            </div>
            <h2 className="text-lg font-semibold mb-1.5 group-hover:text-white">{t(lang, tool.titleKey)}</h2>
            <p className="text-slate-400 text-sm leading-relaxed">{t(lang, tool.descKey)}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
