'use client';

import * as React from 'react';
import { Lock, UserRound } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { useAuth, useToast, type UserProfile } from '@/lib/store';

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inputClass =
  'border-heritage-border text-heritage-charcoal focus:border-heritage-maroon focus:ring-heritage-maroon/15 h-11 w-full rounded-xl border bg-white px-3.5 text-sm outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100';

function EditProfileForm({ user, onClose }: { user: UserProfile; onClose: () => void }) {
  const { updateProfile } = useAuth();
  const { addToast } = useToast();
  const [name, setName] = React.useState(
    user.name === 'Bramhkanti customer' ? '' : user.name,
  );
  const [email, setEmail] = React.useState(user.email ?? '');
  const [error, setError] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    const result = await updateProfile({ name, email });
    setIsSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    addToast({ type: 'success', message: 'Profile updated' });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
      <div>
        <label htmlFor="edit-name" className="mb-1.5 block text-sm font-medium">
          Full name
        </label>
        <input
          id="edit-name"
          value={name}
          autoComplete="name"
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="e.g. Asha Verma"
        />
      </div>

      <div>
        <label htmlFor="edit-email" className="mb-1.5 block text-sm font-medium">
          Email{' '}
          <span className="text-heritage-muted font-normal">
            (optional, for receipts)
          </span>
        </label>
        <input
          id="edit-email"
          type="email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium">Mobile number</span>
        <div className="border-heritage-border text-heritage-muted flex h-11 items-center justify-between rounded-xl border bg-neutral-50 px-3.5 text-sm dark:border-neutral-700 dark:bg-neutral-800/60">
          <span className="tabular-nums">{user.phone}</span>
          <Lock className="h-4 w-4" aria-hidden="true" />
        </div>
        <p className="text-heritage-muted mt-1.5 text-xs">
          You log in with this number. Contact support to change it.
        </p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSaving} className="rounded-xl px-5">
          Save changes
        </Button>
      </div>
    </form>
  );
}

export function EditProfileModal({
  isOpen,
  onClose,
}: EditProfileModalProps): React.JSX.Element {
  const { user } = useAuth();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 sm:p-7 dark:border-neutral-800 dark:bg-[#1c1917]">
        <DialogHeader className="text-left">
          <div className="bg-heritage-maroon-light text-heritage-maroon mb-2 flex h-10 w-10 items-center justify-center rounded-full">
            <UserRound className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Edit profile
          </DialogTitle>
          <DialogDescription className="text-heritage-muted text-sm">
            Your name appears on orders and delivery labels.
          </DialogDescription>
        </DialogHeader>
        {isOpen && user && (
          <EditProfileForm key={user.id} user={user} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}
