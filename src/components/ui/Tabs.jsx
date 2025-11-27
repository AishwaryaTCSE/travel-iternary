// src/components/ui/Tabs.jsx
import React, { useState, Children, cloneElement } from 'react';
import clsx from 'clsx';

const Tabs = ({
  children,
  defaultActiveTab = 0,
  variant = 'default',
  className = '',
  fullWidth = false,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  const tabs = Children.toArray(children).filter(
    (child) => child.type === Tabs.List
  );
  const panels = Children.toArray(children).filter(
    (child) => child.type === Tabs.Panel
  );

  const handleTabChange = (index) => {
    setActiveTab(index);
    onChange?.(index);
  };

  const variants = {
    default: 'border-b border-gray-200 dark:border-gray-700',
    pills: 'space-x-2',
    underline: 'border-b border-gray-200 dark:border-gray-700',
  };

  return (
    <div className={className}>
      <div
        className={clsx(
          'flex',
          variants[variant],
          fullWidth && 'w-full',
          variant === 'pills' && 'mb-4'
        )}
      >
        {tabs.map((tab, index) =>
          cloneElement(tab, {
            key: index,
            isActive: activeTab === index,
            onClick: () => handleTabChange(index),
            variant,
            fullWidth,
          })
        )}
      </div>
      <div className="mt-4">
        {panels.map((panel, index) =>
          cloneElement(panel, {
            key: index,
            isActive: activeTab === index,
          })
        )}
      </div>
    </div>
  );
};

const Tab = ({
  children,
  isActive,
  onClick,
  variant = 'default',
  fullWidth = false,
  className = '',
  disabled = false,
  icon: Icon,
}) => {
  const baseStyles = 'px-4 py-2 text-sm font-medium transition-colors duration-200';

  const variants = {
    default: {
      base: 'border-b-2',
      active: 'border-blue-500 text-blue-600 dark:text-blue-400',
      inactive:
        'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200',
    },
    pills: {
      base: 'rounded-md',
      active: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      inactive:
        'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
    },
    underline: {
      base: 'border-b-2 -mb-px',
      active: 'border-blue-500 text-blue-600 dark:text-blue-400',
      inactive:
        'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200',
    },
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseStyles,
        variants[variant].base,
        isActive ? variants[variant].active : variants[variant].inactive,
        fullWidth && 'flex-1 text-center',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="flex items-center justify-center space-x-2">
        {Icon && <Icon className="h-4 w-4" />}
        <span>{children}</span>
      </div>
    </button>
  );
};

const Panel = ({ children, isActive, className = '' }) => {
  if (!isActive) return null;
  return <div className={className}>{children}</div>;
};

Tabs.List = Tab;
Tabs.Panel = Panel;

export default Tabs;