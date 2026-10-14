import { ImageResponse } from 'next/og';
import { COLOR_TOKENS } from '@/lib/tokens';
import { getOgFonts } from '@/lib/fonts/og-font';

export const alt = 'Bramhkanti — Pure Indian Heritage Foods';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params?: Promise<{ locale?: string }>;
} = {}): Promise<ImageResponse> {
  const resolvedParams = params ? await params : undefined;
  const locale = resolvedParams?.locale || 'en';
  const fonts = await getOgFonts(locale);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px 80px',
        backgroundColor: COLOR_TOKENS.heritage.cream,
        border: `16px solid ${COLOR_TOKENS.primary.DEFAULT}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: COLOR_TOKENS.primary.DEFAULT,
              letterSpacing: '-1px',
            }}
          >
            Bramhkanti
          </span>
          <span
            style={{
              fontSize: 20,
              color: COLOR_TOKENS.heritage.saffron,
              fontWeight: 700,
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            Pure Indian Heritage Foods
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: COLOR_TOKENS.heritage.green,
            color: 'white',
            padding: '10px 24px',
            borderRadius: 30,
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          100% Pure Vegetarian
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <span
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: COLOR_TOKENS.heritage.charcoal,
            lineHeight: 1.2,
          }}
        >
          Traditional Banarasi Achar, Desi Ghee Mithai & Slow-Roasted Makhana
        </span>
        <span style={{ fontSize: 24, color: COLOR_TOKENS.heritage.muted }}>
          Sun-cured in ceramic barnis with cold-pressed mustard oil. Zero chemical
          preservatives.
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `2px solid ${COLOR_TOKENS.heritage.border}`,
          paddingTop: 24,
        }}
      >
        <span
          style={{
            fontSize: 20,
            color: COLOR_TOKENS.primary.DEFAULT,
            fontWeight: 600,
          }}
        >
          bramhkanti.com
        </span>
        <span style={{ fontSize: 18, color: COLOR_TOKENS.heritage.muted }}>
          FSSAI Lic. 12724001000123 • Handcrafted in Varanasi
        </span>
      </div>
    </div>,
    {
      ...size,
      ...(fonts.length > 0 ? { fonts } : {}),
    },
  );
}
