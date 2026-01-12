import { Locale } from '@/i18n.config';

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  'zh-TW': () => import('@/dictionaries/zh-TW.json').then((module) => module.default),
  'zh-CN': () => import('@/dictionaries/zh-CN.json').then((module) => module.default),
  'zh-HK': () => import('@/dictionaries/zh-HK.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};

