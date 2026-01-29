<template>
  <div class="flex justify-between items-center mb-6">
    <div class="flex items-center gap-2">
      <div class="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
        <Sun class="text-white w-6 h-6" />
      </div>
      <h1 class="text-xl font-black tracking-tight hidden sm:block">{{ t('appName') }}</h1>
    </div>
    <div class="flex items-center gap-3">
      <!-- Language Switcher -->
      <div class="flex bg-slate-100  p-1 rounded-full border border-slate-200 ">
        <button
          v-for="l in languages"
          :key="l"
          @click="setLang(l)"
          :class="[
            'px-3 py-1 rounded-full text-xs font-bold transition-all',
            locale === l
              ? 'bg-white shadow-sm text-brand-600'
              : 'text-slate-400'
          ]"
        >
          {{ l === 'zh-TW' ? '繁' : 'EN' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue';
import { useI18n } from 'vue-i18n';
import { Sun } from 'lucide-vue-next';
import type { Language } from '../types';
import { setI18nLocale } from '../plugins/i18n';

const { locale, t } = useI18n();

const languages: Language[] = ['zh-TW', 'en-US'];

const setLang = async (newLang: Language) => {
  await setI18nLocale(newLang);
  locale.value = newLang;
};

// Provide to child components
provide('locale', locale);
</script>
