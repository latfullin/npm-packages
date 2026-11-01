# Changelog

## 0.1.1

### Patch Changes

- 9d50d3c: Ссылка на документацию ведёт на сайт: `homepage` — `https://tinyval.ru/<пакет>/`, в README добавлен раздел «Docs»

## 0.1.0

First release.

- Pattern masks: `9`, `a`, `*`, optional parts, custom tokens, several patterns, pattern functions, `allow`, `validate`
- `mask`, `unmask`, `isComplete`, `isValid`, `numberMask`
- Ready-made masks: phones of 28 countries, `phoneAuto` (country by code, flag and name), bank cards with brand detection, card expiry, CVC, dates and time (impossible digits are rejected), Russian documents (INN, SNILS, passport, OGRN, BIK, KPP, account, postcode, car plate), MAC, hex color, money, percent
- Phones: the national prefix (`8`, `0`) is dropped; `phoneTable` and `phoneFrom` / `phoneAutoFrom` / `detectCountryFrom` / `phoneCountriesFrom` for your own country tables (all countries — `tinyval-phone`)
- `valid`: the date exists, card expiry, Luhn, INN, SNILS, OGRN checksums
- `attach` for inputs: caret handling, Backspace through literals, paste, visible template, unmasked value for handlers
- `v-mask` directive for Vue (`tinyval-mask/vue`): `.raw`, `placeholder`, `onChange`
