import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { SITE_CONFIG } from '@/content/site';

export default function NotFound(): ReactNode {
  return (
    <div className="py-20 text-center sm:py-32">
      <Container className="max-w-xl space-y-6">
        <div className="bg-heritage-saffron-light text-heritage-saffron-dark mx-auto flex h-16 w-16 items-center justify-center rounded-full">
          <Compass className="h-8 w-8" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <div className="text-heritage-saffron-dark text-xs font-semibold tracking-wider uppercase">
            Error 404
          </div>
          <h1 className="text-heritage-maroon font-serif text-3xl font-extrabold tracking-tight sm:text-5xl">
            Flavour Not Found
          </h1>
          <p className="text-heritage-muted text-sm leading-relaxed sm:text-base">
            The delicacy or page you are looking for has been moved, completed its
            seasonal cycle, or does not exist.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button size="md" className="rounded-full">
              <span>Return Home</span>
            </Button>
          </Link>
          <Link href="/categories">
            <Button variant="secondary" size="md" className="rounded-full">
              <span>Browse the shop</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {SITE_CONFIG.contact.whatsappMessageUrl && (
          <p className="text-heritage-muted pt-6 text-xs">
            Need assistance? WhatsApp our culinary team at{' '}
            <a
              href={SITE_CONFIG.contact.whatsappMessageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-heritage-green font-medium underline"
            >
              {SITE_CONFIG.contact.whatsappNumber}
            </a>
          </p>
        )}
      </Container>
    </div>
  );
}
