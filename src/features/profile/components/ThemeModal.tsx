'use client';

import * as React from 'react';
import { Sun, Moon, Laptop, Check, Palette } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import { useTheme, type ThemeMode } from '@/lib/theme';
import { useToast } from '@/lib/store';

export interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ThemeOption {
  id: ThemeMode;
  label: string;
  badge?: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'light',
    label: 'Default (Light)',
    badge: 'Heritage',
    description:
      'Warm cream aesthetic honoring traditional Varanasi brass and terracotta tones.',
    icon: Sun,
  },
  {
    id: 'dark',
    label: 'Dark',
    badge: 'Gentle',
    description:
      'Deep rich charcoal backdrop with muted heritage accents for nighttime comfort.',
    icon: Moon,
  },
  {
    id: 'system',
    label: 'System Preference',
    badge: 'Auto',
    description:
      'Automatically synchronizes with your device or operating system appearance.',
    icon: Laptop,
  },
];

export function ThemeModal({ isOpen, onClose }: ThemeModalProps): React.JSX.Element {
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();

  const handleSelectTheme = (mode: ThemeMode, label: string) => {
    setTheme(mode);
    addToast({
      type: 'success',
      message: `Theme set to ${label}.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-heritage-border bg-heritage-cream max-w-md p-6 sm:p-7 dark:border-neutral-800 dark:bg-[#1c1917]">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2.5">
            <div className="bg-heritage-maroon-light dark:bg-heritage-maroon/20 text-heritage-maroon flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-heritage-maroon font-serif text-xl font-bold dark:text-red-400">
                Store Theme Appearance
              </DialogTitle>
              <DialogDescription className="text-heritage-muted text-xs sm:text-sm dark:text-neutral-400">
                Select your preferred viewing theme for the Bramhkanti storefront.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-2.5">
          {THEME_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectTheme(opt.id, opt.label)}
                className={`group flex w-full items-start justify-between rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-heritage-maroon ring-heritage-maroon/20 bg-white ring-2 dark:border-red-500/60 dark:bg-[#25211d]'
                    : 'border-neutral-200/80 bg-white/70 hover:border-neutral-300 hover:bg-white dark:border-neutral-800/80 dark:bg-[#201d1a] dark:hover:bg-[#25211d]'
                }`}
              >
                <div className="flex min-w-0 items-start gap-3.5">
                  <div
                    className={`shrink-0 rounded-xl p-2 transition-colors ${
                      isSelected
                        ? 'bg-heritage-maroon-light text-heritage-maroon dark:bg-heritage-maroon/30 dark:text-red-300'
                        : 'bg-neutral-100 text-neutral-600 group-hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-400 dark:group-hover:text-neutral-200'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          isSelected
                            ? 'text-heritage-maroon dark:text-red-300'
                            : 'text-neutral-900 dark:text-neutral-100'
                        }`}
                      >
                        {opt.label}
                      </span>
                      {opt.badge && (
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-neutral-600 uppercase dark:bg-neutral-800 dark:text-neutral-400">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                      {opt.description}
                    </p>
                  </div>
                </div>

                <div className="ml-3 shrink-0 pt-1">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                      isSelected
                        ? 'border-heritage-maroon bg-heritage-maroon text-white dark:border-red-600 dark:bg-red-600'
                        : 'border-neutral-300 bg-transparent dark:border-neutral-700'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
