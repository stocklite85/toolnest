import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이름 추첨기 룰렛 | Spin the Wheel',
  description: '참가자 이름을 입력하고 룰렛을 돌려 당첨자를 뽑으세요. 무료 온라인 이름 추첨기.',
  keywords: ['이름 추첨기', '룰렛', '랜덤 뽑기', '제비뽑기', 'spin the wheel', '당첨자 추첨'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
