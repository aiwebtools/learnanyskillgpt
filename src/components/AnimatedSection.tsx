
import React from 'react';
import { cn } from '@/lib/utils';

type AnimationVariant = 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'fade-in-left' | 'fade-in-right' | 'scale-in';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: AnimationVariant;
  delay?: number;
  threshold?: number;
  once?: boolean;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('opacity-100', className)}>
      {children}
    </div>
  );
};

export default AnimatedSection;
