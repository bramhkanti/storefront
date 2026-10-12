import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Mobile (< sm:): Bottom sheet docked at the bottom with rounded top and slide-up animation
        'border-heritage-border bg-heritage-cream fixed right-0 bottom-0 left-0 z-50 flex max-h-[90vh] w-full flex-col overflow-y-auto rounded-t-3xl border-x-0 border-t border-b-0 p-6 shadow-2xl focus:outline-none',
        // Desktop (sm:): Centered modal dialog with rounded corners and scale-in animation
        'sm:top-[50%] sm:right-auto sm:bottom-auto sm:left-[50%] sm:max-h-[85vh] sm:w-full sm:max-w-lg sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-2xl sm:border sm:p-8',
        'data-[state=open]:sheet-animate-bottom sm:data-[state=open]:animate-in sm:data-[state=closed]:animate-out sm:data-[state=open]:fade-in-0 sm:data-[state=closed]:fade-out-0 sm:data-[state=open]:zoom-in-95 sm:data-[state=closed]:zoom-out-95',
        className,
      )}
      {...props}
    >
      {/* Mobile Drag Handle Indicator */}
      <div
        className="bg-heritage-border/90 mx-auto -mt-1 mb-3 h-1.5 w-12 shrink-0 rounded-full sm:hidden"
        aria-hidden="true"
      />
      {children}
      <DialogPrimitive.Close className="text-heritage-muted focus:ring-heritage-maroon absolute top-4 right-4 rounded-xs p-1 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:outline-hidden">
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

export const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-heritage-charcoal text-lg font-semibold', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-heritage-muted text-sm', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
