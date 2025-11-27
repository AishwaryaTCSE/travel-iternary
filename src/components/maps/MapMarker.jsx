// src/components/maps/MapMarker.jsx
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FiExternalLink } from 'react-icons/fi';

const MapMarker = ({ 
  position, 
  title, 
  description, 
  icon, 
  onClick, 
  popup = true,
  link,
  children 
}) => {
  const customIcon = icon ? new L.Icon({
    iconUrl: icon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }) : null;

  return (
    <Marker 
      position={position} 
      icon={customIcon || undefined}
      eventHandlers={{
        click: () => onClick && onClick()
      }}
    >
      {(popup || children) && (
        <Popup>
          <div className="space-y-1">
            {title && <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>}
            {description && <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>}
            {link && (
              <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View on map <FiExternalLink className="ml-1" size={12} />
              </a>
            )}
            {children}
          </div>
        </Popup>
      )}
    </Marker>
  );
};

export default MapMarker;