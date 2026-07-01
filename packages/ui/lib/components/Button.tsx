import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../utils';

export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
} & ComponentPropsWithoutRef<'button'>;

export function Button({ variant = 'primary', className, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'py-1 px-4 rounded shadow transition-all',
        {
          // Primary variant
          'bg-accent hover:bg-accent-dark text-white hover:scale-105': variant === 'primary' && !disabled,
          'bg-gray-400 text-gray-600 cursor-not-allowed': variant === 'primary' && disabled,

          // Secondary variant
          'bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500 text-gray-800 dark:text-gray-200 hover:scale-105':
            variant === 'secondary' && !disabled,
          'bg-gray-100 text-gray-400 cursor-not-allowed': variant === 'secondary' && disabled,

          // Danger variant
          'bg-red-600 bg-opacity-80 hover:bg-red-700 hover:bg-opacity-90 text-white hover:scale-105':
            variant === 'danger' && !disabled,
          'bg-red-300 bg-opacity-80 text-red-100 cursor-not-allowed': variant === 'danger' && disabled,
        },
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
