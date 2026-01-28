<template>
  <section
    :class="[
      'p-6 md:p-8 rounded-[2rem] border-2 transition-all duration-300 transform hover:scale-[1.01]',
      severityColors[adviceKey.severity]
    ]"
  >
    <div class="flex items-start justify-between">
      <div class="space-y-2">
        <span class="text-xs font-black uppercase tracking-widest opacity-70 flex items-center gap-1">
          <Languages class="w-3 h-3" />
          {{ t('decisionTitle') }}
        </span>
        <h2 class="text-3xl md:text-4xl font-black leading-tight">
          {{ t(`advice.${adviceKey.key}.action`) }}
        </h2>
        <p class="text-base md:text-lg font-bold opacity-90 max-w-md">
          {{ t(`advice.${adviceKey.key}.description`) }}
        </p>
      </div>
      <div class="hidden sm:block float-animation">
        <component
          :is="weatherIcons[weather.status]"
          class="w-12 h-12"
          :class="getWeatherIconClass(weather.status)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { Languages } from 'lucide-vue-next';

import type { AdviceResult, WeatherData, WeatherStatus } from '../types';

defineProps({
  adviceKey: {
    type: Object as PropType<AdviceResult>,
    required: true,
  },
  weather: {
    type: Object as PropType<WeatherData>,
    required: true,
  },
  severityColors: {
    type: Object as PropType<Record<string, string>>,
    required: true,
  },
  getWeatherIconClass: {
    type: Function as PropType<(status: WeatherStatus) => string>,
    required: true,
  },
  weatherIcons: {
    type: Object as PropType<Record<WeatherStatus, any>>,
    required: true,
  },
});

const { t } = useI18n();
</script>
