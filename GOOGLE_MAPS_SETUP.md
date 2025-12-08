# Google Maps Itinerary Planner - Setup Guide

## Overview
This component provides a complete travel itinerary planner with Google Maps integration. It allows users to create itineraries, view them on an interactive map, and see recommended places with expense breakdowns and packing suggestions.

## Features
- ✅ Create itineraries with destination, budget, dates, and travelers
- ✅ Interactive Google Maps with markers for hotels, attractions, and restaurants
- ✅ Info windows showing place details, expenses, and packing items
- ✅ Dynamic map updates when new itineraries are added
- ✅ Multiple itinerary management
- ✅ LocalStorage persistence

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

### 2. Configure Environment Variables

Create a `.env` file in the root of your project:

```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Important:** Replace `your_actual_api_key_here` with your actual API key from Google Cloud Console.

### 3. Restart Development Server

After adding the environment variable, restart your development server:

```bash
npm run dev
```

### 4. Access the Component

Navigate to: `http://localhost:5173/google-maps-itinerary`

Or add a link in your navigation:

```jsx
<Link to="/google-maps-itinerary">Google Maps Itinerary</Link>
```

## Usage

### Creating an Itinerary

1. Click "New Itinerary" button
2. Fill in the form:
   - **Trip Title**: Name your trip (e.g., "Summer Vacation 2024")
   - **Destination**: Enter city/country (e.g., "Bangkok, Thailand")
   - **Budget**: Total budget in USD
   - **Travelers**: Number of people
   - **Start/End Dates**: Optional dates
3. Click "Create Itinerary"

### Viewing on Map

- The map automatically centers on your destination
- Markers appear for:
  - 🔵 **Blue**: Destination marker
  - 🔴 **Red**: Hotels (5 nearest)
  - 🟡 **Yellow**: Attractions (8 nearest)
  - 🟢 **Green**: Restaurants (6 nearest)

### Marker Info Windows

Click any marker to see:
- Place name and rating
- Address
- **Estimated Expenses**: Calculated based on your budget
- **Packing Suggestions**: Items specific to the place type

### Managing Itineraries

- Click on any itinerary card in the sidebar to load it on the map
- Click the ❌ button to delete an itinerary
- All itineraries are saved in browser localStorage

## Component Structure

```
GoogleMapsItinerary.jsx
├── Map Initialization
├── Geocoding (address → coordinates)
├── Places Search (hotels, attractions, restaurants)
├── Marker Creation & Management
├── Info Window Content Generation
├── Expense Calculation
└── Packing Suggestions
```

## API Requirements

The component uses these Google Maps APIs:
- **Maps JavaScript API**: For map rendering
- **Places API**: For searching nearby places
- **Geocoding API**: For converting addresses to coordinates

Make sure all three are enabled in your Google Cloud Console.

## Customization

### Changing Marker Colors

Edit the `icon` property in marker creation:

```javascript
icon: {
  url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
}
```

Available colors: `blue-dot`, `red-dot`, `yellow-dot`, `green-dot`, `purple-dot`

### Adjusting Search Radius

Change the `radius` parameter in `searchNearbyPlaces`:

```javascript
radius: 5000, // meters (5km)
```

### Modifying Expense Calculations

Edit the `calculateExpenses` function to adjust budget allocation percentages.

### Adding More Place Types

Add new place types in the `loadItineraryOnMap` function:

```javascript
const museums = await searchNearbyPlaces(location, 'museum', 'museum');
```

## Troubleshooting

### Map Not Loading
- Check browser console for API key errors
- Verify `VITE_GOOGLE_MAPS_API_KEY` is set correctly
- Ensure Maps JavaScript API is enabled

### No Markers Showing
- Check if Places API is enabled
- Verify Geocoding API is enabled
- Check browser console for errors

### Info Windows Not Showing
- Ensure JavaScript is enabled
- Check for console errors
- Verify marker click events are firing

## Security Notes

⚠️ **Important**: Never commit your `.env` file to version control!

Add to `.gitignore`:
```
.env
.env.local
```

For production, set environment variables in your hosting platform's settings.

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all APIs are enabled in Google Cloud Console
3. Ensure API key has proper restrictions set up

