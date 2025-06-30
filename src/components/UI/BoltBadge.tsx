import React from 'react';

interface BoltBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'white' | 'black';
}

const BoltBadge: React.FC<BoltBadgeProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'black'
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  return (
    <a
      href="https://bolt.new"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block transition-transform duration-200 hover:scale-110 ${sizeClasses[size]} ${className}`}
      title="Powered by Bolt.new"
    >
      <img 
        src="/src/assets/black_circle_360x360 copy.png" 
        alt="Powered by Bolt.new" 
        className="w-full h-full object-contain"
      />
    </a>
  );
};

export default BoltBadge;