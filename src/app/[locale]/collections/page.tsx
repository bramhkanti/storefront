import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
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
              className="group border-heritage-border bg-heritage-cream hover:border-heritage-maroon/30 flex flex-col justify-between rounded-xl border p-6 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <div className="text-heritage-saffron-dark mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Curated Box</span>
                </div>

                <h2 className="text-heritage-charcoal group-hover:text-heritage-maroon font-serif text-2xl font-bold transition-colors">
                  {coll.title}
                </h2>

                <p className="text-heritage-muted mt-2 line-clamp-3 text-sm leading-relaxed">
                  {coll.description}
                </p>
              </div>

              <div className="text-heritage-maroon border-heritage-border/60 mt-6 flex items-center gap-1.5 border-t pt-4 text-sm font-semibold">
                <span>Explore Hamper</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
