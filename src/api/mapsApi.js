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
    } else {
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
    const nominatim = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: address, format: 'json', limit: 1 },
    });
    const item = Array.isArray(nominatim.data) ? nominatim.data[0] : null;
    if (item) {
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lon);
      return { lat, lng, address: item.display_name };
    }
    throw new Error('No results found for the given address');
  } catch (error) {
    console.error('Error geocoding address:', error);
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

export const searchWikipediaText = async (query, type = 'point_of_interest', limit = 10) => {
  const term =
    type === 'lodging'
      ? `hotels in ${query}`
      : type === 'tourist_attraction'
      ? `tourist attractions in ${query}`
      : `famous places in ${query}`;
  const resp = await axios.get('https://en.wikipedia.org/w/api.php', {
    params: {
      action: 'query',
      list: 'search',
      srsearch: term,
      srlimit: limit,
      format: 'json',
      origin: '*',
    },
  });
  const items = resp.data?.query?.search || [];
  return items.map((it) => ({ name: it.title }));
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
      const filter =
        type === 'lodging'
          ? '[tourism=hotel]'
          : type === 'point_of_interest'
          ? '[tourism]'
          : '[tourism=attraction]';
      const query = `[out:json];node(around:${radius},${location.lat},${location.lng})${filter};out;`;
      const overpass = await axios.get('https://overpass-api.de/api/interpreter', {
        params: { data: query },
      });
      const elements = overpass.data?.elements || [];
      const results = elements
        .filter((e) => e.tags && e.tags.name)
        .map((e) => ({ name: e.tags.name, lat: e.lat, lng: e.lon, tags: e.tags }));
      if (results.length > 0) return results;
      const wiki = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          list: 'geosearch',
          gscoord: `${location.lat}|${location.lng}`,
          gsradius: radius,
          gslimit: 10,
          format: 'json',
          origin: '*',
        },
      });
      const geosearch = wiki.data?.query?.geosearch || [];
      return geosearch.map((it) => ({ name: it.title, lat: it.lat, lng: it.lon }));
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
  searchWikipediaText,
  // Export the axios instance in case it's needed
  client: mapsClient
};

export default mapsApi;
