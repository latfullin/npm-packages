# tinyval

Tiny, fast, zero-dependency validation.

## Install

```bash
npm install tinyval
```

## Usage

```ts
import { validate, required, string, minLength, email } from 'tinyval';

const { valid, errors } = validate(
  { name: 'I', email: 'bad' },
  {
    name: [required(), string(), minLength(2)],
    email: [required(), email()],
  },
);
// valid === false
// errors === { name: 'Минимум 2 символов', email: 'Некорректный email' }
```

## Custom rule

A rule is a function that returns an error message or `null`:

```ts
const even = (msg = 'Must be even') => (v: unknown) =>
  typeof v === 'number' && v % 2 !== 0 ? msg : null;
```

## License

MIT
