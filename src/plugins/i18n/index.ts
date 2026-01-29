import { createI18n } from 'vue-i18n';

const supportedLocales = ['zh-TW', 'en-US'];

const normalizeLocale = (raw: string | null): string => {
  if (!raw) return 'en-US';
  const trimmed = raw.trim();
  const unquoted = trimmed.startsWith('"') && trimmed.endsWith('"')
    ? trimmed.slice(1, -1)
    : trimmed;
  return supportedLocales.includes(unquoted) ? unquoted : 'en-US';
};

const getStorageLangCode = (): string => {
  try {
    return normalizeLocale(localStorage.getItem('langCode'));
  } catch {
    return 'en-US';
  }
};

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getStorageLangCode(),
  fallbackLocale: 'en-US',
  messages: {
    'zh-TW': {},
    'en-US': {},
  },
});

const loadedLocales = new Set<string>();

const loadLocaleFile = async (locale: string) => {
  const res = await fetch(`/lang/${locale}.json`);
  if (!res.ok) {
    throw new Error(`Failed to load locale: ${locale}`);
  }
  return res.json();
};

export const loadLocale = async (locale: string) => {
  if (!supportedLocales.includes(locale)) return;
  if (loadedLocales.has(locale)) return;
  const messages = await loadLocaleFile(locale);
  i18n.global.setLocaleMessage(locale, messages);
  loadedLocales.add(locale);
};

export const setI18nLocale = async (locale: string) => {
  await loadLocale(locale);
  i18n.global.locale.value = locale;
  try {
    localStorage.setItem('langCode', locale);
  } catch {
    // ignore storage failures
  }
};

export default i18n;
