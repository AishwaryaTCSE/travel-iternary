// src/components/ui/Avatar.jsx
import React from 'react';
import clsx from 'clsx';

const Avatar = ({
  src,
  alt = 'Avatar',
  size = 'md',
  className = '',
  fallback = null,
  ...props
}) => {
  const [imgError, setImgError] = React.useState(false);

  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-24 w-24 text-2xl',
  };

  const handleError = () => {
    setImgError(true);
  };

  if ((!src || imgError) && !fallback) {
    return (
      <span
        className={clsx(
          'inline-flex items-center justify-center rounded-full bg-gray-500 text-white',
          sizes[size],
          className
        )}
        {...props}
      >
        {alt
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()}
      </span>
    );
  }

  if ((!src || imgError) && fallback) {
    return <div className={clsx(sizes[size], className)}>{fallback}</div>;
  }

  return (
    <img
      className={clsx('rounded-full', sizes[size], className)}
      src={src}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
};

export default Avatar;