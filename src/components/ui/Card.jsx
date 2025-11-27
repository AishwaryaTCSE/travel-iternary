// src/components/ui/Card.jsx
import React from 'react';
import clsx from 'clsx';

const Card = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

const CardHeader = ({ className, children, ...props }) => (
  <div
    className={clsx(
      'px-6 py-4 border-b border-gray-200 dark:border-gray-700',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const CardTitle = ({ className, children, ...props }) => (
  <h3
    className={clsx(
      'text-lg font-medium text-gray-900 dark:text-white',
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

const CardDescription = ({ className, children, ...props }) => (
  <p
    className={clsx(
      'mt-1 text-sm text-gray-500 dark:text-gray-400',
      className
    )}
    {...props}
  >
    {children}
  </p>
);

const CardContent = ({ className, children, ...props }) => (
  <div className={clsx('p-6', className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ className, children, ...props }) => (
  <div
    className={clsx(
      'px-6 py-4 border-t border-gray-200 dark:border-gray-700',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;