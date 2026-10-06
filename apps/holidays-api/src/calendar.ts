// Праздники и рабочие дни любой страны: праздники из date-holidays, для РФ — производственный календарь из ru.ts
import Holidays, { type HolidaysTypes } from 'date-holidays';
import { ruHolidays, ruYears } from './ru.js';

export type HolidayType = HolidaysTypes.HolidayType;
export type DayKind = 'workday' | 'weekend' | 'holiday' | 'transfer' | 'working-weekend';

export interface Place {
  country: string;
  region?: string;
  lang?: string;
}

export interface Holiday {
  date: string;
  name: string;
  type: HolidayType;
}

export interface Day {
  date: string;
  workday: boolean;
  kind: DayKind;
  // предпраздничный день, короче на час
  short?: true;
  holiday?: string;
}

export interface Month {
  month: number;
  days: number;
  workdays: number;
  offdays: number;
  short: number;
  hours: { 40: number; 36: number; 24: number };
}

export interface Calendar {
  country: string;
  region?: string;
  year: number;
  // откуда переносы: постановление для РФ, иначе правила date-holidays
  source: string;
  // переносы не утверждены — посчитаны по ст. 112 ТК РФ
  estimated: boolean;
  weekend: string[];
  months: Month[];
  total: Omit<Month, 'month'>;
  // нерабочие дни, кроме обычных выходных: праздники и переносы
  off: Day[];
  // рабочие выходные и сокращённые дни
  work: string[];
  short: string[];
}

export const MIN_YEAR = 1970;
export const MAX_YEAR = 2100;
const DAY = 86_400_000;
const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// Даты как номера дней от 1970-01-01 — без часовых поясов
const toDay = (date: string): number => Date.UTC(+date.slice(0, 4), +date.slice(5, 7) - 1, +date.slice(8, 10)) / DAY;
const fromDay = (n: number): string => new Date(n * DAY).toISOString().slice(0, 10);
const weekday = (n: number): number => (((n + 4) % 7) + 7) % 7;

export const isDate = (s: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(s) && fromDay(toDay(s)) === s;

const all = new Holidays();
const countryNames = new Map<string, Record<string, string>>();

export function countries(lang?: string): { code: string; name: string }[] {
  const key = lang ?? '';
  if (!countryNames.has(key)) countryNames.set(key, all.getCountries(lang));
  return Object.entries(countryNames.get(key)!).map(([code, name]) => ({ code, name }));
}

export function regions(country: string, lang?: string): { code: string; name: string }[] {
  return Object.entries(all.getStates(country.toUpperCase(), lang) ?? {}).map(([code, name]) => ({ code, name }));
}

// Страна и регион существуют: RU, DE + BY
export function hasPlace(country: string, region?: string): boolean {
  const c = country.toUpperCase();
  if (!(c in all.getCountries())) return false;
  return !region || region.toUpperCase() in (all.getStates(c) ?? {});
}

// Ограниченный кеш: при переполнении сбрасывается целиком
function cached<T>(map: Map<string, T>, key: string, make: () => T): T {
  let value = map.get(key);
  if (value === undefined) {
    if (map.size >= 1000) map.clear();
    map.set(key, (value = make()));
  }
  return value;
}

const instances = new Map<string, Holidays>();
const instance = (country: string, region?: string): Holidays =>
  cached(instances, `${country}|${region ?? ''}`, () => (region ? new Holidays(country, region) : new Holidays(country)));

// Дни праздника: целый день — если праздник идёт в его полдень (канун с 18:00 не выходной, «каникулы» на 5 дней — 5 дат)
function holidayDays(h: HolidaysTypes.Holiday): string[] {
  const [date, time = '00:00:00', zone] = h.date.split(' ');
  const [hh, mm, ss] = time.split(':').map(Number);
  const offset = zone ? (zone[0] === '-' ? -1 : 1) * (+zone.slice(1, 3) * 60 + +zone.slice(3, 5)) * 60_000 : 0;
  const start = toDay(date) * DAY + ((hh * 60 + mm) * 60 + ss) * 1000 + offset;
  const end = start + (h.end.getTime() - h.start.getTime());
  const days: string[] = [];
  for (let n = Math.floor(start / DAY); n * DAY + DAY / 2 < end; n++) if (n * DAY + DAY / 2 >= start) days.push(fromDay(n));
  return days.length ? days : [date];
}

// Праздники за год: по одной записи на каждый день. Для РФ нерабочие — только по ст. 112 ТК РФ
export function holidays(place: Place, year: number, types: HolidayType[] = ['public']): Holiday[] {
  const country = place.country.toUpperCase();
  const region = place.region?.toUpperCase();
  const out: Holiday[] = [];
  for (const h of instance(country, region).getHolidays(year, place.lang)) {
    if (!types.includes(h.type)) continue;
    for (const date of holidayDays(h)) {
      if (!date.startsWith(`${year}-`)) continue;
      // у date-holidays для РФ свои переносы (8 марта → 9 марта) — нерабочие дни РФ берутся из ru.ts
      if (country === 'RU' && h.type === 'public' && !(date.slice(5) in ruHolidays)) continue;
      out.push({ date, name: h.name, type: h.type });
    }
  }
  if (country === 'RU' && types.includes('public')) {
    for (const [md, name] of Object.entries(ruHolidays)) {
      const date = `${year}-${md}`;
      if (!out.some((h) => h.date === date && h.type === 'public')) out.push({ date, name, type: 'public' });
    }
  }
  // один день — одна запись каждого типа, по дате
  const seen = new Set<string>();
  return out
    .filter((h) => !seen.has(`${h.date}|${h.type}`) && seen.add(`${h.date}|${h.type}`))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Выходные страны: день отдыха из date-holidays и день перед ним (воскресенье → сб+вс, суббота → пт+сб)
function weekendOf(country: string): number[] {
  const off = WEEKDAYS.indexOf((instance(country).getDayOff() || 'sunday').toLowerCase());
  return [(off + 6) % 7, off];
}

interface YearData {
  source: string;
  estimated: boolean;
  weekend: number[];
  holiday: Map<string, string>;
  transfer: Set<string>;
  work: Set<string>;
  short: Set<string>;
}

const years = new Map<string, YearData>();

function yearData(place: Place, year: number): YearData {
  const country = place.country.toUpperCase();
  const region = place.region?.toUpperCase();
  return cached(years, `${country}|${region ?? ''}|${place.lang ?? ''}|${year}`, () => {
    const weekend = weekendOf(country);
    const holiday = new Map<string, string>();
    for (const h of holidays({ country, region, lang: place.lang }, year)) if (!holiday.has(h.date)) holiday.set(h.date, h.name);
    const data: YearData = {
      source: 'date-holidays',
      estimated: false,
      weekend,
      holiday,
      transfer: new Set(),
      work: new Set(),
      short: new Set(),
    };
    if (country !== 'RU') return data;

    const ru = ruYears[year];
    if (ru) {
      data.source = ru.source;
      for (const md of ru.off) data.transfer.add(`${year}-${md}`);
      for (const md of ru.work) data.work.add(`${year}-${md}`);
      for (const md of ru.short) data.short.add(`${year}-${md}`);
      return data;
    }
    // Год без постановления — по ст. 112 ТК РФ: праздник в выходной (кроме январских) переносится на следующий рабочий день,
    // рабочий день перед праздником сокращён (ст. 95)
    data.source = 'ст. 112 ТК РФ: постановление о переносах ещё не принято';
    data.estimated = true;
    const off = (n: number) => weekend.includes(weekday(n)) || holiday.has(fromDay(n)) || data.transfer.has(fromDay(n));
    for (const date of holiday.keys()) {
      const n = toDay(date);
      if (date.slice(5, 7) === '01' || !weekend.includes(weekday(n))) continue;
      let next = n + 1;
      while (off(next)) next++;
      data.transfer.add(fromDay(next));
    }
    for (const date of holiday.keys()) {
      const before = toDay(date) - 1;
      if (!off(before) && fromDay(before).startsWith(`${year}-`)) data.short.add(fromDay(before));
    }
    return data;
  });
}

export function day(place: Place, date: string): Day {
  const data = yearData(place, +date.slice(0, 4));
  const short = data.short.has(date) ? { short: true as const } : {};
  if (data.work.has(date)) return { date, workday: true, kind: 'working-weekend', ...short };
  const holiday = data.holiday.get(date);
  if (holiday) return { date, workday: false, kind: 'holiday', holiday };
  if (data.transfer.has(date)) return { date, workday: false, kind: 'transfer' };
  if (data.weekend.includes(weekday(toDay(date)))) return { date, workday: false, kind: 'weekend' };
  return { date, workday: true, kind: 'workday', ...short };
}

const round = (n: number): number => Math.round(n * 10) / 10;

export function calendar(place: Place, year: number): Calendar {
  const data = yearData(place, year);
  const months: Month[] = [];
  const off: Day[] = [];
  for (let m = 0; m < 12; m++) {
    const first = Date.UTC(year, m, 1) / DAY;
    const days = Date.UTC(year, m + 1, 1) / DAY - first;
    let workdays = 0;
    let short = 0;
    for (let n = first; n < first + days; n++) {
      const d = day(place, fromDay(n));
      if (d.workday) workdays++;
      if (d.short) short++;
      if (d.kind === 'holiday' || d.kind === 'transfer') off.push(d);
    }
    months.push({
      month: m + 1,
      days,
      workdays,
      offdays: days - workdays,
      short,
      hours: { 40: workdays * 8 - short, 36: round(workdays * 7.2 - short), 24: round(workdays * 4.8 - short) },
    });
  }
  const sum = (f: (m: Month) => number) => round(months.reduce((s, m) => s + f(m), 0));
  return {
    country: place.country.toUpperCase(),
    ...(place.region && { region: place.region.toUpperCase() }),
    year,
    source: data.source,
    estimated: data.estimated,
    weekend: data.weekend.map((w) => WEEKDAYS[w]),
    months,
    total: {
      days: sum((m) => m.days),
      workdays: sum((m) => m.workdays),
      offdays: sum((m) => m.offdays),
      short: sum((m) => m.short),
      hours: { 40: sum((m) => m.hours[40]), 36: sum((m) => m.hours[36]), 24: sum((m) => m.hours[24]) },
    },
    off,
    work: [...data.work].sort(),
    short: [...data.short].sort(),
  };
}

const isWorkday = (place: Place, n: number): boolean => day(place, fromDay(n)).workday;

// Рабочих дней с from по to включительно
export function countWorkdays(place: Place, from: string, to: string): number {
  let count = 0;
  for (let n = toDay(from), end = toDay(to); n <= end; n++) if (isWorkday(place, n)) count++;
  return count;
}

// Дата через days рабочих дней (отрицательное — назад); 0 — сама дата или ближайший следующий рабочий день
export function addWorkdays(place: Place, date: string, days: number): string {
  let n = toDay(date);
  if (days === 0) {
    while (!isWorkday(place, n)) n++;
    return fromDay(n);
  }
  const step = Math.sign(days);
  for (let left = Math.abs(days); left > 0; ) {
    n += step;
    if (isWorkday(place, n)) left--;
  }
  return fromDay(n);
}

export const daysBetween = (from: string, to: string): number => toDay(to) - toDay(from);
