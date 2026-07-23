import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'I LIKED | Wear what you like.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#FFD700',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '40px solid black',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{
          display: 'flex',
          background: 'black',
          color: 'white',
          padding: '40px 100px',
          fontWeight: 900,
          fontSize: 160,
          textTransform: 'uppercase',
          letterSpacing: '-0.05em'
        }}>
          I LIKED
        </div>
        <div style={{
          display: 'flex',
          fontSize: 48,
          marginTop: 60,
          fontWeight: 900,
          color: 'black'
        }}>
          WEAR WHAT YOU LIKE.
        </div>
      </div>
    ),
    { ...size }
  );
}
