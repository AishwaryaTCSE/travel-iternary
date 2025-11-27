import L from 'leaflet';
import 'leaflet-routing-machine';

// Initialize map
export const initMap = (elementId, center = [0, 0], zoom = 2) => {
  const map = L.map(elementId).setView(center, zoom);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  return map;
};

// Add marker to map
export const addMarker = (map, position, title = '', popupContent = '') => {
  const marker = L.marker(position).addTo(map);
  if (title) marker.bindTooltip(title);
  if (popupContent) marker.bindPopup(popupContent);
  return marker;
};

// Add route between points
export const addRoute = (map, waypoints) => {
  if (waypoints.length < 2) return null;

  const routeControl = L.Routing.control({
    waypoints: waypoints.map(coord => L.latLng(coord[0], coord[1])),
    routeWhileDragging: true,
    show: true,
    addWaypoints: true,
    draggableWaypoints: true,
    fitSelectedRoutes: true,
    lineOptions: {
      styles: [{ color: '#1E88E5', opacity: 0.7, weight: 5 }]
    },
    createMarker: (i, wp) => {
      return L.marker(wp.latLng, {
        draggable: true
      });
    }
  }).addTo(map);

  return routeControl;
};

// Geocode address using Nominatim (OpenStreetMap)
export const geocodeAddress = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Get distance between two points in kilometers
export const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in km
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};