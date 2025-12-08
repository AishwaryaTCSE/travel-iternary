import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { useTranslation } from 'react-i18next';
import { Loader } from '@googlemaps/js-api-loader';

const MapOverview = () => {
  const { tripId } = useParams();
  const { trips } = useItinerary();
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  const trip = trips.find(t => t.id === tripId);

  useEffect(() => {
    if (!trip?.destination) return;

    const initMap = async () => {
      try {
        // In a real app, you would use your actual Google Maps API key
        const loader = new Loader({
          apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places']
        });

        const { Map } = await loader.importLibrary('maps');
        const { AdvancedMarkerElement } = await loader.importLibrary('marker');
        
        // Initialize the map
        map.current = new Map(mapRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: 3,
          mapId: 'DEMO_MAP_ID',
        });

        // Geocode the destination
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: trip.destination }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            map.current.setCenter(location);
            map.current.setZoom(12);
            
            // Add marker for destination
            const marker = new AdvancedMarkerElement({
              map: map.current,
              position: location,
              title: trip.destination,
            });
            
            markers.current.push(marker);
          }
        });

        // Add markers for activities with locations
        trip.days?.forEach(day => {
          day.activities?.forEach(activity => {
            if (activity.location) {
              geocoder.geocode({ address: activity.location }, (results, status) => {
                if (status === 'OK' && results[0]) {
                  const marker = new AdvancedMarkerElement({
                    map: map.current,
                    position: results[0].geometry.location,
                    title: activity.text,
                  });
                  markers.current.push(marker);
                }
              });
            }
          });
        });

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      // Remove all markers
      markers.current.forEach(marker => marker.map = null);
      markers.current = [];
    };
  }, [trip]);

  if (!trip) {
    return <div className="p-6 text-center">{t('common.tripNotFound')}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {t('map.title')} - {trip.destination}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('map.subtitle')}
        </p>
      </div>

      <div 
        ref={mapRef} 
        className="w-full h-[600px] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      />
      
      <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">{t('map.locations')}</h2>
        <ul className="space-y-2">
          <li className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="font-medium">{trip.destination}</span> - {t('map.destination')}
          </li>
          {trip.days?.flatMap((day, dayIndex) => 
            day.activities
              ?.filter(activity => activity.location)
              ?.map((activity, activityIndex) => (
                <li key={`${dayIndex}-${activityIndex}`} className="flex items-center ml-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="font-medium">{activity.location}</span> - {activity.text}
                </li>
              ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default MapOverview;
