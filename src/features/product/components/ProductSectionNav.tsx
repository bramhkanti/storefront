'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface TabItem {
  id: string;
  label: string;
}

export interface ProductSectionNavProps {
  hasRelated?: boolean | undefined;
  className?: string | undefined;
}

export function ProductSectionNav({
  hasRelated = false,
  className,
}: ProductSectionNavProps): React.JSX.Element {
  const tabs: TabItem[] = React.useMemo(
    () => [
      { id: 'section-story', label: 'Story & Craft' },
      { id: 'section-specs', label: 'Ingredients & Specs' },
      { id: 'section-reviews', label: 'Rating & Reviews' },
      { id: 'section-policy', label: 'Delivery & Policy' },
      { id: 'section-faqs', label: 'FAQs' },
      ...(hasRelated ? [{ id: 'section-related', label: 'Pairing Products' }] : []),
    ],
    [hasRelated],
  );

  const [activeTab, setActiveTab] = React.useState<string>(
    tabs[0]?.id ?? 'section-story',
  );
  const navContainerRef = React.useRef<HTMLDivElement>(null);
  const tabButtonRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  // Detect the currently visible sticky header (mobile vs desktop)
  const getActiveHeader = () => {
    const mobileHeader = document.getElementById('product-sticky-header');
    const globalHeader = document.querySelector('header');
    return mobileHeader && mobileHeader.offsetParent !== null
      ? mobileHeader
      : globalHeader;
  };

  // Smooth scroll to the target section with generous sticky header offset
  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const target = document.getElementById(id);
    if (!target) return;

    // Dynamically calculate Header + Sticky Nav + 24px comfortable breathing room
    const headerEl = getActiveHeader();
    const navEl = navContainerRef.current?.parentElement;
    const headerHeight = headerEl ? headerEl.offsetHeight : 56;
    const navHeight = navEl ? navEl.offsetHeight : 52;
    const combinedOffset = headerHeight + navHeight + 24;

    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - combinedOffset;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: 'smooth',
    });

    // Scroll active chip into view inside horizontal container
    const activeBtn = tabButtonRefs.current[id];
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  // Track active section as user scrolls through the page
  React.useEffect(() => {
    const handleScroll = () => {
      const headerEl = getActiveHeader();
      const navEl = navContainerRef.current?.parentElement;
      const headerHeight = headerEl ? headerEl.offsetHeight : 56;
      const navHeight = navEl ? navEl.offsetHeight : 52;
      const scrollPosition = window.pageYOffset + headerHeight + navHeight + 40;

      for (let i = tabs.length - 1; i >= 0; i--) {
        const tab = tabs[i]!;
        const element = document.getElementById(tab.id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveTab((current) => {
              if (current !== tab.id) {
                const activeBtn = tabButtonRefs.current[tab.id];
                if (activeBtn) {
                  activeBtn.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest',
                  });
                }
                return tab.id;
              }
              return current;
            });
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tabs]);

  const [headerHeight, setHeaderHeight] = React.useState<number>(56);

  React.useEffect(() => {
    const updateHeaderHeight = () => {
      const headerEl = getActiveHeader();
      if (headerEl) {
        setHeaderHeight(headerEl.offsetHeight);
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  return (
    <nav
      aria-label="Product Sections Navigation"
      style={{ top: `${headerHeight}px` }}
      className={cn(
        'sticky top-14 z-30 w-full border-b border-neutral-200/80 bg-white/95 py-2.5 backdrop-blur-md transition-colors lg:top-20',
        className,
      )}
    >
      <div
        ref={navContainerRef}
        role="tablist"
        aria-orientation="horizontal"
        className="mx-auto flex max-w-7xl [scrollbar-width:none] items-center gap-2 overflow-x-auto px-3 sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabButtonRefs.current[tab.id] = el;
              }}
              role="tab"
              type="button"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={tab.id}
              style={{ fontSize: '14px' }}
              onClick={() => scrollToSection(tab.id)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-[14px] leading-5 font-semibold shadow-none transition-all duration-200 select-none active:scale-95',
                isActive
                  ? 'border-heritage-maroon bg-heritage-maroon text-white'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:text-neutral-900',
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
