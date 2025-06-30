import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  shadow?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = true,
  shadow = 'sm'
}) => {
  const shadowClasses = {
    sm: 'shadow-sm hover:shadow-md',
    md: 'shadow-md hover:shadow-lg',
    lg: 'shadow-lg hover:shadow-xl'
  };

  const classes = `bg-white rounded-xl border border-gray-200 ${shadowClasses[shadow]} transition-shadow duration-200 ${
    padding ? 'p-6' : ''
  } ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;