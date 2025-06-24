import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500",
        secondary: "bg-cream-300 hover:bg-cream-400 text-neutral-800 focus:ring-primary-500",
        success: "bg-success-500 hover:bg-success-600 text-white focus:ring-success-500",
        error: "bg-error-500 hover:bg-error-600 text-white focus:ring-error-500",
        warning: "bg-warning-500 hover:bg-warning-600 text-white focus:ring-warning-500",
        ghost: "bg-transparent hover:bg-neutral-100 text-neutral-700 hover:text-neutral-800 focus:ring-primary-500",
        outline: "border border-primary-500 bg-transparent hover:bg-primary-50 text-primary-600 hover:text-primary-700 focus:ring-primary-500",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-xl",
        md: "h-10 px-4 text-sm rounded-xl",
        lg: "h-11 px-5 text-base rounded-2xl",
        xl: "h-12 px-6 text-lg rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants }; 