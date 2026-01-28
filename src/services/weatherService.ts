import type { WeatherData, HourlyForecast, LocationInfo } from '../types';
import { WeatherStatus } from '../types';

const mapWmoToStatus = (code: number): WeatherStatus => {
  if (code === 0) return WeatherStatus.Sunny;
  if ([1, 2, 3, 45, 48].includes(code)) return WeatherStatus.Cloudy;
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return WeatherStatus.Rainy;
  if ([95, 96, 99].includes(code)) return WeatherStatus.Storm;
  return WeatherStatus.Cloudy;
};

/**
 * 根據經緯度獲取天氣
 */
export const fetchWeatherByCoords = async (
  lat: number,
  lon: number,
  locationName: string,
  signal?: AbortSignal
): Promise<WeatherData> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&timezone=auto&forecast_days=1`;

  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error('Weather API error');

  const data = await response.json();
  const current = data.current;
  const hourly = data.hourly;
  const currentTime = current?.time as string | undefined;
  const hourlyTimes = (hourly?.time as string[] | undefined) ?? [];
  const currentIdx = currentTime ? hourlyTimes.indexOf(currentTime) : -1;
  const fallbackHour = new Date().getHours();
  const baseIdx = currentIdx >= 0 ? currentIdx : fallbackHour;

  const hourlyForecasts: HourlyForecast[] = [];
  for (let i = 1; i <= 6; i++) {
    const targetIdx = baseIdx + i;
    if (targetIdx < hourlyTimes.length) {
      hourlyForecasts.push({
        time: hourlyTimes[targetIdx] ?? `${targetIdx}:00`,
        temp: Math.round(hourly.temperature_2m[targetIdx]),
        status: mapWmoToStatus(hourly.weather_code[targetIdx]),
        precipProb: hourly.precipitation_probability[targetIdx]
      });
    }
  }

  return {
    locationName,
    temp: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    status: mapWmoToStatus(current.weather_code),
    humidity: current.relative_humidity_2m,
    uvIndex: current.uv_index,
    precipProb: hourly.precipitation_probability[baseIdx],
    hourly: hourlyForecasts
  };
};

/**
 * 搜尋城市位置
 */
export const searchLocations = async (query: string, signal?: AbortSignal): Promise<LocationInfo[]> => {
  if (!query || query.length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;

  try {
    const response = await fetch(url, { signal });
    const data = await response.json();
    if (!data.results) return [];

    return data.results.map((res: any) => ({
      name: res.name,
      lat: res.latitude,
      lon: res.longitude,
      admin: res.admin1,
      country: res.country
    }));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return [];
    }
    console.error('Geocoding error', error);
    return [];
  }
};
