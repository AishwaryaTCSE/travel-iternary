import axios from 'axios';
import { env, hasEnv } from './env';

function normalizeWeather(data) {
  if (!data) return null;
  const now = data.current || data;
  return {
    location: data.name || data.city?.name || '',
    current: {
      temp: now.temp,
      feels_like: now.feels_like,
      condition: now.weather?.[0]?.main || '',
      icon: now.weather?.[0]?.icon || '',
      humidity: now.humidity,
      wind_speed: now.wind_speed,
      wind_deg: now.wind_deg,
      sunrise: data.sys ? new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
      sunset: data.sys ? new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
      uv_index: undefined,
      visibility: data.visibility,
      pressure: now.pressure,
      last_updated: new Date().toISOString()
    }
  };
}

export async function getWeatherByCity(city, units = 'metric') {
  if (!hasEnv('weatherApiKey')) return null;
  const base = env.weatherBaseUrl;
  const url = `${base}/weather`;
  try {
    const { data } = await axios.get(url, {
      params: { q: city, appid: env.weatherApiKey, units }
    });
    return normalizeWeather(data);
  } catch (err) {
    console.error('getWeatherByCity error', err);
    return null;
  }
}

export async function getWeatherByCoords(lat, lon, units = 'metric') {
  if (!hasEnv('weatherApiKey')) return null;
  const base = env.weatherBaseUrl;
  const url = `${base}/weather`;
  try {
    const { data } = await axios.get(url, {
      params: { lat, lon, appid: env.weatherApiKey, units }
    });
    return normalizeWeather(data);
  } catch (err) {
    console.error('getWeatherByCoords error', err);
    return null;
  }
}

