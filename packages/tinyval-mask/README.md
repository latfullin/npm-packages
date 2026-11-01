# tinyval-mask

Tiny zero-dependency input masks: phones, bank cards, dates, amounts, documents and custom patterns. ~1 kB gzip for a custom pattern, ~2.6 kB with a phone mask and an input binding.

- The caret doesn't jump, Backspace goes through brackets and dashes, paste works in any format
- Pure `mask` / `unmask` work on the server too (normalize phone numbers)
- Visible template `+7 (___) ___-__-__`, date masks reject day 32 and month 13
- `v-mask` directive for Vue (`tinyval-mask/vue`)

Documentation: **[tinyval.ru/tinyval-mask](https://tinyval.ru/tinyval-mask/)** — guide, API reference and live demo.

## Install

```bash
npm install tinyval-mask
```

## Usage

```ts
import { mask, unmask, isComplete, isValid, attach } from 'tinyval-mask';
import { phone, card, money, date } from 'tinyval-mask/presets';

mask('89991234567', phone());          // '+7 (999) 123-45-67'
unmask('+7 (999) 123-45-67', phone()); // '79991234567'
mask('378282246310005', card());       // '3782 822463 10005' (Amex)
mask('1500.5', money({ currency: '₽' })); // '1 500,5 ₽'
mask('12ab34', '99-99');               // '12-34'
isComplete('+7 (999) 123', phone());   // false
isValid('31.02.2026', date());         // false — filled, but no such date (also: card Luhn, INN, SNILS, OGRN, card expiry)

attach(document.querySelector('#phone'), phone(), {
  placeholder: '_',  // show +7 (___) ___-__-__; any char: '0' → +7 (000) 000-00-00
  raw: true,         // input handlers get 79991234567
  onChange: ({ value, raw, complete, valid }) => {},
});
```

## Phones: any country, flag, name

```ts
import { phoneAuto, phoneCountries, countryName } from 'tinyval-mask/presets';

const tel = phoneAuto({ defaultCountry: 'ru' }); // without + the number is local, with + — international
mask('+375291234567', tel);          // '+375 (29) 123-45-67'
tel.country('+375 29');              // { code: 'by', dial: '375', flag: '🇧🇾' }
countryName('by', 'en');             // 'Belarus' (via Intl, no data in the bundle)
phoneCountries();                    // 28 countries for your own picker
mask('07400123456', phoneAuto({ defaultCountry: 'gb' })); // '+44 7400 123456' — the national prefix 0 / 8 is dropped
```

All 245 countries of the world and SVG flag icons — the [tinyval-phone](https://www.npmjs.com/package/tinyval-phone) package with the same API. Your own countries or formats: `phoneAutoFrom({ ...phoneTable, jp: ['81', '99-9999-9999', '0'] })`.

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

`phone(country)` (28 countries), `phoneAuto(options)`, `detectCountry`, `flag`, `countryName`, `phoneCountries`, `phoneTable`, `phoneFrom` / `phoneAutoFrom` / `detectCountryFrom` / `phoneCountriesFrom` (your own country table), `card()`, `cardBrand(number)`, `cardExpiry()`, `cvc()`, `date(format)`, `time(seconds)`, `datetime()`, `inn()`, `snils()`, `passport()`, `ogrn()`, `bik()`, `kpp()`, `account()`, `postcode()`, `carPlate()`, `mac()`, `hexColor()`, `money(options)`, `percent(options)`.

Import from `tinyval-mask/presets` for the smallest bundle, or use the `masks` namespace from `tinyval-mask`.

## Vue

```vue
<script setup lang="ts">
import { phone } from 'tinyval-mask/presets';
import { vMask } from 'tinyval-mask/vue';

const phoneMask = phone();
</script>

<template>
  <input v-model="tel" v-mask="phoneMask" />                                   <!-- '+7 (999) 123-45-67' -->
  <input v-model="tel" v-mask.raw="phoneMask" />                               <!-- '79991234567' -->
  <input v-model="tel" v-mask.raw="{ mask: phoneMask, placeholder: '_' }" />   <!-- +7 (___) ___-__-__ -->
</template>
```

Works on wrappers too (UI library fields, `<TvField>` from tinyval-vue).

## With tinyval

```ts
const Contact = object({
  phone: preprocess((v) => unmask(String(v ?? ''), phone()), pipe(string(), length(11))),
});
```

## Docs

Full documentation with live examples (ru, en, zh): [tinyval.ru/tinyval-mask](https://tinyval.ru/tinyval-mask/).

## License

MIT
