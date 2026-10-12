import { ImageResponse } from 'next/og';
import { COLOR_TOKENS } from '@/lib/tokens';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: COLOR_TOKENS.primary.DEFAULT,
        borderRadius: '22%',
        color: COLOR_TOKENS.heritage.cream,
        fontSize: '20px',
        fontWeight: 700,
        fontFamily: 'serif',
        border: `1px solid ${COLOR_TOKENS.heritage.saffron}`,
      }}
    >
      B
    </div>,
    {
      ...size,
    },
  );
}
