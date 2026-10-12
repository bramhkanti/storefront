import * as React from 'react';
import { Leaf, Utensils, Droplets, ShieldCheck, Truck } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { TRUST_PILLARS } from '../constants';
import type { TrustPillarItem } from '../types';

const ICON_MAP = {
  leaf: Leaf,
  pot: Utensils,
  oil: Droplets,
  shield: ShieldCheck,
  truck: Truck,
};

export interface TrustBarProps {
  pillars?: TrustPillarItem[];
}

export function TrustBar({ pillars = TRUST_PILLARS }: TrustBarProps): React.JSX.Element {
  return (
    <section
      className="border-heritage-border/70 bg-heritage-cream-dark/35 border-y py-8 sm:py-10"
      aria-label="Quality Guarantees and Trust Pillars"
    >
      <Container>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {pillars.map((pillar) => {
            const Icon = ICON_MAP[pillar.iconName] ?? ShieldCheck;

            return (
              <div
                key={pillar.id}
                className="flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-0.5"
              >
                <div
                  className="border-heritage-border bg-heritage-cream text-heritage-maroon hover:border-heritage-maroon/30 flex h-12 w-12 items-center justify-center rounded-full border shadow-2xs transition-colors"
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-heritage-charcoal mt-2.5 max-w-[150px] text-xs leading-snug font-semibold sm:text-sm">
                  {pillar.title}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
