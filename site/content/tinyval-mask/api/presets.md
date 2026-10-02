::: ru
Готовые маски. Импортируйте из `tinyval-mask/presets` — так в сборку попадут только нужные. Все маски доступны и через объект `masks` из `tinyval-mask`.
:::

::: en
Ready-made masks. Import them from `tinyval-mask/presets` so only the ones you use are bundled. All of them are also available via the `masks` object from `tinyval-mask`.
:::

::: zh
预设掩码。请从 `tinyval-mask/presets` 导入 —— 这样只会打包用到的掩码。所有掩码也可以通过 `tinyval-mask` 中的 `masks` 对象使用。
:::

```ts
import { phone, card, money } from 'tinyval-mask/presets'; // tree-shakeable
import { masks } from 'tinyval-mask';                      // masks.phone(), masks.card()…
```

::: ru
## Телефоны

| Маска | Пример | Без маски |
| --- | --- | --- |
| `phone()`, `phone('ru')` | `+7 (999) 123-45-67` | `79991234567` |
| `phone('kz')` | `+7 (701) 123-45-67` | `77011234567` |
| `phone('by')` | `+375 (29) 123-45-67` | `375291234567` |
| `phone('ua')` | `+380 (67) 123-45-67` | `380671234567` |
| `phone('uz')` | `+998 (90) 123-45-67` | `998901234567` |
| `phone('us')` | `+1 (202) 555-0123` | `12025550123` |

Для России и Казахстана `7` или `8` в начале понимается как код страны: `89991234567` → `+7 (999) 123-45-67`. Без маски — все цифры вместе с кодом страны.

## Банковские карты

| Маска | Пример |
| --- | --- |
| `card()` | `4276 1234 5678 9012`; Amex — `3782 822463 10005`; до 19 цифр |
| `cardExpiry()` | `12/26` |
| `cvc()` | `123` или `1234` |
| `cardBrand(number)` | `'visa'`, `'mastercard'`, `'mir'`, `'amex'`, `'unionpay'`, `'unknown'` — например, чтобы показать иконку |

## Даты и время

| Маска | Пример |
| --- | --- |
| `date()`, `date('dd.mm.yyyy')` | `02.10.2026` |
| `date('yyyy-mm-dd')`, `date('mm/dd/yyyy')`, `date('dd/mm/yyyy')` | `2026-10-02` |
| `time()`, `time(true)` | `09:30`, `09:30:15` |
| `datetime()` | `02.10.2026 15:30` |

Маска не проверяет, существует ли дата, — это задача валидации: [`coerce.date`](@/tinyval/schemas/coerce) в tinyval.

## Документы и реквизиты РФ

| Маска | Пример |
| --- | --- |
| `inn()` | `7707083893` или `500100732259` (10 или 12 цифр) |
| `snils()` | `123-456-789 01` |
| `passport()` | `45 10 123456` |
| `ogrn()` | 13 или 15 цифр |
| `bik()` | `044525225` |
| `kpp()` | `7743AB001` |
| `account()` | `40702 810 9 0000 0000001` |
| `postcode()` | `101000` |
| `carPlate()` | `А 123 ВС 77` — латинские буквы-двойники заменяются кириллицей |

## Числа

| Маска | Пример |
| --- | --- |
| `money({ currency: '₽' })` | `1 500,50 ₽` — без маски `1500.50` |
| `percent()` | `15 %` |

Принимают все опции [`numberMask`](~/api/number-mask).

## Прочее

| Маска | Пример |
| --- | --- |
| `mac()` | `AA:BB:CC:DD:EE:FF` |
| `hexColor()` | `#FF8800` |
:::

::: en
## Phones

| Mask | Example | Unmasked |
| --- | --- | --- |
| `phone()`, `phone('ru')` | `+7 (999) 123-45-67` | `79991234567` |
| `phone('kz')` | `+7 (701) 123-45-67` | `77011234567` |
| `phone('by')` | `+375 (29) 123-45-67` | `375291234567` |
| `phone('ua')` | `+380 (67) 123-45-67` | `380671234567` |
| `phone('uz')` | `+998 (90) 123-45-67` | `998901234567` |
| `phone('us')` | `+1 (202) 555-0123` | `12025550123` |

For Russia and Kazakhstan a leading `7` or `8` is treated as the country code: `89991234567` → `+7 (999) 123-45-67`. Unmasked — all digits including the country code.

## Bank cards

| Mask | Example |
| --- | --- |
| `card()` | `4276 1234 5678 9012`; Amex — `3782 822463 10005`; up to 19 digits |
| `cardExpiry()` | `12/26` |
| `cvc()` | `123` or `1234` |
| `cardBrand(number)` | `'visa'`, `'mastercard'`, `'mir'`, `'amex'`, `'unionpay'`, `'unknown'` — e.g. to show an icon |

## Dates and time

| Mask | Example |
| --- | --- |
| `date()`, `date('dd.mm.yyyy')` | `02.10.2026` |
| `date('yyyy-mm-dd')`, `date('mm/dd/yyyy')`, `date('dd/mm/yyyy')` | `2026-10-02` |
| `time()`, `time(true)` | `09:30`, `09:30:15` |
| `datetime()` | `02.10.2026 15:30` |

The mask doesn't check whether the date exists — that's validation: [`coerce.date`](@/tinyval/schemas/coerce) in tinyval.

## Russian documents and bank details

| Mask | Example |
| --- | --- |
| `inn()` | `7707083893` or `500100732259` (10 or 12 digits) |
| `snils()` | `123-456-789 01` |
| `passport()` | `45 10 123456` |
| `ogrn()` | 13 or 15 digits |
| `bik()` | `044525225` |
| `kpp()` | `7743AB001` |
| `account()` | `40702 810 9 0000 0000001` |
| `postcode()` | `101000` |
| `carPlate()` | `А 123 ВС 77` — Latin look-alike letters are replaced with Cyrillic |

## Numbers

| Mask | Example |
| --- | --- |
| `money({ currency: '₽' })` | `1 500,50 ₽` — unmasked `1500.50` |
| `percent()` | `15 %` |

They accept all [`numberMask`](~/api/number-mask) options.

## Other

| Mask | Example |
| --- | --- |
| `mac()` | `AA:BB:CC:DD:EE:FF` |
| `hexColor()` | `#FF8800` |
:::

::: zh
## 电话

| 掩码 | 示例 | 去掉掩码后 |
| --- | --- | --- |
| `phone()`、`phone('ru')` | `+7 (999) 123-45-67` | `79991234567` |
| `phone('kz')` | `+7 (701) 123-45-67` | `77011234567` |
| `phone('by')` | `+375 (29) 123-45-67` | `375291234567` |
| `phone('ua')` | `+380 (67) 123-45-67` | `380671234567` |
| `phone('uz')` | `+998 (90) 123-45-67` | `998901234567` |
| `phone('us')` | `+1 (202) 555-0123` | `12025550123` |

对于俄罗斯和哈萨克斯坦，开头的 `7` 或 `8` 被视为国家代码：`89991234567` → `+7 (999) 123-45-67`。去掉掩码后是包含国家代码的全部数字。

## 银行卡

| 掩码 | 示例 |
| --- | --- |
| `card()` | `4276 1234 5678 9012`；Amex 为 `3782 822463 10005`；最多 19 位 |
| `cardExpiry()` | `12/26` |
| `cvc()` | `123` 或 `1234` |
| `cardBrand(number)` | `'visa'`、`'mastercard'`、`'mir'`、`'amex'`、`'unionpay'`、`'unknown'` —— 例如用于显示图标 |

## 日期和时间

| 掩码 | 示例 |
| --- | --- |
| `date()`、`date('dd.mm.yyyy')` | `02.10.2026` |
| `date('yyyy-mm-dd')`、`date('mm/dd/yyyy')`、`date('dd/mm/yyyy')` | `2026-10-02` |
| `time()`、`time(true)` | `09:30`、`09:30:15` |
| `datetime()` | `02.10.2026 15:30` |

掩码不检查日期是否真实存在 —— 这属于校验：使用 tinyval 的 [`coerce.date`](@/tinyval/schemas/coerce)。

## 俄罗斯证件与银行信息

| 掩码 | 示例 |
| --- | --- |
| `inn()` | `7707083893` 或 `500100732259`（10 或 12 位） |
| `snils()` | `123-456-789 01` |
| `passport()` | `45 10 123456` |
| `ogrn()` | 13 或 15 位 |
| `bik()` | `044525225` |
| `kpp()` | `7743AB001` |
| `account()` | `40702 810 9 0000 0000001` |
| `postcode()` | `101000` |
| `carPlate()` | `А 123 ВС 77` —— 外形相同的拉丁字母会替换为西里尔字母 |

## 数字

| 掩码 | 示例 |
| --- | --- |
| `money({ currency: '₽' })` | `1 500,50 ₽` —— 去掉掩码后为 `1500.50` |
| `percent()` | `15 %` |

它们接受 [`numberMask`](~/api/number-mask) 的所有选项。

## 其他

| 掩码 | 示例 |
| --- | --- |
| `mac()` | `AA:BB:CC:DD:EE:FF` |
| `hexColor()` | `#FF8800` |
:::

## @t(see)

::: ru
- [Шаблоны](~/guide/patterns) — своя маска, если готовой нет
:::

::: en
- [Patterns](~/guide/patterns) — your own mask if there is no ready-made one
:::

::: zh
- [模板](~/guide/patterns)：没有合适的预设掩码时自定义掩码
:::
