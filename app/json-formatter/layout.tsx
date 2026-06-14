import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON Formatter',
  description: 'Format, minify, and validate JSON instantly. Free, private — everything runs in your browser.',
  keywords: ['json formatter', 'json beautifier', 'json minifier', 'json validator', 'online json'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
