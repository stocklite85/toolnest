import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Subnet Calculator',
  description: 'Calculate subnet mask, network address, broadcast address, and usable host range from IP/CIDR notation. Free subnet calculator.',
  keywords: ['subnet calculator', 'cidr calculator', 'subnet mask', 'network calculator', '서브넷 계산기'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
