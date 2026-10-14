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
    description: 'Warm cream aesthetic honoring traditional Varanasi brass and terracotta tones.',
    icon: Sun,
  },
  {
    id: 'dark',
    label: 'Dark',
    badge: 'Gentle',
    description: 'Deep rich charcoal backdrop with muted heritage accents for nighttime comfort.',
    icon: Moon,
  },
  {
    id: 'system',
    label: 'System Preference',
    badge: 'Auto',
    description: 'Automatically synchronizes with your device or operating system appearance.',
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
      <DialogContent className="border-heritage-border bg-heritage-cream dark:bg-[#1c1917] dark:border-neutral-800 max-w-md p-6 sm:p-7">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2.5">
            <div className="bg-heritage-maroon-light dark:bg-heritage-maroon/20 text-heritage-maroon flex h-9 w-9 items-center justify-center rounded-full shrink-0">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-heritage-maroon dark:text-red-400 font-serif text-xl font-bold">
                Store Theme Appearance
              </DialogTitle>
              <DialogDescription className="text-heritage-muted dark:text-neutral-400 text-xs sm:text-sm">
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
                className={`w-full flex items-start justify-between p-4 rounded-2xl border text-left transition-all group ${
                  isSelected
                    ? 'border-heritage-maroon bg-white dark:bg-[#25211d] dark:border-red-500/60 ring-2 ring-heritage-maroon/20'
                    : 'border-neutral-200/80 bg-white/70 dark:bg-[#201d1a] dark:border-neutral-800/80 hover:bg-white dark:hover:bg-[#25211d] hover:border-neutral-300'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`p-2 rounded-xl shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-heritage-maroon-light text-heritage-maroon dark:bg-heritage-maroon/30 dark:text-red-300'
                        : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200'
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
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 ml-3 pt-1">
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'border-heritage-maroon bg-heritage-maroon text-white dark:bg-red-600 dark:border-red-600'
                        : 'border-neutral-300 dark:border-neutral-700 bg-transparent'
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
