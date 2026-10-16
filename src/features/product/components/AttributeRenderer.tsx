import * as React from 'react';
import { Flame, Sparkles, Sun, Utensils } from 'lucide-react';
import type {
  AcharAttributes,
  FoodAttributes,
  MakhanaAttributes,
  SweetsAttributes,
} from '@/lib/api/contracts/domain';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';

export interface AttributeRendererProps {
  primaryCategory: string;
  foodAttributes: FoodAttributes;
  categoryAttributes?: Record<string, unknown> | undefined;
  className?: string | undefined;
}

/**
 * Open/Closed attribute renderer registry.
 * Dispatches to specialized category presenters with graceful key-value fallback.
 */
export function AttributeRenderer({
  primaryCategory,
  foodAttributes,
  categoryAttributes = {},
  className,
}: AttributeRendererProps) {
  const normCategory = primaryCategory.toLowerCase();

  return (
    <div className={cn('space-y-6', className)}>
      {/* Category-Specific Heritage Attributes */}
      {normCategory.includes('achar') && (
        <AcharAttributesCard
          attributes={categoryAttributes as unknown as Partial<AcharAttributes>}
        />
      )}

      {normCategory.includes('sweet') && (
        <SweetsAttributesCard
          attributes={categoryAttributes as unknown as Partial<SweetsAttributes>}
        />
      )}

      {normCategory.includes('makhana') && (
        <MakhanaAttributesCard
          attributes={categoryAttributes as unknown as Partial<MakhanaAttributes>}
        />
      )}

      {/* Fallback for Future Categories (Extensibility) */}
      {!normCategory.includes('achar') &&
        !normCategory.includes('sweet') &&
        !normCategory.includes('makhana') &&
        Object.keys(categoryAttributes).length > 0 && (
          <GenericAttributesCard attributes={categoryAttributes} />
        )}

      {/* Indian Food Regulatory & Nutritional Information */}
      <FoodRegulatoryCard foodAttributes={foodAttributes} />
    </div>
  );
}

function AcharAttributesCard({ attributes }: { attributes: Partial<AcharAttributes> }) {
  const spiceColors: Record<string, string> = {
    Mild: 'text-amber-700 bg-amber-100 border-amber-300',
    Medium: 'text-orange-700 bg-orange-100 border-orange-300',
    Hot: 'text-red-700 bg-red-100 border-red-300',
    'Extra Hot': 'text-rose-900 bg-rose-200 border-rose-400',
  };

  return (
    <div className="border-heritage-border bg-white rounded-2xl border p-5 shadow-none">
      <h3 className="text-heritage-charcoal flex items-center gap-2 font-serif text-sm font-semibold tracking-wide">
        <Sun className="text-heritage-saffron h-4 w-4" />
        <span>Authentic Pickling Attributes</span>
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
        {attributes.spiceLevel && (
          <div>
            <div className="text-heritage-muted mb-1 flex items-center gap-1">
              <Flame className="h-3 w-3" />
              <span>Spice Level</span>
            </div>
            <span
              className={cn(
                'inline-block rounded-sm border px-2 py-0.5 text-[11px] font-semibold uppercase',
                spiceColors[attributes.spiceLevel] ?? 'bg-amber-100 text-amber-800',
              )}
            >
              {attributes.spiceLevel}
            </span>
          </div>
        )}

        {attributes.oilType && (
          <div>
            <div className="text-heritage-muted mb-1">Cold-Pressed Oil</div>
            <div className="text-heritage-charcoal font-medium">{attributes.oilType}</div>
          </div>
        )}

        {attributes.mangoVariety && (
          <div>
            <div className="text-heritage-muted mb-1">Mango Variety</div>
            <div className="text-heritage-charcoal font-medium">
              {attributes.mangoVariety}
            </div>
          </div>
        )}

        {attributes.preservativeType && (
          <div>
            <div className="text-heritage-muted mb-1">Preservation Method</div>
            <div className="text-heritage-charcoal font-medium">
              {attributes.preservativeType}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SweetsAttributesCard({ attributes }: { attributes: Partial<SweetsAttributes> }) {
  return (
    <div className="border-heritage-border bg-white rounded-2xl border p-5 shadow-none">
      <h3 className="text-heritage-charcoal flex items-center gap-2 font-serif text-sm font-semibold tracking-wide">
        <Sparkles className="text-heritage-gold h-4 w-4" />
        <span>Pure Desi Ghee Specifications</span>
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
        {attributes.gheeType && (
          <div>
            <div className="text-heritage-muted mb-1">Ghee Standard</div>
            <div className="text-heritage-charcoal font-medium">
              {attributes.gheeType}
            </div>
          </div>
        )}

        {attributes.milkContent && (
          <div>
            <div className="text-heritage-muted mb-1">Milk / Mawa Base</div>
            <div className="text-heritage-charcoal font-medium">
              {attributes.milkContent}
            </div>
          </div>
        )}

        {attributes.shelfLifeDays !== undefined && (
          <div>
            <div className="text-heritage-muted mb-1">Fresh Shelf Life</div>
            <div className="text-heritage-charcoal font-medium">
              {attributes.shelfLifeDays} Days
            </div>
          </div>
        )}

        {attributes.refrigerationRequired !== undefined && (
          <div>
            <div className="text-heritage-muted mb-1">Refrigeration</div>
            <div className="text-heritage-charcoal font-medium">
              {attributes.refrigerationRequired ? 'Recommended' : 'Not Required'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MakhanaAttributesCard({
  attributes,
}: {
  attributes: Partial<MakhanaAttributes>;
}) {
  return (
    <div className="border-heritage-border bg-white rounded-2xl border p-5 shadow-none">
      <h3 className="text-heritage-charcoal flex items-center gap-2 font-serif text-sm font-semibold tracking-wide">
        <Utensils className="text-heritage-saffron h-4 w-4" />
        <span>Roasting & Seasoning Specifications</span>
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
        {attributes.roastType && (
          <div>
            <div className="text-heritage-muted mb-1">Roasting Style</div>
            <div className="text-heritage-charcoal font-medium">
              {attributes.roastType}
            </div>
          </div>
        )}

        {attributes.flavor && (
          <div>
            <div className="text-heritage-muted mb-1">Seasoning Flavor</div>
            <div className="text-heritage-charcoal font-medium">{attributes.flavor}</div>
          </div>
        )}

        {attributes.sizeGrade && (
          <div>
            <div className="text-heritage-muted mb-1">Grade Size</div>
            <div className="text-heritage-charcoal font-medium">
              {attributes.sizeGrade}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GenericAttributesCard({ attributes }: { attributes: Record<string, unknown> }) {
  return (
    <div className="border-heritage-border bg-white rounded-2xl border p-5 shadow-none">
      <h3 className="text-heritage-charcoal font-serif text-sm font-semibold tracking-wide">
        Product Specifications
      </h3>

      <dl className="mt-4 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
        {Object.entries(attributes).map(([key, value]) => (
          <div key={key}>
            <dt className="text-heritage-muted capitalize">
              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </dt>
            <dd className="text-heritage-charcoal mt-0.5 font-medium">{String(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function FoodRegulatoryCard({ foodAttributes }: { foodAttributes: FoodAttributes }) {
  return (
    <div className="border-heritage-border bg-white space-y-4 rounded-2xl border p-5 shadow-none">
      <div className="border-heritage-border/60 flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="vegetarian">100% Pure Vegetarian</Badge>
          <span className="text-heritage-charcoal text-xs font-semibold">
            FSSAI Reg. No. {foodAttributes.fssaiLicenseNumber}
          </span>
        </div>
        {foodAttributes.shelfLife && (
          <span className="text-heritage-muted text-xs">
            Shelf Life:{' '}
            <strong className="text-heritage-charcoal font-medium">
              {foodAttributes.shelfLife}
            </strong>
          </span>
        )}
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <span className="text-heritage-charcoal font-semibold">Ingredients: </span>
          <span className="text-heritage-muted">
            {foodAttributes.ingredients.join(', ')}
          </span>
        </div>

        {foodAttributes.allergens && foodAttributes.allergens.length > 0 && (
          <div>
            <span className="text-heritage-charcoal font-semibold">
              Allergen Advice:{' '}
            </span>
            <span className="text-amber-800">{foodAttributes.allergens.join(', ')}</span>
          </div>
        )}

        {foodAttributes.storage && (
          <div>
            <span className="text-heritage-charcoal font-semibold">Storage: </span>
            <span className="text-heritage-muted">{foodAttributes.storage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
