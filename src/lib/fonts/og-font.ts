/**
 * Font loader for OpenGraph dynamic image generation (ImageResponse / Satori).
 *
 * Satori renders server-side SVG/PNG images and requires explicit font buffers
 * to draw Indic (Devanagari) characters without tofu (missing glyph boxes).
 */

export interface OgFontConfig {
  name: string;
  data: ArrayBuffer;
  style: 'normal' | 'italic';
  weight: 400 | 700 | 800;
}

/**
 * Loads font definitions suitable for ImageResponse based on the requested locale.
 * Returns an array of font configurations for Satori.
 */
export async function getOgFonts(locale = 'en'): Promise<OgFontConfig[]> {
  const fonts: OgFontConfig[] = [];

  // If locale is Hindi or an Indic script, we fetch or load the Devanagari font data
  if (locale === 'hi' || locale === 'mr') {
    try {
      // In production or Node runtime, font buffers can be loaded from local files or asset endpoints
      // When deployed or in build, Google Font raw TTF buffer can be fetched or read from public assets
      const fontUrl =
        'https://fonts.gstatic.com/s/notosansdevanagari/v27/8vI27wspVJp613w46iGau8Puk1uX7Dk-i5_179V4.ttf';
      const res = await fetch(fontUrl, { cache: 'force-cache' });
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fonts.push({
          name: 'Noto Sans Devanagari',
          data: buffer,
          style: 'normal',
          weight: 700,
        });
      }
    } catch {
      // Fallback silently if offline or during build in isolated sandbox
    }
  }

  return fonts;
}
