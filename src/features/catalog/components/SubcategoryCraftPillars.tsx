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
        'grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4',
        className,
      )}
    >
      {pillars.map((item, idx) => {
        const Icon = ICON_MAP[item.icon] ?? Sparkles;
        return (
          <div
            key={idx}
            className="border-line bg-surface hover:border-line-strong flex items-start gap-3.5 rounded-2xl border p-4 transition-colors"
          >
            <div className="bg-brand-50 text-brand-700 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-fg text-sm leading-tight font-bold">{item.title}</h3>
              <p className="text-fg-muted mt-1 text-xs leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
