import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '로또 번호 생성기 | Lotto Number Generator',
  description: '로또 6/45 번호를 무작위로 생성하세요. 한 번에 최대 10게임까지 자동 생성. Generate random Korean Lotto 6/45 numbers.',
  keywords: ['로또 번호 생성기', '로또 자동번호', '로또 번호 추첨', 'lotto generator', '로또 6/45'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
