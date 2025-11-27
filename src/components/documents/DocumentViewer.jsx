import React from 'react';
import { FiX, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const DocumentViewer = ({ document, onClose, onNext, onPrevious, hasNext, hasPrevious }) => {
  const { t } = useTranslation();

  if (!document) return null;

  const isImage = document.type.startsWith('image/');
  const isPDF = document.type === 'application/pdf';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start justify-between">
              <div className="text-center sm:mt-0 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                  {document.name}
                </h3>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(document.uploadedAt).toLocaleDateString()} • {formatFileSize(document.size)}
                </div>
              </div>
              <div className="flex space-x-2">
                <a
                  href={document.url}
                  download={document.name}
                  className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  title={t('documents.download')}
                >
                  <FiDownload size={20} />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex justify-center">
                {isImage ? (
                  <img 
                    src={document.url} 
                    alt={document.name} 
                    className="max-h-[70vh] max-w-full object-contain"
                  />
                ) : isPDF ? (
                  <iframe 
                    src={document.url} 
                    title={document.name}
                    className="w-full h-[70vh] border-0"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="text-5xl mb-4">📄</div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('documents.previewNotAvailable')}
                    </p>
                    <a
                      href={document.url}
                      download={document.name}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiDownload className="mr-2" />
                      {t('documents.downloadFile')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {(hasPrevious || hasNext) && (
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 flex justify-between">
              <button
                type="button"
                onClick={onPrevious}
                disabled={!hasPrevious}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  hasPrevious
                    ? 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                }`}
              >
                <FiChevronLeft className="mr-1" size={20} />
                {t('common.previous')}
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={!hasNext}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  hasNext
                    ? 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                }`}
              >
                {t('common.next')}
                <FiChevronRight className="ml-1" size={20} />
              </button>
            </div>
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

export default DocumentViewer;