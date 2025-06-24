import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  "w-full border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-neutral-400",
  {
    variants: {
      variant: {
        default: "border-neutral-300 bg-white focus:border-primary-500 focus:ring-primary-500/20 hover:border-neutral-400",
        error: "border-error-500 bg-white focus:border-error-500 focus:ring-error-500/20",
        success: "border-success-500 bg-white focus:border-success-500 focus:ring-success-500/20",
      },
      inputSize: {
        sm: "px-3 py-2 text-sm rounded-xl",
        md: "px-3 py-2 text-sm rounded-xl",
        lg: "px-4 py-3 text-base rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  success?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, label, error, success, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={inputVariants({ 
            variant: error ? 'error' : success ? 'success' : variant, 
            inputSize, 
            className 
          })}
          {...props}
        />
        {error && (
          <p className="text-sm text-error-600">{error}</p>
        )}
        {success && !error && (
          <p className="text-sm text-success-600">{success}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants }; 