// Запуск: PORT, API_KEYS (через запятую), LIMIT_ANONYMOUS, LIMIT_KEYED, TRUST_PROXY=1 — IP из X-Forwarded-For за прокси
import { serve } from '@hono/node-server';
import { getConnInfo } from '@hono/node-server/conninfo';
import { createApp } from './app.js';

const env = process.env;
const app = createApp({
  keys: (env.API_KEYS ?? '').split(',').map((k) => k.trim()).filter(Boolean),
  anonymous: Number(env.LIMIT_ANONYMOUS ?? 100),
  keyed: Number(env.LIMIT_KEYED ?? 10_000),
  ip: (c) =>
    (env.TRUST_PROXY && c.req.header('x-forwarded-for')?.split(',')[0].trim()) || getConnInfo(c).remote.address || 'unknown',
});

const port = Number(env.PORT ?? 3000);
serve({ fetch: app.fetch, port }, () => console.log(`holidays-api: http://localhost:${port}/v1`));
