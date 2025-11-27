// src/components/ui/Skeleton.jsx
import React from 'react';
import clsx from 'clsx';

const Skeleton = ({
  className = '',
  variant = 'text',
  width = '100%',
  height = '1rem',
  animation = 'pulse',
  ...props
}) => {
  const baseStyles = 'bg-gray-200 dark:bg-gray-700 rounded';

  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
    none: '',
  };

  const variants = {
    text: 'h-4',
    circle: 'rounded-full',
    rectangle: '',
    rounded: 'rounded-lg',
  };

  return (
    <div
      className={clsx(
        baseStyles,
        variants[variant],
        animations[animation],
        className
      )}
      style={{ width, height, ...props.style }}
      {...props}
    />
  );
};

const SkeletonGroup = ({ count = 1, children, className = '' }) => {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>{children}</React.Fragment>
      ))}
    </div>
  );
};

Skeleton.Group = SkeletonGroup;

export default Skeleton;