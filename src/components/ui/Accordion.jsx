// src/components/ui/Accordion.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import clsx from 'clsx';

const Accordion = ({
  items,
  multiple = false,
  defaultOpenIndex = null,
  className = '',
}) => {
  const [openItems, setOpenItems] = useState(
    defaultOpenIndex !== null ? [defaultOpenIndex] : []
  );

  const handleItemClick = (index) => {
    if (multiple) {
      setOpenItems((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenItems((prev) =>
        prev.includes(index) ? [] : [index]
      );
    }
  };

  return (
    <div className={clsx('space-y-2', className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={clsx(
            'border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden',
            item.className
          )}
        >
          <button
            type="button"
            className="w-full px-4 py-3 text-left flex items-center justify-between focus:outline-none"
            onClick={() => handleItemClick(index)}
            aria-expanded={openItems.includes(index)}
            aria-controls={`accordion-panel-${index}`}
          >
            <span className="font-medium text-gray-900 dark:text-white">
              {item.title}
            </span>
            {openItems.includes(index) ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          <div
            id={`accordion-panel-${index}`}
            className={clsx(
              'px-4 pb-4',
              !openItems.includes(index) && 'hidden'
            )}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;