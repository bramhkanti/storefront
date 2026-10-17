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
    <section className="pt-6 sm:pt-8" aria-label="Our promises">
      <Container>
        <ul className="-mx-4 flex snap-x scroll-px-4 [scrollbar-width:none] gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden">
          {pillars.map((pillar) => {
            const Icon = ICON_MAP[pillar.iconName] ?? ShieldCheck;
            return (
              <li
                key={pillar.id}
                className="flex shrink-0 snap-start items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 dark:border-neutral-800 dark:bg-[#1c1917]"
              >
                <span
                  className="bg-heritage-maroon-light text-heritage-maroon flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm leading-snug font-semibold whitespace-nowrap sm:whitespace-normal">
                  {pillar.title}
                </span>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
