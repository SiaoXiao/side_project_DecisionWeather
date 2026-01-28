import type { WeatherData, AdviceResult } from '../types';
import { WeatherStatus } from '../types';

/**
 * 回傳翻譯 Key 而非字串，以支援 i18n
 */
export const getActionAdvice = (data: WeatherData): AdviceResult => {
  const { temp, precipProb, uvIndex, status, hourly } = data;

  const upcomingRain = hourly.slice(0, 3).some(h => h.precipProb > 50 || h.status === WeatherStatus.Rainy);

  if (precipProb > 60 || status === WeatherStatus.Rainy || status === WeatherStatus.Storm) {
    return { key: 'rain_critical', severity: 'high' };
  }

  if (upcomingRain) {
    return { key: 'rain_upcoming', severity: 'medium' };
  }

  if (temp > 32 || uvIndex >= 8) {
    return { key: 'heat_warning', severity: 'high' };
  }

  if (temp < 16) {
    return { key: 'cold_warning', severity: 'medium' };
  }

  if (temp > 28) {
    return { key: 'warm_notice', severity: 'low' };
  }

  return { key: 'comfortable', severity: 'low' };
};
