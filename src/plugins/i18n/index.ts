import { createI18n } from 'vue-i18n';

const supportedLocales = ['zh-TW', 'en-US'] as const;
type SupportedLocale = (typeof supportedLocales)[number];

const getStorageLangCode = (): SupportedLocale => {
  try {
    const value = localStorage.getItem('langCode');
    return supportedLocales.includes(value as SupportedLocale) ? (value as SupportedLocale) : 'en-US';
  } catch {
    return 'en-US';
  }
};

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getStorageLangCode(),
  fallbackLocale: 'en-US',
  flatJson: true,
  messages: {
    'zh-TW': {},
    'en-US': {},
  },
});

const loadedLocales = new Set<SupportedLocale>();

const loadLocaleFile = async (locale: SupportedLocale) => {
  const res = await fetch(`/lang/${locale}.json`);
  if (!res.ok) {
    throw new Error(`Failed to load locale: ${locale}`);
  }
  return res.json();
};

export const loadLocale = async (locale: SupportedLocale) => {
  if (loadedLocales.has(locale)) return;
  const messages = await loadLocaleFile(locale);
  i18n.global.setLocaleMessage(locale, messages);
  loadedLocales.add(locale);
};

export const setI18nLocale = async (locale: SupportedLocale) => {
  await loadLocale(locale);
  i18n.global.locale.value = locale;
  try {
    localStorage.setItem('langCode', locale);
  } catch {
    // ignore storage failures
  }
};

export default i18n;
