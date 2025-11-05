import React from 'react';

/**
 * PetVibe Heading Component
 * @param {number} level - Heading level (1, 2, or 3)
 * @param {ReactNode} children - Content
 * @param {string} className - Additional classes
 */
export function Heading({ level = 1, children, className = '' }) {
  const map = { 1: 'pv-h1', 2: 'pv-h2', 3: 'pv-h3' } as const;
  const Tag = `h${level}` as any;
  return <Tag className={`${map[level]} ${className}`}>{children}</Tag>;
}

/**
 * PetVibe Price Display Component
 * @param {number|string} value - Price value
 * @param {string} currency - Currency symbol (default: ₫)
 */
export function PriceTag({ value, currency = '₫', className = '' }) {
  return (
    <span className={`pv-price ${className}`}>
      {value.toLocaleString()}{currency}
    </span>
  );
}

/**
 * PetVibe Badge/Chip Component
 * @param {ReactNode} children - Content
 * @param {string} variant - Visual variant
 */
export function Badge({ 
  children, 
  variant = 'default',
  className = '' 
}: { 
  children: React.ReactNode; 
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}) {
  const variants = {
    default: 'bg-oldCopper-100 text-oldCopper-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`pv-badge px-2 py-1 rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

/**
 * PetVibe Body Text Component
 */
export function Body({ children, className = '' }) {
  return <p className={`pv-body ${className}`}>{children}</p>;
}

/**
 * PetVibe Small Text Component
 */
export function Small({ children, className = '' }) {
  return <span className={`pv-small ${className}`}>{children}</span>;
}

/**
 * PetVibe Accent Text (for quotes, taglines)
 */
export function AccentText({ children, className = '' }) {
  return <p className={`pv-accent-text ${className}`}>{children}</p>;
}

