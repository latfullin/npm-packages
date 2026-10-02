// Приведение типов для данных из query, form-data, env, где всё приходит строками
import type { Message, Schema } from './core.js';
import * as s from './schemas.js';

const TRUE = ['true', '1', 'on', 'yes'];
const FALSE = ['false', '0', 'off', 'no'];

const trimmed = (v: unknown) => (typeof v === 'string' ? v.trim() : v);

export const string = (msg?: Message): Schema<string> =>
  s.preprocess(
    (v) => (typeof v === 'number' || typeof v === 'boolean' || typeof v === 'bigint' ? String(v) : v),
    s.string(msg),
  );

export const number = (msg?: Message): Schema<number> =>
  s.preprocess((v) => {
    v = trimmed(v);
    return typeof v === 'string' && v !== '' ? Number(v) : v;
  }, s.number(msg));

export const boolean = (msg?: Message): Schema<boolean> =>
  s.preprocess((v) => {
    v = trimmed(v);
    if (typeof v === 'string') v = v.toLowerCase();
    if (typeof v === 'number') v = String(v);
    return TRUE.includes(v as string) ? true : FALSE.includes(v as string) ? false : v;
  }, s.boolean(msg));

export const date = (msg?: Message): Schema<Date> =>
  s.preprocess((v) => {
    v = trimmed(v);
    return (typeof v === 'string' && v !== '') || typeof v === 'number' ? new Date(v) : v;
  }, s.date(msg));
