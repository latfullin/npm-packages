// Телефоны: маска по стране, автоопределение страны по коду, флаг и название страны для интерфейса
import { createMask, type Mask } from './core.js';

const digits = (s: string) => s.replace(/\D/g, '');

// Телефонный код страны и формат номера после кода (основной формат мобильных номеров)
const COUNTRIES = {
  ru: ['7', '(999) 999-99-99'],
  kz: ['7', '(999) 999-99-99'],
  by: ['375', '(99) 999-99-99'],
  ua: ['380', '(99) 999-99-99'],
  uz: ['998', '(99) 999-99-99'],
  kg: ['996', '(999) 999-999'],
  tj: ['992', '(99) 999-99-99'],
  tm: ['993', '(99) 99-99-99'],
  am: ['374', '(99) 999-999'],
  ge: ['995', '(999) 99-99-99'],
  az: ['994', '(99) 999-99-99'],
  md: ['373', '(99) 999-999'],
  lv: ['371', '9999-9999'],
  lt: ['370', '(999) 99999'],
  ee: ['372', '999 9999[9]'],
  us: ['1', '(999) 999-9999'],
  ca: ['1', '(999) 999-9999'],
  gb: ['44', '9999 999999'],
  de: ['49', '999 9999999[9]'],
  fr: ['33', '9 99 99 99 99'],
  it: ['39', '999 999 9999'],
  es: ['34', '999 99 99 99'],
  pl: ['48', '999 999 999'],
  tr: ['90', '(999) 999 99 99'],
  cn: ['86', '999 9999 9999'],
  in: ['91', '99999 99999'],
  il: ['972', '99-999-9999'],
  ae: ['971', '99 999 9999'],
} as const satisfies Record<string, readonly [string, string]>;

export type PhoneCountry = keyof typeof COUNTRIES;

export interface CountryInfo {
  // код страны: 'ru'
  code: PhoneCountry;
  // телефонный код без +: '7'
  dial: string;
  // флаг-эмодзи: 🇷🇺 (Windows вместо флагов показывает буквы — для иконок используйте code)
  flag: string;
}

// 9 в шаблоне — «любая цифра», поэтому девятки кода страны экранируются
const patternOf = (c: PhoneCountry) => `+${COUNTRIES[c][0].replace(/9/g, '\\9')} ${COUNTRIES[c][1]}`;

// Флаг-эмодзи по коду страны: flag('ru') → 🇷🇺
export const flag = (code: string): string =>
  String.fromCodePoint(...[...code.toUpperCase()].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));

// Название страны на нужном языке: countryName('by', 'ru') → «Беларусь». Берётся из Intl, данных в пакете нет
export function countryName(code: string, locale = 'en'): string {
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code.toUpperCase()) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

const info = (code: PhoneCountry): CountryInfo => ({ code, dial: COUNTRIES[code][0], flag: flag(code) });

// Все страны для выпадающего списка: phoneCountries() → [{ code: 'ru', dial: '7', flag: '🇷🇺' }, …]
export const phoneCountries = (): CountryInfo[] => (Object.keys(COUNTRIES) as PhoneCountry[]).map(info);

// Страна по цифрам номера (с кодом страны). countries — среди каких искать и кого предпочесть при общем коде (+1: us или ca)
export function detectCountry(number: string, countries?: readonly PhoneCountry[]): PhoneCountry | undefined {
  const d = digits(number);
  const list = countries ?? (Object.keys(COUNTRIES) as PhoneCountry[]);
  let best: PhoneCountry | undefined;
  for (const c of list) {
    const dial = COUNTRIES[c][0];
    if (!d.startsWith(dial) || (best && COUNTRIES[best][0].length >= dial.length)) continue;
    // +7: Казахстан — коды операторов 6xx и 7xx, остальное — Россия
    if (dial === '7' && list.includes('ru') && list.includes('kz')) {
      best = /^7[67]/.test(d) ? 'kz' : 'ru';
      continue;
    }
    best = c;
  }
  return best;
}

// В России и Казахстане номер набирают с 7 или 8 в начале — это код страны: 8 999 … → +7 (999) …
const sevenPrefix = (s: string) =>
  !s.trimStart().startsWith('+') && /^\D*[78]/.test(s) ? `+7${s.replace(/^\D*[78]/, '')}` : s;

// без цифр номера значение пустое: префикс +7 ( сам по себе — не номер
const output = (r: { raw: string; value: string }) => (r.raw ? digits(r.value) : '');

// Телефон одной страны. Значение без маски — все цифры с кодом страны: 79991234567
export function phone(country: PhoneCountry = 'ru'): Mask {
  return createMask({
    pattern: patternOf(country),
    prepare: COUNTRIES[country][0] === '7' ? sevenPrefix : undefined,
    output,
  });
}

export interface PhoneAutoOptions {
  // Страна по умолчанию: номер без + считается местным (9991234567 → +7 999 …), с + — международным
  defaultCountry?: PhoneCountry;
  // Среди каких стран определять; первая из стран с общим кодом (+1) побеждает
  countries?: PhoneCountry[];
}

export type PhoneAutoMask = Mask & {
  // Страна для значения поля — для флага, названия, подсказки
  country(value: string): CountryInfo | undefined;
};

// Телефон любой страны: маска выбирается по коду, который вводит пользователь
export function phoneAuto(options: PhoneAutoOptions = {}): PhoneAutoMask {
  const { defaultCountry, countries } = options;
  const dial = defaultCountry ? COUNTRIES[defaultCountry][0] : undefined;

  // ввод приводится к международному виду: всегда начинается с +
  const prepare = (input: string): string => {
    // + в середине — пользователь начал вводить номер другой страны: всё до него отбрасывается
    const plus = input.lastIndexOf('+');
    const s = plus > 0 ? input.slice(plus) : input;
    if (s.trimStart().startsWith('+') || !digits(s)) return s;
    if (dial === '7') return sevenPrefix(s).startsWith('+') ? sevenPrefix(s) : `+7${s}`;
    if (dial) return digits(s).startsWith(dial) ? `+${s}` : `+${dial}${s}`;
    return `+${s}`;
  };

  const mask = createMask({
    // valid — номер заполнен по маске определённой страны (общий шаблон «до 15 цифр» правильным не считается)
    validate: (r) => !!detectCountry(r.value, countries),
    // пока страна не определена — до 15 цифр (максимум по стандарту E.164)
    pattern: (s) => {
      // пустое поле — шаблон страны по умолчанию: +7 (___) ___-__-__; введённый + без цифр — международный номер
      const c = detectCountry(s, countries) ?? (digits(s) || s.trimStart().startsWith('+') ? undefined : defaultCountry);
      return c ? patternOf(c) : '+999 999 999 999 999';
    },
    prepare,
    output,
  });

  return {
    ...mask,
    country(value) {
      const s = prepare(String(value ?? ''));
      const c = detectCountry(s, countries) ?? (digits(s) || s.trimStart().startsWith('+') ? undefined : defaultCountry);
      return c ? info(c) : undefined;
    },
  };
}
