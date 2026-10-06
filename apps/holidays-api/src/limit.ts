// Лимит запросов в сутки (UTC): без ключа — по IP, с ключом — по ключу. Счётчики в памяти процесса
import type { MiddlewareHandler } from 'hono';

export interface LimitOptions {
  // действующие API-ключи
  keys: Iterable<string>;
  // запросов в сутки без ключа и с ключом
  anonymous: number;
  keyed: number;
  // IP клиента для анонимного лимита
  ip: (c: Parameters<MiddlewareHandler>[0]) => string;
  now?: () => number;
}

const DAY = 86_400_000;

export function limit(options: LimitOptions): MiddlewareHandler {
  const keys = new Set(options.keys);
  const now = options.now ?? Date.now;
  let window = 0;
  let counts = new Map<string, number>();

  return async (c, next) => {
    const auth = c.req.header('authorization');
    const key = c.req.header('x-api-key') ?? (auth?.startsWith('Bearer ') ? auth.slice(7).trim() : undefined);
    if (key !== undefined && !keys.has(key)) return c.json({ error: 'Неизвестный API-ключ' }, 401);

    const today = Math.floor(now() / DAY);
    if (today !== window) {
      window = today;
      counts = new Map();
    }
    const id = key !== undefined ? `key:${key}` : `ip:${options.ip(c)}`;
    const max = key !== undefined ? options.keyed : options.anonymous;
    const used = (counts.get(id) ?? 0) + 1;
    counts.set(id, used);

    c.header('X-RateLimit-Limit', String(max));
    c.header('X-RateLimit-Remaining', String(Math.max(0, max - used)));
    c.header('X-RateLimit-Reset', String(((today + 1) * DAY) / 1000));
    if (used > max) {
      c.header('Retry-After', String(Math.ceil(((today + 1) * DAY - now()) / 1000)));
      return c.json({ error: key ? 'Лимит запросов по ключу исчерпан' : 'Лимит без ключа исчерпан — получите API-ключ' }, 429);
    }
    await next();
  };
}
