<template>
  <footer class="text-center pt-8 pb-12">
    <button
      @click="onRefresh"
      class="inline-flex items-center gap-2 text-slate-400 hover:text-brand-500 transition-colors text-sm font-bold"
    >
      <RotateCcw class="w-4 h-4" />
      {{ t('refresh') }}
    </button>
    <p class="text-[10px] text-slate-300 mt-4 uppercase tracking-tighter">
      {{ t('footerSource') }}
    </p>
    <p class="text-[10px] text-slate-300 mt-2">
      Copyright © Keith Lee 2026. All Rights Reserved.
    </p>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { RotateCcw } from 'lucide-vue-next';

const emit = defineEmits<{
  refresh: [];
}>();

const { t } = useI18n();

const onRefresh = () => {
  emit('refresh');
};
</script>
