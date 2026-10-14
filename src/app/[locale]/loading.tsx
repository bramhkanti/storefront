import type { ReactNode } from 'react';
import { Container } from '@/components/layout/Container';

export default function Loading(): ReactNode {
  return (
    <div
      className="animate-pulse space-y-10 py-12"
      aria-busy="true"
      aria-label="Loading content"
    >
      <Container className="space-y-8">
        {/* Breadcrumb Skeleton */}
        <div className="bg-heritage-cream-dark h-4 w-48 rounded-md" />

        {/* Hero Title Skeleton */}
        <div className="max-w-xl space-y-3">
          <div className="bg-heritage-cream-dark h-4 w-24 rounded-md" />
          <div className="bg-heritage-cream-dark h-10 w-3/4 rounded-md" />
          <div className="bg-heritage-cream-dark h-4 w-full rounded-md" />
          <div className="bg-heritage-cream-dark h-4 w-5/6 rounded-md" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="bg-heritage-cream-dark h-14 w-full rounded-xl" />

        {/* Product Cards Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border-heritage-border bg-heritage-cream-dark/50 flex min-h-[340px] flex-col justify-between rounded-xl border p-5"
            >
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="bg-heritage-cream-dark h-4 w-16 rounded-md" />
                  <div className="bg-heritage-cream-dark h-4 w-20 rounded-md" />
                </div>
                <div className="bg-heritage-cream-dark h-12 w-3/4 rounded-md" />
                <div className="bg-heritage-cream-dark h-10 w-full rounded-md" />
              </div>
              <div className="border-heritage-border/60 mt-6 flex items-center justify-between border-t pt-4">
                <div className="bg-heritage-cream-dark h-6 w-20 rounded-md" />
                <div className="bg-heritage-cream-dark h-8 w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
