// Условные правила, как в Laravel: requiredIf, requiredUnless, requiredWith, requiredWithout, prohibitedIf
import { createSchema, fail, has, isEmpty, type Message, type Schema } from './core.js';
import { optional } from './schemas.js';

// Условие: соседние поля и их значения { delivery: 'courier' }, { type: ['a', 'b'] } — или своя функция
export type Condition = Record<string, unknown> | ((info: { parent: unknown; root: unknown }) => boolean);

const sibling = (parent: unknown, field: string): unknown => {
  let v = parent;
  for (const k of field.split('.')) {
    if (v === null || typeof v !== 'object' || !has(v, k)) return undefined;
    v = (v as Record<string, unknown>)[k];
  }
  return v;
};

const matches = (cond: Condition, parent: unknown, root: unknown) =>
  typeof cond === 'function'
    ? cond({ parent, root })
    : Object.entries(cond).every(([field, expected]) => {
        const v = sibling(parent, field);
        return Array.isArray(expected) ? expected.includes(v) : v === expected;
      });

// Обязательно, когда выполняется проверка; иначе — как optional
function requiredWhen<T>(test: (parent: unknown, root: unknown) => boolean, schema: Schema<T>): Schema<T | undefined> {
  const opt = optional(schema);
  return createSchema((v, ctx, path, parent) => (test(parent, ctx.root) ? schema : opt).run(v, ctx, path, parent));
}

// Обязательно, если условие выполняется: requiredIf({ delivery: 'courier' }, string())
export const requiredIf = <T>(condition: Condition, schema: Schema<T>): Schema<T | undefined> =>
  requiredWhen((p, r) => matches(condition, p, r), schema);

// Обязательно, если условие НЕ выполняется
export const requiredUnless = <T>(condition: Condition, schema: Schema<T>): Schema<T | undefined> =>
  requiredWhen((p, r) => !matches(condition, p, r), schema);

// Обязательно, если заполнено хотя бы одно из полей
export const requiredWith = <T>(fields: string[], schema: Schema<T>): Schema<T | undefined> =>
  requiredWhen((p) => fields.some((f) => !isEmpty(sibling(p, f))), schema);

// Обязательно, если не заполнено хотя бы одно из полей: телефон или email
export const requiredWithout = <T>(fields: string[], schema: Schema<T>): Schema<T | undefined> =>
  requiredWhen((p) => fields.some((f) => isEmpty(sibling(p, f))), schema);

// Должно быть пустым, если условие выполняется; иначе — как optional
export function prohibitedIf<T>(condition: Condition, schema: Schema<T>, msg?: Message): Schema<T | undefined> {
  const opt = optional(schema);
  return createSchema((v, ctx, path, parent) =>
    matches(condition, parent, ctx.root) ? (isEmpty(v) ? undefined : fail(ctx, path, 'prohibited', msg)) : opt.run(v, ctx, path, parent),
  );
}
