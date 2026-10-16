'use client';

import * as React from 'react';
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Droplets,
  FileText,
  Flame,
  Leaf,
  Package,
  Sun,
  Truck,
  Utensils,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export interface ProductContentGridProps {
  keyHighlights?: string[] | undefined;
  storyNarrative?: string | undefined;
  ingredients?: Array<{ name: string; detail: string; icon: string }> | undefined;
  storageInstructions?: Array<{ icon: string; text: string }> | undefined;
  shippingHighlights?: {
    dispatchTime: string;
    packagingStandard: string;
    transitAssurance: string;
  } | undefined;
  className?: string | undefined;
}

export function ProductContentGrid({
  keyHighlights = [
    'Made with real, handpicked mangoes',
    'Authentic North Indian recipe',
    'Rich in traditional spices and flavours',
    'No artificial preservatives',
    'Pure, natural and safe',
  ],
  storyNarrative = "At Bramhkanti, we bring you the true taste of India with recipes passed down through generations. Our pickles are made with care, using the finest ingredients and traditional methods, because we believe that good food is more than just taste — it's a feeling.",
  ingredients = [
    { name: 'Raw Mango', detail: '(Seasonal)', icon: 'mango' },
    { name: 'Mustard Oil', detail: '(Cold Pressed)', icon: 'oil' },
    { name: 'Hand-Crushed Spices', detail: 'Artisanal', icon: 'spices' },
    { name: 'Fennel Seeds', detail: '(Saunf)', icon: 'seed' },
    { name: 'Fenugreek Seeds', detail: '(Methi)', icon: 'grain' },
    { name: 'Red Chilli Powder', detail: 'Mathania', icon: 'chilli' },
  ],
  storageInstructions = [
    { icon: 'sun', text: 'Store in a cool, dry place away from direct sunlight.' },
    { icon: 'spoon', text: 'Use a dry spoon.' },
    { icon: 'clock', text: 'Best before 12 months from the date of packaging.' },
  ],
  shippingHighlights = {
    dispatchTime: 'Dispatched within 24 hours directly from our Varanasi kitchen facility.',
    packagingStandard: 'Triple-cushioned shockproof transit box engineered for fragile glass.',
    transitAssurance: 'Insured Pan-India express air and surface delivery.',
  },
  className,
}: ProductContentGridProps): React.JSX.Element {
  // Desktop Tab State
  const [activeTab, setActiveTab] = React.useState<
    'about' | 'ingredients' | 'storage' | 'shipping'
  >('about');

  // Mobile Accordion Open State: key of open section or null (defaults to 'highlights')
  const [mobileOpenSection, setMobileOpenSection] = React.useState<string | null>(
    'highlights',
  );

  const toggleMobileSection = (key: string) => {
    setMobileOpenSection((prev) => (prev === key ? null : key));
  };

  const renderIngredientIcon = (icon: string) => {
    switch (icon) {
      case 'oil':
        return <Droplets className="h-5 w-5 text-accent-text" />;
      case 'spices':
      case 'chilli':
        return <Flame className="h-5 w-5 text-primary" />;
      default:
        return <Leaf className="h-5 w-5 text-success" />;
    }
  };

  const renderStorageIcon = (icon: string) => {
    switch (icon) {
      case 'sun':
        return <Sun className="h-4 w-4 text-accent-text" />;
      case 'spoon':
        return <Utensils className="h-4 w-4 text-primary" />;
      default:
        return <Clock className="h-4 w-4 text-fg-muted" />;
    }
  };

  return (
    <div className={cn('w-full space-y-6 text-fg', className)}>
      {/* =========================================================================
          DESKTOP VIEW: Clean 4-Tab Bar + 2-Row Multi-Card Dashboard
         ========================================================================= */}
      <div className="hidden lg:block space-y-6">
        {/* Desktop Tab Bar */}
        <div className="flex items-center gap-8 border-b border-line text-sm font-semibold text-fg-muted">
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={cn(
              'pb-3 transition-colors relative',
              activeTab === 'about'
                ? 'text-primary font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary'
                : 'hover:text-fg',
            )}
          >
            About Product
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ingredients')}
            className={cn(
              'pb-3 transition-colors relative',
              activeTab === 'ingredients'
                ? 'text-primary font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary'
                : 'hover:text-fg',
            )}
          >
            Ingredients
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('storage')}
            className={cn(
              'pb-3 transition-colors relative',
              activeTab === 'storage'
                ? 'text-primary font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary'
                : 'hover:text-fg',
            )}
          >
            Storage & Shelf Life
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            className={cn(
              'pb-3 transition-colors relative',
              activeTab === 'shipping'
                ? 'text-primary font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary'
                : 'hover:text-fg',
            )}
          >
            Shipping & Returns
          </button>
        </div>

        {/* Dashboard View: Content changes dynamically based on active tab */}
        <div className="space-y-6">
          {/* Tab 1: About Product */}
          {activeTab === 'about' && (
            <div className="grid grid-cols-12 gap-6 items-stretch animate-in fade-in duration-200">
              {/* Left Box: Key Highlights */}
              <div className="col-span-4 rounded-2xl border border-line bg-surface p-6 space-y-4">
                <h3 className="text-base font-bold text-fg">
                  Key Highlights
                </h3>
                <ul className="space-y-3">
                  {keyHighlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-fg">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                        <Check className="h-3 w-3 stroke-[2.5]" />
                      </div>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Center Box: Artisanal Photography */}
              <div className="col-span-3 relative rounded-2xl overflow-hidden border border-line min-h-[220px]">
                <Image
                  src="/images/home/story-spices.jpg"
                  alt="Raw Mangoes & Mortar Spices"
                  fill
                  sizes="30vw"
                  className="object-cover"
                />
              </div>

              {/* Right Box: Our Story */}
              <div className="col-span-5 rounded-2xl border border-line bg-surface p-6 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold text-fg">
                    Our Story
                  </h3>
                  <p className="text-sm text-fg-muted leading-relaxed mt-2">
                    {storyNarrative}
                  </p>
                </div>
                <div>
                  <Link
                    href="/about"
                    className="inline-flex items-center text-sm font-bold text-primary hover:underline"
                  >
                    <span>Know More</span>
                    <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Ingredients */}
          {activeTab === 'ingredients' && (
            <div className="grid grid-cols-12 gap-6 items-stretch animate-in fade-in duration-200">
              {/* Left Box: 6 Circular Badges */}
              <div className="col-span-8 rounded-2xl border border-line bg-surface p-6 space-y-5">
                <div>
                  <h3 className="text-base font-bold text-fg">
                    Pure, Farm-Sourced Ingredients
                  </h3>
                  <p className="text-xs text-fg-muted mt-1">
                    Every raw ingredient is ethically sourced from local Indian farms and hand-processed without chemicals.
                  </p>
                </div>
                <div className="grid grid-cols-6 gap-3 text-center pt-2">
                  {ingredients.map((ing, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface-soft mb-2 shadow-none">
                        {renderIngredientIcon(ing.icon)}
                      </div>
                      <span className="text-xs font-bold text-fg leading-tight">
                        {ing.name}
                      </span>
                      <span className="text-[11px] text-fg-muted mt-0.5">
                        {ing.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Box: Purity Pledge */}
              <div className="col-span-4 rounded-2xl border border-line bg-surface-soft p-6 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    <Leaf className="h-5 w-5" />
                    <h4 className="text-sm font-bold">100% Purity Pledge</h4>
                  </div>
                  <p className="text-xs text-fg-muted leading-relaxed">
                    We never use synthetic vinegar, artificial preservatives, or chemical coloring agents. All preservation occurs naturally via virgin cold-pressed mustard oil and rock salt.
                  </p>
                </div>
                <div className="pt-2 border-t border-line text-xs font-semibold text-primary">
                  ✓ Certified Food Safety & Quality Assured
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Storage & Shelf Life */}
          {activeTab === 'storage' && (
            <div className="grid grid-cols-12 gap-6 items-stretch animate-in fade-in duration-200">
              {/* Left Box: Storage Guidelines */}
              <div className="col-span-7 rounded-2xl border border-line bg-surface p-6 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-fg">
                    Storage & Shelf Life Instructions
                  </h3>
                  <p className="text-xs text-fg-muted mt-1">
                    To maintain pristine crunch and flavor, follow these traditional storage practices:
                  </p>
                </div>
                <div className="space-y-3 pt-1">
                  {storageInstructions.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-fg">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface-soft">
                        {renderStorageIcon(item.icon)}
                      </div>
                      <span className="leading-snug mt-1.5">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Box: Natural Preservation Science */}
              <div className="col-span-5 rounded-2xl border border-line bg-surface p-6 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-fg">
                    Why It Stays Fresh
                  </h3>
                  <p className="text-xs text-fg-muted leading-relaxed">
                    Traditional mustard oil acts as a natural seal against airborne microbes. When kept submersed, our pickles mature and improve in richness over time without synthetic preservatives.
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-accent-tint/30 p-3 text-xs text-accent-text font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>Shelf Life: 12 Months from Manufacturing</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Shipping & Returns */}
          {activeTab === 'shipping' && (
            <div className="grid grid-cols-3 gap-6 items-stretch animate-in fade-in duration-200">
              {/* Box 1: Dispatch */}
              <div className="rounded-2xl border border-line bg-surface p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-tint text-primary">
                  <Truck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-fg">
                  Pan-India Express Dispatch
                </h3>
                <p className="text-xs text-fg-muted leading-relaxed">
                  {shippingHighlights.dispatchTime} Tracking link is sent via WhatsApp and SMS immediately upon shipment.
                </p>
              </div>

              {/* Box 2: Packaging */}
              <div className="rounded-2xl border border-line bg-surface p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-tint text-primary">
                  <Package className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-fg">
                  Fragile Glass Packaging
                </h3>
                <p className="text-xs text-fg-muted leading-relaxed">
                  {shippingHighlights.packagingStandard} Designed to withstand long-distance courier transit with zero leakage.
                </p>
              </div>

              {/* Box 3: Replacement Guarantee */}
              <div className="rounded-2xl border border-line bg-surface p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-tint text-primary">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-fg">
                  Transit Damage Guarantee
                </h3>
                <p className="text-xs text-fg-muted leading-relaxed">
                  In the rare event of transit damage, share a photo with our WhatsApp support within 48 hours for an instant, no-questions-asked replacement.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          MOBILE VIEW: 5 Interactive Accordion / Chevron Menu Rows
         ========================================================================= */}
      <div className="block lg:hidden space-y-2.5">
        {/* 1. Product Highlights */}
        <div className="rounded-xl border border-line bg-surface overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleMobileSection('highlights')}
            className="w-full flex items-center justify-between p-3 text-left font-bold text-sm text-fg"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-tint text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-fg">Product Highlights</span>
            </div>
            {mobileOpenSection === 'highlights' ? (
              <ChevronDown className="h-4 w-4 text-fg-muted" />
            ) : (
              <ChevronRight className="h-4 w-4 text-fg-muted" />
            )}
          </button>
          {mobileOpenSection === 'highlights' && (
            <div className="p-3 pt-3 border-t border-line text-sm text-fg space-y-2.5 animate-in fade-in duration-150">
              {keyHighlights.map((hl, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-fg">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm leading-snug">{hl}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Our Story */}
        <div className="rounded-xl border border-line bg-surface overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleMobileSection('story')}
            className="w-full flex items-center justify-between p-3 text-left font-bold text-sm text-fg"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-tint text-primary">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-fg">Our Story</span>
            </div>
            {mobileOpenSection === 'story' ? (
              <ChevronDown className="h-4 w-4 text-fg-muted" />
            ) : (
              <ChevronRight className="h-4 w-4 text-fg-muted" />
            )}
          </button>
          {mobileOpenSection === 'story' && (
            <div className="p-3 pt-3 border-t border-line text-sm text-fg space-y-3 animate-in fade-in duration-150">
              <p className="text-sm leading-relaxed text-fg">{storyNarrative}</p>
              <Link
                href="/about"
                className="inline-flex items-center text-sm font-bold text-primary underline"
              >
                Know More →
              </Link>
            </div>
          )}
        </div>

        {/* 3. Ingredients */}
        <div className="rounded-xl border border-line bg-surface overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleMobileSection('ingredients')}
            className="w-full flex items-center justify-between p-3 text-left font-bold text-sm text-fg"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-tint text-primary">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-fg">Ingredients</span>
            </div>
            {mobileOpenSection === 'ingredients' ? (
              <ChevronDown className="h-4 w-4 text-fg-muted" />
            ) : (
              <ChevronRight className="h-4 w-4 text-fg-muted" />
            )}
          </button>
          {mobileOpenSection === 'ingredients' && (
            <div className="p-3 pt-3 border-t border-line grid grid-cols-3 gap-2.5 text-center animate-in fade-in duration-150">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex flex-col items-center p-2 rounded-xl bg-surface-soft border border-line">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface border border-line mb-1">
                    {renderIngredientIcon(ing.icon)}
                  </div>
                  <span className="text-sm font-bold text-fg">{ing.name}</span>
                  <span className="text-xs text-fg-muted">{ing.detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Storage & Shelf Life */}
        <div className="rounded-xl border border-line bg-surface overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleMobileSection('storage')}
            className="w-full flex items-center justify-between p-3 text-left font-bold text-sm text-fg"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-tint text-primary">
                <Clock className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-fg">Storage & Shelf Life</span>
            </div>
            {mobileOpenSection === 'storage' ? (
              <ChevronDown className="h-4 w-4 text-fg-muted" />
            ) : (
              <ChevronRight className="h-4 w-4 text-fg-muted" />
            )}
          </button>
          {mobileOpenSection === 'storage' && (
            <div className="p-3 pt-3 border-t border-line space-y-2.5 text-sm text-fg animate-in fade-in duration-150">
              {storageInstructions.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-fg">
                  {renderStorageIcon(item.icon)}
                  <span className="text-sm leading-snug">{item.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Shipping & Returns */}
        <div className="rounded-xl border border-line bg-surface overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleMobileSection('shipping')}
            className="w-full flex items-center justify-between p-3 text-left font-bold text-sm text-fg"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-tint text-primary">
                <Truck className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-fg">Shipping & Returns</span>
            </div>
            {mobileOpenSection === 'shipping' ? (
              <ChevronDown className="h-4 w-4 text-fg-muted" />
            ) : (
              <ChevronRight className="h-4 w-4 text-fg-muted" />
            )}
          </button>
          {mobileOpenSection === 'shipping' && (
            <div className="p-3 pt-3 border-t border-line space-y-2.5 text-sm text-fg animate-in fade-in duration-150">
              <div className="flex items-start gap-2.5 text-sm text-fg">
                <Truck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm leading-snug">{shippingHighlights.dispatchTime}</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-fg">
                <Package className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm leading-snug">{shippingHighlights.packagingStandard}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
