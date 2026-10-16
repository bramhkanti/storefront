import * as React from 'react';
import {
  Award,
  Clock,
  Flame,
  Leaf,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Sun,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface CategoryCraftPillarsProps {
  categoryHandle: string;
  className?: string | undefined;
}

interface PillarItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function CategoryCraftPillars({
  categoryHandle,
  className,
}: CategoryCraftPillarsProps): React.JSX.Element {
  const normHandle = categoryHandle.toLowerCase();

  let pillars: PillarItem[];

  if (normHandle.includes('achar') || normHandle.includes('pickle')) {
    pillars = [
      {
        icon: Sun,
        title: '21-Day Sun Cured',
        description: 'Matured slowly in ceramic barnies under the natural Indian sun.',
      },
      {
        icon: Leaf,
        title: 'Virgin Mustard Oil',
        description: 'Cold-pressed Kachi Ghani oil creates a natural, breathable seal.',
      },
      {
        icon: ShieldCheck,
        title: 'Zero Synthetic Vinegar',
        description: '100% free from synthetic acetic acid, artificial colors, and stabilizers.',
      },
      {
        icon: PackageCheck,
        title: 'Aroma-Lock Glass Jar',
        description: 'Food-grade glass packaging with 5-layer shockproof transit protection.',
      },
    ];
  } else if (normHandle.includes('makhana')) {
    pillars = [
      {
        icon: Award,
        title: 'GI-Tagged Mithila Origin',
        description: 'Harvested sustainably from ancient freshwater ponds in Mithila, Bihar.',
      },
      {
        icon: Sparkles,
        title: 'Jumbo 6+ Hand-Graded',
        description: 'Only the top 5% largest lotus seeds selected for maximum crunch.',
      },
      {
        icon: Flame,
        title: 'Slow-Roasted in Pure Ghee',
        description: 'Never deep-fried. Roasted in native cow ghee and cold-pressed olive oil.',
      },
      {
        icon: Leaf,
        title: 'Pure Mineral Seasoning',
        description: 'Lightly dusted with Himalayan pink salt and stone-ground natural spices.',
      },
    ];
  } else {
    // Sweets & Confections
    pillars = [
      {
        icon: Sparkles,
        title: '100% Pure Desi Cow Ghee',
        description: 'Crafted exclusively in aromatic slow-clarified native cow milk ghee.',
      },
      {
        icon: Leaf,
        title: 'Unrefined Heritage Sweetener',
        description: 'Sweetened with organic jaggery and sulfur-free desi khand sugar.',
      },
      {
        icon: Clock,
        title: 'Small-Batch Freshness',
        description: 'Prepared fresh in small woks to retain true melt-in-mouth texture.',
      },
      {
        icon: ShieldCheck,
        title: 'Dedicated Satvik Kitchen',
        description: 'Prepared in a 100% pure vegetarian, hygienic heritage facility.',
      },
    ];
  }

  return (
    <div
      aria-label="Artisanal Standards"
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4',
        className,
      )}
    >
      {pillars.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="rounded-2xl border border-line bg-surface p-4 flex items-start gap-3.5 transition-colors hover:border-line-strong"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-fg leading-tight">
                {item.title}
              </h3>
              <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
