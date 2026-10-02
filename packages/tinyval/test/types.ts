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
