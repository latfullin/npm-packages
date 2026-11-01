# tinyval

Tiny, fast, zero-dependency validation for browser and server.

- ~2.5 kB gzip for a typical form, ~5.5 kB for everything (tree-shakeable)
- TypeScript types inferred from the schema
- Nested objects and arrays, unions, unknown keys handling, coercion, transforms, async checks
- [Standard Schema](https://standardschema.dev) — works with tRPC, Hono, TanStack Form, React Hook Form and more

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
  result.errors; // { name: 'Must be at least 2 characters long', 'address.city': 'Required' }
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
| `tuple([a, b])` | Fixed-length array |
| `record(value)`, `record(key, value)` | Object with arbitrary keys |
| `union([a, b])` | The first matching schema |
| `variant(key, [objA, objB])` | Objects selected by a tag field, precise errors |
| `enumOf(Enum)` | Values of a TypeScript `enum` or an `as const` object |
| `lazy((value, { parent, root }) => schema)` | Recursive schemas (trees) or a schema chosen by the value / sibling fields; protected from too deep input |
| `optional(schema, default?)` | Value may be missing; default can be a value or a function |
| `nullable(schema)` | Value may be `null` |
| `fallback(schema, value)` | Value used instead of an error (query params, settings) |
| `label(schema, 'Email')` | Field name for `{label}` in messages |
| `transform(schema, fn)` | Change the output (and its type) |
| `preprocess(fn, schema)` | Prepare the input before validation |
| `coerce.string/number/boolean/date()` | Convert strings from query, form-data, env |

## Object helpers

```ts
const UpdateUser = partial(User);                   // all fields optional (PATCH)
const Login = pick(User, ['email', 'password']);
const PublicUser = omit(User, ['password']);
const Admin = extend(User, { role: oneOf(['admin', 'moderator']) });
```

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

## Options

```ts
validate(schema, data, {
  all: true,                    // every error of a field, not only the first
  messages: ru,                 // messages for this call only (per-request language)
  labels: { email: 'Email' },   // field names for {label}
  maxDepth: 256,                // max nesting for lazy()
  abortEarly: true,             // stop at the first error (server, no details needed)
});
```

Every issue has `code`, `message`, `path` and `params` (`{ min: 8 }`) — so the client can translate errors by code.

## Laravel-style errors

`flatten(issues)` returns every message by field: `{ password: ['Must be at least 8 characters long', 'Invalid format'] }`.

```ts
const result = validate(User, body, { all: true });
if (!result.valid) res.status(422).json({ errors: flatten(result.issues) });
```

## Standard Schema

Every schema implements [Standard Schema](https://standardschema.dev), so it can be passed directly to tRPC, Hono, TanStack Form, React Hook Form and other compatible libraries:

```ts
app.post('/users', sValidator('json', CreateUser), handler); // Hono
```

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
setMessages({ required: '{label} is required' });
```

On a server with per-request languages pass `{ messages }` to `validate` instead — it doesn't touch other requests.

## Vue

Form state for Vue 3 (`useForm`: v-model values, errors, submit, server errors) is a separate package — [tinyval-vue](https://www.npmjs.com/package/tinyval-vue).

## Custom lang file

Copy a locale into your project, edit it and load it — like Laravel lang files:

```bash
npx tinyval lang en            # creates lang/tinyval/en.ts (also: ru, zh; --out <dir>, --js, --force)
```

```ts
// lang/tinyval/en.ts
import type { Messages } from 'tinyval';

export default {
  required: '{label} is required',
  'email.required': 'We need your email to send the receipt', // field-specific
  'items.*.qty.min': 'Quantity must be at least {min}',        // array items
  // ...all other codes — TypeScript checks that none is missing
} satisfies Messages;
```

```ts
import { setMessages, setLabels } from 'tinyval';
import messages from './lang/tinyval/en';

setMessages(messages);
setLabels({ email: 'Email address' }); // names for {label}
```

## Custom rules

```ts
const even = (msg = 'Must be even') => check<number>((v) => v % 2 === 0, msg);

pipe(number(), even());
```

A custom schema with `createSchema` (supports Standard Schema too):

```ts
const bigint = (msg?: Message) =>
  createSchema<bigint>((value, ctx, path) =>
    typeof value === 'bigint' ? value : fail(ctx, path, isEmpty(value) ? 'required' : 'bigint', msg),
  );
```

## Docs

Full documentation with live examples (ru, en, zh): [tinyval.ru/tinyval](https://tinyval.ru/tinyval/).

## License

MIT
