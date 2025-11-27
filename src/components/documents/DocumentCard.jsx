import React from 'react';
import { FiFile, FiDownload, FiTrash2, FiEye } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const DocumentCard = ({ document, onView, onDownload, onDelete, isOwner = true }) => {
  const { t } = useTranslation();
  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('word')) return '📝';
    return '📎';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        <div className="text-3xl">
          {getFileIcon(document.type)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
            {document.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(document.uploadedAt).toLocaleDateString()} • {formatFileSize(document.size)}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {document.tags?.map((tag, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onView(document)}
            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            title={t('documents.view')}
          >
            <FiEye size={18} />
          </button>
          <button
            onClick={() => onDownload(document)}
            className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
            title={t('documents.download')}
          >
            <FiDownload size={18} />
          </button>
          {isOwner && (
            <button
              onClick={() => onDelete(document.id)}
              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
              title={t('common.delete')}
            >
              <FiTrash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default DocumentCard;