/* eslint-disable react/button-has-type */
import React from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  primary?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  quaternary?: boolean;
  light?: boolean;
  loading?: boolean;
  danger?: boolean;
}

// Fluent UI style button variants with gradient glass effect
const variants = {
  primary: `
    bg-gold/80 hover:bg-gold/90 active:bg-gold/95
    text-white/90 hover:text-white
    backdrop-blur-xl
    border border-white/20
    shadow-[inset_0_1px_0px_rgba(255,255,255,0.18)]
    dark:bg-gold/80 dark:hover:bg-gold/90
  `,
  secondary: `
    bg-red/80 hover:bg-red/90 active:bg-red/95
    text-white/90 hover:text-white
    backdrop-blur-xl
    border border-white/20
    shadow-[inset_0_1px_0px_rgba(255,255,255,0.18)]
    dark:bg-red/80 dark:hover:bg-red/90
  `,
  tertiary: `
    bg-grey-500/10 hover:bg-grey-500/20 active:bg-grey-500/30
    text-grey-100 dark:text-grey-100
    backdrop-blur-xl
    border border-white/20
    shadow-[inset_0_1px_0px_rgba(255,255,255,0.18)]
    dark:bg-grey-700/20 dark:hover:bg-grey-700/30
  `,
  quaternary: `
    bg-orange/80 hover:bg-orange/90 active:bg-orange/95
    text-white/90 hover:text-white
    backdrop-blur-xl
    border border-white/20
    shadow-[inset_0_1px_0px_rgba(255,255,255,0.18)]
    dark:bg-orange/80 dark:hover:bg-orange/90
  `
};

// Fluent UI style sizes updated to match config
const sizes = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-small',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-2 text-base',
  xl: 'px-6 py-3 text-md'
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  type = 'button',
  primary,
  secondary,
  tertiary,
  quaternary,
  size = 'md',
  disabled,
  loading,
  ...props
}) => {
  // Determine which variant to use
  let variant = variants.tertiary; // default
  if (primary) variant = variants.primary;
  if (secondary) variant = variants.secondary;
  if (tertiary) variant = variants.tertiary;
  if (quaternary) variant = variants.quaternary;

  return (
    <button
      className={classNames(
        // Base styles
        'inline-flex items-center justify-center rounded-md font-medium',
        'transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'relative overflow-hidden',
        'backdrop-saturate-150 backdrop-filter',
        // Variant styles
        variant,
        // Size styles
        sizes[size],
        // Additional classes
        className || ''
      )}
      type={type}
      disabled={disabled || loading}
      {...props}
    >
      {/* Glass shine effect */}
      <span 
        className="absolute inset-0 overflow-hidden rounded-md"
        aria-hidden="true"
      >
        <span className="absolute inset-0 rounded-md bg-gradient-to-b from-white/[0.12] to-transparent" />
      </span>

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
      </span>
    </button>
  );
};

export default Button;