import { createI18n } from 'vue-i18n';
import { translations } from '../../translations';

const supportedLocales = Object.keys(translations);

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

const resolveNestedKey = (locale: string, key: string): string => {
  const messages = (translations as Record<string, any>)[locale];
  if (!messages) return key;
  const value = key.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), messages);
  return typeof value === 'string' ? value : key;
};

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'zh-TW',
  messages: translations,
  missing: (locale, key) => {
    const resolved = resolveNestedKey(locale, key);
    if (resolved !== key) return resolved;
    return resolveNestedKey('zh-TW', key);
  },
});

export default i18n;
