import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { useTranslation } from 'react-i18next';
import { FiUpload, FiDownload, FiTrash2, FiFile, FiImage, FiFileText } from 'react-icons/fi';
import { getRequiredDocuments } from '../services/documents';

const Documents = () => {
  const { tripId } = useParams();
  const { trips, currentTrip, updateTrip } = useItinerary();
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [requiredDocs, setRequiredDocs] = useState([]);

  const trip = tripId ? trips.find(t => t.id === tripId) : currentTrip;
  const documents = trip?.documents || [];

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      const docs = await getRequiredDocuments(trip);
      if (mounted) setRequiredDocs(docs);
    };
    if (trip) run();
    return () => { mounted = false; };
  }, [trip]);

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <FiImage className="text-blue-500" size={24} />;
    } else if (fileType === 'application/pdf') {
      return <FiFileText className="text-red-500" size={24} />;
    }
    return <FiFile className="text-gray-500" size={24} />;
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      // In a real app, you would upload files to a server here
      // For this example, we'll create mock file objects
      const newDocuments = await Promise.all(
        files.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: file.type,
                size: file.size,
                uploadedAt: new Date().toISOString(),
                // In a real app, you would store the file URL or path here
                // For this example, we'll store a data URL
                url: e.target.result
              });
            };
            reader.readAsDataURL(file);
          });
        })
      );

      updateTrip(tripId, {
        documents: [...documents, ...newDocuments]
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      // Show error message to user
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const deleteDocument = (id) => {
    if (window.confirm(t('documents.confirmDelete'))) {
      updateTrip(tripId, {
        documents: documents.filter(doc => doc.id !== id)
      });
    }
  };

  const downloadDocument = (document) => {
    // In a real app, you would download the file from the server
    // For this example, we'll create a temporary link to download the data URL
    const link = document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!trip) {
    return <div className="p-6 text-center">{t('common.tripNotFound')}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('documents.title')} - {trip.destination}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('documents.subtitle')}
        </p>
      </div>

      {requiredDocs.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
            <ul className="space-y-2">
              {requiredDocs.map((d, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <span className="text-sm">{d.name}</span>
                  {d.required ? (
                    <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Required</span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">Optional</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <FiUpload className="text-gray-400 text-4xl mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {t('documents.uploadPrompt')}
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              multiple
              disabled={uploading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? t('common.uploading') : t('documents.selectFiles')}
            </button>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {t('documents.supportedFormats')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {t('documents.uploadedFiles')} ({documents.length})
          </h2>
          
          {documents.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {t('documents.noDocuments')}
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {getFileIcon(doc.type)}
                    </div>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(doc.uploadedAt).toLocaleDateString()} •{' '}
                        {(doc.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadDocument(doc)}
                      className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title={t('common.download')}
                    >
                      <FiDownload size={20} />
                    </button>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title={t('common.delete')}
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;
