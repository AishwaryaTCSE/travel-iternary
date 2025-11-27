import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiTag } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Food & Drinks', icon: '🍔', color: '#FF6B6B' },
  { id: '2', name: 'Accommodation', icon: '🏨', color: '#4D96FF' },
  { id: '3', name: 'Transportation', icon: '🚗', color: '#6BCB77' },
  { id: '4', name: 'Activities', icon: '🎡', color: '#FFD93D' },
  { id: '5', name: 'Shopping', icon: '🛍️', color: '#A55EEA' },
  { id: '6', name: 'Sightseeing', icon: '🏛️', color: '#FF9F1C' },
  { id: '7', name: 'Health', icon: '🏥', color: '#FF6B6B' },
  { id: '8', name: 'Other', icon: '📌', color: '#A5B4C0' },
];

const COLOR_PALETTE = [
  '#FF6B6B', '#FF9F1C', '#FFD93D', '#6BCB77', 
  '#4D96FF', '#845EF7', '#F06595', '#A5B4C0'
];

const ICONS = [
  '🍔', '🍕', '🍣', '🍜', '☕', '🍷', '🍺', '🍰',
  '✈️', '🚗', '🚆', '🚕', '🚲', '🚆', '🚢', '🚠',
  '🏨', '🏠', '⛺', '🏖️', '🌴', '🏕️', '🏘️', '🏡',
  '🎡', '🎢', '🎪', '🎭', '🎨', '🎯', '🎳', '🎰',
  '🛍️', '👕', '👟', '👒', '💍', '🕶️', '👓', '👛',
  '🏛️', '🗼', '🗽', '🏟️', '🏯', '🏰', '🗿', '🎭',
  '🏥', '💊', '🌡️', '🚑', '🚨', '🩺', '💉', '🩹',
  '📌', '📎', '📝', '📋', '📅', '📌', '📍', '🔖',
];

const ExpenseCategories = ({ 
  categories: propCategories = DEFAULT_CATEGORIES, 
  onChange,
  className = ''
}) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState(propCategories);
  const [editingId, setEditingId] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', icon: '📌', color: '#A5B4C0' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    
    const categoryToAdd = {
      ...newCategory,
      id: `cat-${Date.now()}`,
      name: newCategory.name.trim(),
    };

    const updatedCategories = [...categories, categoryToAdd];
    setCategories(updatedCategories);
    onChange?.(updatedCategories);
    setNewCategory({ name: '', icon: '📌', color: '#A5B4C0' });
    setIsAdding(false);
  };

  const handleUpdateCategory = (id, updates) => {
    const updatedCategories = categories.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    );
    setCategories(updatedCategories);
    onChange?.(updatedCategories);
    setEditingId(null);
  };

  const handleDeleteCategory = (id) => {
    if (DEFAULT_CATEGORIES.some(cat => cat.id === id)) {
      // Don't allow deleting default categories
      return;
    }
    
    const updatedCategories = categories.filter(cat => cat.id !== id);
    setCategories(updatedCategories);
    onChange?.(updatedCategories);
  };

  const startEditing = (category) => {
    setEditingId(category.id);
    setNewCategory({
      name: category.name,
      icon: category.icon,
      color: category.color
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    if (isAdding) {
      setIsAdding(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {t('expenses.categories')}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t('expenses.manageCategoriesDescription')}
        </p>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="relative group p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
              style={{ borderLeftColor: category.color, borderLeftWidth: '4px' }}
            >
              {editingId === category.id ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl cursor-pointer"
                        style={{ backgroundColor: `${newCategory.color}20` }}
                        onClick={() => {
                          // Toggle through icons on click
                          const currentIndex = ICONS.indexOf(newCategory.icon);
                          const nextIndex = (currentIndex + 1) % ICONS.length;
                          setNewCategory({...newCategory, icon: ICONS[nextIndex]});
                        }}
                      >
                        {newCategory.icon}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"
                        style={{ backgroundColor: newCategory.color }}
                      />
                    </div>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-between pt-1">
                    <div className="flex space-x-1">
                      {COLOR_PALETTE.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className="w-5 h-5 rounded-full border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
                          style={{ backgroundColor: color }}
                          onClick={() => setNewCategory({...newCategory, color})}
                        />
                      ))}
                    </div>
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateCategory(category.id, newCategory)}
                        className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        title={t('common.save')}
                      >
                        <FiCheck size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        title={t('common.cancel')}
                      >
                        <FiX size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        {category.icon}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"
                        style={{ backgroundColor: category.color }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </span>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => startEditing(category)}
                      className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title={t('common.edit')}
                    >
                      <FiEdit2 size={16} />
                    </button>
                    {!DEFAULT_CATEGORIES.some(cat => cat.id === category.id) && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        title={t('common.delete')}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isAdding ? (
            <div className="p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl cursor-pointer"
                      style={{ backgroundColor: `${newCategory.color}20` }}
                      onClick={() => {
                        // Toggle through icons on click
                        const currentIndex = ICONS.indexOf(newCategory.icon);
                        const nextIndex = (currentIndex + 1) % ICONS.length;
                        setNewCategory({...newCategory, icon: ICONS[nextIndex]});
                      }}
                    >
                      {newCategory.icon}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"
                      style={{ backgroundColor: newCategory.color }}
                    />
                  </div>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    placeholder={t('expenses.categoryName')}
                    className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    autoFocus
                  />
                </div>
                <div className="flex justify-between pt-1">
                  <div className="flex space-x-1">
                    {COLOR_PALETTE.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className="w-5 h-5 rounded-full border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
                        style={{ backgroundColor: color }}
                        onClick={() => setNewCategory({...newCategory, color})}
                      />
                    ))}
                  </div>
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      disabled={!newCategory.name.trim()}
                      className={`p-1 ${newCategory.name.trim() ? 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300' : 'text-gray-400 cursor-not-allowed'}`}
                      title={t('common.add')}
                    >
                      <FiCheck size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      title={t('common.cancel')}
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setNewCategory({ name: '', icon: '📌', color: '#A5B4C0' });
                setIsAdding(true);
              }}
              className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 transition-colors duration-200"
            >
              <FiPlus className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('expenses.addCategory')}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCategories;
