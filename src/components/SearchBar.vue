<template>
  <div class="relative mb-8">
    <div class="relative">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        type="text"
        :placeholder="t('searchPlaceholder')"
        :value="searchQuery"
        @input="handleSearchInput"
        @keydown="handleKeydown"
        @focus="showResults = searchQuery.length >= 2"
        class="w-full pl-12 pr-10 py-4 bg-white  rounded-2xl shadow-sm border border-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-bold text-lg text-slate-900"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full"
      >
        <X class="w-4 h-4 text-slate-400" />
      </button>
    </div>

    <!-- Search Results -->
    <div
      v-if="showResults"
      class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
    >
      <div v-if="isSearching" class="px-5 py-4 text-sm font-bold text-slate-400">
        {{ t('searching') }}
      </div>
      <div v-else-if="searchResults.length === 0" class="px-5 py-4 text-sm font-bold text-slate-400">
        {{ t('noResults') }}
      </div>
      <button
        v-else
        v-for="(res, i) in searchResults"
        :key="i"
        @click="selectLocation(res)"
        @mouseenter="activeIndex = i"
        :class="[
          'w-full px-5 py-4 text-left flex items-center justify-between border-b last:border-0 border-slate-50 transition-colors',
          activeIndex === i ? 'bg-slate-50' : 'hover:bg-slate-50'
        ]"
      >
        <div>
          <p class="font-bold text-slate-800">{{ res.name }}</p>
          <p class="text-xs text-slate-400">{{ res.admin ? `${res.admin}, ` : '' }}{{ res.country }}</p>
        </div>
        <MapPin class="w-4 h-4 text-slate-300" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { Search, X, MapPin } from 'lucide-vue-next';
import type { LocationInfo } from '../types';
import { searchLocations } from '../services/weatherService';

const emit = defineEmits<{
  'select-location': [value: LocationInfo];
}>();

const { t } = useI18n();

// State
const searchQuery = ref('');
const searchResults = ref<LocationInfo[]>([]);
const showResults = ref(false);
const searchAbort = ref<AbortController | null>(null);
const isSearching = ref(false);
const activeIndex = ref(-1);

const debouncedSearch = useDebounceFn(async (input: string) => {
  if (searchAbort.value) {
    searchAbort.value.abort();
  }
  const controller = new AbortController();
  searchAbort.value = controller;
  isSearching.value = true;
  try {
    const results = await searchLocations(input, controller.signal);
    if (controller.signal.aborted) return;
    searchResults.value = results;
    showResults.value = true;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return;
    }
    console.error('Search failed:', err);
    searchResults.value = [];
  } finally {
    if (!controller.signal.aborted) {
      isSearching.value = false;
    }
  }
}, 400);

// Methods
const handleSearchInput = (event: Event) => {
  const input = (event.target as HTMLInputElement).value;
  searchQuery.value = input;

  if (input.length < 2) {
    if (searchAbort.value) {
      searchAbort.value.abort();
    }
    searchResults.value = [];
    showResults.value = false;
    isSearching.value = false;
    activeIndex.value = -1;
    return;
  }

  debouncedSearch(input);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    showResults.value = false;
    return;
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    if (!showResults.value) showResults.value = true;
    if (searchResults.value.length === 0) return;
    event.preventDefault();
    const max = searchResults.value.length - 1;
    if (event.key === 'ArrowDown') {
      activeIndex.value = activeIndex.value >= max ? 0 : activeIndex.value + 1;
    } else {
      activeIndex.value = activeIndex.value <= 0 ? max : activeIndex.value - 1;
    }
    return;
  }

  if (event.key === 'Enter') {
    if (activeIndex.value >= 0) {
      const selected = searchResults.value[activeIndex.value];
      if (selected) {
        selectLocation(selected);
      }
    }
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  showResults.value = false;
  isSearching.value = false;
  activeIndex.value = -1;
};

const selectLocation = (loc: LocationInfo) => {
  emit('select-location', loc);
  clearSearch();
};

watch(searchResults, (results) => {
  activeIndex.value = results.length > 0 ? 0 : -1;
});
</script>
