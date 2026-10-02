// Языки сайта. Новый язык: создать i18n/<код>.ts и добавить его сюда.
// Страницы на новом языке появятся сразу — с английским текстом, пока не добавлены блоки ::: <код>
import ru from './ru';
import en from './en';
import zh from './zh';
import type { LangFile } from './types';

export const langs: LangFile[] = [ru, en, zh];

// Язык по умолчанию — без префикса в URL
export const defaultLang = 'ru';

// Язык, текст которого показывается, если перевода нет
export const fallbackLang = 'en';

export const prefix = (code: string) => (code === defaultLang ? '' : `/${code}`);

export function langByHtmlLang(lang: string): LangFile {
  return langs.find((l) => l.lang === lang) ?? langs.find((l) => l.code === fallbackLang)!;
}

export type { LangFile };
