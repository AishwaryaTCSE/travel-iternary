import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ItineraryContext = createContext();

export const ItineraryProvider = ({ children }) => {
  const [trips, setTrips] = useLocalStorage('trips', []);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load initial trip if none selected
  useEffect(() => {
    if (trips.length > 0 && !currentTrip) {
      setCurrentTrip(trips[0]);
    }
  }, [trips, currentTrip]);

  const createTrip = (tripData) => {
    try {
      setLoading(true);
      const newTrip = {
        id: uuidv4(),
        ...tripData,
        createdAt: new Date().toISOString(),
        activities: [],
        expenses: [],
        documents: []
      };
      setTrips(prev => [...prev, newTrip]);
      setCurrentTrip(newTrip);
      return newTrip;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTrip = (tripId, updates) => {
    try {
      setLoading(true);
      setTrips(prev => 
        prev.map(trip => 
          trip.id === tripId ? { ...trip, ...updates, updatedAt: new Date().toISOString() } : trip
        )
      );
      setCurrentTrip(prev => (prev?.id === tripId ? { ...prev, ...updates } : prev));
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = (tripId) => {
    try {
      setLoading(true);
      setTrips(prev => prev.filter(trip => trip.id !== tripId));
      if (currentTrip?.id === tripId) {
        setCurrentTrip(trips.length > 1 ? trips.find(t => t.id !== tripId) : null);
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Activity CRUD operations
  const addActivity = (tripId, activity) => {
    const newActivity = {
      id: uuidv4(),
      ...activity,
      createdAt: new Date().toISOString()
    };
    
    setTrips(prev => 
      prev.map(trip => 
        trip.id === tripId 
          ? { 
              ...trip, 
              activities: [...trip.activities, newActivity] 
            } 
          : trip
      )
    );
    return newActivity;
  };

  // Similar update and delete operations for activities
  // ... (implement updateActivity, deleteActivity)

  return (
    <ItineraryContext.Provider
      value={{
        trips,
        currentTrip,
        loading,
        error,
        createTrip,
        updateTrip,
        deleteTrip,
        setCurrentTrip,
        addActivity,
        // Add other operations here
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
};

export const useItinerary = () => {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  return context;
};

export default ItineraryContext;