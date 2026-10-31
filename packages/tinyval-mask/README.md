# tinyval-mask

Tiny zero-dependency input masks: phones, bank cards, dates, amounts, documents and custom patterns. ~1 kB gzip for a custom pattern, ~1.6 kB with a phone mask and an input binding.

- The caret doesn't jump, Backspace goes through brackets and dashes, paste works in any format
- Pure `mask` / `unmask` work on the server too (normalize phone numbers)
- `v-mask` directive for Vue (`tinyval-mask/vue`)

Documentation: **[tinyval.ru/tinyval-mask](https://tinyval.ru/tinyval-mask/)** — guide, API reference and live demo.

## Install

```bash
npm install tinyval-mask
```

## Usage

```ts
import { mask, unmask, isComplete, attach } from 'tinyval-mask';
import { phone, card, money } from 'tinyval-mask/presets';

mask('89991234567', phone());          // '+7 (999) 123-45-67'
unmask('+7 (999) 123-45-67', phone()); // '79991234567'
mask('378282246310005', card());       // '3782 822463 10005' (Amex)
mask('1500.5', money({ currency: '₽' })); // '1 500,5 ₽'
mask('12ab34', '99-99');               // '12-34'
isComplete('+7 (999) 123', phone());   // false

attach(document.querySelector('#phone'), phone(), {
  onChange: ({ value, raw, complete }) => {},
});
```

## Patterns

| Char | Meaning |
| --- | --- |
| `9` | digit |
| `a` | letter |
| `*` | letter or digit |
| `[ ]` | optional part (all or nothing) |
| `\` | escape: `\9` is a literal nine |

```ts
createMask({ pattern: 'HH-HH', tokens: { H: { pattern: /[0-9a-f]/i, transform: 'upper' } } });
createMask(['999-999', '9999-9999']);                 // the first pattern that fits
createMask({ pattern: (input) => '...' });            // pattern depends on input
numberMask({ thousands: ',', decimal: '.', precision: 2, negative: true, prefix: '$' });
```

## Ready-made masks

`phone('ru' | 'kz' | 'by' | 'ua' | 'uz' | 'us')`, `card()`, `cardBrand(number)`, `cardExpiry()`, `cvc()`, `date(format)`, `time(seconds)`, `datetime()`, `inn()`, `snils()`, `passport()`, `ogrn()`, `bik()`, `kpp()`, `account()`, `postcode()`, `carPlate()`, `mac()`, `hexColor()`, `money(options)`, `percent(options)`.

Import from `tinyval-mask/presets` for the smallest bundle, or use the `masks` namespace from `tinyval-mask`.

## Vue

```vue
<script setup lang="ts">
import { phone } from 'tinyval-mask/presets';
import { vMask } from 'tinyval-mask/vue';

const phoneMask = phone();
</script>

<template>
  <input v-model="tel" v-mask="phoneMask" />
</template>
```

Works on wrappers too (UI library fields, `<TvField>` from tinyval-vue).

## With tinyval

```ts
const Contact = object({
  phone: preprocess((v) => unmask(String(v ?? ''), phone()), pipe(string(), length(11))),
});
```

## License

MIT
