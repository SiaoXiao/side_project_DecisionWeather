<template>
  <div class="flex items-center gap-2 text-slate-400 px-2">
    <MapPin class="w-4 h-4 text-brand-500" />
    <span class="font-bold text-sm">{{ locationName }}</span>
  </div>
</template>

<script setup lang="ts">
import { MapPin } from 'lucide-vue-next';

defineProps({
  locationName: {
    type: String,
    required: true,
  },
});
</script>
