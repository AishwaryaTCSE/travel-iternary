// src/components/ui/Dropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'react-feather';
import clsx from 'clsx';

const Dropdown = ({
  button,
  children,
  position = 'left',
  className = '',
  dropdownClassName = '',
  isOpen: isOpenProp,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
      onOpenChange?.(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpenProp !== undefined) {
      setIsOpen(isOpenProp);
    }
  }, [isOpenProp]);

  const toggleDropdown = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenChange?.(newState);
  };

  const positionClasses = {
    left: 'right-0',
    right: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
  };

  return (
    <div className={clsx('relative', className)} ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        {button}
      </div>
      {isOpen && (
        <div
          className={clsx(
            'absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5',
            positionClasses[position],
            dropdownClassName
          )}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {React.Children.map(children, (child) =>
              React.cloneElement(child, {
                onClick: (e) => {
                  child.props.onClick?.(e);
                  setIsOpen(false);
                  onOpenChange?.(false);
                },
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ children, className = '', ...props }) => {
  return (
    <div
      className={clsx(
        'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer',
        className
      )}
      role="menuitem"
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownDivider = () => {
  return <div className="border-t border-gray-200 dark:border-gray-700 my-1" />;
};

Dropdown.Item = DropdownItem;
Dropdown.Divider = DropdownDivider;

export default Dropdown;