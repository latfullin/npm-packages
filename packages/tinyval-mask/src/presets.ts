// Готовые маски: import { masks } from 'tinyval-mask'; masks.phone('ru')
import { createMask, type Mask, type Token } from './core.js';
import { numberMask, type NumberMaskOptions } from './number.js';

const digits = (s: string) => s.replace(/\D/g, '');

// ---------- телефоны

const PHONES = {
  ru: '+7 (999) 999-99-99',
  kz: '+7 (999) 999-99-99',
  by: '+375 (99) 999-99-99',
  ua: '+380 (99) 999-99-99',
  // 9 в шаблоне — «любая цифра», поэтому девятки кода страны экранированы
  uz: '+\\9\\98 (99) 999-99-99',
  us: '+1 (999) 999-9999',
};

export type PhoneCountry = keyof typeof PHONES;

// Телефон. Значение без маски — все цифры с кодом страны: 79991234567
export function phone(country: PhoneCountry = 'ru'): Mask {
  const seven = country === 'ru' || country === 'kz';
  return createMask({
    pattern: PHONES[country],
    // В России и Казахстане номер набирают с 7 или 8 в начале — это код страны: 8 999 … → +7 (999) …
    prepare: seven ? (s) => (!s.trimStart().startsWith('+') && /^\D*[78]/.test(s) ? `+7${s.replace(/^\D*[78]/, '')}` : s) : undefined,
    output: (r) => digits(r.value),
  });
}

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
    pattern: (input) =>
      cardBrand(input) === 'amex'
        ? '9999 999999 99999'
        : digits(input).length > 16
          ? '9999 9999 9999 9999 999'
          : '9999 9999 9999 9999',
  });

export const cardExpiry = (): Mask => createMask('99/99');
export const cvc = (): Mask => createMask('999[9]');

// ---------- даты и время

export type DateFormat = 'dd.mm.yyyy' | 'yyyy-mm-dd' | 'mm/dd/yyyy' | 'dd/mm/yyyy';

export const date = (format: DateFormat = 'dd.mm.yyyy'): Mask => createMask(format.replace(/[dmy]/g, '9'));
export const time = (seconds = false): Mask => createMask(seconds ? '99:99:99' : '99:99');
export const datetime = (format: DateFormat = 'dd.mm.yyyy'): Mask => createMask(`${format.replace(/[dmy]/g, '9')} 99:99`);

// ---------- документы и реквизиты РФ

export const inn = (): Mask => createMask('9999999999[99]');
export const snils = (): Mask => createMask('999-999-999 99');
export const passport = (): Mask => createMask('99 99 999999');
export const ogrn = (): Mask => createMask('9999999999999[99]');
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
