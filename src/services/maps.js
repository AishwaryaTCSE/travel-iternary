import axios from 'axios';
import { env, hasEnv } from './env';

export async function geocodeDestination(destination) {
  if (!destination) return null;

  try {
    if (hasEnv('googleMapsApiKey')) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json`;
      const { data } = await axios.get(url, {
        params: { address: destination, key: env.googleMapsApiKey }
      });
      const result = data.results?.[0];
      if (result) {
        const loc = result.geometry.location;
        return { lat: loc.lat, lng: loc.lng, formatted: result.formatted_address };
      }
    }

    const nominatim = `https://nominatim.openstreetmap.org/search`;
    const { data } = await axios.get(nominatim, {
      params: { format: 'json', q: destination, limit: 1 }
    });
    const item = Array.isArray(data) ? data[0] : null;
    if (item) {
      return { lat: parseFloat(item.lat), lng: parseFloat(item.lon), formatted: item.display_name };
    }
  } catch (err) {
    console.error('geocodeDestination error', err);
  }
  return null;
}

export async function searchPlaces({ lat, lng }, { query, type, radius = 3000 }) {
  try {
    if (hasEnv('googlePlacesApiKey')) {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
      const { data } = await axios.get(url, {
        params: {
          key: env.googlePlacesApiKey,
          location: `${lat},${lng}`,
          radius,
          keyword: query,
          type
        }
      });
      return (data.results || []).map((r) => ({
        id: r.place_id,
        name: r.name,
        position: [r.geometry.location.lat, r.geometry.location.lng],
        rating: r.rating,
        userRatingsTotal: r.user_ratings_total,
        address: r.vicinity,
        types: r.types,
        source: 'google'
      }));
    }

    if (hasEnv('foursquareApiKey')) {
      const url = `${env.foursquareBaseUrl}/search`;
      const { data } = await axios.get(url, {
        headers: { Authorization: env.foursquareApiKey },
        params: {
          ll: `${lat},${lng}`,
          query,
          radius,
          limit: 20
        }
      });
      return (data.results || data || []).map((r) => ({
        id: r.fsq_id,
        name: r.name,
        position: [r.geocodes?.main?.latitude, r.geocodes?.main?.longitude],
        rating: r.rating || undefined,
        userRatingsTotal: r.popularity || undefined,
        address: r.location?.formatted_address,
        types: r.categories?.map((c) => c.name),
        source: 'foursquare'
      }));
    }
  } catch (err) {
    console.error('searchPlaces error', err);
  }
  return [];
}

export async function getNearbyAttractions(center) {
  const categories = ['tourist_attraction', 'museum', 'park', 'restaurant', 'cafe'];
  const results = await Promise.all(
    categories.map((type) => searchPlaces(center, { type, radius: 5000 }))
  );
  return results.flat();
}

