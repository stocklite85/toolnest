import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ToolNest - Free Online Utilities'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          display: 'flex',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '16px' }}>
          <span style={{ fontSize: '80px', fontWeight: 800, color: '#ffffff', letterSpacing: '-2px' }}>Tool</span>
          <span style={{ fontSize: '80px', fontWeight: 800, color: '#818cf8', letterSpacing: '-2px' }}>Nest</span>
        </div>

        {/* Tagline */}
        <p style={{ fontSize: '26px', color: '#94a3b8', margin: '0 0 48px 0', letterSpacing: '0.5px' }}>
          Free Online Utilities — No login, no tracking
        </p>

        {/* Tool pills */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {[
            { icon: '🔐', label: 'Password Generator', color: '#6366f1' },
            { icon: '🎲', label: 'ID Generator', color: '#06b6d4' },
            { icon: '🌐', label: 'Subnet Calculator', color: '#10b981' },
          ].map(tool => (
            <div key={tool.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${tool.color}40`,
              borderRadius: '14px',
              padding: '14px 22px',
            }}>
              <span style={{ fontSize: '28px' }}>{tool.icon}</span>
              <span style={{ fontSize: '18px', color: '#e2e8f0', fontWeight: 600 }}>{tool.label}</span>
            </div>
          ))}
        </div>

        {/* URL */}
        <p style={{ position: 'absolute', bottom: '32px', fontSize: '18px', color: '#475569' }}>
          toolnest-inky.vercel.app
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
