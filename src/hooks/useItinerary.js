import { useContext } from 'react';
import { ItineraryContext } from '../context/ItineraryContext';

export const useItinerary = () => {
  const context = useContext(ItineraryContext);
  
  if (context === undefined) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  
  return context;
};

export default useItinerary;