'use client'
import { useEffect } from 'react'

interface Props {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal'
  className?: string
}

export default function AdSlot({ slot, format = 'auto', className = '' }: Props) {
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).adsbygoogle.push({})
    } catch {}
  }, [])

  return (
    <div className={`overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5163207360443663"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
