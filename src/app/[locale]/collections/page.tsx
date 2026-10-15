import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { listCollections } from '@/features/collection/queries';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Curated Heritage Collections & Gift Hampers | Bramhkanti',
  description:
    'Discover festive gifting hampers, customer favourites, and authentic family recipes curated across pickles, sweets, and makhana.',
  canonicalPath: '/collections',
});

export default async function CollectionsIndexPage(): Promise<ReactNode> {
  const collections = await listCollections();

  return (
    <div className="space-y-10 py-8 sm:py-12">
      <Container className="space-y-8">
        <Breadcrumbs items={[{ name: 'Curated Collections' }]} />

        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="saffron">Limited Editions</Badge>
            <span className="text-heritage-saffron-dark text-xs font-semibold tracking-wider uppercase">
              Hand-Selected
            </span>
          </div>

          <h1 className="text-heritage-maroon font-serif text-3xl font-extrabold tracking-tight sm:text-5xl">
            Curated Heritage Collections
          </h1>

          <p className="text-heritage-muted text-base leading-relaxed">
            Thoughtfully assembled gift hampers and festive selections combining our
            authentic sun-dried pickles, pure cow ghee sweets, and roasted makhana.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((coll) => (
            <Link
              key={coll.id}
              href={`/collections/${coll.handle}`}
              className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg dark:border-neutral-800 dark:bg-[#1c1917]"
            >
              <div className="relative aspect-16/9 bg-neutral-100 dark:bg-neutral-800">
                {coll.image && (
                  <Image
                    src={coll.image.url}
                    alt={coll.image.altText ?? coll.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                )}
                {coll.badge && (
                  <span className="bg-heritage-maroon absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white">
                    {coll.badge}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold tracking-tight">{coll.title}</h2>
                {coll.description && (
                  <p className="text-heritage-muted mt-1 line-clamp-2 text-sm">
                    {coll.description}
                  </p>
                )}
                <span className="text-heritage-maroon mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                  Shop collection
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
