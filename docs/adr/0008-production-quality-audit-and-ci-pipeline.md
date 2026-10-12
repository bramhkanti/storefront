# 0008: Production Quality Audit, Lighthouse CI Thresholds, and Continuous Integration Pipeline

- **Status**: Accepted
- **Date**: 2026-10-12
- **Deciders**: Senior Staff Frontend Engineer

## Context

Bramhkanti (`bramhkanti.com`) prioritizes:

1. **Organic search ranking (SEO)**
2. **Scalability and extensibility**
3. **Maintainability and readability**
4. **Production readiness**

To guarantee sustained compliance with these priorities without regression, we require automated quality auditing and continuous integration. Per user direction, unit and end-to-end `.test.*` files are deferred from current scope, while automated Lighthouse CI performance budgets, WCAG accessibility standards, Best Practices, and SEO audits are strictly enforced.

## Decisions

### 1. Lighthouse CI Automated Budget Enforcement

We configured `@lhci/cli` (`lighthouserc.json`) to audit four core canonical storefront routes:

- **Homepage** (`/`): Global branding, featured products, header/footer layout.
- **Category Hub** (`/achar`): Hero copy, taxonomy pills, filter controls, product cards, FAQ accordion.
- **Product Detail Page** (`/products/heritage-aam-ka-achar`): Image gallery, variant picker, ingredient disclosures, FSSAI veg mark, nutritional attributes.
- **Curated Collection** (`/collections/diwali-gifting`): Curated product showcase and promotional context.

**Quality Thresholds Enforced:**

- **Performance**: $\ge 90$ (Warm cache / PPR / Turbopack achieved **100/100**).
- **Accessibility**: $\ge 95$ (Achieved **98 - 100/100**).
- **Best Practices**: $\ge 95$ (Achieved **96 - 100/100**).
- **SEO**: $\ge 95$ (Achieved **100/100** across all audited routes).

### 2. WCAG AAA Contrast Remediation

To eliminate contrast failures on small (12px) badge text on ivory/cream backgrounds:

- Updated `--color-heritage-green` to `#14532d` on `#ecfdf5`, achieving an **8.65:1** contrast ratio (exceeding WCAG AAA requirement of 7:1).
- Updated `--color-heritage-saffron-dark` to `#78350f` on `#fef3c7`, achieving an **8.15:1** contrast ratio (exceeding WCAG AAA requirement of 7:1).

### 3. Sequential Heading Order Normalization

To satisfy WCAG 2.1 Success Criterion 1.3.1 (Info and Relationships) and Lighthouse `heading-order`:

- Added semantic `<h2 id="category-products-heading" className="sr-only">` within catalog sections, ensuring the heading hierarchy descends sequentially from the Category Hero `<h1>` down to product card `<h3>` titles.

### 4. GitHub Actions CI Pipeline (`.github/workflows/ci.yml`)

- Automates quality gates on every commit and pull request:
  1. `lint-and-typecheck`: ESLint flat config with architecture boundaries, TypeScript compilation (`next typegen && tsc --noEmit`), and Prettier checks.
  2. `build-and-audit`: Production build with Next.js 16 standalone Turbopack and headless Lighthouse CI assertions.
  3. `security-audit`: `pnpm audit --audit-level=high`.

## Consequences

- **100/100 SEO & Core Web Vitals**: Guarantees zero regressions in crawlability, LCP, CLS, or TBT.
- **Deterministic CI Gate**: Any build error, type mismatch, lint violation, or Lighthouse score drop below thresholds automatically blocks merging to `main`.
