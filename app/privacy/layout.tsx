import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ToolNest privacy policy. All tools run entirely in your browser. No data is collected or stored.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
