# Environment Variables Setup

This document explains how to configure the API keys needed for the travel itinerary planner to fetch real places, recommendations, and nearby locations.

## Required API Keys

### 1. Places & Recommendations API (Choose one)

#### Option A: Foursquare API (Recommended)
- **Why**: Best for places search, recommendations, and detailed place information
- **Get your key**: https://developer.foursquare.com/
- **Steps**:
  1. Sign up for a Foursquare developer account
  2. Create a new app/project
  3. Copy your API key
  4. Add to `.env` file:
     ```
     VITE_FOURSQUARE_API_KEY=your_foursquare_api_key_here
     VITE_FOURSQUARE_BASE_URL=https://api.foursquare.com/v3/places
     ```

#### Option B: Google Maps Places API
- **Why**: Good alternative if you already have Google Maps API access
- **Get your key**: https://console.cloud.google.com/google/maps-apis
- **Steps**:
  1. Go to Google Cloud Console
  2. Enable "Places API" and "Geocoding API"
  3. Create credentials (API Key)
  4. Add to `.env` file:
     ```
     VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
     ```

### 2. Map Geocoding API (Choose one)

#### Option A: Google Maps Geocoding API
- Same as above - use the same `VITE_GOOGLE_MAPS_API_KEY`

#### Option B: Mapbox Geocoding API
- **Get your token**: https://account.mapbox.com/access-tokens/
- **Steps**:
  1. Sign up for Mapbox account
  2. Create an access token
  3. Add to `.env` file:
     ```
     VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
     ```

### 3. Weather API (Optional but Recommended)

#### OpenWeatherMap API
- **Get your key**: https://openweathermap.org/api
- **Steps**:
  1. Sign up for free account
  2. Get your API key from dashboard
  3. Add to `.env` file:
     ```
     VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
     ```

### 4. Currency API (Optional)

#### Exchange Rate API
- **Get your key**: https://exchangerate-api.com/ or https://fixer.io/
- **Add to `.env` file**:
  ```
  VITE_CURRENCY_API_KEY=your_currency_api_key_here
  ```

## Setup Instructions

1. **Create `.env` file** in the root directory (`travel-itinerary-planner/.env`)

2. **Add your API keys** to the `.env` file:
   ```env
   # Required: Choose Foursquare OR Google Maps
   VITE_FOURSQUARE_API_KEY=your_key_here
   VITE_FOURSQUARE_BASE_URL=https://api.foursquare.com/v3/places
   
   # OR
   VITE_GOOGLE_MAPS_API_KEY=your_key_here
   
   # Optional: For geocoding (if not using Google Maps)
   VITE_MAPBOX_ACCESS_TOKEN=your_token_here
   
   # Optional: For weather data
   VITE_OPENWEATHER_API_KEY=your_key_here
   
   # Optional: For currency conversion
   VITE_CURRENCY_API_KEY=your_key_here
   ```

3. **Restart your development server** after adding the keys:
   ```bash
   npm run dev
   ```

## How It Works

### Places & Recommendations
- The app will automatically fetch **hotels**, **restaurants**, and **attractions** near your itinerary destination
- Recommendations are based on:
  - Your itinerary destination
  - Activities in your itinerary (to suggest relevant places)
  - Distance from the destination (within 3-5km radius)
  - Ratings and reviews from the API

### Map Features
- **Real-time places**: Shows actual hotels, restaurants, and attractions from APIs
- **Itinerary activities**: Displays your planned activities on the map
- **Expense locations**: Shows where you've spent money
- **Nearby recommendations**: Suggests places based on your itinerary details

### Fallback Behavior
- If API keys are not configured, the app will use mock/fallback data
- You'll see a warning message suggesting to add API keys for real data
- The app will still function with mock data for testing

## Troubleshooting

### Places not showing?
1. Check that your API key is correctly set in `.env`
2. Verify the API key is valid and has proper permissions
3. Check browser console for API errors
4. Ensure you've restarted the dev server after adding keys

### Rate Limits
- Free tier APIs have rate limits
- If you hit limits, the app will fall back to mock data
- Consider upgrading your API plan for production use

## Security Note

⚠️ **Never commit your `.env` file to version control!**
- The `.env` file is already in `.gitignore`
- Only commit `.env.example` (without real keys)
- Keep your API keys secure and private

