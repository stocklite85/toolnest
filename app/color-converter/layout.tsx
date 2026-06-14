import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Color Converter',
  description: 'Convert colors between HEX, RGB, and HSL instantly. Free, private — everything runs in your browser.',
  keywords: ['color converter', 'hex to rgb', 'rgb to hsl', 'hex color picker', 'online color converter'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
