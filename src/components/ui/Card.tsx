import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  "border transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "border-neutral-200 shadow-soft",
        elevated: "border-neutral-200 shadow-medium",
        outlined: "border border-primary-200 shadow-none",
        ghost: "border-transparent shadow-none hover:bg-neutral-50",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-lg",
        md: "rounded-xl",
        lg: "rounded-2xl",
        xl: "rounded-3xl",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      rounded: "md",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, rounded, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cardVariants({ variant, padding, rounded, className })}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export { Card, cardVariants }; 