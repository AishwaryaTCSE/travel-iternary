import axios from 'axios';

// Check which map service to use based on available API keys
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const useGoogleMaps = !!GOOGLE_MAPS_API_KEY;

// Base URLs
const GOOGLE_MAPS_BASE_URL = 'https://maps.googleapis.com/maps/api';
const MAPBOX_BASE_URL = 'https://api.mapbox.com';

// Create appropriate API client based on available keys
const mapsClient = axios.create({
  baseURL: useGoogleMaps ? GOOGLE_MAPS_BASE_URL : MAPBOX_BASE_URL,
  params: useGoogleMaps
    ? { key: GOOGLE_MAPS_API_KEY }
    : { access_token: MAPBOX_ACCESS_TOKEN },
});

export const geocodeAddress = async (address) => {
  try {
    let response;
    
    if (useGoogleMaps) {
      response = await mapsClient.get('/geocode/json', {
        params: { address },
      });
      const { results } = response.data;
      if (results && results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        return { lat, lng, address: results[0].formatted_address };
      }
      // Fallback to Mapbox if Google returns no results and Mapbox token is available
      if (MAPBOX_ACCESS_TOKEN) {
        const fallback = await axios.get(
          `${MAPBOX_BASE_URL}/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`,
          {
            params: { types: 'address,place,locality,neighborhood,region', limit: 1, access_token: MAPBOX_ACCESS_TOKEN },
          }
        );
        const { features } = fallback.data;
        if (features && features.length > 0) {
          const [lng, lat] = features[0].center;
          return { lat, lng, address: features[0].place_name };
        }
      }
    } else {
      // Mapbox geocoding
      response = await mapsClient.get(`/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`, {
        params: {
          types: 'address,place,locality,neighborhood,region',
          limit: 1,
        },
      });
      
      const { features } = response.data;
      if (features && features.length > 0) {
        const [lng, lat] = features[0].center;
        return { lat, lng, address: features[0].place_name };
      }
    }
    
    throw new Error('No results found for the given address');
  } catch (error) {
    console.error('Error geocoding address:', error);
    // Try Mapbox as a final fallback when Google fails and token exists
    if (useGoogleMaps && MAPBOX_ACCESS_TOKEN) {
      try {
        const fallback = await axios.get(
          `${MAPBOX_BASE_URL}/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`,
          {
            params: { types: 'address,place,locality,neighborhood,region', limit: 1, access_token: MAPBOX_ACCESS_TOKEN },
          }
        );
        const { features } = fallback.data;
        if (features && features.length > 0) {
          const [lng, lat] = features[0].center;
          return { lat, lng, address: features[0].place_name };
        }
      } catch (_) {
        // Ignore and rethrow original error
      }
    }
    throw error;
  }
};

export const getDirections = async (origin, destination, mode = 'driving') => {
  try {
    if (useGoogleMaps) {
const response = await mapsClient.get('/directions/json', {
        params: {
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          mode,
          alternatives: true,
        },
      });
      return response.data;
    } else {
      // Mapbox directions
const response = await mapsClient.get(`/directions/v5/mapbox/${mode}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`, {
        params: {
          geometries: 'geojson',
          overview: 'full',
          steps: true,
          alternatives: true,
        },
      });
      return response.data;
    }
  } catch (error) {
    console.error('Error getting directions:', error);
    throw error;
  }
};

export const getStaticMapUrl = (center, zoom = 12, size = '600x400', markers = []) => {
  if (useGoogleMaps) {
    let url = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=${zoom}&size=${size}&key=${GOOGLE_MAPS_API_KEY}`;
    
    // Add markers if any
    markers.forEach((marker, index) => {
      url += `&markers=color:red%7C${marker.lat},${marker.lng}`;
    });
    
    return url;
  } else {
    // Mapbox static map
    let url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/`;
    
    // Add markers if any
    markers.forEach((marker) => {
      url += `pin-s+ff0000(${marker.lng},${marker.lat}),`;
    });
    
    url += `${center.lng},${center.lat},${zoom},0/${size}?access_token=${MAPBOX_ACCESS_TOKEN}`;
    return url;
  }
};

export const searchNearbyPlaces = async (location, radius = 1000, type) => {
  try {
    if (useGoogleMaps) {
const response = await mapsClient.get('/place/nearbysearch/json', {
        params: {
          location: `${location.lat},${location.lng}`,
          radius,
          type: type || 'tourist_attraction',
        },
      });
      return response.data.results || [];
    } else {
      // For Mapbox, we'll use the Foursquare integration for place search
      console.warn('Mapbox native nearby search not implemented. Use Foursquare API instead.');
      return [];
    }
  } catch (error) {
    console.error('Error searching nearby places:', error);
    throw error;
  }
};

// Create a default export object that includes all the map functions
const mapsApi = {
  geocodeAddress,
  getDirections,
  getStaticMapUrl,
  searchNearbyPlaces,
  // Export the axios instance in case it's needed
  client: mapsClient
};

export default mapsApi;
