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
        }}
      >
        <img 
          src="https://iliked.in/images/logo.png" 
          style={{ width: '800px', height: '400px', objectFit: 'contain' }} 
        />
      </div>
    ),
    { ...size }
  );
}
