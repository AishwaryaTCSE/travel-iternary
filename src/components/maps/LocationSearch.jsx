// src/components/maps/LocationSearch.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiMapPin } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const LocationSearch = ({
  onSelectLocation,
  placeholder = 'Search for a location...',
  className = '',
  value = '',
  clearOnSelect = true,
  autoFocus = false
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    const location = {
      name: suggestion.display_name.split(',')[0],
      address: suggestion.display_name,
      position: [parseFloat(suggestion.lat), parseFloat(suggestion.lon)],
      boundingBox: suggestion.boundingbox,
      type: suggestion.type,
      importance: parseFloat(suggestion.importance)
    };

    if (clearOnSelect) {
      setQuery('');
      setSuggestions([]);
    } else {
      setQuery(suggestion.display_name);
    }

    onSelectLocation(location);
    inputRef.current?.focus();
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            autoComplete="off"
            autoFocus={autoFocus}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FiX className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="mt-2 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? t('common.searching') : t('common.search')}
        </button>
      </form>

      {suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.place_id}-${index}`}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-start"
            >
              <FiMapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {suggestion.display_name.split(',')[0]}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {suggestion.display_name.split(',').slice(1).join(',').trim()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;