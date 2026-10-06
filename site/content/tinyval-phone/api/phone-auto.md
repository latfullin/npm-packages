::: ru
Телефон любой страны мира: маска выбирается по коду, который вводит пользователь. Работает так же, как [phoneAuto из tinyval-mask](@/tinyval-mask/api/phone-auto), но знает 245 стран.
:::

::: en
A phone number of any country in the world: the mask is chosen by the code the user types. Works like [phoneAuto from tinyval-mask](@/tinyval-mask/api/phone-auto), but knows 245 countries.
:::

::: zh
全球任意国家的电话号码：根据用户输入的区号选择掩码。与 [tinyval-mask 的 phoneAuto](@/tinyval-mask/api/phone-auto) 用法相同，但支持 245 个国家。
:::

## @t(signature)

```ts
function phoneAuto(options?: { defaultCountry?: PhoneCountry; countries?: PhoneCountry[] }): PhoneAutoMask

interface PhoneAutoMask extends Mask {
  country(value: string): CountryInfo | undefined;
}

interface CountryInfo {
  code: PhoneCountry; // 'jp'
  dial: string;       // '81'
  flag: string;       // '🇯🇵'
}
```

## @t(params)

::: ru
| Опция | Описание |
| --- | --- |
| `defaultCountry` | Страна по умолчанию. Номер без `+` считается местным, национальная приставка отбрасывается: `09012345678` → `+81 90-1234-5678`. Пустое поле показывает её шаблон и флаг |
| `countries` | Среди каких стран определять. Удобно, если сервис работает в нескольких странах: остальные номера не примутся как `valid` |
:::

::: en
| Option | Description |
| --- | --- |
| `defaultCountry` | The default country. A number without `+` is local, the national prefix is dropped: `09012345678` → `+81 90-1234-5678`. An empty field shows its template and flag |
| `countries` | Which countries to detect among. Handy if the service works in a few countries: other numbers won't be `valid` |
:::

::: zh
| 选项 | 说明 |
| --- | --- |
| `defaultCountry` | 默认国家。不带 `+` 的号码视为本地号码，国内长途前缀会被去掉：`09012345678` → `+81 90-1234-5678`。空输入框显示该国家的模板和国旗 |
| `countries` | 在哪些国家中识别。适用于只在几个国家提供服务的情况：其他号码不会是 `valid` |
:::

## @t(notes)

::: ru
- Как различаются страны с общим кодом (`+1`, `+7`, `+44`) — в [Странах и форматах](~/guide/countries#страны-с-общим-кодом).
- Чтобы ввести номер другой страны, когда поле показывает страну по умолчанию, достаточно набрать `+`.
- Значение без маски — все цифры с кодом страны: `819012345678`.
- `valid` — `true`, только если номер заполнен по маске определённой страны.
:::

::: en
- How countries sharing a code (`+1`, `+7`, `+44`) are told apart — in [Countries & formats](~/guide/countries#countries-sharing-a-code).
- To type a number of another country when the field shows the default country, just type `+`.
- The unmasked value is all digits including the country code: `819012345678`.
- `valid` is `true` only if the number is filled by the mask of a detected country.
:::

::: zh
- 如何区分共用区号的国家（`+1`、`+7`、`+44`）—— 见 [国家与格式](~/guide/countries)。
- 当输入框显示默认国家时，如需输入其他国家的号码，只需输入 `+`。
- 去掉掩码后为包含国家代码的全部数字：`819012345678`。
- 只有当号码按识别出的国家掩码填写完整时，`valid` 才为 `true`。
:::

## @t(examples)

```ts
import { mask, unmask, isValid } from 'tinyval-mask';
import { phoneAuto, countryName } from 'tinyval-phone';

const tel = phoneAuto({ defaultCountry: 'jp' });
mask('09012345678', tel);              // '+81 90-1234-5678'
mask('+55 11961234567', tel);          // '+55 (11) 96123-4567'
tel.country('+1 242');                 // { code: 'bs', dial: '1', flag: '🇧🇸' }
countryName(tel.country('+55')!.code, 'en'); // 'Brazil'
isValid('+81 90-1234-5678', tel);      // true

// только несколько стран
const eu = phoneAuto({ defaultCountry: 'de', countries: ['de', 'at', 'ch', 'fr', 'it'] });
```

## @t(see)

::: ru
- [phone, detectCountry, phoneCountries](~/api/phone)
- [loadFlag](~/api/load-flag) — иконка флага для `country.code`
- [vMask](@/tinyval-mask/api/v-mask) — маска в поле Vue
:::

::: en
- [phone, detectCountry, phoneCountries](~/api/phone)
- [loadFlag](~/api/load-flag) — a flag icon for `country.code`
- [vMask](@/tinyval-mask/api/v-mask) — a mask in a Vue field
:::

::: zh
- [phone、detectCountry、phoneCountries](~/api/phone)
- [loadFlag](~/api/load-flag) —— `country.code` 对应的国旗图标
- [vMask](@/tinyval-mask/api/v-mask) —— Vue 输入框中的掩码
:::
