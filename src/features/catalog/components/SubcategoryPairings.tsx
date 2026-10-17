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
        'border-line bg-surface rounded-2xl border p-5 transition-colors sm:p-6',
        className,
      )}
    >
      <div className="border-line/60 flex items-center gap-2.5 border-b pb-3">
        <div className="bg-brand-50 text-brand-700 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <UtensilsCrossed className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-fg text-sm leading-tight font-bold sm:text-base">
            Traditional Serving Suggestions & Culinary Pairings
          </h3>
          <p className="text-fg-muted mt-0.5 text-xs">
            How our elders recommend enjoying authentic {subName}
          </p>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-3 pt-4 md:grid-cols-3">
        {pairingNotes.map((note, idx) => (
          <li
            key={idx}
            className="text-fg-muted flex items-start gap-2.5 text-xs leading-relaxed sm:text-sm"
          >
            <CheckCircle2 className="text-brand-600 mt-0.5 h-4 w-4 shrink-0" />
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
