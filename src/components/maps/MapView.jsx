// src/components/maps/MapView.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FiMapPin, FiExternalLink, FiZoomIn, FiZoomOut, FiCompass } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapView = ({ 
  center = [51.505, -0.09], 
  zoom = 13, 
  markers = [], 
  height = '500px',
  className = '',
  onMarkerClick,
  showControls = true,
  scrollWheelZoom = true
}) => {
  const { t } = useTranslation();
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(zoom);

  // Update view when center or zoom changes
  const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
  };

  // Map controls component
  const MapControls = () => {
    const map = useMap();
    
    return showControls && (
      <div className="leaflet-top leaflet-right">
        <div className="leaflet-control-container">
          <div className="leaflet-bar leaflet-control">
            <button
              className="leaflet-control-zoom-in"
              title={t('map.zoomIn')}
              onClick={() => map.zoomIn()}
            >
              <FiZoomIn className="w-4 h-4" />
            </button>
            <button
              className="leaflet-control-zoom-out"
              title={t('map.zoomOut')}
              onClick={() => map.zoomOut()}
            >
              <FiZoomOut className="w-4 h-4" />
            </button>
          </div>
          <div className="leaflet-bar leaflet-control mt-2">
            <button
              className="leaflet-control-locate"
              title={t('map.locateMe')}
              onClick={() => {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    const { latitude, longitude } = pos.coords;
                    map.setView([latitude, longitude], 13);
                  },
                  (err) => console.error('Error getting location:', err)
                );
              }}
            >
              <FiCompass className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
      style={{ height }}
    >
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={scrollWheelZoom}
        zoomControl={false}
      >
        <ChangeView center={mapCenter} zoom={mapZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapControls />
        
        {markers.map((marker, index) => (
          <Marker 
            key={marker.id || index} 
            position={marker.position}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(marker)
            }}
          >
            {marker.popup && (
              <Popup>
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{marker.title}</h4>
                  {marker.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">{marker.description}</p>
                  )}
                  {marker.link && (
                    <a 
                      href={marker.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {t('map.viewOnMap')} <FiExternalLink className="ml-1" size={12} />
                    </a>
                  )}
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;