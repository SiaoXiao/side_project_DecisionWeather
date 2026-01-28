<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <section class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p class="text-slate-500 text-sm font-bold mb-1">{{ t('nowTemp') }}</p>
        <div class="flex items-baseline gap-1">
          <span class="text-5xl font-black text-slate-900">{{ weather.temp }}°</span>
          <span class="text-slate-400 font-bold">C</span>
        </div>
        <p class="text-slate-400 text-xs mt-1 font-bold">{{ t('feelsLike') }} {{ weather.feelsLike }}°C</p>
      </div>
      <div class="text-right">
        <p class="text-slate-500 text-sm font-bold mb-1">{{ t('status') }}</p>
        <p class="text-2xl font-black text-slate-800">{{ t(`weatherStatus.${weather.status}`) }}</p>
        <p class="text-slate-400 text-xs mt-1 font-bold">{{ t('precipProb') }} {{ weather.precipProb }}%</p>
      </div>
    </section>

    <section class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 grid grid-cols-2 gap-4">
      <div class="flex flex-col justify-center">
        <div class="flex items-center gap-2 text-slate-400 mb-1">
          <Droplets class="w-4 h-4 text-blue-500" />
          <span class="text-xs font-black uppercase">{{ t('humidity') }}</span>
        </div>
        <p class="text-xl font-black text-slate-800">{{ weather.humidity }}%</p>
      </div>
      <div class="flex flex-col justify-center border-l border-slate-100 pl-4">
        <div class="flex items-center gap-2 text-slate-400 mb-1">
          <Sun class="w-4 h-4 text-orange-400" />
          <span class="text-xs font-black uppercase">{{ t('uvIndex') }}</span>
        </div>
        <p class="text-xl font-black text-slate-800">{{ weather.uvIndex }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { Droplets, Sun } from 'lucide-vue-next';

import type { WeatherData } from '../types';

defineProps({
  weather: {
    type: Object as PropType<WeatherData>,
    required: true,
  },
});

const { t } = useI18n();
</script>
