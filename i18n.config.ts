export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'zh-TW', 'zh-CN'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

