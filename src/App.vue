<template>
  <div class="max-w-2xl mx-auto px-4 py-8 md:py-12 transition-all duration-500 font-sans min-h-screen">
    <!-- Top Bar -->
    <AppHeader />

    <!-- Search Bar -->
    <SearchBar @select-location="setSelectedLoc" />

    <!-- Quick Access Cities -->
    <QuickAccessCities
      :major-cities="majorCities"
      :selected-loc="selectedLoc"
      @toggle-current-location="toggleCurrentLocation"
      @select-city="setSelectedLoc"
    />

    <!-- Main Content -->
    <WeatherSkeleton v-if="loading" />
    <WeatherError
      v-else-if="error"
      :error="error"
      :location-name="selectedLocLabel"
      @retry="loadWeather(selectedLoc)"
    />
    <main v-else-if="weather && adviceKey" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <!-- Location -->
      <WeatherLocation :location-name="weather!.locationName" />

      <!-- ACTION ADVICE -->
      <AdviceCard
        :advice-key="adviceKey!"
        :weather="weather!"
        :severity-colors="severityColors"
        :get-weather-icon-class="getWeatherIconClass"
        :weather-icons="WEATHER_ICONS"
      />

      <!-- OVERVIEW -->
      <WeatherOverview :weather="weather!" />

      <!-- HOURLY FORECAST -->
      <HourlyForecast
        :hourly="weather!.hourly"
        :get-weather-icon-class="getWeatherIconClass"
        :mini-icons="MINI_ICONS"
      />

      <!-- Footer -->
      <AppFooter
        @refresh="loadWeather(selectedLoc)"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { Sun, Cloud, CloudRain, CloudLightning } from 'lucide-vue-next';
import type { WeatherData, LocationInfo, AdviceResult } from './types';
import { WeatherStatus } from './types';
import { fetchWeatherByCoords } from './services/weatherService';
import { getActionAdvice } from './services/adviceEngine';
import WeatherSkeleton from './components/Skeleton.vue';
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import SearchBar from './components/SearchBar.vue';
import QuickAccessCities from './components/QuickAccessCities.vue';
import WeatherError from './components/WeatherError.vue';
import WeatherLocation from './components/WeatherLocation.vue';
import AdviceCard from './components/AdviceCard.vue';
import WeatherOverview from './components/WeatherOverview.vue';
import HourlyForecast from './components/HourlyForecast.vue';

// Constants
const majorCities: LocationInfo[] = [
  { name: 'Taipei' as const, lat: 25.033, lon: 121.5654 },
  { name: 'Taichung' as const, lat: 24.1477, lon: 120.6736 },
  { name: 'Kaohsiung' as const, lat: 22.6273, lon: 120.3014 }
];

// Icon mapping
const WEATHER_ICONS: Record<WeatherStatus, any> = {
  [WeatherStatus.Sunny]: Sun,
  [WeatherStatus.Cloudy]: Cloud,
  [WeatherStatus.Rainy]: CloudRain,
  [WeatherStatus.Storm]: CloudLightning,
};

const MINI_ICONS: Record<WeatherStatus, any> = {
  [WeatherStatus.Sunny]: Sun,
  [WeatherStatus.Cloudy]: Cloud,
  [WeatherStatus.Rainy]: CloudRain,
  [WeatherStatus.Storm]: CloudLightning,
};

// State
const currentLoc = ref<LocationInfo | null>(null);
const selectedLoc = ref<LocationInfo>(majorCities[0]!);
const weather = ref<WeatherData | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const weatherAbort = ref<AbortController | null>(null);

// Methods
const { t } = useI18n();

const debouncedLoadWeather = useDebounceFn((loc: LocationInfo) => {
  loadWeather(loc);
}, 200);

const setSelectedLoc = (loc: LocationInfo) => {
  selectedLoc.value = loc;
  debouncedLoadWeather(loc);
};

const getWeatherIconClass = (status: WeatherStatus): string => {
  switch (status) {
    case WeatherStatus.Sunny:
      return 'text-yellow-500';
    case WeatherStatus.Cloudy:
      return 'text-slate-400';
    case WeatherStatus.Rainy:
      return 'text-blue-500';
    case WeatherStatus.Storm:
      return 'text-purple-600';
    default:
      return 'text-slate-400';
  }
};

const loadWeather = async (loc: LocationInfo) => {
  if (weatherAbort.value) {
    weatherAbort.value.abort();
  }
  const controller = new AbortController();
  weatherAbort.value = controller;
  loading.value = true;
  error.value = null;
  try {
    const displayName = t(`cities.${loc.name}`) !== `cities.${loc.name}`
      ? t(`cities.${loc.name}`)
      : loc.name;

    const data = await fetchWeatherByCoords(loc.lat, loc.lon, displayName, controller.signal);
    if (!controller.signal.aborted) {
      weather.value = data;
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return;
    }
    error.value = t('error');
  } finally {
    if (!controller.signal.aborted) {
      loading.value = false;
    }
  }
};

const detectLocation = () => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      currentLoc.value = {
        name: 'currentLocation',
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      };
      setSelectedLoc(currentLoc.value);
    },
    (err) => console.warn('Geolocation denied', err)
  );
};

const toggleCurrentLocation = () => {
  if (currentLoc.value) {
    setSelectedLoc(currentLoc.value);
  } else {
    detectLocation();
  }
};

onMounted(() => {
  detectLocation();
});

// Computed
const selectedLocLabel = computed(() => {
  const key = `cities.${selectedLoc.value.name}`;
  const translated = t(key);
  return translated !== key ? translated : selectedLoc.value.name;
});

const adviceKey = computed<AdviceResult | null>(() =>
  weather.value ? getActionAdvice(weather.value) : null
);

const severityColors: Record<string, string> = {
  low: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  medium: 'bg-orange-50 border-orange-200 text-orange-800',
  high: 'bg-rose-50 border-rose-200 text-rose-800'
};
</script>
