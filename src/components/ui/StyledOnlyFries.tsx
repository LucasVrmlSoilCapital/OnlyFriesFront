import React from 'react';

export interface StyledOnlyFriesProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export const StyledOnlyFries: React.FC<StyledOnlyFriesProps> = ({ 
  size = 'md', 
  className = '',
  animated = true 
}) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl', 
    lg: 'text-4xl',
    xl: 'text-6xl'
  };

  return (
    <span className={`
      inline-block font-black 
      text-secondary-400
      drop-shadow-lg
      ${animated ? 'hover:scale-105 hover:text-primary-400 transform transition-all duration-300 ease-out' : ''}
      ${sizeClasses[size]}
      ${className}
    `}>
      ✨ Only Fries ✨
    </span>
  );
}; 