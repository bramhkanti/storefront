import { ImageResponse } from 'next/og';
import { getCategoryReader } from '@/lib/api/container';
import { COLOR_TOKENS } from '@/lib/tokens';

export const alt = 'Bramhkanti Heritage Category Hub';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<ImageResponse> {
  const { category: categoryHandle } = await params;
  const categoryReader = getCategoryReader();
  const category = await categoryReader.getCategoryByHandle(categoryHandle);

  const title = category?.name ?? 'Traditional Indian Heritage Foods';
  const description =
    category?.description ??
    'Authentic Indian pickles, sweets, and snacks made with pure heritage ingredients.';

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
      {/* Header */}
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
              fontSize: 38,
              fontWeight: 900,
              color: COLOR_TOKENS.primary.DEFAULT,
              letterSpacing: '-1px',
            }}
          >
            Bramhkanti
          </span>
          <span
            style={{
              fontSize: 16,
              color: COLOR_TOKENS.heritage.saffron,
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            Heritage Collection
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: COLOR_TOKENS.heritage.green,
            color: 'white',
            padding: '8px 20px',
            borderRadius: 24,
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          100% Pure Veg
        </div>
      </div>

      {/* Category body */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <span
          style={{
            fontSize: 20,
            color: COLOR_TOKENS.heritage.saffron,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          Handcrafted Traditional Delicacies
        </span>
        <span
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: COLOR_TOKENS.heritage.charcoal,
            lineHeight: 1.15,
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontSize: 22,
            color: COLOR_TOKENS.heritage.muted,
            lineHeight: 1.3,
            maxWidth: 950,
          }}
        >
          {description}
        </span>
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `2px solid ${COLOR_TOKENS.heritage.border}`,
          paddingTop: 20,
        }}
      >
        <span
          style={{
            fontSize: 20,
            color: COLOR_TOKENS.primary.DEFAULT,
            fontWeight: 600,
          }}
        >
          bramhkanti.com/{categoryHandle}
        </span>
        <span style={{ fontSize: 18, color: COLOR_TOKENS.heritage.muted }}>
          Zero Preservatives • Dispatched from Varanasi
        </span>
      </div>
    </div>,
    { ...size },
  );
}
