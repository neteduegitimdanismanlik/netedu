import { ImageResponse } from 'next/og'

/**
 * The preview image shown when any NetEdu link is shared (WhatsApp,
 * Instagram DMs, LinkedIn, X). Next.js attaches it to every page that
 * doesn't have its own. Text is kept to plain ASCII so the built-in font
 * renders every character.
 */

export const alt = 'NetEdu — university guidance for IB students'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#1e1b4b',
          padding: '72px 80px',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: 'white',
              color: '#1e1b4b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            N
          </div>
          <div style={{ fontSize: 44, fontWeight: 700 }}>NetEdu</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>Get into your dream university</div>
          <div style={{ fontSize: 32, color: '#c7d2fe' }}>
            IB requirements, IA and EE marking, and a roadmap built for you
          </div>
        </div>
        <div style={{ fontSize: 28, color: '#a5b4fc' }}>neteduapp.com</div>
      </div>
    ),
    size
  )
}
