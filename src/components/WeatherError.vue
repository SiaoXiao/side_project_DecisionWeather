<template>
  <div class="text-center py-20 bg-white rounded-[2rem] border border-dashed border-rose-300">
    <RotateCcw
      class="w-12 h-12 text-rose-300 mx-auto mb-4 cursor-pointer"
      @click="emit('retry')"
    />
    <p v-if="locationName" class="text-slate-400 text-sm font-bold mb-2">{{ locationName }}</p>
    <p class="text-rose-500 font-bold">{{ error }}</p>
    <p class="text-slate-400 text-xs mt-2">{{ t('errorHint') }}</p>
    <button @click="emit('retry')" class="mt-4 text-sm text-slate-400 underline">
      {{ t('retry') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { RotateCcw } from 'lucide-vue-next';

defineProps({
  error: {
    type: String,
    required: true,
  },
  locationName: {
    type: String,
    required: false,
  },
});

const emit = defineEmits<{
  (e: 'retry'): void;
}>();

const { t } = useI18n();
</script>
