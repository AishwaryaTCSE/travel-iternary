import axios from 'axios';

const FOURSQUARE_API_KEY = import.meta.env.VITE_FOURSQUARE_API_KEY;
const FOURSQUARE_BASE_URL = import.meta.env.VITE_FOURSQUARE_BASE_URL || 'https://api.foursquare.com/v3/places';

const placesApi = axios.create({
  baseURL: FOURSQUARE_BASE_URL,
  headers: {
    'Authorization': FOURSQUARE_API_KEY,
    'Accept': 'application/json',
  },
});

export const searchPlaces = async (query, options = {}) => {
  try {
    const { lat, lng, radius = 1000, categories, limit = 10 } = options;
    
    const params = {
      query,
      limit,
      ...(lat && lng && { 
        ll: `${lat},${lng}`,
        radius,
      }),
      ...(categories && { categories }),
    };

    const response = await placesApi.get('/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching places:', error);
    throw error;
  }
};

export const getPlaceDetails = async (fsqId) => {
  try {
    const response = await placesApi.get(`/${fsqId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
};

export const getPlacePhotos = async (fsqId, limit = 5) => {
  try {
    const response = await placesApi.get(`/${fsqId}/photos`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching place photos:', error);
    throw error;
  }
};

export const getPlaceTips = async (fsqId, limit = 5) => {
  try {
    const response = await placesApi.get(`/${fsqId}/tips`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching place tips:', error);
    throw error;
  }
};