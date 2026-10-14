'use client';

import * as React from 'react';
import { User, Phone, Check, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { useAuth, useToast, type UserProfile } from '@/lib/store';

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EditProfileFormProps {
  user: UserProfile;
  onClose: () => void;
  onSave: (updates: Partial<UserProfile>) => void;
}

function EditProfileForm({
  user,
  onClose,
  onSave,
}: EditProfileFormProps): React.JSX.Element {
  const { addToast } = useToast();

  const [step, setStep] = React.useState<'edit' | 'verify-phone'>('edit');
  const [name, setName] = React.useState(user.name || '');
  const [phone, setPhone] = React.useState(
    user.phone.replace('+91 ', '').replace('+91', '').trim() || '',
  );
  const [phoneError, setPhoneError] = React.useState('');
  const [otpCode, setOtpCode] = React.useState('');
  const [otpError, setOtpError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Normalize phone for comparison
  const originalCleanPhone = user.phone.replace(/\D/g, '').slice(-10);
  const currentCleanPhone = phone.replace(/\D/g, '').slice(-10);
  const isPhoneChanged =
    currentCleanPhone.length === 10 && currentCleanPhone !== originalCleanPhone;

  const validatePhone = (num: string): boolean => {
    const cleaned = num.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number');
      return false;
    }
    if (!/^[6-9]/.test(cleaned)) {
      setPhoneError('Indian mobile numbers must start with 6, 7, 8, or 9');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Check if phone number was altered
    if (isPhoneChanged) {
      if (!validatePhone(phone)) return;

      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep('verify-phone');
        setOtpCode('');
        setOtpError('');
        addToast({
          type: 'info',
          message: `OTP sent to new number +91 ${currentCleanPhone} for verification.`,
        });
      }, 500);
      return;
    }

    // Phone wasn't changed; directly save name
    setIsSubmitting(true);
    setTimeout(() => {
      const initials = name
        .trim()
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      onSave({
        name: name.trim(),
        initials: initials || user.initials || 'BK',
      });

      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  const handleVerifyOtpAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otpCode.replace(/\D/g, '');
    if (cleanOtp.length < 4) {
      setOtpError('Please enter the 6-digit OTP code sent to your phone');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const initials = name
        .trim()
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      onSave({
        name: name.trim(),
        phone: `+91 ${currentCleanPhone}`,
        initials: initials || user.initials || 'BK',
      });

      setIsSubmitting(false);
      onClose();
      addToast({
        type: 'success',
        message: 'New mobile number verified and profile updated successfully!',
      });
    }, 500);
  };

  if (step === 'verify-phone') {
    return (
      <form onSubmit={handleVerifyOtpAndSave} className="mt-4 space-y-4">
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl p-3 text-xs text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>
            Verifying new mobile number <strong>+91 {currentCleanPhone}</strong>. Enter the OTP code to confirm this change.
          </span>
        </div>

        <div>
          <label
            htmlFor="phone-otp-input"
            className="text-heritage-charcoal dark:text-neutral-200 block text-xs font-semibold tracking-wider uppercase"
          >
            Enter 6-Digit OTP
          </label>
          <div className="relative mt-1">
            <KeyRound className="text-heritage-muted dark:text-neutral-400 pointer-events-none absolute top-3 left-3 h-4 w-4" />
            <input
              id="phone-otp-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otpCode}
              onChange={(e) => {
                setOtpCode(e.target.value);
                setOtpError('');
              }}
              required
              className="border-heritage-border dark:border-neutral-700 bg-white dark:bg-[#25211d] text-heritage-charcoal dark:text-neutral-100 focus:border-heritage-maroon w-full rounded-xl border py-2.5 pr-3 pl-10 text-sm tracking-widest font-mono shadow-xs transition-colors"
              placeholder="123456"
              autoFocus
            />
          </div>
          {otpError && (
            <p className="text-red-600 text-xs mt-1.5 font-medium">{otpError}</p>
          )}
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">
            Demo preview: enter any 4–6 digit code (e.g. 123456)
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setStep('edit')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Change Number</span>
          </button>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="gap-1.5"
          >
            <Check className="h-4 w-4" />
            <span>{isSubmitting ? 'Verifying...' : 'Verify & Save'}</span>
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleInitialSubmit} className="mt-4 space-y-4">
      {/* Full Name */}
      <div>
        <label
          htmlFor="edit-name"
          className="text-heritage-charcoal dark:text-neutral-200 block text-xs font-semibold tracking-wider uppercase"
        >
          Full Name
        </label>
        <div className="relative mt-1">
          <User className="text-heritage-muted dark:text-neutral-400 pointer-events-none absolute top-3 left-3 h-4 w-4" />
          <input
            id="edit-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border-heritage-border dark:border-neutral-700 bg-white dark:bg-[#25211d] text-heritage-charcoal dark:text-neutral-100 focus:border-heritage-maroon w-full rounded-xl border py-2.5 pr-3 pl-10 text-sm shadow-xs transition-colors"
            placeholder="Aditya Sharma"
          />
        </div>
      </div>

      {/* Phone Number */}
      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="edit-phone"
            className="text-heritage-charcoal dark:text-neutral-200 block text-xs font-semibold tracking-wider uppercase"
          >
            Mobile Number
          </label>
          {isPhoneChanged && (
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300 px-2 py-0.5 rounded-full">
              Requires OTP Verification
            </span>
          )}
        </div>
        <div className="relative mt-1 flex rounded-xl shadow-xs overflow-hidden border border-heritage-border dark:border-neutral-700 bg-white dark:bg-[#25211d] focus-within:border-heritage-maroon transition-colors">
          <span className="bg-neutral-50 dark:bg-neutral-800 text-heritage-muted dark:text-neutral-400 inline-flex items-center gap-1.5 border-r border-heritage-border dark:border-neutral-700 px-3 text-xs font-semibold select-none">
            <Phone className="h-3.5 w-3.5 text-neutral-400" />
            <span>+91</span>
          </span>
          <input
            id="edit-phone"
            type="tel"
            maxLength={10}
            value={phone}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, '');
              setPhone(digitsOnly);
              setPhoneError('');
            }}
            required
            className="text-heritage-charcoal dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 block w-full flex-1 border-0 px-3 py-2.5 text-sm font-mono tracking-wider focus:ring-0 focus:outline-none"
            placeholder="9876543210"
          />
        </div>
        {phoneError ? (
          <p className="text-red-600 text-xs mt-1.5 font-medium">{phoneError}</p>
        ) : (
          <p className="text-neutral-400 dark:text-neutral-500 text-[11px] mt-1">
            Used for OTP login, order updates, and delivery alerts.
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={isSubmitting}
          className="gap-1.5"
        >
          <Check className="h-4 w-4" />
          <span>
            {isSubmitting
              ? 'Processing...'
              : isPhoneChanged
                ? 'Verify New Number'
                : 'Save Changes'}
          </span>
        </Button>
      </div>
    </form>
  );
}

export function EditProfileModal({
  isOpen,
  onClose,
}: EditProfileModalProps): React.JSX.Element {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const handleSave = (updates: Partial<UserProfile>) => {
    updateProfile(updates);
    addToast({
      type: 'success',
      message: 'Your profile details have been updated successfully.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-heritage-border bg-heritage-cream dark:bg-[#1c1917] dark:border-neutral-800 max-w-md p-6 sm:p-7">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2.5">
            <div className="bg-heritage-maroon-light dark:bg-heritage-maroon/20 text-heritage-maroon flex h-9 w-9 items-center justify-center rounded-full shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-heritage-maroon dark:text-red-400 font-serif text-xl font-bold">
                Change Mobile Number
              </DialogTitle>
              <DialogDescription className="text-heritage-muted dark:text-neutral-400 text-xs sm:text-sm">
                Update your verified contact mobile number via 6-digit OTP confirmation.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isOpen && user && (
          <EditProfileForm
            key={user.id + (user.name || '') + (user.phone || '')}
            user={user}
            onClose={onClose}
            onSave={handleSave}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
