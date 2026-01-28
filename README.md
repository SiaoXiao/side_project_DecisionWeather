# DecisionWeather

A lightweight weather decision helper built with Vue 3 + Vite. It provides quick city search, current conditions, and a simple action-oriented recommendation card.

## Features

- Geolocation-based weather for current location
- City search with keyboard navigation
- Action advice based on temperature, rain, and UV
- Hourly forecast for the next 6 hours
- i18n support (zh-TW, en-US)
- Clean, responsive UI

## Tech Stack

- Vue 3 + TypeScript + Vite
- vue-i18n
- @vueuse/core
- Open-Meteo API (no API key required)

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Notes

- Weather data and geocoding are fetched from Open-Meteo.
- If geolocation is denied, use the city buttons or search to select a location.
