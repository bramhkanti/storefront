import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none';

    const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary:
        'bg-heritage-maroon text-white hover:bg-heritage-maroon-dark focus-visible:outline-heritage-maroon shadow-sm active:scale-[0.99]',
      secondary:
        'bg-heritage-cream-dark text-heritage-charcoal hover:bg-heritage-border border border-heritage-border focus-visible:outline-heritage-charcoal',
      outline:
        'border border-heritage-maroon text-heritage-maroon hover:bg-heritage-maroon hover:text-white focus-visible:outline-heritage-maroon',
      ghost:
        'text-heritage-charcoal hover:bg-heritage-cream-dark focus-visible:outline-heritage-charcoal',
      link: 'text-heritage-maroon underline-offset-4 hover:underline focus-visible:outline-heritage-maroon p-0 h-auto',
    };

    const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'min-h-8 px-3 text-xs gap-1.5',
      md: 'min-h-10 px-4 text-sm gap-2',
      lg: 'min-h-12 px-6 text-base gap-2.5',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
