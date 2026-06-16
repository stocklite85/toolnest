import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '닉네임 생성기 | Nickname Generator',
  description: '웃김, 판타지, 무협, 캐릭터 등 다양한 스타일의 닉네임을 즉시 생성하세요. Generate unique nicknames instantly.',
  keywords: ['닉네임 생성기', 'nickname generator', '랜덤 닉네임', '닉네임 추천', '무료 닉네임'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
