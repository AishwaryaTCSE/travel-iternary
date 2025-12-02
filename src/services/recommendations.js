import { searchPlaces, getNearbyAttractions } from './maps';

export async function getItineraryRecommendations(trip, center) {
  if (!trip || !center) return { places: [] };

  const queries = [];
  switch (trip.tripType) {
    case 'business':
      queries.push({ query: 'coffee', type: 'cafe' });
      queries.push({ query: 'restaurant', type: 'restaurant' });
      queries.push({ query: 'coworking', type: 'point_of_interest' });
      break;
    case 'family':
      queries.push({ query: 'park', type: 'park' });
      queries.push({ query: 'museum', type: 'museum' });
      break;
    case 'backpacking':
      queries.push({ query: 'hostel', type: 'lodging' });
      queries.push({ query: 'trail', type: 'tourist_attraction' });
      break;
    default:
      queries.push({ query: 'tourist attraction', type: 'tourist_attraction' });
      queries.push({ query: 'food', type: 'restaurant' });
  }

  const results = await Promise.all(
    queries.map((q) => searchPlaces(center, q))
  );
  const attractions = await getNearbyAttractions(center);
  const places = [...results.flat(), ...attractions];

  return { places };
}

