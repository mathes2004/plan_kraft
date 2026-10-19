import { ImageResponse } from 'next/og';
export const dynamic = 'force-static';
export const alt = 'PLAN KRAFT — Waterproofing Solutions, Sri Lanka';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 90,
        background: '#123b4b',
        color: '#fff',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ color: '#d4df37', fontSize: 24, letterSpacing: 4, marginBottom: 38 }}>
        PLAN KRAFT WATERPROOFING SOLUTIONS
      </div>
      <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
        Protecting Your Property.
      </div>
      <div style={{ fontSize: 64, color: '#8cd2e5', marginTop: 10 }}>
        Preserving Your Investment.
      </div>
      <div style={{ fontSize: 25, marginTop: 50, color: '#c6d9df' }}>
        Batticaloa based. Islandwide service. Free inspection & quotation.
      </div>
    </div>,
    size,
  );
}
