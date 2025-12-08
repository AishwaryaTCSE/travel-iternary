import axios from 'axios';

// Using a free flights API (Amadeus API requires registration, so we'll use a mock/alternative)
// For production, you would use Amadeus API or similar
const FLIGHTS_API_BASE_URL = 'https://api.skyscanner.net/v1';

// Mock flights data generator for demo purposes
// In production, replace with actual API calls
const generateMockFlights = (origin, destination, date) => {
  const airlines = ['American Airlines', 'Delta', 'United', 'Lufthansa', 'British Airways', 'Air France'];
  const flightNumbers = ['AA', 'DL', 'UA', 'LH', 'BA', 'AF'];
  
  return Array(10).fill().map((_, i) => ({
    id: `flight-${i + 1}`,
    airline: airlines[i % airlines.length],
    flightNumber: `${flightNumbers[i % flightNumbers.length]}${Math.floor(Math.random() * 9000) + 1000}`,
    origin: origin,
    destination: destination,
    departure: {
      time: `${String(Math.floor(Math.random() * 12) + 6).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      date: date,
      airport: `${origin} Airport`
    },
    arrival: {
      time: `${String(Math.floor(Math.random() * 12) + 12).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      date: date,
      airport: `${destination} Airport`
    },
    duration: `${Math.floor(Math.random() * 8) + 2}h ${Math.floor(Math.random() * 60)}m`,
    stops: Math.random() > 0.5 ? 0 : 1,
    price: Math.floor(Math.random() * 800) + 200,
    currency: 'USD',
    class: ['Economy', 'Business', 'First'][Math.floor(Math.random() * 3)],
    availableSeats: Math.floor(Math.random() * 10) + 1
  }));
};

// Search flights
export const searchFlights = async (origin, destination, departureDate, returnDate = null, passengers = 1) => {
  try {
    // In production, replace this with actual API call
    // Example: const response = await axios.get(`${FLIGHTS_API_BASE_URL}/flights`, { params: {...} });
    
    // For demo, return mock data
    const flights = generateMockFlights(origin, destination, departureDate);
    
    if (returnDate) {
      const returnFlights = generateMockFlights(destination, origin, returnDate);
      return {
        outbound: flights,
        return: returnFlights
      };
    }
    
    return {
      outbound: flights,
      return: null
    };
  } catch (error) {
    console.error('Error searching flights:', error);
    // Return mock data as fallback
    return {
      outbound: generateMockFlights(origin, destination, departureDate),
      return: returnDate ? generateMockFlights(destination, origin, returnDate) : null
    };
  }
};

// Get flight details by ID
export const getFlightDetails = async (flightId) => {
  try {
    // In production, replace with actual API call
    return {
      id: flightId,
      airline: 'American Airlines',
      flightNumber: 'AA1234',
      aircraft: 'Boeing 737-800',
      seats: {
        total: 180,
        available: 45,
        economy: 30,
        business: 10,
        first: 5
      },
      amenities: ['WiFi', 'Entertainment', 'Meals', 'Power Outlets'],
      baggage: {
        carryOn: '1 piece (7kg)',
        checked: '1 piece (23kg)'
      }
    };
  } catch (error) {
    console.error('Error fetching flight details:', error);
    throw error;
  }
};

// Get popular flight routes
export const getPopularRoutes = async (origin) => {
  try {
    const popularDestinations = ['New York', 'London', 'Paris', 'Tokyo', 'Dubai', 'Sydney'];
    return popularDestinations.map(dest => ({
      destination: dest,
      averagePrice: Math.floor(Math.random() * 1000) + 300,
      currency: 'USD'
    }));
  } catch (error) {
    console.error('Error fetching popular routes:', error);
    return [];
  }
};

