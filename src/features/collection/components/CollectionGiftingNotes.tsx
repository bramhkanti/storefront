import * as React from 'react';
import { Gift, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface CollectionGiftingNotesProps {
  collectionTitle: string;
  notes: string[];
  className?: string | undefined;
}

export function CollectionGiftingNotes({
  collectionTitle,
  notes,
  className,
}: CollectionGiftingNotesProps): React.JSX.Element | null {
  if (!notes || notes.length === 0) return null;

  return (
    <div
      aria-label="Gifting Recommendations"
      className={cn(
        'rounded-2xl border border-line bg-surface p-5 sm:p-6 transition-colors',
        className,
      )}
    >
      <div className="flex items-center gap-2.5 pb-3 border-b border-line/60">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <Gift className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-fg leading-tight">
            Gifting Occasions & Hamper Presentation
          </h3>
          <p className="text-xs text-fg-muted mt-0.5">
            Thoughtful ways to celebrate and share our {collectionTitle} selection
          </p>
        </div>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
        {notes.map((note, idx) => (
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
