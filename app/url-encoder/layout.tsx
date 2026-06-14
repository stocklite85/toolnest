import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'URL Encoder / Decoder',
  description: 'Encode and decode URLs and query strings instantly. Free, private — everything runs in your browser.',
  keywords: ['url encoder', 'url decoder', 'url encode', 'percent encoding', 'online url encoder'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
