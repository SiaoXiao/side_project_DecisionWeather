export const WeatherStatus = {
  Sunny: 'sunny',
  Cloudy: 'cloudy',
  Rainy: 'rainy',
  Storm: 'storm',
} as const;

export type WeatherStatus = typeof WeatherStatus[keyof typeof WeatherStatus];

export interface HourlyForecast {
  time: string;
  temp: number;
  status: WeatherStatus;
  precipProb: number;
}

export interface WeatherData {
  locationName: string;
  temp: number;
  feelsLike: number;
  status: WeatherStatus;
  humidity: number;
  uvIndex: number;
  precipProb: number;
  hourly: HourlyForecast[];
}

export interface AdviceResult {
  key: string;
  severity: 'low' | 'medium' | 'high';
}

export interface LocationInfo {
  name: string;
  lat: number;
  lon: number;
  admin?: string;
  country?: string;
}

export type Language = 'zh-TW' | 'en-US';
