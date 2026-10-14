'use client';

import * as React from 'react';
import { ShieldCheck, Smartphone, User, ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { useAuth, useToast, type UserProfile } from '@/lib/store';

export function AuthModal(): React.JSX.Element {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();
  const { addToast } = useToast();

  const [step, setStep] = React.useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [otpCode, setOtpCode] = React.useState('');
  const [phoneError, setPhoneError] = React.useState('');
  const [otpError, setOtpError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const resetForm = React.useCallback(() => {
    setStep('phone');
    setPhoneNumber('');
    setFullName('');
    setOtpCode('');
    setPhoneError('');
    setOtpError('');
    setIsSubmitting(false);
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeAuthModal();
      resetForm();
    }
  };

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

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(phoneNumber)) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
      setOtpCode('');
      addToast({
        type: 'info',
        message: `OTP sent successfully to +91 ${phoneNumber}.`,
      });
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otpCode.replace(/\D/g, '');
    if (cleanOtp.length < 4) {
      setOtpError('Please enter the OTP sent to your number');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const name = fullName.trim() || 'Valued Customer';
      const initials = name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const profile: UserProfile = {
        id: `usr_${Date.now()}`,
        name,
        phone: `+91 ${phoneNumber}`,
        initials: initials || 'BK',
        addressSummary: 'Varanasi, Uttar Pradesh',
        orderCount: 1,
      };

      login(profile);
      setIsSubmitting(false);
      resetForm();
      addToast({
        type: 'success',
        message: `Welcome to Bramhkanti, ${profile.name}!`,
      });
    }, 600);
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="border-heritage-border bg-heritage-cream max-w-md p-6 sm:p-8">
        <DialogHeader className="text-left">
          <div className="bg-heritage-maroon-light text-heritage-maroon mb-2 flex h-10 w-10 items-center justify-center rounded-full">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <DialogTitle className="text-heritage-maroon font-serif text-xl font-bold">
            {step === 'phone' ? 'Sign In / Register' : 'Verify Mobile OTP'}
          </DialogTitle>
          <DialogDescription className="text-heritage-muted text-sm">
            {step === 'phone'
              ? 'Access your orders, saved addresses, and authentic heritage delicacies.'
              : `Enter the 6-digit code sent to +91 ${phoneNumber}`}
          </DialogDescription>
        </DialogHeader>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="auth-fullname"
                className="text-heritage-charcoal block text-xs font-semibold tracking-wider uppercase"
              >
                Full Name (Optional)
              </label>
              <div className="relative mt-1">
                <User
                  className="text-heritage-muted pointer-events-none absolute top-3 left-3 h-4 w-4"
                  aria-hidden="true"
                />
                <input
                  id="auth-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aditya Sharma"
                  className="border-heritage-border bg-heritage-cream text-heritage-charcoal placeholder:text-heritage-muted/70 focus:border-heritage-maroon w-full rounded-md border py-2.5 pr-3 pl-9.5 text-sm transition-colors focus:ring-0 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="auth-phone"
                className="text-heritage-charcoal block text-xs font-semibold tracking-wider uppercase"
              >
                Mobile Number <span className="text-heritage-maroon">*</span>
              </label>
              <div className="relative mt-1 flex rounded-md shadow-xs">
                <span className="border-heritage-border bg-heritage-cream-dark text-heritage-muted inline-flex items-center rounded-l-md border border-r-0 px-3 text-sm font-medium">
                  +91
                </span>
                <input
                  id="auth-phone"
                  type="tel"
                  required
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value.replace(/\D/g, ''));
                    setPhoneError('');
                  }}
                  placeholder="98765 43210"
                  className="border-heritage-border bg-heritage-cream text-heritage-charcoal placeholder:text-heritage-muted/70 focus:border-heritage-maroon block w-full flex-1 rounded-none rounded-r-md border px-3 py-2.5 text-sm transition-colors focus:ring-0 focus:outline-none"
                  aria-invalid={Boolean(phoneError)}
                  aria-describedby={phoneError ? 'auth-phone-error' : undefined}
                />
              </div>
              {phoneError && (
                <p
                  id="auth-phone-error"
                  className="text-heritage-maroon mt-1.5 text-xs font-medium"
                >
                  {phoneError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full font-medium"
            >
              <Smartphone className="h-4 w-4" aria-hidden="true" />
              <span>Get OTP on SMS</span>
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="auth-otp"
                  className="text-heritage-charcoal block text-xs font-semibold tracking-wider uppercase"
                >
                  6-Digit OTP <span className="text-heritage-maroon">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-heritage-maroon inline-flex items-center gap-1 text-xs font-medium hover:underline"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Change number</span>
                </button>
              </div>
              <input
                id="auth-otp"
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, ''));
                  setOtpError('');
                }}
                placeholder="• • • • • •"
                className="border-heritage-border bg-heritage-cream text-heritage-charcoal placeholder:text-heritage-muted/70 focus:border-heritage-maroon mt-1 block w-full rounded-md border px-3 py-2.5 text-center text-lg font-bold tracking-widest transition-colors focus:ring-0 focus:outline-none"
                aria-invalid={Boolean(otpError)}
                aria-describedby={otpError ? 'auth-otp-error' : undefined}
              />
              {otpError && (
                <p
                  id="auth-otp-error"
                  className="text-heritage-maroon mt-1.5 text-xs font-medium"
                >
                  {otpError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full font-medium"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>Verify & Continue</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                addToast({
                  type: 'info',
                  message: `New OTP dispatched to +91 ${phoneNumber}.`,
                });
              }}
              className="text-heritage-muted hover:text-heritage-maroon w-full text-xs"
            >
              Resend OTP
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
