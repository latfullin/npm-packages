// Новые схемы объектов из существующих: partial, pick, omit, extend
import type { Infer, Schema } from './core.js';
import { object, optional, type ObjectSchema, type Shape } from './schemas.js';

type Flat<T> = { [K in keyof T]: T[K] } & {};

// Все поля (или перечисленные) становятся необязательными — например, для PATCH
export function partial<S extends Shape, K extends keyof S & string = keyof S & string>(
  schema: ObjectSchema<S>,
  keys?: readonly K[],
): ObjectSchema<Flat<Omit<S, K> & { [P in K]: Schema<Infer<S[P]> | undefined> }>> {
  const shape: Shape = { ...schema.shape };
  for (const k of keys ?? Object.keys(shape)) shape[k] = optional(shape[k]);
  return object(shape, schema.options) as any;
}

// Только перечисленные поля
export function pick<S extends Shape, K extends keyof S & string>(
  schema: ObjectSchema<S>,
  keys: readonly K[],
): ObjectSchema<Flat<Pick<S, K>>> {
  const shape: Shape = {};
  for (const k of keys) shape[k] = schema.shape[k];
  return object(shape, schema.options) as any;
}

// Все поля, кроме перечисленных
export function omit<S extends Shape, K extends keyof S & string>(
  schema: ObjectSchema<S>,
  keys: readonly K[],
): ObjectSchema<Flat<Omit<S, K>>> {
  const shape: Shape = { ...schema.shape };
  for (const k of keys) delete shape[k];
  return object(shape, schema.options) as any;
}

// Добавляет поля или заменяет существующие
export function extend<S extends Shape, E extends Shape>(
  schema: ObjectSchema<S>,
  fields: E,
): ObjectSchema<Flat<Omit<S, keyof E> & E>> {
  return object({ ...schema.shape, ...fields }, schema.options) as any;
}
