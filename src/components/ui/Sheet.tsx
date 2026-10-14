import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetPortal = SheetPrimitive.Portal;

export const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300 data-[state=closed]:opacity-0 data-[state=open]:opacity-100',
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

interface SheetContentProps extends React.ComponentPropsWithoutRef<
  typeof SheetPrimitive.Content
> {
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export const SheetContent = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = 'right', className, children, ...props }, ref) => {
  const sideClasses: Record<'top' | 'bottom' | 'left' | 'right', string> = {
    top: 'inset-x-0 top-0 border-b',
    bottom:
      'sheet-animate-bottom inset-x-0 bottom-0 border-t rounded-t-3xl max-h-[92vh] overflow-y-auto',
    left: 'sheet-animate-left inset-y-0 left-0 h-full w-3/4 max-w-sm border-r',
    right: 'sheet-animate-right inset-y-0 right-0 h-full w-full sm:max-w-md border-l',
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(
          'bg-heritage-cream border-heritage-border fixed z-50 flex flex-col p-6 shadow-2xl focus:outline-hidden',
          sideClasses[side],
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="text-heritage-muted hover:text-heritage-charcoal hover:bg-heritage-cream-dark focus:ring-heritage-maroon absolute top-3.5 right-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors focus:ring-2 focus:outline-hidden">
          <X className="h-4.5 w-4.5" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
});
SheetContent.displayName = SheetPrimitive.Content.displayName;

export const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'border-heritage-border flex flex-col space-y-2 border-b pb-4 text-left',
      className,
    )}
    {...props}
  />
);
SheetHeader.displayName = 'SheetHeader';

export const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-heritage-charcoal text-lg font-semibold', className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

export const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-heritage-muted text-sm', className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
