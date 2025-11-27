// src/components/ui/Tooltip.jsx
import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

const Tooltip = ({
  content,
  children,
  position = 'top',
  className = '',
  delay = 300,
  disabled = false,
  interactive = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const tooltipRef = useRef(null);
  let timeout;

  const showTooltip = () => {
    if (disabled) return;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setIsMounted(true);
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeout);
    setIsVisible(false);
    // Wait for the exit animation to complete before unmounting
    setTimeout(() => {
      if (!isVisible) {
        setIsMounted(false);
      }
    }, 200);
  };

  const handleMouseEnter = () => {
    showTooltip();
  };

  const handleMouseLeave = () => {
    hideTooltip();
  };

  const handleFocus = () => {
    showTooltip();
  };

  const handleBlur = () => {
    hideTooltip();
  };

  const handleClick = () => {
    if (interactive) {
      if (!isVisible) {
        showTooltip();
      } else {
        hideTooltip();
      }
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (!React.isValidElement(children)) {
    console.warn('Tooltip children must be a valid React element');
    return children;
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 -mt-1 border-t-8 border-t-gray-900 border-r-8 border-r-transparent border-l-8 border-l-transparent',
    right:
      'right-full top-1/2 transform -translate-y-1/2 -mr-1 border-r-8 border-r-gray-900 border-t-8 border-t-transparent border-b-8 border-b-transparent',
    bottom:
      'bottom-full left-1/2 transform -translate-x-1/2 -mb-1 border-b-8 border-b-gray-900 border-r-8 border-r-transparent border-l-8 border-l-transparent',
    left: 'left-full top-1/2 transform -translate-y-1/2 -ml-1 border-l-8 border-l-gray-900 border-t-8 border-t-transparent border-b-8 border-b-transparent',
  };

  const childProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onClick: handleClick,
    'aria-describedby': isMounted ? 'tooltip' : undefined,
    tabIndex: 0,
  };

  return (
    <div className="relative inline-block" ref={tooltipRef}>
      {React.cloneElement(children, childProps)}
      {isMounted && (
        <div
          id="tooltip"
          role="tooltip"
          className={clsx(
            'absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded shadow-lg whitespace-nowrap transition-opacity duration-200',
            positionClasses[position],
            isVisible ? 'opacity-100' : 'opacity-0',
            className
          )}
          onMouseEnter={interactive ? handleMouseEnter : undefined}
          onMouseLeave={interactive ? handleMouseLeave : undefined}
        >
          {content}
          <div
            className={clsx('absolute w-0 h-0', arrowClasses[position])}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;