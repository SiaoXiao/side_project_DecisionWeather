<template>
  <div class="flex gap-2 mb-8 overflow-x-auto pb-5 scrollbar-hide items-center">
    <button
      @click="emit('toggle-current-location')"
      :class="[
        'flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border',
        selectedLoc.name === 'currentLocation'
          ? 'bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-500/30'
          : 'bg-white text-slate-500 border-slate-200 hover:border-brand-500'
      ]"
    >
      <Navigation :class="['w-4 h-4', selectedLoc.name === 'currentLocation' ? 'animate-pulse' : '']" />
      {{ t('currentLocation') }}
    </button>

    <div class="h-6 w-[1px] bg-slate-200 mx-2 flex-shrink-0" />

    <button
      v-for="c in majorCities"
      :key="c.name"
      @click="emit('select-city', c)"
      :class="[
        'px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border',
        selectedLoc.name === c.name
          ? 'bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-500/30'
          : 'bg-white text-slate-500 border-slate-200 hover:border-brand-500'
      ]"
    >
      {{ t(`cities.${c.name}`) }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { Navigation } from 'lucide-vue-next';

import type { LocationInfo } from '../types';

defineProps({
  majorCities: {
    type: Array as PropType<LocationInfo[]>,
    required: true,
  },
  selectedLoc: {
    type: Object as PropType<LocationInfo>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'toggle-current-location'): void;
  (e: 'select-city', loc: LocationInfo): void;
}>();

const { t } = useI18n();
</script>
