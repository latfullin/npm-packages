// HTTP API праздников и рабочих дней: /v1/*
import { Hono, type Context } from 'hono';
import { cors } from 'hono/cors';
import {
  MAX_YEAR,
  MIN_YEAR,
  addWorkdays,
  calendar,
  countWorkdays,
  countries,
  day,
  daysBetween,
  hasPlace,
  holidays,
  isDate,
  regions,
  type HolidayType,
  type Place,
} from './calendar.js';
import { limit, type LimitOptions } from './limit.js';

export type AppOptions = LimitOptions;

const TYPES: HolidayType[] = ['public', 'bank', 'optional', 'school', 'observance'];
// длиннее — дорого считать и легко положить сервис одним запросом
const MAX_RANGE = 3660;
const MAX_SHIFT = 2500;

class BadRequest extends Error {
  constructor(
    message: string,
    readonly status: 400 | 404 = 400,
  ) {
    super(message);
  }
}

function place(c: Context): Place {
  const country = c.req.param('country') ?? '';
  const region = c.req.query('region') || undefined;
  if (!hasPlace(country, region)) throw new BadRequest(region ? `Неизвестный регион ${region} страны ${country}` : `Неизвестная страна ${country}`, 404);
  return { country, region, lang: c.req.query('lang') || undefined };
}

function year(value: string | undefined): number {
  const y = Number(value);
  if (!Number.isInteger(y) || y < MIN_YEAR || y > MAX_YEAR) throw new BadRequest(`Год — от ${MIN_YEAR} до ${MAX_YEAR}`);
  return y;
}

function date(value: string | undefined, name = 'date'): string {
  if (!value || !isDate(value)) throw new BadRequest(`${name} — дата в формате YYYY-MM-DD`);
  year(value.slice(0, 4));
  return value;
}

export function createApp(options: AppOptions): Hono {
  const app = new Hono();

  app.onError((err, c) => {
    if (err instanceof BadRequest) return c.json({ error: err.message }, err.status);
    console.error(err);
    return c.json({ error: 'Внутренняя ошибка' }, 500);
  });
  app.notFound((c) => c.json({ error: 'Нет такого метода' }, 404));

  app.get('/health', (c) => c.text('ok'));

  app.use('/v1/*', cors({ origin: '*', exposeHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset', 'Retry-After'] }));
  app.use('/v1/*', limit(options));

  app.get('/v1', (c) =>
    c.json({
      data: 'Праздники — date-holidays (ISC, данные CC BY-SA 3.0, https://github.com/commenthol/date-holidays); производственный календарь РФ — постановления Правительства РФ',
      limits: { anonymous: options.anonymous, keyed: options.keyed, per: 'day' },
    }),
  );

  app.get('/v1/countries', (c) => c.json(countries(c.req.query('lang') || undefined)));

  app.get('/v1/countries/:country/regions', (c) => {
    const p = place(c);
    return c.json(regions(p.country, p.lang));
  });

  app.get('/v1/holidays/:country/:year', (c) => {
    const p = place(c);
    const y = year(c.req.param('year'));
    const types = (c.req.query('types') ?? 'public').split(',').filter(Boolean) as HolidayType[];
    const bad = types.find((t) => !TYPES.includes(t));
    if (bad) throw new BadRequest(`Неизвестный тип ${bad}: ${TYPES.join(', ')}`);
    return c.json({ country: p.country.toUpperCase(), year: y, holidays: holidays(p, y, types) });
  });

  app.get('/v1/calendar/:country/:year', (c) => c.json(calendar(place(c), year(c.req.param('year')))));

  app.get('/v1/day/:country/:date', (c) => c.json(day(place(c), date(c.req.param('date')))));

  app.get('/v1/workdays/:country/count', (c) => {
    const p = place(c);
    const from = date(c.req.query('from'), 'from');
    const to = date(c.req.query('to'), 'to');
    const range = daysBetween(from, to);
    if (range < 0) throw new BadRequest('from позже to');
    if (range > MAX_RANGE) throw new BadRequest(`Период — не больше ${MAX_RANGE} дней`);
    return c.json({ from, to, workdays: countWorkdays(p, from, to), days: range + 1 });
  });

  app.get('/v1/workdays/:country/add', (c) => {
    const p = place(c);
    const from = date(c.req.query('date'));
    const days = Number(c.req.query('days'));
    if (!Number.isInteger(days) || Math.abs(days) > MAX_SHIFT) throw new BadRequest(`days — целое от -${MAX_SHIFT} до ${MAX_SHIFT}`);
    return c.json({ date: from, days, result: addWorkdays(p, from, days) });
  });

  return app;
}
