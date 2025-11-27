// src/components/maps/MapRoute.jsx
import React, { useEffect, useRef } from 'react';
import { Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const MapRoute = ({ 
  waypoints = [],
  color = '#3b82f6',
  weight = 4,
  opacity = 0.7,
  showRoute = true,
  showWaypoints = true,
  routeLine = true,
  addWaypoints = true,
  fitSelectedRoutes = true,
  createMarker = null
}) => {
  const map = useMap();
  const routeRef = useRef(null);

  useEffect(() => {
    if (!showRoute || waypoints.length < 2) return;

    // Remove existing routing control if it exists
    if (routeRef.current) {
      routeRef.current.remove();
    }

    // Create a new routing control
    const routingControl = L.Routing.control({
      waypoints: waypoints.map(wp => L.latLng(wp[0], wp[1])),
      lineOptions: {
        styles: [{ color, weight, opacity }],
        extendToWaypoints: true,
        missingRouteTolerance: 10
      },
      show: showRoute,
      addWaypoints: addWaypoints,
      routeWhileDragging: false,
      fitSelectedRoutes: fitSelectedRoutes,
      createMarker: createMarker || function(i, wp) {
        return L.marker(wp.latLng, {
          draggable: false
        });
      }
    }).addTo(map);

    routeRef.current = routingControl;

    return () => {
      if (routeRef.current) {
        map.removeControl(routeRef.current);
        routeRef.current = null;
      }
    };
  }, [map, waypoints, color, weight, opacity, showRoute, addWaypoints, fitSelectedRoutes, createMarker]);

  if (!routeLine || waypoints.length < 2) {
    return null;
  }

  return (
    <Polyline
      positions={waypoints}
      pathOptions={{ color, weight, opacity }}
    />
  );
};

export default MapRoute;