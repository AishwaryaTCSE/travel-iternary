// src/utils/recommendationUtils.js
// Mock data for demonstration
const mockRecommendations = {
  paris: [
    {
      id: '1',
      name: 'Eiffel Tower',
      category: 'attraction',
      location: 'Paris, France',
      description: 'Iconic 19th-century lattice tower offering city views from observation decks and restaurants.',
      priceLevel: 3,
      rating: 4.7,
      imageUrl: 'https://example.com/eiffel-tower.jpg',
      tags: ['landmark', 'viewpoint', 'historical']
    },
    // Add more mock recommendations...
  ],
  // Add more destinations...
};

export const getRecommendations = async (destination, dates, interests = [], filters = {}) => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter by destination (mocked)
      const destinationKey = destination.toLowerCase().replace(/\s+/g, '');
      let results = mockRecommendations[destinationKey] || [];

      // Apply filters
      if (filters.category && filters.category !== 'all') {
        results = results.filter(item => item.category === filters.category);
      }

      if (filters.priceRange && filters.priceRange !== 'all') {
        const priceMap = { budget: 1, mid: 2, luxury: 3 };
        results = results.filter(item => 
          item.priceLevel <= (priceMap[filters.priceRange] || 3)
        );
      }

      if (filters.rating > 0) {
        results = results.filter(item => item.rating >= filters.rating);
      }

      // Sort by rating by default
      results.sort((a, b) => b.rating - a.rating);

      resolve(results);
    }, 500); // Simulate network delay
  });
};

export const getRecommendationDetails = async (id) => {
  // In a real app, this would fetch details for a specific recommendation
  return new Promise((resolve) => {
    setTimeout(() => {
      // Find the recommendation by ID in all mock data
      const allRecommendations = Object.values(mockRecommendations).flat();
      const recommendation = allRecommendations.find(item => item.id === id);
      resolve(recommendation || null);
    }, 300);
  });
};