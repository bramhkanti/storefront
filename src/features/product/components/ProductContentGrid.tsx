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
  shippingHighlights?:
    | {
        dispatchTime: string;
        packagingStandard: string;
        transitAssurance: string;
      }
    | undefined;
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
    dispatchTime:
      'Dispatched within 24 hours directly from our Varanasi kitchen facility.',
    packagingStandard:
      'Triple-cushioned shockproof transit box engineered for fragile glass.',
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
        return <Droplets className="text-accent-text h-5 w-5" />;
      case 'spices':
      case 'chilli':
        return <Flame className="text-primary h-5 w-5" />;
      default:
        return <Leaf className="text-success h-5 w-5" />;
    }
  };

  const renderStorageIcon = (icon: string) => {
    switch (icon) {
      case 'sun':
        return <Sun className="text-accent-text h-4 w-4" />;
      case 'spoon':
        return <Utensils className="text-primary h-4 w-4" />;
      default:
        return <Clock className="text-fg-muted h-4 w-4" />;
    }
  };

  return (
    <div className={cn('text-fg w-full space-y-6', className)}>
      {/* =========================================================================
          DESKTOP VIEW: Clean 4-Tab Bar + 2-Row Multi-Card Dashboard
         ========================================================================= */}
      <div className="hidden space-y-6 lg:block">
        {/* Desktop Tab Bar */}
        <div className="border-line text-fg-muted flex items-center gap-8 border-b text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={cn(
              'relative pb-3 transition-colors',
              activeTab === 'about'
                ? 'text-primary after:bg-primary font-bold after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5'
                : 'hover:text-fg',
            )}
          >
            About Product
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ingredients')}
            className={cn(
              'relative pb-3 transition-colors',
              activeTab === 'ingredients'
                ? 'text-primary after:bg-primary font-bold after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5'
                : 'hover:text-fg',
            )}
          >
            Ingredients
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('storage')}
            className={cn(
              'relative pb-3 transition-colors',
              activeTab === 'storage'
                ? 'text-primary after:bg-primary font-bold after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5'
                : 'hover:text-fg',
            )}
          >
            Storage & Shelf Life
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            className={cn(
              'relative pb-3 transition-colors',
              activeTab === 'shipping'
                ? 'text-primary after:bg-primary font-bold after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5'
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
            <div className="animate-in fade-in grid grid-cols-12 items-stretch gap-6 duration-200">
              {/* Left Box: Key Highlights */}
              <div className="border-line bg-surface col-span-4 space-y-4 rounded-2xl border p-6">
                <h3 className="text-fg text-base font-bold">Key Highlights</h3>
                <ul className="space-y-3">
                  {keyHighlights.map((highlight, idx) => (
                    <li key={idx} className="text-fg flex items-start gap-2.5 text-sm">
                      <div className="bg-primary-tint text-primary mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                        <Check className="h-3 w-3 stroke-[2.5]" />
                      </div>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Center Box: Artisanal Photography */}
              <div className="border-line relative col-span-3 min-h-[220px] overflow-hidden rounded-2xl border">
                <Image
                  src="/images/home/story-spices.jpg"
                  alt="Raw Mangoes & Mortar Spices"
                  fill
                  sizes="30vw"
                  className="object-cover"
                />
              </div>

              {/* Right Box: Our Story */}
              <div className="border-line bg-surface col-span-5 flex flex-col justify-between space-y-3 rounded-2xl border p-6">
                <div>
                  <h3 className="text-fg text-base font-bold">Our Story</h3>
                  <p className="text-fg-muted mt-2 text-sm leading-relaxed">
                    {storyNarrative}
                  </p>
                </div>
                <div>
                  <Link
                    href="/about"
                    className="text-primary inline-flex items-center text-sm font-bold hover:underline"
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
            <div className="animate-in fade-in grid grid-cols-12 items-stretch gap-6 duration-200">
              {/* Left Box: 6 Circular Badges */}
              <div className="border-line bg-surface col-span-8 space-y-5 rounded-2xl border p-6">
                <div>
                  <h3 className="text-fg text-base font-bold">
                    Pure, Farm-Sourced Ingredients
                  </h3>
                  <p className="text-fg-muted mt-1 text-xs">
                    Every raw ingredient is ethically sourced from local Indian farms and
                    hand-processed without chemicals.
                  </p>
                </div>
                <div className="grid grid-cols-6 gap-3 pt-2 text-center">
                  {ingredients.map((ing, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="border-line bg-surface-soft mb-2 flex h-14 w-14 items-center justify-center rounded-full border shadow-none">
                        {renderIngredientIcon(ing.icon)}
                      </div>
                      <span className="text-fg text-xs leading-tight font-bold">
                        {ing.name}
                      </span>
                      <span className="text-fg-muted mt-0.5 text-[11px]">
                        {ing.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Box: Purity Pledge */}
              <div className="border-line bg-surface-soft col-span-4 flex flex-col justify-between space-y-3 rounded-2xl border p-6">
                <div className="space-y-3">
                  <div className="text-primary flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    <h4 className="text-sm font-bold">100% Purity Pledge</h4>
                  </div>
                  <p className="text-fg-muted text-xs leading-relaxed">
                    We never use synthetic vinegar, artificial preservatives, or chemical
                    coloring agents. All preservation occurs naturally via virgin
                    cold-pressed mustard oil and rock salt.
                  </p>
                </div>
                <div className="border-line text-primary border-t pt-2 text-xs font-semibold">
                  ✓ Certified Food Safety & Quality Assured
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Storage & Shelf Life */}
          {activeTab === 'storage' && (
            <div className="animate-in fade-in grid grid-cols-12 items-stretch gap-6 duration-200">
              {/* Left Box: Storage Guidelines */}
              <div className="border-line bg-surface col-span-7 space-y-4 rounded-2xl border p-6">
                <div>
                  <h3 className="text-fg text-base font-bold">
                    Storage & Shelf Life Instructions
                  </h3>
                  <p className="text-fg-muted mt-1 text-xs">
                    To maintain pristine crunch and flavor, follow these traditional
                    storage practices:
                  </p>
                </div>
                <div className="space-y-3 pt-1">
                  {storageInstructions.map((item, idx) => (
                    <div key={idx} className="text-fg flex items-start gap-3 text-sm">
                      <div className="border-line bg-surface-soft flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                        {renderStorageIcon(item.icon)}
                      </div>
                      <span className="mt-1.5 leading-snug">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Box: Natural Preservation Science */}
              <div className="border-line bg-surface col-span-5 flex flex-col justify-between space-y-3 rounded-2xl border p-6">
                <div className="space-y-2">
                  <h3 className="text-fg text-base font-bold">Why It Stays Fresh</h3>
                  <p className="text-fg-muted text-xs leading-relaxed">
                    Traditional mustard oil acts as a natural seal against airborne
                    microbes. When kept submersed, our pickles mature and improve in
                    richness over time without synthetic preservatives.
                  </p>
                </div>
                <div className="border-line bg-accent-tint/30 text-accent-text flex items-center gap-2 rounded-xl border p-3 text-xs font-medium">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>Shelf Life: 12 Months from Manufacturing</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Shipping & Returns */}
          {activeTab === 'shipping' && (
            <div className="animate-in fade-in grid grid-cols-3 items-stretch gap-6 duration-200">
              {/* Box 1: Dispatch */}
              <div className="border-line bg-surface space-y-3 rounded-2xl border p-6">
                <div className="bg-primary-tint text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                  <Truck className="h-5 w-5" />
                </div>
                <h3 className="text-fg text-base font-bold">
                  Pan-India Express Dispatch
                </h3>
                <p className="text-fg-muted text-xs leading-relaxed">
                  {shippingHighlights.dispatchTime} Tracking link is sent via WhatsApp and
                  SMS immediately upon shipment.
                </p>
              </div>

              {/* Box 2: Packaging */}
              <div className="border-line bg-surface space-y-3 rounded-2xl border p-6">
                <div className="bg-primary-tint text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                  <Package className="h-5 w-5" />
                </div>
                <h3 className="text-fg text-base font-bold">Fragile Glass Packaging</h3>
                <p className="text-fg-muted text-xs leading-relaxed">
                  {shippingHighlights.packagingStandard} Designed to withstand
                  long-distance courier transit with zero leakage.
                </p>
              </div>

              {/* Box 3: Replacement Guarantee */}
              <div className="border-line bg-surface space-y-3 rounded-2xl border p-6">
                <div className="bg-primary-tint text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="text-fg text-base font-bold">Transit Damage Guarantee</h3>
                <p className="text-fg-muted text-xs leading-relaxed">
                  In the rare event of transit damage, share a photo with our WhatsApp
                  support within 48 hours for an instant, no-questions-asked replacement.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          MOBILE VIEW: 5 Interactive Accordion / Chevron Menu Rows
         ========================================================================= */}
      <div className="block space-y-2.5 lg:hidden">
        {/* 1. Product Highlights */}
        <div className="border-line bg-surface overflow-hidden rounded-xl border transition-all">
          <button
            type="button"
            onClick={() => toggleMobileSection('highlights')}
            className="text-fg flex w-full items-center justify-between p-3 text-left text-sm font-bold"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary-tint text-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-fg text-sm font-bold">Product Highlights</span>
            </div>
            {mobileOpenSection === 'highlights' ? (
              <ChevronDown className="text-fg-muted h-4 w-4" />
            ) : (
              <ChevronRight className="text-fg-muted h-4 w-4" />
            )}
          </button>
          {mobileOpenSection === 'highlights' && (
            <div className="border-line text-fg animate-in fade-in space-y-2.5 border-t p-3 pt-3 text-sm duration-150">
              {keyHighlights.map((hl, idx) => (
                <div key={idx} className="text-fg flex items-center gap-2.5 text-sm">
                  <Check className="text-primary h-4 w-4 shrink-0" />
                  <span className="text-sm leading-snug">{hl}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Our Story */}
        <div className="border-line bg-surface overflow-hidden rounded-xl border transition-all">
          <button
            type="button"
            onClick={() => toggleMobileSection('story')}
            className="text-fg flex w-full items-center justify-between p-3 text-left text-sm font-bold"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary-tint text-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-fg text-sm font-bold">Our Story</span>
            </div>
            {mobileOpenSection === 'story' ? (
              <ChevronDown className="text-fg-muted h-4 w-4" />
            ) : (
              <ChevronRight className="text-fg-muted h-4 w-4" />
            )}
          </button>
          {mobileOpenSection === 'story' && (
            <div className="border-line text-fg animate-in fade-in space-y-3 border-t p-3 pt-3 text-sm duration-150">
              <p className="text-fg text-sm leading-relaxed">{storyNarrative}</p>
              <Link
                href="/about"
                className="text-primary inline-flex items-center text-sm font-bold underline"
              >
                Know More →
              </Link>
            </div>
          )}
        </div>

        {/* 3. Ingredients */}
        <div className="border-line bg-surface overflow-hidden rounded-xl border transition-all">
          <button
            type="button"
            onClick={() => toggleMobileSection('ingredients')}
            className="text-fg flex w-full items-center justify-between p-3 text-left text-sm font-bold"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary-tint text-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="text-fg text-sm font-bold">Ingredients</span>
            </div>
            {mobileOpenSection === 'ingredients' ? (
              <ChevronDown className="text-fg-muted h-4 w-4" />
            ) : (
              <ChevronRight className="text-fg-muted h-4 w-4" />
            )}
          </button>
          {mobileOpenSection === 'ingredients' && (
            <div className="border-line animate-in fade-in grid grid-cols-3 gap-2.5 border-t p-3 pt-3 text-center duration-150">
              {ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="bg-surface-soft border-line flex flex-col items-center rounded-xl border p-2"
                >
                  <div className="bg-surface border-line mb-1 flex h-9 w-9 items-center justify-center rounded-full border">
                    {renderIngredientIcon(ing.icon)}
                  </div>
                  <span className="text-fg text-sm font-bold">{ing.name}</span>
                  <span className="text-fg-muted text-xs">{ing.detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Storage & Shelf Life */}
        <div className="border-line bg-surface overflow-hidden rounded-xl border transition-all">
          <button
            type="button"
            onClick={() => toggleMobileSection('storage')}
            className="text-fg flex w-full items-center justify-between p-3 text-left text-sm font-bold"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary-tint text-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <Clock className="h-4 w-4" />
              </div>
              <span className="text-fg text-sm font-bold">Storage & Shelf Life</span>
            </div>
            {mobileOpenSection === 'storage' ? (
              <ChevronDown className="text-fg-muted h-4 w-4" />
            ) : (
              <ChevronRight className="text-fg-muted h-4 w-4" />
            )}
          </button>
          {mobileOpenSection === 'storage' && (
            <div className="border-line text-fg animate-in fade-in space-y-2.5 border-t p-3 pt-3 text-sm duration-150">
              {storageInstructions.map((item, idx) => (
                <div key={idx} className="text-fg flex items-center gap-2.5 text-sm">
                  {renderStorageIcon(item.icon)}
                  <span className="text-sm leading-snug">{item.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Shipping & Returns */}
        <div className="border-line bg-surface overflow-hidden rounded-xl border transition-all">
          <button
            type="button"
            onClick={() => toggleMobileSection('shipping')}
            className="text-fg flex w-full items-center justify-between p-3 text-left text-sm font-bold"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary-tint text-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <Truck className="h-4 w-4" />
              </div>
              <span className="text-fg text-sm font-bold">Shipping & Returns</span>
            </div>
            {mobileOpenSection === 'shipping' ? (
              <ChevronDown className="text-fg-muted h-4 w-4" />
            ) : (
              <ChevronRight className="text-fg-muted h-4 w-4" />
            )}
          </button>
          {mobileOpenSection === 'shipping' && (
            <div className="border-line text-fg animate-in fade-in space-y-2.5 border-t p-3 pt-3 text-sm duration-150">
              <div className="text-fg flex items-start gap-2.5 text-sm">
                <Truck className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                <span className="text-sm leading-snug">
                  {shippingHighlights.dispatchTime}
                </span>
              </div>
              <div className="text-fg flex items-start gap-2.5 text-sm">
                <Package className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                <span className="text-sm leading-snug">
                  {shippingHighlights.packagingStandard}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
