# Changelog

## 0.1.0

First release.

- Phone masks for 245 countries for `tinyval-mask`: `phone(country)`, `phoneAuto(options)`, `detectCountry`, `phoneCountries`, `phoneTable`
- Formats from Google libphonenumber data; the 28 countries of `tinyval-mask` keep its formats
- Countries sharing a dial code are told apart (`+1`, `+7`, `+44`, …); national prefix (`0`, `8`) is dropped
- SVG flag icons for 257 countries and territories: `loadFlag(code)` (one module per flag) and `tinyval-phone/flags/<code>.svg`
- Your own data: `setCountries` (change, add, remove countries), `setFlags` / `resetFlags`, CLI `npx tinyval-phone countries | flags` copies the data into your project
