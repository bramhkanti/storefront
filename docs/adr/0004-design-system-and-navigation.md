# ADR 0004: Design System, Indian Heritage Palette, and Zero-Hardcode Navigation

## Status

Accepted

## Context

Bramhkanti is an authentic Indian heritage food brand specializing in sun-dried pickles (achar), pure desi ghee mithai, and roasted makhana. Key requirements:

1. **Brand Identity**: Evoke Indian culinary warmth, purity, and trust without aesthetic clutter.
2. **Accessibility (WCAG 2.1 AA/AAA)**: High-contrast text colors (`heritage-charcoal` on `heritage-cream`), visible keyboard focus rings (`:focus-visible`), skip links (`#main-content`), and WAI-ARIA dialog and disclosure primitives.
3. **Regulatory Compliance**: Indian food law mandates clear display of FSSAI registration numbers and the 100% vegetarian mark (green dot inside green square).
4. **Zero-Hardcode Extensibility**: When new categories are introduced in the backend or fixtures, the storefront's Header, Mobile Drawer, and Footer must automatically render them without code modifications in the layout layer.
5. **Content Integrity**: No user-facing strings may be hardcoded inside components; all brand copy lives in `src/content/site.ts`.

## Decisions

### 1. Heritage Color Palette (`src/app/globals.css`)

Declared using Tailwind CSS v4 `@theme`:

- **`heritage-maroon` (`#7a1c1d`)**: Primary brand crimson, inspired by royal heritage and terracotta spices.
- **`heritage-saffron` (`#d97706`)**: Auspicious golden turmeric and saffron accent.
- **`heritage-cream` (`#fcfaf7`) / `heritage-cream-dark` (`#f4ede4`)**: Warm ivory canvas replacing stark harsh white.
- **`heritage-green` (`#15803d`)**: Statutory Indian vegetarian indicator with certified green dot-in-square mark.
- **`heritage-charcoal` (`#241814`)**: Ultra-high contrast text meeting WCAG AAA requirements.

### 2. UI Component Architecture (`src/components/ui/`)

- Radix UI unstyled primitives provide bulletproof WAI-ARIA compliance:
  - `Button`: Focus ring, loading spinner, semantic variants.
  - `Sheet`: Slide-out drawers for mobile navigation and shopping bag with focus trapping and ESC dismissal.
  - `Dialog`: Accessible modals.
  - `Accordion`: WAI-ARIA disclosure for product/category FAQs.
  - `Badge`: Specialized variant rendering statutory FSSAI vegetarian symbol.
  - `SkipLink`: Accessible keyboard skip link targeting `#main-content`.
  - `VisuallyHidden`: Screen reader accessibility labels.
- Architectural boundary enforcement: `src/components/ui` NEVER imports from `features` or `app`.

### 3. Layout Architecture (`src/components/layout/`)

- `Header`: Server component with announcement bar, brand logo, and dynamic category navigation.
- `HeaderNav`: Client component managing mobile drawer and cart bag trigger.
- `MobileMenu`: Slide-out accessible mobile menu with expandable subcategories and WhatsApp assistance.
- `Footer`: Comprehensive footer displaying FSSAI Lic. No., 4 core brand guarantees, dynamic category links, and legal links.
- `Breadcrumbs`: Renders accessible navigation trail accompanied by Schema.org `BreadcrumbList` JSON-LD microdata.
- `Container`: Responsive max-width 7xl layout shell.

## Consequences

- **Positive**: Category addition is 100% data-driven; instant accessibility compliance for assistive tech users; robust Indian regulatory food markings embedded across listings; clean styling token isolation.
- **Negative**: Dynamic category tree fetch is required at root layout (fully mitigated by Next.js 16 `"use cache"` with `'navigation'` profile).
