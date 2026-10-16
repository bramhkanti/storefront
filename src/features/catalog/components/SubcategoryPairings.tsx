import * as React from 'react';
import { UtensilsCrossed, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SubcategoryPairingsProps {
  subName: string;
  pairingNotes: string[];
  className?: string | undefined;
}

export function SubcategoryPairings({
  subName,
  pairingNotes,
  className,
}: SubcategoryPairingsProps): React.JSX.Element | null {
  if (!pairingNotes || pairingNotes.length === 0) return null;

  return (
    <div
      aria-label="Culinary Pairings"
      className={cn(
        'rounded-2xl border border-line bg-surface p-5 sm:p-6 transition-colors',
        className,
      )}
    >
      <div className="flex items-center gap-2.5 pb-3 border-b border-line/60">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <UtensilsCrossed className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-fg leading-tight">
            Traditional Serving Suggestions & Culinary Pairings
          </h3>
          <p className="text-xs text-fg-muted mt-0.5">
            How our elders recommend enjoying authentic {subName}
          </p>
        </div>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
        {pairingNotes.map((note, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2.5 text-xs sm:text-sm text-fg-muted leading-relaxed"
          >
            <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
