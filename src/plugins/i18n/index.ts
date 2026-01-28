import { createI18n } from 'vue-i18n';

const supportedLocales = ['zh-TW', 'en-US'];

const normalizeLocale = (raw: string | null): string => {
  if (!raw) return 'zh-TW';
  const trimmed = raw.trim();
  const unquoted = trimmed.startsWith('"') && trimmed.endsWith('"')
    ? trimmed.slice(1, -1)
    : trimmed;
  return supportedLocales.includes(unquoted) ? unquoted : 'zh-TW';
};

const getInitialLocale = (): string => {
  try {
    return normalizeLocale(localStorage.getItem('dw_lang'));
  } catch {
    return 'zh-TW';
  }
};

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'zh-TW',
  flatJson: true,
  messageResolver: (obj, path) => {
    if (!obj || typeof obj !== 'object') return null;
    if (Object.prototype.hasOwnProperty.call(obj, path)) {
      return (obj as Record<string, unknown>)[path];
    }
    return path.split('.').reduce((acc: any, key) => (acc ? acc[key] : null), obj as any);
  },
  messages: {},
});

const loadedLocales = new Set<string>();

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const flattenMessages = (input: Record<string, unknown>, prefix = '', output: Record<string, string> = {}) => {
  for (const [key, value] of Object.entries(input)) {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (isPlainObject(value)) {
      flattenMessages(value, nextKey, output);
    } else if (typeof value === 'string') {
      output[nextKey] = value;
    }
  }
  return output;
};

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
  const rawMessages = await loadLocaleFile(locale);
  const messages = isPlainObject(rawMessages)
    ? flattenMessages(rawMessages as Record<string, unknown>)
    : {};
  i18n.global.setLocaleMessage(locale, messages);
  loadedLocales.add(locale);
};

export const setI18nLocale = async (locale: string) => {
  await loadLocale(locale);
  i18n.global.locale.value = locale;
  try {
    localStorage.setItem('dw_lang', locale);
  } catch {
    // ignore storage failures
  }
};

export default i18n;
