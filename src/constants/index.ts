import { WeatherStatus } from '../types';

export const WEATHER_ICONS: Record<WeatherStatus, string> = {
  [WeatherStatus.Sunny]: 'Sun',
  [WeatherStatus.Cloudy]: 'Cloud',
  [WeatherStatus.Rainy]: 'CloudRain',
  [WeatherStatus.Storm]: 'CloudLightning',
};

export const MINI_ICONS: Record<WeatherStatus, string> = {
  [WeatherStatus.Sunny]: 'Sun',
  [WeatherStatus.Cloudy]: 'Cloud',
  [WeatherStatus.Rainy]: 'CloudRain',
  [WeatherStatus.Storm]: 'CloudLightning',
};
