import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Password Generator',
  description: 'Generate strong, secure passwords instantly. Choose length, character types, and get multiple passwords at once. Free, no login required.',
  keywords: ['password generator', 'random password', 'secure password', 'strong password', '비밀번호 생성기'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
