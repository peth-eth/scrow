const SIZES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-3',
};

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'primary';
  className?: string;
  inline?: boolean;
};

export function Spinner({
  size = 'sm',
  variant = 'primary',
  className = '',
  inline = false,
}: SpinnerProps) {
  const borderColor =
    variant === 'light'
      ? 'border-white border-t-transparent'
      : 'border-primary border-t-transparent';

  const Tag = inline ? 'span' : 'div';

  return (
    <Tag
      className={`${inline ? 'inline-block' : ''} animate-spin rounded-full ${SIZES[size]} ${borderColor} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
