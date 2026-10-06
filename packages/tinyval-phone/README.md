# tinyval-phone

Phone masks for every country for [tinyval-mask](https://www.npmjs.com/package/tinyval-mask): the country and its number format are detected by the code the user types. 245 countries, ~4 kB gzip, plus SVG flag icons loaded on demand.

- The same API as `phone` / `phoneAuto` from `tinyval-mask/presets` — just change the import
- Formats from Google libphonenumber data: in every country the number looks the way it's written there
- Countries sharing a code are told apart: `+1 242` is the Bahamas, `+44 7797` is Jersey, `+7 701` is Kazakhstan
- The national prefix is dropped: `07400 123456` in the UK → `+44 7400 123456`

## Install

```bash
npm install tinyval-mask tinyval-phone
```

## Usage

```ts
import { mask, unmask } from 'tinyval-mask';
import { phoneAuto, phone, detectCountry, countryName } from 'tinyval-phone';

const tel = phoneAuto({ defaultCountry: 'jp' });
mask('09012345678', tel);          // '+81 90-1234-5678'
mask('+55 11961234567', tel);      // '+55 (11) 96123-4567'
unmask('+81 90-1234-5678', tel);   // '819012345678'
tel.country('+1 242 359 1234');    // { code: 'bs', dial: '1', flag: '🇧🇸' }
countryName('bs', 'en');           // 'Bahamas'

mask('0612345678', phone('fr'));   // '+33 6 12 34 56 78'
detectCountry('+44 7797 712345');  // 'je'
```

With Vue — the `v-mask` directive from `tinyval-mask/vue`:

```vue
<input v-model="tel" v-mask.raw="{ mask: phoneAuto({ defaultCountry: 'jp' }), placeholder: '_' }" />
```

## Flag icons

Flag emoji don't render on Windows; SVG icons look the same everywhere. Each flag is a separate module, so only the flags you show get loaded.

```ts
import { loadFlag, flagCodes } from 'tinyval-phone/flags';

el.innerHTML = (await loadFlag('jp')) ?? ''; // '<svg …>', 3:2
flagCodes();                                 // 257 codes
import jp from 'tinyval-phone/flags/jp.svg'; // a file URL via your bundler
```

## Your own countries and flags

Like `npx tinyval lang` in tinyval: copy the data into your project, edit it, load it once on startup.

```bash
npx tinyval-phone countries ru kz de   # phones/countries.ts — formats to edit; no codes = all countries
npx tinyval-phone flags ru kz          # phones/flags.ts — SVG of these flags; --all --svg copies .svg files
```

```ts
import { setCountries } from 'tinyval-phone';
import { setFlags } from 'tinyval-phone/flags';
import countries from './phones/countries';
import flags from './phones/flags';

setCountries(countries);  // change formats, add (ab: [...]) or remove (xk: null) countries; { replace: true } — only yours
setFlags(flags);          // or one loader for all: setFlags((code) => fetch(`/flags/${code}.svg`).then((r) => r.text()))
```

A country entry is `[dial code, pattern after the code, national prefix, country sign]`, e.g. `['49', '999 9999999[9]', '0']`.

## Docs

Full documentation with a live demo (ru, en, zh): see the `site/` folder of the repository.

## Data

Formats are generated from libphonenumber-js metadata (based on Google libphonenumber, Apache-2.0), flags are from country-flag-icons (MIT) — see `NOTICE`. To update: `npm run generate`.

## License

MIT
