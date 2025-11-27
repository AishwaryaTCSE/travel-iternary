// src/components/packing/PackingCategory.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiTrash2, FiEdit2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import PackingItem from './PackingItem';

const PackingCategory = ({ 
  category, 
  onUpdate, 
  onDelete,
  onAddItem,
  onUpdateItem,
  onDeleteItem
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [categoryName, setCategoryName] = useState(category.name);
  const [newItemName, setNewItemName] = useState('');

  const handleUpdate = () => {
    onUpdate(category.id, { name: categoryName });
    setIsEditing(false);
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    
    onAddItem(category.id, {
      name: newItemName,
      isPacked: false,
      quantity: 1,
      notes: ''
    });
    
    setNewItemName('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div 
        className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="bg-white dark:bg-gray-700 border-b border-blue-500 focus:outline-none"
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          ) : (
            <h3 className="font-medium text-gray-900 dark:text-white">
              {category.name} ({category.items.length})
            </h3>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdate();
                }}
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1"
              >
                <FiCheck size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                  setCategoryName(category.name);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
              >
                <FiX size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"
              >
                <FiEdit2 size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(t('packing.confirmDeleteCategory'))) {
                    onDelete(category.id);
                  }
                }}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
              >
                <FiTrash2 size={16} />
              </button>
              <button 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
              </button>
            </>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3">
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddItem();
                }
              }}
              placeholder={t('packing.addItemPlaceholder')}
              className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleAddItem}
              disabled={!newItemName.trim()}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <FiPlus size={18} />
            </button>
          </div>

          <div className="space-y-2">
            {category.items.map((item) => (
              <PackingItem
                key={item.id}
                item={item}
                onUpdate={(updates) => onUpdateItem(category.id, item.id, updates)}
                onDelete={() => onDeleteItem(category.id, item.id)}
              />
            ))}
            {category.items.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                {t('packing.noItemsInCategory')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PackingCategory;