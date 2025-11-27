import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiX, FiFilePlus } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const DocumentUpload = ({ onUpload, tripId, isLoading = false }) => {
  const { t } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('general');

  const onDrop = useCallback((acceptedFiles) => {
    const filesWithPreview = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setSelectedFiles(prev => [...prev, ...filesWithPreview]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;
    
    const documents = selectedFiles.map(file => ({
      file: file.file,
      name: file.name,
      type: file.type,
      size: file.size,
      tripId,
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    }));

    onUpload(documents);
    setSelectedFiles([]);
    setTags('');
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 hover:border-blue-400 dark:border-gray-600 dark:hover:border-blue-500'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <FiUpload className="w-10 h-10 text-gray-400" />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {isDragActive
              ? t('documents.dropHere')
              : t('documents.dragAndDrop')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('documents.supportedFormats')} PDF, JPG, PNG, DOC, DOCX (max 10MB)
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('documents.category')}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="general">{t('documents.categories.general')}</option>
              <option value="tickets">{t('documents.categories.tickets')}</option>
              <option value="accommodation">{t('documents.categories.accommodation')}</option>
              <option value="reservations">{t('documents.categories.reservations')}</option>
              <option value="passport">{t('documents.categories.passport')}</option>
              <option value="insurance">{t('documents.categories.insurance')}</option>
              <option value="other">{t('documents.categories.other')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('documents.tags')} <span className="text-xs text-gray-500">({t('common.optional')})</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder={t('documents.tagsPlaceholder')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('documents.selectedFiles')} ({selectedFiles.length})
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-md p-2 text-sm"
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <FiFile className="flex-shrink-0 text-gray-400" />
                    <span className="truncate">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading
                ? 'bg-blue-400'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {t('common.uploading')}...
              </>
            ) : (
              <>
                <FiFilePlus className="mr-2" size={16} />
                {t('documents.uploadFiles')} ({selectedFiles.length})
              </>
            )}
          </button>
        </div>
      )}
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

export default DocumentUpload;