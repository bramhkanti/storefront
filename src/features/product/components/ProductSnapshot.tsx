'use client';

import * as React from 'react';
import {
  Clock,
  Flame,
  Leaf,
  Package,
  ShieldCheck,
  Sparkles,
  Sun,
  type LucideIcon,
} from 'lucide-react';
import type { SnapshotHighlight } from '../data/productContent';
import { cn } from '@/lib/utils/cn';

const ICON_MAP: Record<SnapshotHighlight['icon'], LucideIcon> = {
  sun: Sun,
  leaf: Leaf,
  shield: ShieldCheck,
  package: Package,
  sparkles: Sparkles,
  flame: Flame,
  clock: Clock,
};

export interface ProductSnapshotProps {
  highlights: SnapshotHighlight[];
  className?: string | undefined;
}

export function ProductSnapshot({
  highlights,
  className,
}: ProductSnapshotProps): React.JSX.Element {
  if (!highlights || highlights.length === 0) return <></>;

  return (
    <div
      className={cn(
        'space-y-3.5 rounded-2xl border border-neutral-200 bg-white p-4 shadow-none sm:p-5',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
        <h3 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase">
          A Snapshot View
        </h3>
        <span className="text-xs font-medium text-neutral-500">
          Artisanal Craft Standards
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {highlights.map((item) => {
          const IconComponent = ICON_MAP[item.icon] ?? Sparkles;
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-3.5 transition-colors hover:border-neutral-300"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800">
                <IconComponent className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-sm leading-tight font-semibold text-neutral-900">
                  {item.label}
                </span>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
