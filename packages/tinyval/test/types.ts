// Проверка вывода типов: файл только компилируется (tsc -p test), не запускается
import {
  array,
  boolean,
  coerce,
  date,
  email,
  type Infer,
  literal,
  min,
  minLength,
  nullable,
  number,
  object,
  oneOf,
  optional,
  parse,
  pipe,
  string,
  transform,
  trim,
  validate,
} from '../dist/index.js';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
const expect = <T extends true>() => {};

const user = object({
  name: pipe(string(), trim(), minLength(2)),
  email: pipe(string(), email()),
  age: optional(coerce.number()),
  role: oneOf(['admin', 'user']),
  active: optional(boolean(), true),
  kind: literal('person'),
  note: nullable(string()),
  birthday: optional(date()),
  tags: array(string()),
  address: object({ city: string() }),
  csv: transform(string(), (s) => s.split(',')),
});

type User = Infer<typeof user>;

expect<
  Equal<
    User,
    {
      name: string;
      email: string;
      role: 'admin' | 'user';
      active: boolean;
      kind: 'person';
      note: string | null;
      tags: string[];
      address: { city: string };
      csv: string[];
      age?: number | undefined;
      birthday?: Date | undefined;
    }
  >
>();

const r = validate(user, {});
if (r.valid) {
  expect<Equal<typeof r.data, User>>();
} else {
  expect<Equal<typeof r.data, undefined>>();
}

expect<Equal<ReturnType<typeof parse<typeof user>>, User>>();

// @ts-expect-error — правило для чисел нельзя применить к строке
pipe(string(), minLength(1), min(1));

void number;

// ---------- partial, pick, omit, extend, union, variant, record, tuple, enumOf

import { enumOf, extend, omit, partial, pick, record, tuple, union, variant } from '../dist/index.js';

const Base = object({ id: number(), name: string(), email: string() });

// Same — взаимная совместимость типов (строгое Equal спотыкается о внутреннее представление partial без ключей)
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
const p0 = partial(Base);
expect<Same<Infer<typeof p0>, { id?: number | undefined; name?: string | undefined; email?: string | undefined }>>();
const p1 = partial(Base, ['email']);
expect<Equal<Infer<typeof p1>, { id: number; name: string; email?: string | undefined }>>();
const p2 = pick(Base, ['id']);
expect<Equal<Infer<typeof p2>, { id: number }>>();
const p3 = omit(Base, ['email', 'id']);
expect<Equal<Infer<typeof p3>, { name: string }>>();
const p4 = extend(Base, { id: string(), age: optional(number()) });
expect<Equal<Infer<typeof p4>, { name: string; email: string; id: string; age?: number | undefined }>>();
// @ts-expect-error — такого поля нет
pick(Base, ['nope']);

const u = union([number(), literal('auto')]);
expect<Equal<Infer<typeof u>, number | 'auto'>>();

const v = variant('type', [object({ type: literal('a'), x: number() }), object({ type: literal('b'), y: string() })]);
expect<Equal<Infer<typeof v>, { type: 'a'; x: number } | { type: 'b'; y: string }>>();

const rec = record(number());
expect<Equal<Infer<typeof rec>, Record<string, number>>>();
const rec2 = record(oneOf(['ru', 'en']), string());
expect<Equal<Infer<typeof rec2>, Record<'ru' | 'en', string>>>();

const tup = tuple([number(), string()]);
expect<Equal<Infer<typeof tup>, [number, string]>>();

enum Role {
  Admin = 'admin',
  User = 'user',
}
const role = enumOf(Role);
expect<Same<Infer<typeof role>, Role>>();

// ---------- Standard Schema: интерфейс из спецификации https://standardschema.dev
interface StandardSchemaV1<Input = unknown, Output = Input> {
  readonly '~standard': {
    readonly version: 1;
    readonly vendor: string;
    readonly validate: (value: unknown) => unknown;
    readonly types?: { readonly input: Input; readonly output: Output } | undefined;
  };
}
type StdOutput<S extends StandardSchemaV1> = NonNullable<S['~standard']['types']>['output'];

const std: StandardSchemaV1<unknown, Infer<typeof Base>> = Base;
expect<Equal<StdOutput<typeof Base>, { id: number; name: string; email: string }>>();
void std;

// ---------- lazy, label, fallback

import { array as arr, fallback, label, lazy, type Schema } from '../dist/index.js';

type Category = { name: string; children: Category[] };
const CategorySchema: Schema<Category> = object({ name: string(), children: arr(lazy(() => CategorySchema)) });
expect<Equal<Infer<typeof CategorySchema>, Category>>();

const lbl = label(number(), 'Age');
expect<Equal<Infer<typeof lbl>, number>>();

const fb = fallback(coerce.number(), 1);
expect<Equal<Infer<typeof fb>, number>>();
// @ts-expect-error — значение по умолчанию должно быть того же типа
fallback(coerce.number(), 'one');

// ---------- Messages: полный lang-файл проверяется TypeScript

import type { MessageCode, Messages } from '../dist/index.js';
import ruLocale from '../dist/locales/ru.js';

const fullRu = { ...ruLocale, required: 'Заполните поле', 'email.required': 'Укажите почту' } satisfies Messages;
void fullRu;
// @ts-expect-error — в полном lang-файле не хватает кодов
const incomplete = { required: 'x' } satisfies Messages;
void incomplete;
expect<Equal<Extract<MessageCode, 'required' | 'minLength' | 'depth'>, 'required' | 'minLength' | 'depth'>>();

// ---------- условия, file, brand
import { brand, file, prohibitedIf, requiredIf, requiredWithout, uuid } from '../dist/index.js';

const cond = object({ delivery: string(), address: requiredIf({ delivery: 'courier' }, string()), phone: requiredWithout(['email'], string()), price: prohibitedIf({ delivery: 'pickup' }, number()) });
expect<Equal<Infer<typeof cond>, { delivery: string; address?: string | undefined; phone?: string | undefined; price?: number | undefined }>>();
const f = file({ maxSize: 1 });
expect<Equal<Infer<typeof f>, File>>();
const UserId = brand(pipe(string(), uuid()), 'UserId');
const OrderId = brand(pipe(string(), uuid()), 'OrderId');
type UserId = Infer<typeof UserId>;
type OrderId = Infer<typeof OrderId>;
const takeUser = (id: UserId) => id;
declare const orderId: OrderId;
// @ts-expect-error — OrderId нельзя передать вместо UserId
takeUser(orderId);
// @ts-expect-error — обычную строку тоже нельзя
takeUser('550e8400-e29b-41d4-a716-446655440000');

// ---------- lazy по значению
const dyn = lazy((v, { parent }) => (typeof v === 'number' || parent ? number() : number()));
expect<Equal<Infer<typeof dyn>, number>>();
