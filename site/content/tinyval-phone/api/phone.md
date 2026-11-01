::: ru
Маска одной страны, определение страны по номеру и список всех стран — с тем же API, что в `tinyval-mask/presets`.
:::

::: en
A single-country mask, country detection by number and the list of all countries — with the same API as in `tinyval-mask/presets`.
:::

::: zh
单个国家的掩码、根据号码识别国家以及所有国家的列表 —— API 与 `tinyval-mask/presets` 相同。
:::

## @t(signature)

```ts
function phone(country: PhoneCountry): Mask
function detectCountry(number: string, countries?: PhoneCountry[]): PhoneCountry | undefined
function phoneCountries(): CountryInfo[]
const phoneTable: Record<PhoneCountry, [dial, pattern, trunk?, detect?]> // данные пакета
function setCountries(countries: Record<string, CountryEntry | null>, options?: { replace?: boolean }): void
function getCountries(): PhoneTable // с изменениями из setCountries

// из tinyval-mask/presets, для удобства
function flag(code: string): string
function countryName(code: string, locale?: string): string
```

## @t(notes)

::: ru
- `phone(country)` — маска с кодом страны в начале: `+81 99-9999-9999`. Код можно не набирать, национальную приставку — тоже: `09012345678` → `+81 90-1234-5678`.
- `detectCountry` ищет по цифрам с кодом страны и не учитывает страну по умолчанию: `detectCountry('9012345678')` — это `+90` (Турция).
- `phoneCountries()` — 245 стран в алфавитном порядке кодов. Названия — через `countryName` на языке интерфейса.
- `setCountries` меняет, добавляет (`ab: […]`) и убирает (`xk: null`) страны для всех функций пакета; `replace: true` — только переданные. Вызывайте один раз при старте, до создания масок. Файл для правки — `npx tinyval-phone countries`, см. [Свои страны и флаги](~/guide/custom).
:::

::: en
- `phone(country)` — a mask with the country code at the start: `+81 99-9999-9999`. The code doesn't have to be typed, nor does the national prefix: `09012345678` → `+81 90-1234-5678`.
- `detectCountry` looks at digits including the country code and doesn't know about a default country: `detectCountry('9012345678')` is `+90` (Turkey).
- `phoneCountries()` — 245 countries in alphabetical order of codes. Names come from `countryName` in the UI language.
- `setCountries` changes, adds (`ab: […]`) and removes (`xk: null`) countries for all functions of the package; `replace: true` — only the given ones. Call it once on startup, before creating masks. A file to edit — `npx tinyval-phone countries`, see [Your own countries & flags](~/guide/custom).
:::

::: zh
- `phone(country)` —— 以国家代码开头的掩码：`+81 99-9999-9999`。国家代码可以不输入，国内长途前缀也可以不输入：`09012345678` → `+81 90-1234-5678`。
- `detectCountry` 按包含国家代码的数字识别，不考虑默认国家：`detectCountry('9012345678')` 是 `+90`（土耳其）。
- `phoneCountries()` —— 按代码字母顺序排列的 245 个国家。名称通过 `countryName` 以界面语言获取。
- `setCountries` 为本包的所有函数修改、添加（`ab: […]`）和删除（`xk: null`）国家；`replace: true` —— 只保留传入的国家。请在启动时、创建掩码之前调用一次。可编辑的文件 —— `npx tinyval-phone countries`，见 [自定义国家和国旗](~/guide/custom)。
:::

## @t(examples)

```ts
import { mask } from 'tinyval-mask';
import { phone, detectCountry, phoneCountries, countryName } from 'tinyval-phone';

mask('09012345678', phone('jp'));   // '+81 90-1234-5678'
mask('0612345678', phone('fr'));    // '+33 6 12 34 56 78'
detectCountry('+971501234567');     // 'ae'
detectCountry('+1 242 359 1234');   // 'bs'

// свой выбор страны
const options = phoneCountries().map((c) => ({
  value: c.code,
  label: `${c.flag} ${countryName(c.code, 'ru')} +${c.dial}`,
}));
```

## @t(see)

::: ru
- [Свои страны и флаги](~/guide/custom) — `npx tinyval-phone countries`
- [phoneAuto](~/api/phone-auto) — страна по вводу
- [Страны и форматы](~/guide/countries) — `phoneTable` и свои страны
:::

::: en
- [Your own countries & flags](~/guide/custom) — `npx tinyval-phone countries`
- [phoneAuto](~/api/phone-auto) — the country by input
- [Countries & formats](~/guide/countries) — `phoneTable` and your own countries
:::

::: zh
- [自定义国家和国旗](~/guide/custom) —— `npx tinyval-phone countries`
- [phoneAuto](~/api/phone-auto) —— 根据输入识别国家
- [国家与格式](~/guide/countries) —— `phoneTable` 和自定义国家
:::
