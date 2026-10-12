import { ImageResponse } from 'next/og';
import { getProductReader } from '@/lib/api/container';
import { formatPrice } from '@/lib/utils/money';
import { COLOR_TOKENS } from '@/lib/tokens';

export const alt = 'Bramhkanti Heritage Product';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}): Promise<ImageResponse> {
  const { handle } = await params;
  const productReader = getProductReader();
  const product = await productReader.getProductByHandle(handle);

  const title = product?.title ?? 'Traditional Indian Heritage Delicacy';
  const primaryVariant = product?.variants[0];
  const priceFormatted = primaryVariant
    ? formatPrice(primaryVariant.price.amount, primaryVariant.price.currencyCode)
    : '';
  const packSize = primaryVariant?.title ?? '';
  const shelfLife = product?.foodAttributes.shelfLife ?? '12 Months';

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
      {/* Brand header */}
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
            Pure Heritage Foods
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

      {/* Product main block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {packSize && (
          <span
            style={{
              fontSize: 20,
              color: COLOR_TOKENS.heritage.saffron,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Pack Size: {packSize} • Shelf Life: {shelfLife}
          </span>
        )}
        <span
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: COLOR_TOKENS.heritage.charcoal,
            lineHeight: 1.15,
          }}
        >
          {title}
        </span>
        {priceFormatted && (
          <span
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: COLOR_TOKENS.primary.DEFAULT,
            }}
          >
            {priceFormatted}
          </span>
        )}
      </div>

      {/* Bottom trust footer */}
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
          bramhkanti.com/products/{handle}
        </span>
        <span style={{ fontSize: 18, color: COLOR_TOKENS.heritage.muted }}>
          Traditional Sun-Cured Banarasi Recipes
        </span>
      </div>
    </div>,
    { ...size },
  );
}
