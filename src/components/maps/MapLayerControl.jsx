// src/components/maps/MapLayerControl.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { FiLayers, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const baseLayers = [
  {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'
  },
  {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles © Esri'
  },
  {
    name: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap'
  }
];

const MapLayerControl = ({ className = '' }) => {
  const map = useMap();
  const [isOpen, setIsOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState(baseLayers[0].name);
  const { t } = useTranslation();
  const layerRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    // Add the base layer
    const layer = L.tileLayer(baseLayers[0].url, {
      attribution: baseLayers[0].attribution
    }).addTo(map);

    layerRef.current = layer;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [map]);

  const changeBaseLayer = (layer) => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    const newLayer = L.tileLayer(layer.url, {
      attribution: layer.attribution
    }).addTo(map);

    layerRef.current = newLayer;
    setActiveLayer(layer.name);
    setIsOpen(false);
  };

  return (
    <div className={`leaflet-top leaflet-right ${className}`}>
      <div className="leaflet-control-container">
        <div className="leaflet-bar leaflet-control">
          <button
            className="leaflet-control-layers-toggle"
            title={t('map.layers')}
            onClick={() => setIsOpen(!isOpen)}
          >
            <FiLayers className="inline-block" />
          </button>
        </div>

        {isOpen && (
          <div className="leaflet-control-layers leaflet-control-layers-expanded">
            <div className="leaflet-control-layers-overlays">
              <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {t('map.baseLayers')}
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <FiX size={18} />
                  </button>
                </div>
                <div className="space-y-1">
                  {baseLayers.map((layer) => (
                    <div
                      key={layer.name}
                      className={`px-3 py-1.5 rounded text-sm cursor-pointer ${
                        activeLayer === layer.name
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => changeBaseLayer(layer)}
                    >
                      {layer.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapLayerControl;