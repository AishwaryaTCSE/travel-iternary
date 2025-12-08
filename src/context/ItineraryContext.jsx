import React, { createContext, useContext, useState, useEffect } from 'react';
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
              activities: [...(trip.activities || []), newActivity] 
            } 
          : trip
      )
    );
    setCurrentTrip(prev => {
      if (prev?.id === tripId) {
        return { ...prev, activities: [...(prev.activities || []), newActivity] };
      }
      return prev;
    });
    return newActivity;
  };

  const updateActivity = (tripId, activityId, updates) => {
    setTrips(prev => 
      prev.map(trip => 
        trip.id === tripId 
          ? { 
              ...trip, 
              activities: (trip.activities || []).map(activity =>
                activity.id === activityId 
                  ? { ...activity, ...updates, updatedAt: new Date().toISOString() }
                  : activity
              )
            } 
          : trip
      )
    );
    setCurrentTrip(prev => {
      if (prev?.id === tripId) {
        return {
          ...prev,
          activities: (prev.activities || []).map(activity =>
            activity.id === activityId 
              ? { ...activity, ...updates, updatedAt: new Date().toISOString() }
              : activity
          )
        };
      }
      return prev;
    });
  };

  const deleteActivity = (tripId, activityId) => {
    setTrips(prev => 
      prev.map(trip => 
        trip.id === tripId 
          ? { 
              ...trip, 
              activities: (trip.activities || []).filter(activity => activity.id !== activityId)
            } 
          : trip
      )
    );
    setCurrentTrip(prev => {
      if (prev?.id === tripId) {
        return {
          ...prev,
          activities: (prev.activities || []).filter(activity => activity.id !== activityId)
        };
      }
      return prev;
    });
  };

  // Helper function to get trip by ID
  const getTripById = (tripId) => {
    return trips.find(trip => trip.id === tripId) || null;
  };

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
        updateActivity,
        deleteActivity,
        getTripById,
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
