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
        'border-line bg-surface rounded-2xl border p-5 transition-colors sm:p-6',
        className,
      )}
    >
      <div className="border-line/60 flex items-center gap-2.5 border-b pb-3">
        <div className="bg-brand-50 text-brand-700 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <Gift className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-fg text-sm leading-tight font-bold sm:text-base">
            Gifting Occasions & Hamper Presentation
          </h3>
          <p className="text-fg-muted mt-0.5 text-xs">
            Thoughtful ways to celebrate and share our {collectionTitle} selection
          </p>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-3 pt-4 md:grid-cols-3">
        {notes.map((note, idx) => (
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
