import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const spinnerVariants = cva(
  "animate-spin rounded-full border-4 border-solid border-current border-r-transparent",
  {
    variants: {
      size: {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-3",
        lg: "h-12 w-12 border-4",
        xl: "h-16 w-16 border-4",
      },
      color: {
        primary: "text-primary-500",
        secondary: "text-secondary-500",
        white: "text-white",
        neutral: "text-neutral-500",
      },
    },
    defaultVariants: {
      size: "md",
      color: "primary",
    },
  }
);

export interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size, 
  color, 
  className 
}) => {
  return (
    <div
      className={spinnerVariants({ size, color, className })}
      role="status"
      aria-label="Chargement en cours"
    >
      <span className="sr-only">Chargement...</span>
    </div>
  );
};

export { LoadingSpinner }; 