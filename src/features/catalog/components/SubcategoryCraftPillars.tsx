import * as React from 'react';
import {
  Award,
  Clock,
  Droplets,
  Flame,
  Leaf,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Sun,
  type LucideIcon,
} from 'lucide-react';
import type { SubcategoryCraftPillar } from '@/features/catalog/data/subcategoryContent';
import { cn } from '@/lib/utils/cn';

const ICON_MAP: Record<SubcategoryCraftPillar['icon'], LucideIcon> = {
  sun: Sun,
  leaf: Leaf,
  shield: ShieldCheck,
  package: PackageCheck,
  award: Award,
  flame: Flame,
  sparkles: Sparkles,
  clock: Clock,
  droplets: Droplets,
};

export interface SubcategoryCraftPillarsProps {
  pillars: SubcategoryCraftPillar[];
  className?: string | undefined;
}

export function SubcategoryCraftPillars({
  pillars,
  className,
}: SubcategoryCraftPillarsProps): React.JSX.Element | null {
  if (!pillars || pillars.length === 0) return null;

  return (
    <div
      aria-label="Artisanal Craft Standards"
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4',
        className,
      )}
    >
      {pillars.map((item, idx) => {
        const Icon = ICON_MAP[item.icon] ?? Sparkles;
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
