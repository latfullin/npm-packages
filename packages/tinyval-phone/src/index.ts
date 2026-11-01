// Телефоны всех стран мира для tinyval-mask: тот же API, что у phone / phoneAuto из tinyval-mask/presets
import type { Mask } from 'tinyval-mask';
import {
  phoneFrom,
  phoneAutoFrom,
  detectCountryFrom,
  phoneCountriesFrom,
  type PhoneTable,
  type CountryInfo as Info,
  type PhoneAutoOptions as AutoOptions,
  type PhoneAutoMask as AutoMask,
} from 'tinyval-mask/presets';
import { phoneTable } from './countries.js';

export { phoneTable };
export { flag, countryName } from 'tinyval-mask/presets';

// Страна из таблицы пакета или добавленная через setCountries
export type PhoneCountry = keyof typeof phoneTable | (string & {});
export type CountryInfo = Info<PhoneCountry>;
export type PhoneAutoOptions = AutoOptions<PhoneCountry>;
export type PhoneAutoMask = AutoMask<PhoneCountry>;
// Запись страны: [телефонный код, шаблон после кода, национальная приставка, признак страны]
export type CountryEntry = PhoneTable[string];
// Изменения таблицы: новая или изменённая страна — запись, удалить страну — null
export type Countries = Record<string, CountryEntry | null>;

let table: PhoneTable = phoneTable;

// Поменять, добавить или убрать страны — один раз при старте, до создания масок (как setMessages в tinyval).
// Файл с таблицей для правки: npx tinyval-phone countries. replace — только переданные страны, без остальных
export function setCountries(countries: Countries, options: { replace?: boolean } = {}): void {
  const next: Record<string, CountryEntry> = options.replace ? {} : { ...table };
  for (const [code, entry] of Object.entries(countries)) {
    if (entry) next[code.toLowerCase()] = entry;
    else delete next[code.toLowerCase()];
  }
  table = next;
}

// Текущая таблица стран — с изменениями из setCountries
export const getCountries = (): PhoneTable => table;

// Телефон одной страны: phone('jp') → +81 90-1234-5678
export const phone = (country: PhoneCountry): Mask => phoneFrom(table, country);

// Телефон любой страны: маска, флаг и название — по коду, который вводит пользователь
export const phoneAuto = (options: PhoneAutoOptions = {}): PhoneAutoMask => phoneAutoFrom(table, options);

// Страна по номеру с кодом страны: detectCountry('+1 242 359 1234') → 'bs'
export const detectCountry = (number: string, countries?: readonly PhoneCountry[]): PhoneCountry | undefined =>
  detectCountryFrom(table, number, countries);

// Все страны для выпадающего списка: [{ code: 'ac', dial: '247', flag: '🇦🇨' }, …]
export const phoneCountries = (): CountryInfo[] => phoneCountriesFrom(table);
