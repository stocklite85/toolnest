import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ID Generator',
  description: 'Generate random usernames, alphanumeric IDs, and UUID v4 instantly. Free online ID generator tool.',
  keywords: ['id generator', 'username generator', 'uuid generator', 'random id', '아이디 생성기'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
