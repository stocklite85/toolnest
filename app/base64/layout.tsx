import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Base64 Encoder / Decoder',
  description: 'Encode text to Base64 or decode Base64 strings instantly. Free, private — everything runs in your browser.',
  keywords: ['base64 encoder', 'base64 decoder', 'base64 converter', 'online base64', 'free tool'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
