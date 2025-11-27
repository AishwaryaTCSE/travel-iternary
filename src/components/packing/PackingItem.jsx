// src/components/packing/PackingItem.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';

const PackingItem = ({ item, onUpdate, onDelete }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [itemData, setItemData] = useState({
    name: item.name,
    quantity: item.quantity,
    notes: item.notes || ''
  });

  const handleUpdate = () => {
    onUpdate({
      ...item,
      ...itemData,
      quantity: parseInt(itemData.quantity) || 1
    });
    setIsEditing(false);
  };

  const togglePacked = () => {
    onUpdate({
      ...item,
      isPacked: !item.isPacked
    });
  };

  if (isEditing) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md flex items-center space-x-3">
        <input
          type="checkbox"
          checked={item.isPacked}
          onChange={togglePacked}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <div className="flex-1 grid grid-cols-12 gap-2 items-center">
          <input
            type="text"
            value={itemData.name}
            onChange={(e) => setItemData({ ...itemData, name: e.target.value })}
            className="col-span-5 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
          />
          <input
            type="number"
            min="1"
            value={itemData.quantity}
            onChange={(e) => setItemData({ ...itemData, quantity: e.target.value })}
            className="col-span-2 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
          />
          <input
            type="text"
            value={itemData.notes}
            onChange={(e) => setItemData({ ...itemData, notes: e.target.value })}
            placeholder={t('packing.notes')}
            className="col-span-5 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
          />
        </div>
        <div className="flex space-x-1">
          <button
            onClick={handleUpdate}
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1"
          >
            <FiCheck size={18} />
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setItemData({
                name: item.name,
                quantity: item.quantity,
                notes: item.notes || ''
              });
            }}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 p-3 rounded-md border ${item.isPacked ? 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700'} flex items-center space-x-3`}>
      <input
        type="checkbox"
        checked={item.isPacked}
        onChange={togglePacked}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className={`font-medium ${item.isPacked ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
            {item.name}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            {item.quantity > 1 ? `×${item.quantity}` : ''}
          </span>
        </div>
        {item.notes && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {item.notes}
          </p>
        )}
      </div>
      <div className="flex space-x-1">
        <button
          onClick={() => {
            setItemData({
              name: item.name,
              quantity: item.quantity,
              notes: item.notes || ''
            });
            setIsEditing(true);
          }}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"
        >
          <FiEdit2 size={16} />
        </button>
        <button
          onClick={() => {
            if (window.confirm(t('packing.confirmDeleteItem'))) {
              onDelete();
            }
          }}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default PackingItem;