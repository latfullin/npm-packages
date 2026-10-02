// Работа со значениями формы по пути вида 'items.0.title'

export function clone<T>(v: T): T {
  if (v instanceof Date) return new Date(v.getTime()) as T;
  if (Array.isArray(v)) return v.map(clone) as T;
  if (isPlainObject(v)) {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v)) out[k] = clone(v[k]);
    return out as T;
  }
  return v;
}

export function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (!v || typeof v !== 'object') return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}

export const getPath = (o: unknown, path: string): unknown =>
  path === '' ? o : path.split('.').reduce<unknown>((v, k) => (v == null ? undefined : (v as Record<string, unknown>)[k]), o);

export function setPath(o: object, path: string, value: unknown): void {
  const keys = path.split('.');
  const last = keys.pop()!;
  let cur = o as Record<string, unknown>;
  for (const k of keys) {
    if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = /^\d+$/.test(k) ? [] : {};
    cur = cur[k] as Record<string, unknown>;
  }
  cur[last] = value;
}

export const snapshot = (v: unknown) => JSON.stringify(v ?? null);

// Путь key находится внутри path (или совпадает с ним); '' — вся форма
export const within = (key: string, path: string) => path === '' || key === path || key.startsWith(`${path}.`);

const SAME = Symbol();

// Только изменённые поля: вложенные объекты сравниваются по полям, массивы и остальное — целиком
export function diff(current: unknown, start: unknown): unknown {
  if (isPlainObject(current) && isPlainObject(start)) {
    const out: Record<string, unknown> = {};
    let changed = false;
    for (const k of Object.keys(current)) {
      const d = diff(current[k], start[k]);
      if (d !== SAME) {
        out[k] = d;
        changed = true;
      }
    }
    return changed ? out : SAME;
  }
  return snapshot(current) === snapshot(start) ? SAME : clone(current);
}

export const changes = (current: unknown, start: unknown): Record<string, unknown> => {
  const d = diff(current, start);
  return d === SAME ? {} : (d as Record<string, unknown>);
};
