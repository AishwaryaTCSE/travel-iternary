import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { useTranslation } from 'react-i18next';
import { FiMapPin, FiStar, FiClock, FiDollarSign } from 'react-icons/fi';

const Recommendations = () => {
  const { tripId } = useParams();
  const { trips } = useItinerary();
  const { t } = useTranslation();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    rating: 0,
    priceRange: [0, 4]
  });

  const trip = trips.find(t => t.id === tripId);

  // Mock categories - in a real app, these would come from your API
  const categories = [
    { id: 'all', name: t('recommendations.categories.all') },
    { id: 'attractions', name: t('recommendations.categories.attractions') },
    { id: 'restaurants', name: t('recommendations.categories.restaurants') },
    { id: 'shopping', name: t('recommendations.categories.shopping') },
    { id: 'nightlife', name: t('recommendations.categories.nightlife') },
    { id: 'outdoors', name: t('recommendations.categories.outdoors') }
  ];

  // Price range labels
  const priceLabels = [
    t('recommendations.price.free'),
    t('recommendations.price.inexpensive'),
    t('recommendations.price.moderate'),
    t('recommendations.price.expensive'),
    t('recommendations.price.luxury')
  ];

  // Mock function to fetch recommendations
  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch this from an API
      // const response = await fetch(`/api/trips/${tripId}/recommendations`);
      // const data = await response.json();
      
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      const mockRecommendations = [
        {
          id: '1',
          name: 'Eiffel Tower',
          category: 'attractions',
          rating: 4.7,
          reviewCount: 45231,
          price: 3, // 0-4 scale
          duration: '2-3 hours',
          description: 'Iconic Parisian landmark offering panoramic city views from its observation decks.',
          image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          location: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
          isSaved: false
        },
        {
          id: '2',
          name: 'Louvre Museum',
          category: 'attractions',
          rating: 4.8,
          reviewCount: 123456,
          price: 3,
          duration: '3-4 hours',
          description: "World's largest art museum and a historic monument in Paris, France.",
          image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          location: 'Rue de Rivoli, 75001 Paris, France',
          isSaved: true
        },
        {
          id: '3',
          name: 'Le Jules Verne',
          category: 'restaurants',
          rating: 4.6,
          reviewCount: 4231,
          price: 4,
          duration: '2 hours',
          description: 'Michelin-starred restaurant on the Eiffel Tower with spectacular city views.',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          location: '2nd Floor, Eiffel Tower, 75007 Paris, France',
          isSaved: false
        },
        {
          id: '4',
          name: 'Seine River Cruise',
          category: 'attractions',
          rating: 4.5,
          reviewCount: 28765,
          price: 2,
          duration: '1 hour',
          description: 'Scenic boat tour offering unique views of Parisian landmarks along the Seine.',
          image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          location: 'Port de la Bourdonnais, 75007 Paris, France',
          isSaved: false
        },
        {
          id: '5',
          name: 'Montmartre',
          category: 'outdoors',
          rating: 4.7,
          reviewCount: 35672,
          price: 0,
          duration: '2-4 hours',
          description: 'Historic district known for its artistic history, the white-domed Basilica of the Sacré-Cœur, and a cobblestone square.',
          image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          location: 'Montmartre, 75018 Paris, France',
          isSaved: true
        }
      ];

      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trip?.destination) {
      fetchRecommendations();
    }
  }, [trip?.destination]);

  const toggleSave = (id) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id ? { ...rec, isSaved: !rec.isSaved } : rec
      )
    );
  };

  const filteredRecommendations = recommendations.filter(rec => {
    // Filter by category
    if (filters.category !== 'all' && rec.category !== filters.category) {
      return false;
    }
    
    // Filter by minimum rating
    if (rec.rating < filters.rating) {
      return false;
    }
    
    // Filter by price range
    if (rec.price < filters.priceRange[0] || rec.price > filters.priceRange[1]) {
      return false;
    }
    
    return true;
  });

  if (!trip) {
    return <div className="p-6 text-center">{t('common.tripNotFound')}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('recommendations.title')} - {trip.destination}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('recommendations.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">{t('recommendations.filters')}</h2>
            
            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-medium mb-2">{t('recommendations.categories.title')}</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === category.id}
                        onChange={() => setFilters({...filters, category: category.id})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="font-medium mb-2">
                  {t('recommendations.minimumRating')}: {filters.rating > 0 ? filters.rating.toFixed(1) : t('recommendations.any')}
                </h3>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.rating}
                  onChange={(e) => setFilters({...filters, rating: parseFloat(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>0</span>
                  <span>5</span>
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="font-medium mb-2">
                  {t('recommendations.priceRange')}
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <select
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters({
                      ...filters,
                      priceRange: [parseInt(e.target.value), filters.priceRange[1]]
                    })}
                    className="flex-1 p-2 border rounded-lg"
                  >
                    {priceLabels.map((label, index) => (
                      <option key={`min-${index}`} value={index} disabled={index > filters.priceRange[1]}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-500">to</span>
                  <select
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({
                      ...filters,
                      priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                    })}
                    className="flex-1 p-2 border rounded-lg"
                  >
                    {priceLabels.map((label, index) => (
                      <option 
                        key={`max-${index}`} 
                        value={index}
                        disabled={index < filters.priceRange[0]}
                      >
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setFilters({
                  category: 'all',
                  rating: 0,
                  priceRange: [0, 4]
                })}
                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('common.resetFilters')}
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRecommendations.map((rec) => (
                <div key={rec.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={rec.image}
                      alt={rec.name}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => toggleSave(rec.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full ${
                        rec.isSaved 
                          ? 'bg-yellow-400 text-yellow-900' 
                          : 'bg-white/90 text-gray-800'
                      }`}
                      aria-label={rec.isSaved ? t('common.saved') : t('common.save')}
                    >
                      <FiStar fill={rec.isSaved ? 'currentColor' : 'none'} />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      {categories.find(cat => cat.id === rec.category)?.name || rec.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{rec.name}</h3>
                      <div className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm px-2 py-1 rounded">
                        <FiStar className="text-yellow-500 mr-1" fill="currentColor" />
                        {rec.rating.toFixed(1)}
                        <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                          ({rec.reviewCount.toLocaleString()})
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {rec.description}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                      <div className="flex items-center">
                        <FiMapPin className="mr-1" size={14} />
                        <span className="truncate max-w-[120px]">{rec.location.split(',')[0]}</span>
                      </div>
                      <div className="flex items-center">
                        <FiClock className="mr-1" size={14} />
                        <span>{rec.duration}</span>
                      </div>
                      <div className="flex items-center ml-auto">
                        <FiDollarSign 
                          className={`mr-1 ${rec.price === 0 ? 'text-green-500' : ''}`} 
                          size={14} 
                        />
                        <span>{priceLabels[rec.price]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                {t('recommendations.noResults')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {t('recommendations.tryAdjustingFilters')}
              </p>
              <button
                onClick={() => setFilters({
                  category: 'all',
                  rating: 0,
                  priceRange: [0, 4]
                })}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('common.resetFilters')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;