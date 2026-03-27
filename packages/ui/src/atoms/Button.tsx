import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'default' | 'outline' | 'destructive' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'default' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    'bg-primary text-white shadow hover:bg-primary/90',
  outline:
    'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
  destructive:
    'bg-destructive text-white shadow-sm hover:bg-destructive/90',
  ghost:
    'hover:bg-accent hover:text-accent-foreground',
  link:
    'text-primary underline-offset-4 hover:underline',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 rounded-md px-3 text-xs',
  default: 'h-9 rounded-md px-4 py-2 text-sm',
  lg: 'h-10 rounded-md px-6 py-2 text-base',
  icon: 'h-9 w-9 rounded-md',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'default',
      size = 'default',
      isLoading = false,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {isLoading && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
