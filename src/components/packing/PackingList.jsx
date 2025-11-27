// src/components/packing/PackingList.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import PackingItem from './PackingItem';
import PackingCategory from './PackingCategory';
import { generatePackingList } from '../../utils/packingUtils';

const PackingList = ({ tripDetails, onUpdate }) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    if (tripDetails) {
      const generatedList = generatePackingList(tripDetails);
      setCategories(generatedList);
    }
  }, [tripDetails]);

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      items: []
    };
    
    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setIsAddingCategory(false);
    onUpdate?.([...categories, newCategory]);
  };

  const updateCategory = (categoryId, updates) => {
    const updatedCategories = categories.map(cat => 
      cat.id === categoryId ? { ...cat, ...updates } : cat
    );
    setCategories(updatedCategories);
    onUpdate?.(updatedCategories);
  };

  const deleteCategory = (categoryId) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(updatedCategories);
    onUpdate?.(updatedCategories);
  };

  const addItem = (categoryId, item) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: [...cat.items, { ...item, id: Date.now().toString() }]
        };
      }
      return cat;
    });
    setCategories(updatedCategories);
    onUpdate?.(updatedCategories);
  };

  const updateItem = (categoryId, itemId, updates) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map(item => 
            item.id === itemId ? { ...item, ...updates } : item
          )
        };
      }
      return cat;
    });
    setCategories(updatedCategories);
    onUpdate?.(updatedCategories);
  };

  const deleteItem = (categoryId, itemId) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.filter(item => item.id !== itemId)
        };
      }
      return cat;
    });
    setCategories(updatedCategories);
    onUpdate?.(updatedCategories);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('packing.packingList')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsAddingCategory(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="mr-1" size={14} />
            {t('packing.addCategory')}
          </button>
          <button
            onClick={() => {
              const generatedList = generatePackingList(tripDetails);
              setCategories(generatedList);
              onUpdate?.(generatedList);
            }}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('packing.regenerate')}
          </button>
        </div>
      </div>

      {isAddingCategory && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder={t('packing.categoryName')}
              className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              autoFocus
            />
            <button
              onClick={addCategory}
              disabled={!newCategoryName.trim()}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <FiCheck size={18} />
            </button>
            <button
              onClick={() => {
                setIsAddingCategory(false);
                setNewCategoryName('');
              }}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {categories.map((category) => (
          <PackingCategory
            key={category.id}
            category={category}
            onUpdate={updateCategory}
            onDelete={deleteCategory}
            onAddItem={addItem}
            onUpdateItem={updateItem}
            onDeleteItem={deleteItem}
          />
        ))}

        {categories.length === 0 && !isAddingCategory && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>{t('packing.noCategories')}</p>
            <button
              onClick={() => setIsAddingCategory(true)}
              className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {t('packing.createFirstCategory')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackingList;