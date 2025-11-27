// src/components/ui/Toast.jsx
import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';

const iconTypes = {
  success: {
    icon: <CheckCircle className="h-5 w-5 text-green-400" />,
    color: 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200',
  },
  error: {
    icon: <XCircle className="h-5 w-5 text-red-400" />,
    color: 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200',
  },
  warning: {
    icon: <AlertCircle className="h-5 w-5 text-yellow-400" />,
    color: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
  },
  info: {
    icon: <Info className="h-5 w-5 text-blue-400" />,
    color: 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
  },
};

const Toast = ({ message, type = 'info', onDismiss, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(), 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const { icon, color } = iconTypes[type] || iconTypes.info;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className={`rounded-md p-4 ${color} shadow-lg`}
        >
          <div className="flex">
            <div className="flex-shrink-0">{icon}</div>
            <div className="ml-3">
              <p className="text-sm font-medium">{message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => onDismiss(), 300);
                }}
                className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;