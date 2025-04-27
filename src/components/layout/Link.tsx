import { ReactNode } from 'react';

interface LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function Link({ href, children, className = '' }: LinkProps) {
  return (
    <a
      href={href}
      className={`text-white hover:text-slate-200 transition-colors ${className}`}
    >
      {children}
    </a>
  );
}