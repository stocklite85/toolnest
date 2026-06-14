import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { LangProvider } from '@/contexts/LangContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'ToolNest - Free Online Utilities', template: '%s | ToolNest' },
  description: 'Free online tools: password generator, ID generator, subnet calculator and more. No login required.',
  keywords: ['password generator', 'id generator', 'subnet calculator', 'free tools', 'online utilities'],
  verification: {
    google: 'gFJC8pKAliNeLONrdUMXGG5PsKABSFIcGr6DLkmz6KY',
    other: { 'naver-site-verification': '959ce7ee9fb420f2d0bc22eb3b69c56c44a4eaf9' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-white min-h-screen flex flex-col`}>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5163207360443663"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <LangProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  )
}
