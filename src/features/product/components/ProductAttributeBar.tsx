'use client';

import * as React from 'react';
import {
  Award,
  Droplets,
  Flame,
  FlaskConicalOff,
  Leaf,
  ShieldCheck,
  Sparkles,
  Wheat,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface AttributeItem {
  label: string;
  icon: string;
}

export interface ProductAttributeBarProps {
  desktopItems?: AttributeItem[] | undefined;
  mobileItems?: AttributeItem[] | undefined;
  className?: string | undefined;
}

export function ProductAttributeBar({
  desktopItems = [
    { icon: 'leaf-slash', label: 'No Preservatives' },
    { icon: 'award', label: 'FSSAI Certified' },
    { icon: 'leaf', label: '100% Natural Ingredients' },
    { icon: 'shield', label: 'Freshness Guarantee' },
  ],
  mobileItems = [
    { icon: 'leaf-slash', label: 'No Preservatives' },
    { icon: 'award', label: 'FSSAI\nCertified' },
    { icon: 'leaf', label: '100% Natural Ingredients' },
    { icon: 'shield', label: 'Freshness Guarantee' },
  ],
  className,
}: ProductAttributeBarProps): React.JSX.Element {
  const renderIcon = (type: string, isMobile = false) => {
    const iconClass = isMobile ? 'h-5 w-5 text-primary' : 'h-5 w-5 text-accent-text';

    switch (type) {
      case 'wheat':
        return <Wheat className={iconClass} />;
      case 'mortar':
      case 'spices':
        return <Flame className={iconClass} />;
      case 'bottle':
      case 'oil':
        return <Droplets className={iconClass} />;
      case 'leaf-slash':
      case 'flask':
      case 'flask-off':
      case 'no-preservatives':
        return <FlaskConicalOff className={iconClass} />;
      case 'mango':
      case 'leaf':
        return <Leaf className={iconClass} />;
      case 'award':
        return <Award className={iconClass} />;
      case 'shield':
        return <ShieldCheck className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Desktop Attribute Bar (Horizontal 4-column divided card) */}
      <div className="divide-line border-line bg-surface text-fg hidden grid-cols-4 divide-x rounded-2xl border px-6 py-4 text-center shadow-xs lg:grid">
        {desktopItems.map((item, idx) => (
          <div key={idx} className="flex items-center justify-center gap-3 px-4">
            <div className="bg-accent-tint/40 text-accent-text flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              {renderIcon(item.icon, false)}
            </div>
            <span className="text-fg text-left text-sm leading-snug font-semibold">
              {item.label.replace('\n', ' ')}
            </span>
          </div>
        ))}
      </div>

      {/* Mobile Trust Badges (4 circular icons in row) */}
      <div className="grid grid-cols-4 gap-2 pt-1 pb-3 text-center lg:hidden">
        {mobileItems.map((item, idx) => {
          const isFssai = item.label.toLowerCase().includes('fssai');
          const lines = isFssai
            ? ['FSSAI', 'Certified']
            : item.label.includes('\n')
              ? item.label.split('\n')
              : [item.label];

          return (
            <div key={idx} className="flex flex-col items-center">
              <div className="border-line bg-surface mb-1.5 flex h-11 w-11 items-center justify-center rounded-full border text-center shadow-2xs">
                {renderIcon(item.icon, true)}
              </div>
              <div className="text-fg-muted flex min-h-[2rem] flex-col items-center justify-start text-center text-[11px] leading-tight font-medium">
                {lines.map((line, lIdx) => (
                  <span key={lIdx} className="block whitespace-normal">
                    {line}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
