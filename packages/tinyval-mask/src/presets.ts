// Готовые маски: import { masks } from 'tinyval-mask'; masks.phone('ru')
import { createMask, type Mask, type Token } from './core.js';
import { numberMask, type NumberMaskOptions } from './number.js';

const digits = (s: string) => s.replace(/\D/g, '');
const nums = (s: string) => digits(s).split('').map(Number);
const weighted = (d: number[], w: number[]) => w.reduce((sum, x, i) => sum + x * d[i], 0);

// Контрольная цифра номера карты (алгоритм Луна)
const luhn = (s: string) => {
  const d = nums(s);
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let x = d[d.length - 1 - i];
    if (i % 2) x = x * 2 > 9 ? x * 2 - 9 : x * 2;
    sum += x;
  }
  return d.length >= 12 && sum % 10 === 0;
};

// Остаток от деления длинного числа (ОГРН — 13–15 цифр, больше Number.MAX_SAFE_INTEGER не бывает, но так надёжнее)
const mod = (s: string, m: number) => [...s].reduce((r, ch) => (r * 10 + Number(ch)) % m, 0);

// ---------- телефоны

export {
  phone,
  phoneAuto,
  phoneCountries,
  detectCountry,
  phoneTable,
  phoneFrom,
  phoneAutoFrom,
  phoneCountriesFrom,
  detectCountryFrom,
  type PhoneTable,
  flag,
  countryName,
  type PhoneCountry,
  type CountryInfo,
  type PhoneAutoOptions,
  type PhoneAutoMask,
} from './phone.js';

// ---------- банковские карты

export type CardBrand = 'visa' | 'mastercard' | 'mir' | 'amex' | 'unionpay' | 'unknown';

// Платёжная система по первым цифрам номера
export function cardBrand(number: string): CardBrand {
  const d = digits(String(number ?? ''));
  if (/^220[0-4]/.test(d)) return 'mir';
  if (/^3[47]/.test(d)) return 'amex';
  if (/^4/.test(d)) return 'visa';
  if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d\d|27[01]\d|2720)/.test(d)) return 'mastercard';
  if (/^62/.test(d)) return 'unionpay';
  return 'unknown';
}

// Номер карты: Amex — 4-6-5, остальные — по 4 цифры, до 19 цифр
export const card = (): Mask =>
  createMask({
    validate: (r) => luhn(r.raw),
    pattern: (input) =>
      cardBrand(input) === 'amex'
        ? '9999 999999 99999'
        : digits(input).length > 16
          ? '9999 9999 9999 9999 999'
          : '9999 9999 9999 9999',
  });

// valid — месяц 01–12 и срок не истёк (карта действует до конца указанного месяца)
export const cardExpiry = (): Mask =>
  createMask({
    pattern: '99/99',
    allow: dateAllow('mmyy'),
    validate: ({ raw }) => {
      const month = Number(raw.slice(0, 2));
      const year = 2000 + Number(raw.slice(2, 4));
      const now = new Date();
      return month >= 1 && month <= 12 && (year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1));
    },
  });
export const cvc = (): Mask => createMask('999[9]');

// ---------- даты и время

export type DateFormat = 'dd.mm.yyyy' | 'yyyy-mm-dd' | 'mm/dd/yyyy' | 'dd/mm/yyyy';

// Какие цифры допустимы на позиции: spec — буква на каждую цифру (d — день, m — месяц, y — год, H — часы, i — минуты, s — секунды).
// Не пропустит 32-е число, 13-й месяц, 25-й час и 00.00. Существует ли дата (31 февраля) — проверяет валидация
function dateAllow(spec: string) {
  return (raw: string, ch: string): boolean => {
    const k = raw.length;
    const t = spec[k];
    const first = k === 0 || spec[k - 1] !== t;
    const prev = raw[k - 1];
    switch (t) {
      case 'd':
        return first ? ch <= '3' : prev === '3' ? ch <= '1' : prev !== '0' || ch !== '0';
      case 'm':
        return first ? ch <= '1' : prev === '1' ? ch <= '2' : prev !== '0' || ch !== '0';
      case 'H':
        return first ? ch <= '2' : prev !== '2' || ch <= '3';
      case 'i':
      case 's':
        return !first || ch <= '5';
      default:
        return true;
    }
  };
}

const letters = (format: string) => format.replace(/[^dmy]/g, '');

// valid — такая дата существует: 31.02 нет, 29.02 — только в високосный год
const dateExists = (spec: string) => ({ raw }: { raw: string }) => {
  const part = (ch: string) => Number([...spec].map((t, i) => (t === ch ? raw[i] : '')).join(''));
  const y = part('y');
  const m = part('m');
  const d = part('d');
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return m >= 1 && m <= 12 && d >= 1 && d <= days;
};

export const date = (format: DateFormat = 'dd.mm.yyyy'): Mask =>
  createMask({ pattern: format.replace(/[dmy]/g, '9'), allow: dateAllow(letters(format)), validate: dateExists(letters(format)) });
export const time = (seconds = false): Mask =>
  createMask({ pattern: seconds ? '99:99:99' : '99:99', allow: dateAllow(seconds ? 'HHiiss' : 'HHii') });
export const datetime = (format: DateFormat = 'dd.mm.yyyy'): Mask =>
  createMask({
    pattern: `${format.replace(/[dmy]/g, '9')} 99:99`,
    allow: dateAllow(`${letters(format)}HHii`),
    validate: dateExists(`${letters(format)}HHii`),
  });

// ---------- документы и реквизиты РФ

// valid — контрольные суммы ИНН (10 цифр — организация, 12 — физлицо)
export const inn = (): Mask =>
  createMask({
    pattern: '9999999999[99]',
    validate: ({ raw }) => {
      const d = nums(raw);
      const c = (w: number[]) => (weighted(d, w) % 11) % 10;
      return d.length === 10
        ? c([2, 4, 10, 3, 5, 9, 4, 6, 8]) === d[9]
        : c([7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === d[10] && c([3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === d[11];
    },
  });

// valid — контрольное число СНИЛС
export const snils = (): Mask =>
  createMask({
    pattern: '999-999-999 99',
    validate: ({ raw }) => {
      const d = nums(raw);
      const sum = weighted(d, [9, 8, 7, 6, 5, 4, 3, 2, 1]);
      const control = sum < 100 ? sum : sum === 100 || sum === 101 ? 0 : sum % 101 === 100 ? 0 : sum % 101;
      return control === d[9] * 10 + d[10];
    },
  });
export const passport = (): Mask => createMask('99 99 999999');
// valid — контрольная цифра ОГРН (13 цифр) или ОГРНИП (15 цифр)
export const ogrn = (): Mask =>
  createMask({
    pattern: '9999999999999[99]',
    validate: ({ raw }) => {
      const body = raw.slice(0, -1);
      return (mod(body, raw.length === 13 ? 11 : 13) % 10) === Number(raw[raw.length - 1]);
    },
  });
export const bik = (): Mask => createMask('999999999');
export const kpp = (): Mask => createMask({ pattern: '9999XX999', tokens: { X: { pattern: /[0-9a-z]/i, transform: 'upper' } } });
export const account = (): Mask => createMask('99999 999 9 9999 9999999');
export const postcode = (): Mask => createMask('999999');

// Госномер: буквы, похожие на латиницу (А В Е К М Н О Р С Т У Х), можно вводить и латиницей
const LATIN: Record<string, string> = { A: 'А', B: 'В', E: 'Е', K: 'К', M: 'М', H: 'Н', O: 'О', P: 'Р', C: 'С', T: 'Т', Y: 'У', X: 'Х' };
const plateLetter: Token = {
  pattern: /[АВЕКМНОРСТУХABEKMHOPCTYX]/i,
  transform: (ch) => LATIN[ch.toUpperCase()] ?? ch.toUpperCase(),
};
export const carPlate = (): Mask => createMask({ pattern: 'L 999 LL 99[9]', tokens: { L: plateLetter } });

// ---------- прочее

const hex: Token = { pattern: /[0-9a-f]/i, transform: 'upper' };
export const mac = (): Mask => createMask({ pattern: 'HH:HH:HH:HH:HH:HH', tokens: { H: hex } });
export const hexColor = (): Mask => createMask({ pattern: '#HHHHHH', tokens: { H: hex } });

// Деньги: money({ currency: '₽' }) → 1 234,50 ₽
export const money = (options: NumberMaskOptions & { currency?: string } = {}): Mask => {
  const { currency, ...rest } = options;
  return numberMask({ precision: 2, suffix: currency ? ` ${currency}` : '', ...rest });
};

export const percent = (options: NumberMaskOptions = {}): Mask => numberMask({ precision: 0, suffix: ' %', ...options });
