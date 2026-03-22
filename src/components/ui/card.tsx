import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'metric' | 'highlighted';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseStyles = 'rounded-lg border transition-all duration-200';

    const variantStyles = {
      default: 'bg-[#12121a] border-[#2a2a3d] hover:border-[#3a3a4d]',
      metric: 'bg-[#12121a] border-[#2a2a3d] hover:bg-[#1a1a26] hover:border-[#6366f1]/30 hover:shadow-lg hover:shadow-[#6366f1]/10',
      highlighted: 'bg-[#1a1a26] border-[#6366f1]/30 shadow-lg shadow-[#6366f1]/10',
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className || ''}`}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
