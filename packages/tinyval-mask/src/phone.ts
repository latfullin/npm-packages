// Телефоны: маска по стране, автоопределение страны по коду, флаг и название страны для интерфейса
import { createMask, type Mask } from './core.js';

const digits = (s: string) => s.replace(/\D/g, '');

// Таблица стран: код → [телефонный код, формат номера после кода, национальная приставка, признак страны].
// Приставка и признак — регулярные выражения по цифрам номера без кода страны:
// приставка — что набирают внутри страны перед номером (8 в России, 0 в Британии), её можно не набирать;
// признак — начало номера, по которому страна отличается от других с тем же кодом (+1 242 — Багамы); с $ на конце — весь номер
export type PhoneTable = Record<string, readonly [dial: string, pattern: string, trunk?: string, detect?: string]>;

// Свои страны и форматы: phoneAutoFrom({ ...phoneTable, xx: ['999', '99 999 999'] }). Все страны мира — пакет tinyval-phone
export const phoneTable = {
  // 7 и 8 в начале местного номера — код страны: 8 999 … → +7 999 …
  ru: ['7', '(999) 999-99-99', '[78]'],
  // +7 6xx и +7 7xx — Казахстан, остальное — Россия
  kz: ['7', '(999) 999-99-99', '[78]', '[67]'],
  by: ['375', '(99) 999-99-99', '0|80?'],
  ua: ['380', '(99) 999-99-99', '0'],
  uz: ['998', '(99) 999-99-99'],
  kg: ['996', '(999) 999-999', '0'],
  tj: ['992', '(99) 999-99-99'],
  tm: ['993', '(99) 99-99-99', '8'],
  am: ['374', '(99) 999-999', '0'],
  ge: ['995', '(999) 99-99-99', '0'],
  az: ['994', '(99) 999-99-99', '0'],
  md: ['373', '(99) 999-999', '0'],
  lv: ['371', '9999-9999'],
  lt: ['370', '(999) 99999', '[08]'],
  ee: ['372', '999 9999[9]'],
  us: ['1', '(999) 999-9999', '1'],
  ca: ['1', '(999) 999-9999', '1'],
  gb: ['44', '9999 999999', '0'],
  de: ['49', '999 9999999[9]', '0'],
  fr: ['33', '9 99 99 99 99', '0'],
  it: ['39', '999 999 9999'],
  es: ['34', '999 99 99 99'],
  pl: ['48', '999 999 999'],
  tr: ['90', '(999) 999 99 99', '0'],
  cn: ['86', '999 9999 9999', '0'],
  in: ['91', '99999 99999', '0'],
  il: ['972', '99-999-9999', '0'],
  ae: ['971', '99 999 9999', '0'],
} as const satisfies PhoneTable;

export type PhoneCountry = keyof typeof phoneTable;

export interface CountryInfo<C extends string = PhoneCountry> {
  // код страны: 'ru'
  code: C;
  // телефонный код без +: '7'
  dial: string;
  // флаг-эмодзи: 🇷🇺 (Windows вместо флагов показывает буквы — для иконок используйте code)
  flag: string;
}

// регулярные выражения таблиц создаются один раз
const regexps = new Map<string, RegExp>();
const re = (source: string) => {
  let r = regexps.get(source);
  if (!r) regexps.set(source, (r = new RegExp(`^(?:${source})`)));
  return r;
};

// 9 в шаблоне — «любая цифра», поэтому девятки кода страны экранируются
const patternOf = (t: PhoneTable, c: string) => `+${t[c][0].replace(/9/g, '\\9')} ${t[c][1]}`;

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

const info = <C extends string>(t: PhoneTable, code: C): CountryInfo<C> => ({ code, dial: t[code][0], flag: flag(code) });

// Все страны таблицы для выпадающего списка: [{ code: 'ru', dial: '7', flag: '🇷🇺' }, …]
export const phoneCountriesFrom = <T extends PhoneTable>(table: T): CountryInfo<keyof T & string>[] =>
  Object.keys(table).map((c) => info(table, c as keyof T & string));
export const phoneCountries = (): CountryInfo[] => phoneCountriesFrom(phoneTable);

// Страна по цифрам номера с кодом страны. Самый длинный подходящий код; среди стран с общим кодом —
// первая, чей признак подходит, иначе первая без признака (из countries — в их порядке)
export function detectCountryFrom<T extends PhoneTable>(
  table: T,
  number: string,
  countries?: readonly (keyof T & string)[],
): (keyof T & string) | undefined {
  const d = digits(number);
  const list = countries ?? (Object.keys(table) as (keyof T & string)[]);
  let dial = '';
  for (const c of list) if (d.startsWith(table[c][0]) && table[c][0].length > dial.length) dial = table[c][0];
  if (!dial) return;
  const national = d.slice(dial.length);
  const same = list.filter((c) => table[c][0] === dial);
  return same.find((c) => table[c][3] && re(table[c][3]!).test(national)) ?? same.find((c) => !table[c][3]) ?? same[0];
}
export const detectCountry = (number: string, countries?: readonly PhoneCountry[]): PhoneCountry | undefined =>
  detectCountryFrom(phoneTable, number, countries);

// Номер без + — местный: национальная приставка отбрасывается, код страны добавляется. 8 999 … → +7 999 …, 07400 … → +44 7400 …
const trunk = (t: PhoneTable, c: string, s: string): string | undefined => {
  if (s.trimStart().startsWith('+') || !t[c][2]) return;
  const d = digits(s);
  const m = re(t[c][2]!).exec(d);
  return m?.[0] ? `+${t[c][0]}${d.slice(m[0].length)}` : undefined;
};

// без цифр номера значение пустое: префикс +7 ( сам по себе — не номер
const output = (r: { raw: string; value: string }) => (r.raw ? digits(r.value) : '');

// Телефон одной страны. Значение без маски — все цифры с кодом страны: 79991234567
export function phoneFrom<T extends PhoneTable>(table: T, country: keyof T & string): Mask {
  return createMask({
    pattern: patternOf(table, country),
    // код страны в начале набирать не обязательно — это делает сама маска; приставку 8 / 0 — отбросить
    prepare: table[country][2] ? (s) => trunk(table, country, s) ?? s : undefined,
    output,
  });
}
export const phone = (country: PhoneCountry = 'ru'): Mask => phoneFrom(phoneTable, country);

export interface PhoneAutoOptions<C extends string = PhoneCountry> {
  // Страна по умолчанию: номер без + считается местным (9991234567 → +7 999 …), с + — международным
  defaultCountry?: C;
  // Среди каких стран определять; первая из стран с общим кодом (+1) побеждает
  countries?: C[];
}

export type PhoneAutoMask<C extends string = PhoneCountry> = Mask & {
  // Страна для значения поля — для флага, названия, подсказки
  country(value: string): CountryInfo<C> | undefined;
};

// Телефон любой страны таблицы: маска выбирается по коду, который вводит пользователь
export function phoneAutoFrom<T extends PhoneTable>(table: T, options: PhoneAutoOptions<keyof T & string> = {}): PhoneAutoMask<keyof T & string> {
  const { defaultCountry, countries } = options;

  // ввод приводится к международному виду: всегда начинается с +
  const prepare = (input: string): string => {
    // + в середине — пользователь начал вводить номер другой страны: всё до него отбрасывается
    const plus = input.lastIndexOf('+');
    const s = plus > 0 ? input.slice(plus) : input;
    if (s.trimStart().startsWith('+') || !digits(s)) return s;
    if (!defaultCountry) return `+${s}`;
    const dial = table[defaultCountry][0];
    return trunk(table, defaultCountry, s) ?? (digits(s).startsWith(dial) ? `+${s}` : `+${dial}${s}`);
  };
  // страна значения; пустое поле — страна по умолчанию, введённый + без цифр — международный номер
  const detect = (s: string) =>
    detectCountryFrom(table, s, countries) ?? (digits(s) || s.trimStart().startsWith('+') ? undefined : defaultCountry);

  const mask = createMask({
    // valid — номер заполнен по маске определённой страны (общий шаблон «до 15 цифр» правильным не считается)
    validate: (r) => !!detectCountryFrom(table, r.value, countries),
    // пока страна не определена — до 15 цифр (максимум по стандарту E.164)
    pattern: (s) => {
      const c = detect(s);
      return c ? patternOf(table, c) : '+999 999 999 999 999';
    },
    prepare,
    output,
  });

  return {
    ...mask,
    country(value) {
      const c = detect(prepare(String(value ?? '')));
      return c ? info(table, c) : undefined;
    },
  };
}
export const phoneAuto = (options: PhoneAutoOptions = {}): PhoneAutoMask => phoneAutoFrom(phoneTable, options);
