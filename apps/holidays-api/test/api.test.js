import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../dist/app.js';

const make = (now = () => Date.UTC(2026, 9, 6, 12)) =>
  createApp({ keys: ['secret'], anonymous: 2, keyed: 3, ip: (c) => c.req.header('x-test-ip') ?? 'a', now });

const get = async (app, path, headers = {}) => {
  const res = await app.request(path, { headers });
  return { status: res.status, headers: res.headers, body: await res.json() };
};

test('ручки отвечают', async () => {
  const app = createApp({ keys: [], anonymous: 100, keyed: 100, ip: () => 'a' });
  assert.equal((await get(app, '/v1/countries?lang=ru')).body.find((c) => c.code === 'RU').name, 'Россия');
  assert.ok((await get(app, '/v1/countries/de/regions')).body.some((r) => r.code === 'BY'));
  assert.equal((await get(app, '/v1/holidays/ru/2026')).body.holidays.length, 14);
  assert.equal((await get(app, '/v1/calendar/ru/2026')).body.total.workdays, 247);
  assert.equal((await get(app, '/v1/day/ru/2026-01-09')).body.kind, 'transfer');
  assert.equal((await get(app, '/v1/workdays/ru/count?from=2026-01-01&to=2026-12-31')).body.workdays, 247);
  assert.equal((await get(app, '/v1/workdays/ru/add?date=2026-04-30&days=3')).body.result, '2026-05-06');
});

test('ошибки ввода', async () => {
  const app = createApp({ keys: [], anonymous: 100, keyed: 100, ip: () => 'a' });
  assert.equal((await get(app, '/v1/holidays/xx/2026')).status, 404);
  assert.equal((await get(app, '/v1/holidays/de/2026?region=zz')).status, 404);
  assert.equal((await get(app, '/v1/holidays/ru/abc')).status, 400);
  assert.equal((await get(app, '/v1/holidays/ru/2026?types=foo')).status, 400);
  assert.equal((await get(app, '/v1/day/ru/2026-02-30')).status, 400);
  assert.equal((await get(app, '/v1/workdays/ru/count?from=2026-02-01&to=2026-01-01')).status, 400);
  assert.equal((await get(app, '/v1/workdays/ru/count?from=2000-01-01&to=2026-01-01')).status, 400);
  assert.equal((await get(app, '/v1/workdays/ru/add?date=2026-01-01&days=1.5')).status, 400);
  assert.equal((await get(app, '/v1/nope')).status, 404);
});

test('лимит без ключа — по IP, с ключом — больше', async () => {
  const app = make();
  for (let i = 0; i < 2; i++) assert.equal((await get(app, '/v1/countries')).status, 200);
  const over = await get(app, '/v1/countries');
  assert.equal(over.status, 429);
  assert.ok(Number(over.headers.get('retry-after')) > 0);
  assert.equal((await get(app, '/v1/countries', { 'x-test-ip': 'b' })).status, 200);

  const key = { authorization: 'Bearer secret' };
  const first = await get(app, '/v1/countries', key);
  assert.equal(first.status, 200);
  assert.equal(first.headers.get('x-ratelimit-limit'), '3');
  assert.equal(first.headers.get('x-ratelimit-remaining'), '2');
  for (let i = 0; i < 2; i++) assert.equal((await get(app, '/v1/countries', { 'x-api-key': 'secret' })).status, 200);
  assert.equal((await get(app, '/v1/countries', key)).status, 429);
  assert.equal((await get(app, '/v1/countries', { 'x-api-key': 'wrong' })).status, 401);
  assert.equal((await app.request('/health')).status, 200);
});

test('лимит сбрасывается в новые сутки', async () => {
  let now = Date.UTC(2026, 9, 6, 23, 59);
  const app = make(() => now);
  for (let i = 0; i < 2; i++) await get(app, '/v1/countries');
  assert.equal((await get(app, '/v1/countries')).status, 429);
  now = Date.UTC(2026, 9, 7, 0, 1);
  assert.equal((await get(app, '/v1/countries')).status, 200);
});
