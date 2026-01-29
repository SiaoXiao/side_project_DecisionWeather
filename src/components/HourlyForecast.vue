<template>
  <section class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
    <h3 class="font-black text-slate-800 flex items-center gap-2 mb-6">
      {{ t('future6Hours') }}
      <ChevronRight class="w-4 h-4 text-slate-400" />
    </h3>
    <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      <div
        v-for="(h, idx) in hourly"
        :key="idx"
        class="flex flex-col items-center min-w-[80px] space-y-3 bg-slate-50 p-4 rounded-3xl border border-slate-100 transition-colors hover:bg-slate-100 group"
      >
        <span class="text-xs font-black text-slate-400 text-center">{{ formatHour(h.time) }}</span>
        <div class="transition-transform group-hover:scale-110">
          <component :is="miniIcons[h.status]" class="w-6 h-6" :class="getWeatherIconClass(h.status)" />
        </div>
        <span class="text-lg font-black text-slate-800">{{ h.temp }}°</span>
        <div class="flex items-center gap-0.5 text-[10px] font-black text-blue-500">
          <Umbrella class="w-3 h-3" />
          <span>{{ h.precipProb }}%</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { ChevronRight, Umbrella } from 'lucide-vue-next';

import type { HourlyForecast, WeatherStatus } from '../types';
import { formatHour } from '../utils/timeFormat';

defineProps({
  hourly: {
    type: Array as PropType<HourlyForecast[]>,
    required: true,
  },
  getWeatherIconClass: {
    type: Function as PropType<(status: WeatherStatus) => string>,
    required: true,
  },
  miniIcons: {
    type: Object as PropType<Record<WeatherStatus, any>>,
    required: true,
  },
});

const { t } = useI18n();
</script>
