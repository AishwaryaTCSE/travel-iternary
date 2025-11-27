import React from 'react';
import { FiFolder, FiSearch } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import DocumentCard from './DocumentCard';

const DocumentList = ({ 
  documents, 
  onView, 
  onDownload, 
  onDelete, 
  onSearch,
  searchQuery = '',
  onSearchChange,
  categories = [],
  selectedCategory = 'all',
  onCategoryChange,
  isLoading = false
}) => {
  const { t } = useTranslation();

  const filteredDocuments = documents
    .filter(doc => 
      selectedCategory === 'all' || doc.category === selectedCategory
    )
    .filter(doc => 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags?.some(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('documents.searchPlaceholder')}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-3 py-1 text-sm rounded-full ${
              selectedCategory === 'all'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('common.all')}
          </button>
          
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => onCategoryChange(category.value)}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                selectedCategory === category.value
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onView={onView}
              onDownload={onDownload}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FiFolder className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {t('documents.noDocuments')}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery || selectedCategory !== 'all'
              ? t('documents.noMatchingDocuments')
              : t('documents.getStarted')}
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentList;