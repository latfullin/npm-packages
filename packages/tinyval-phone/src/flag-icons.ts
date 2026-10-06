// Флаги-иконки в SVG (3:2): эмодзи-флаги Windows не показывает, а иконка выглядит одинаково везде.
// Каждый флаг — отдельный модуль: в бандл попадают только загруженные
import { flags } from './flags/index.js';

type Markup = string | undefined;
// Свой флаг: SVG-разметка или функция, которая её загружает; null — флага нет
export type FlagSource = string | (() => Markup | Promise<Markup>) | null;
// Свои флаги по коду страны или одна функция для всех (вернула undefined — встроенный флаг)
export type Flags = Record<string, FlagSource> | ((code: string) => Markup | Promise<Markup>);

let own: Record<string, FlagSource> = {};
let loader: ((code: string) => Markup | Promise<Markup>) | undefined;

// Заменить или добавить флаги — один раз при старте. Файл с флагами для правки: npx tinyval-phone flags ru kz
//   setFlags({ ru: '<svg …>', xx: () => import('./xx.svg?raw').then((m) => m.default), su: null })
//   setFlags((code) => fetch(`/flags/${code}.svg`).then((r) => r.text()))
export function setFlags(source: Flags): void {
  if (typeof source === 'function') loader = source;
  else for (const [code, flag] of Object.entries(source)) own[code.toLowerCase()] = flag;
}

// Вернуть встроенные флаги
export function resetFlags(): void {
  own = {};
  loader = undefined;
}

// Коды стран, для которых есть флаг (с учётом setFlags; флаги из функции-загрузчика заранее не известны)
export const flagCodes = (): string[] =>
  [...new Set([...Object.keys(flags), ...Object.keys(own)])].filter((c) => own[c] !== null).sort();

// SVG-разметка флага: await loadFlag('ru') → '<svg …>'; нет такого флага — undefined
export async function loadFlag(code: string): Promise<Markup> {
  const c = String(code).toLowerCase();
  if (c in own) {
    const f = own[c];
    return typeof f === 'function' ? f() : (f ?? undefined);
  }
  const custom = loader ? await loader(c) : undefined;
  if (custom !== undefined) return custom;
  return flags[c] ? (await flags[c]()).default : undefined;
}
