# tinyval

Tiny, fast, zero-dependency validation for browser and server.

- ~1.4 kB gzip for a typical form, ~2.3 kB for everything (tree-shakeable)
- TypeScript types inferred from the schema
- Nested objects and arrays, unknown keys handling, coercion, transforms, async checks

## Install

```bash
npm install tinyval
```

## Usage

```ts
import { validate, object, string, number, optional, pipe, trim, minLength, email, min, coerce, type Infer } from 'tinyval';

const User = object({
  name: pipe(string(), trim(), minLength(2)),
  email: pipe(string(), trim(), email()),
  age: optional(pipe(coerce.number(), min(0))),
});

type User = Infer<typeof User>; // { name: string; email: string; age?: number }

const result = validate(User, input);

if (result.valid) {
  result.data; // cleaned, typed data (unknown keys removed)
} else {
  result.errors; // { name: 'Must be at least 2 long', 'address.city': 'Required' }
  result.issues; // [{ code, message, path: ['address', 'city'] }]
}
```

On the server, `parse` returns the data or throws `ValidationError`:

```ts
import { parse, ValidationError } from 'tinyval';

try {
  const user = parse(User, req.body);
} catch (e) {
  if (e instanceof ValidationError) res.status(422).json({ errors: e.errors });
}
```

## Empty values

`undefined`, `null` and `''` are treated as "not provided": required fields fail with `Required`, `optional()` fields are skipped (or get their default).

## Schemas

| Schema | Description |
| --- | --- |
| `string()`, `number()`, `boolean()`, `date()` | Base types. `number()` rejects `NaN` and `Infinity` |
| `literal(value)`, `oneOf([...])` | Exact value / one of values |
| `unknown()` | Any value |
| `object(shape, { unknown })` | `unknown`: `'strip'` (default), `'strict'` or `'passthrough'` |
| `array(item)` | Array of items |
| `optional(schema, default?)` | Value may be missing; default can be a value or a function |
| `nullable(schema)` | Value may be `null` |
| `transform(schema, fn)` | Change the output (and its type) |
| `preprocess(fn, schema)` | Prepare the input before validation |
| `coerce.string/number/boolean/date()` | Convert strings from query, form-data, env |

## Pipe actions

`pipe(schema, ...actions)` runs checks and transforms after the type check.

| Action | Description |
| --- | --- |
| `minLength(n)`, `maxLength(n)`, `length(n)` | Length of a string or array |
| `min(n)`, `max(n)`, `integer()` | Numbers |
| `pattern(re)`, `email()` | Strings |
| `sameAs(field)` | Equals a sibling field |
| `trim()`, `toLowerCase()`, `toUpperCase()` | Transforms |
| `check(fn, msg?)` | Custom check: `(value, { parent, root }) => boolean` |
| `checkAsync(fn, msg?)` | Async check, requires `validateAsync` / `parseAsync` |

```ts
const Signup = object({
  email: pipe(string(), email(), checkAsync(async (v) => !(await db.userExists(v)), 'Email is taken')),
  password: pipe(string(), minLength(8)),
  confirm: pipe(string(), sameAs('password')),
});

const result = await validateAsync(Signup, body);
```

Pass `{ all: true }` to collect every error of a field instead of the first one.

## Messages

Every schema and action accepts a custom message. `{param}` placeholders are replaced, a function receives the params:

```ts
minLength(3, 'At least {min} characters');
max(10, (p) => `No more than ${p.max}`);
```

Global messages and locales:

```ts
import { setMessages } from 'tinyval';
import ru from 'tinyval/locales/ru';

setMessages(ru);
setMessages({ required: 'Please fill in' });
```

## Custom rules

```ts
const even = (msg = 'Must be even') => check<number>((v) => v % 2 === 0, msg);

pipe(number(), even());
```

## License

MIT
