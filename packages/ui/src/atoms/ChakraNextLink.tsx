import Link from 'next/link';
import { AnchorHTMLAttributes, ReactNode } from 'react';

export type ChakraNextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string;
  isExternal?: boolean;
  children?: ReactNode;
};

export function ChakraNextLink({
  href = '',
  isExternal,
  children,
  className,
  onClick,
  ...props
}: ChakraNextLinkProps) {
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick} {...props}>
      {children}
    </Link>
  );
}
