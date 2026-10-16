'use client';

import * as React from 'react';
import { Award, Clock, PackageCheck, ShieldCheck } from 'lucide-react';
import type { FoodAttributes } from '@/lib/api/contracts/domain';
import { cn } from '@/lib/utils/cn';

export interface ProductSpecsSectionProps {
  primaryCategory: string;
  foodAttributes: FoodAttributes;
  categoryAttributes?: Record<string, unknown> | undefined;
  className?: string | undefined;
}

export function ProductSpecsSection({
  foodAttributes,
  className,
}: ProductSpecsSectionProps): React.JSX.Element {
  const certifications = [
    {
      icon: ShieldCheck,
      title: '100% Pure Vegetarian',
      desc: 'Green Dot Certified • Dedicated Sacred Kitchen',
      isVeg: true,
    },
    {
      icon: Award,
      title: 'FSSAI Registered',
      desc: `Reg. No. ${foodAttributes.fssaiLicenseNumber}`,
      isVeg: false,
    },
    {
      icon: Clock,
      title: foodAttributes.shelfLife || '12 Months Freshness',
      desc: 'Vedic sun-cured naturally without chemicals',
      isVeg: false,
    },
    {
      icon: PackageCheck,
      title: 'Aroma-Lock Glass Packaging',
      desc: 'Food-grade glass jar • Zero micro-plastics',
      isVeg: false,
    },
  ];

  return (
    <section aria-labelledby="specs-heading" className={cn('space-y-4', className)}>
      <div>
        <h2 id="specs-heading" className="text-[20px] font-semibold text-neutral-900 leading-snug">
          Ingredients & Product Transparency
        </h2>
      </div>

      {/* 4 Trust Certification Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {certifications.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-neutral-200 bg-white p-3.5 transition-colors hover:border-neutral-300 space-y-2"
            >
              <div className="flex items-center gap-2.5">
                {item.isVeg ? (
                  /* Standard Green Dot Vegetarian Emblem */
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 border-emerald-600 bg-white p-0.5">
                    <div className="h-3 w-3 rounded-full bg-emerald-600" />
                  </div>
                ) : (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                    <Icon className="h-4 w-4" />
                  </div>
                )}
                <span className="text-sm font-semibold text-neutral-900 leading-tight">
                  {item.title}
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Ingredients Spotlight Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-neutral-100 pb-2.5">
          <span className="text-sm font-semibold text-neutral-900">
            Handcrafted Real Ingredients
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
            0% Synthetic Vinegar • 0% Chemicals
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {foodAttributes.ingredients.map((ingredient, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50/70 px-3 py-1.5 text-sm font-medium text-neutral-800"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              {ingredient}
            </span>
          ))}
        </div>

        {foodAttributes.allergens && foodAttributes.allergens.length > 0 && (
          <p className="text-xs text-neutral-500 pt-1">
            <strong className="text-neutral-700">Allergen Advice: </strong>
            Contains {foodAttributes.allergens.join(', ')}.
          </p>
        )}

        {foodAttributes.storage && (
          <div className="pt-2 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100">
            <strong className="text-neutral-900">Storage & Care: </strong>
            {foodAttributes.storage}
          </div>
        )}
      </div>
    </section>
  );
}
