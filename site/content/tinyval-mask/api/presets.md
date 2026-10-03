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

| Страна | Маска | Формат |
| --- | --- | --- |
| 🇷🇺 Россия | `phone()`, `phone('ru')` | `+7 (123) 456-78-90` |
| 🇰🇿 Казахстан | `phone('kz')` | `+7 (123) 456-78-90` |
| 🇧🇾 Беларусь | `phone('by')` | `+375 (12) 345-67-89` |
| 🇺🇦 Украина | `phone('ua')` | `+380 (12) 345-67-89` |
| 🇺🇿 Узбекистан | `phone('uz')` | `+998 (12) 345-67-89` |
| 🇰🇬 Киргизия | `phone('kg')` | `+996 (123) 456-789` |
| 🇹🇯 Таджикистан | `phone('tj')` | `+992 (12) 345-67-89` |
| 🇹🇲 Туркменистан | `phone('tm')` | `+993 (12) 34-56-78` |
| 🇦🇲 Армения | `phone('am')` | `+374 (12) 345-678` |
| 🇬🇪 Грузия | `phone('ge')` | `+995 (123) 45-67-89` |
| 🇦🇿 Азербайджан | `phone('az')` | `+994 (12) 345-67-89` |
| 🇲🇩 Молдова | `phone('md')` | `+373 (12) 345-678` |
| 🇱🇻 Латвия | `phone('lv')` | `+371 1234-5678` |
| 🇱🇹 Литва | `phone('lt')` | `+370 (123) 45678` |
| 🇪🇪 Эстония | `phone('ee')` | `+372 123 4567` |
| 🇺🇸 Соединенные Штаты | `phone('us')` | `+1 (123) 456-7890` |
| 🇨🇦 Канада | `phone('ca')` | `+1 (123) 456-7890` |
| 🇬🇧 Великобритания | `phone('gb')` | `+44 1234 567890` |
| 🇩🇪 Германия | `phone('de')` | `+49 123 4567890` |
| 🇫🇷 Франция | `phone('fr')` | `+33 1 23 45 67 89` |
| 🇮🇹 Италия | `phone('it')` | `+39 123 456 7890` |
| 🇪🇸 Испания | `phone('es')` | `+34 123 45 67 89` |
| 🇵🇱 Польша | `phone('pl')` | `+48 123 456 789` |
| 🇹🇷 Турция | `phone('tr')` | `+90 (123) 456 78 90` |
| 🇨🇳 Китай | `phone('cn')` | `+86 123 4567 8901` |
| 🇮🇳 Индия | `phone('in')` | `+91 12345 67890` |
| 🇮🇱 Израиль | `phone('il')` | `+972 12-345-6789` |
| 🇦🇪 ОАЭ | `phone('ae')` | `+971 12 345 6789` |

Без маски — все цифры вместе с кодом страны: `+375 (29) 123-45-67` → `375291234567`. Для России и Казахстана `7` или `8` в начале понимается как код страны: `89991234567` → `+7 (999) 123-45-67`.

Если страна заранее неизвестна, используйте [`phoneAuto`](~/api/phone-auto): маска выбирается по коду, который вводит пользователь, и есть флаг и название страны для интерфейса.

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

Невозможные цифры не вводятся: 32-е число, 13-й месяц, 25-й час, 60 минут, `00.00`. То же у `cardExpiry` для месяца. Существует ли дата целиком (31 февраля), проверяет валидация: [`coerce.date`](@/tinyval/schemas/coerce) в tinyval.

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

## Что проверяет valid

`isValid` и свойство `valid` — значение заполнено **и** правильно по смыслу. `isComplete` и `complete` — только заполнено.

| Маска | `valid` |
| --- | --- |
| `date`, `datetime` | Дата существует: 31.02 — нет, 29.02 — только в високосный год |
| `cardExpiry` | Месяц 01–12, срок не истёк |
| `card` | Контрольная цифра номера (алгоритм Луна) |
| `inn`, `snils`, `ogrn` | Контрольные суммы |
| `phoneAuto` | Номер заполнен по маске определённой страны |
| остальные | То же, что `complete` |

```ts
isComplete('31.02.2026', date()); // true — все цифры на месте
isValid('31.02.2026', date());    // false — такой даты нет
```
:::

::: en
## Phones

| Country | Mask | Format |
| --- | --- | --- |
| 🇷🇺 Russia | `phone()`, `phone('ru')` | `+7 (123) 456-78-90` |
| 🇰🇿 Kazakhstan | `phone('kz')` | `+7 (123) 456-78-90` |
| 🇧🇾 Belarus | `phone('by')` | `+375 (12) 345-67-89` |
| 🇺🇦 Ukraine | `phone('ua')` | `+380 (12) 345-67-89` |
| 🇺🇿 Uzbekistan | `phone('uz')` | `+998 (12) 345-67-89` |
| 🇰🇬 Kyrgyzstan | `phone('kg')` | `+996 (123) 456-789` |
| 🇹🇯 Tajikistan | `phone('tj')` | `+992 (12) 345-67-89` |
| 🇹🇲 Turkmenistan | `phone('tm')` | `+993 (12) 34-56-78` |
| 🇦🇲 Armenia | `phone('am')` | `+374 (12) 345-678` |
| 🇬🇪 Georgia | `phone('ge')` | `+995 (123) 45-67-89` |
| 🇦🇿 Azerbaijan | `phone('az')` | `+994 (12) 345-67-89` |
| 🇲🇩 Moldova | `phone('md')` | `+373 (12) 345-678` |
| 🇱🇻 Latvia | `phone('lv')` | `+371 1234-5678` |
| 🇱🇹 Lithuania | `phone('lt')` | `+370 (123) 45678` |
| 🇪🇪 Estonia | `phone('ee')` | `+372 123 4567` |
| 🇺🇸 United States | `phone('us')` | `+1 (123) 456-7890` |
| 🇨🇦 Canada | `phone('ca')` | `+1 (123) 456-7890` |
| 🇬🇧 United Kingdom | `phone('gb')` | `+44 1234 567890` |
| 🇩🇪 Germany | `phone('de')` | `+49 123 4567890` |
| 🇫🇷 France | `phone('fr')` | `+33 1 23 45 67 89` |
| 🇮🇹 Italy | `phone('it')` | `+39 123 456 7890` |
| 🇪🇸 Spain | `phone('es')` | `+34 123 45 67 89` |
| 🇵🇱 Poland | `phone('pl')` | `+48 123 456 789` |
| 🇹🇷 Türkiye | `phone('tr')` | `+90 (123) 456 78 90` |
| 🇨🇳 China | `phone('cn')` | `+86 123 4567 8901` |
| 🇮🇳 India | `phone('in')` | `+91 12345 67890` |
| 🇮🇱 Israel | `phone('il')` | `+972 12-345-6789` |
| 🇦🇪 United Arab Emirates | `phone('ae')` | `+971 12 345 6789` |

Unmasked — all digits including the country code: `+375 (29) 123-45-67` → `375291234567`. For Russia and Kazakhstan a leading `7` or `8` is treated as the country code: `89991234567` → `+7 (999) 123-45-67`.

If the country isn't known in advance, use [`phoneAuto`](~/api/phone-auto): the mask is chosen by the code the user types, with a flag and the country name for your UI.

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

Impossible digits can't be typed: day 32, month 13, hour 25, minute 60, `00.00`. `cardExpiry` does the same for the month. Whether the whole date exists (February 31) is checked by validation: [`coerce.date`](@/tinyval/schemas/coerce) in tinyval.

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

## What valid checks

`isValid` and the `valid` property mean the value is filled **and** correct. `isComplete` and `complete` mean only filled.

| Mask | `valid` |
| --- | --- |
| `date`, `datetime` | The date exists: no 31.02, 29.02 only in a leap year |
| `cardExpiry` | Month 01–12, not expired |
| `card` | The check digit (Luhn algorithm) |
| `inn`, `snils`, `ogrn` | Checksums |
| `phoneAuto` | The number is filled by the mask of a detected country |
| others | The same as `complete` |

```ts
isComplete('31.02.2026', date()); // true — all digits are there
isValid('31.02.2026', date());    // false — no such date
```
:::

::: zh
## 电话

| 国家 | 掩码 | 格式 |
| --- | --- | --- |
| 🇷🇺 俄罗斯 | `phone()`, `phone('ru')` | `+7 (123) 456-78-90` |
| 🇰🇿 哈萨克斯坦 | `phone('kz')` | `+7 (123) 456-78-90` |
| 🇧🇾 白俄罗斯 | `phone('by')` | `+375 (12) 345-67-89` |
| 🇺🇦 乌克兰 | `phone('ua')` | `+380 (12) 345-67-89` |
| 🇺🇿 乌兹别克斯坦 | `phone('uz')` | `+998 (12) 345-67-89` |
| 🇰🇬 吉尔吉斯斯坦 | `phone('kg')` | `+996 (123) 456-789` |
| 🇹🇯 塔吉克斯坦 | `phone('tj')` | `+992 (12) 345-67-89` |
| 🇹🇲 土库曼斯坦 | `phone('tm')` | `+993 (12) 34-56-78` |
| 🇦🇲 亚美尼亚 | `phone('am')` | `+374 (12) 345-678` |
| 🇬🇪 格鲁吉亚 | `phone('ge')` | `+995 (123) 45-67-89` |
| 🇦🇿 阿塞拜疆 | `phone('az')` | `+994 (12) 345-67-89` |
| 🇲🇩 摩尔多瓦 | `phone('md')` | `+373 (12) 345-678` |
| 🇱🇻 拉脱维亚 | `phone('lv')` | `+371 1234-5678` |
| 🇱🇹 立陶宛 | `phone('lt')` | `+370 (123) 45678` |
| 🇪🇪 爱沙尼亚 | `phone('ee')` | `+372 123 4567` |
| 🇺🇸 美国 | `phone('us')` | `+1 (123) 456-7890` |
| 🇨🇦 加拿大 | `phone('ca')` | `+1 (123) 456-7890` |
| 🇬🇧 英国 | `phone('gb')` | `+44 1234 567890` |
| 🇩🇪 德国 | `phone('de')` | `+49 123 4567890` |
| 🇫🇷 法国 | `phone('fr')` | `+33 1 23 45 67 89` |
| 🇮🇹 意大利 | `phone('it')` | `+39 123 456 7890` |
| 🇪🇸 西班牙 | `phone('es')` | `+34 123 45 67 89` |
| 🇵🇱 波兰 | `phone('pl')` | `+48 123 456 789` |
| 🇹🇷 土耳其 | `phone('tr')` | `+90 (123) 456 78 90` |
| 🇨🇳 中国 | `phone('cn')` | `+86 123 4567 8901` |
| 🇮🇳 印度 | `phone('in')` | `+91 12345 67890` |
| 🇮🇱 以色列 | `phone('il')` | `+972 12-345-6789` |
| 🇦🇪 阿拉伯联合酋长国 | `phone('ae')` | `+971 12 345 6789` |

去掉掩码后为包含国家代码的全部数字：`+375 (29) 123-45-67` → `375291234567`。对于俄罗斯和哈萨克斯坦，开头的 `7` 或 `8` 被视为国家代码：`89991234567` → `+7 (999) 123-45-67`。

如果事先不知道国家，请使用 [`phoneAuto`](~/api/phone-auto)：根据用户输入的区号选择掩码，并提供国旗和国家名称用于界面显示。

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

无法输入不可能的数字：32 日、13 月、25 时、60 分、`00.00`。`cardExpiry` 的月份同样如此。整个日期是否存在（2 月 31 日）由校验负责：使用 tinyval 的 [`coerce.date`](@/tinyval/schemas/coerce)。

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

## valid 检查什么

`isValid` 和 `valid` 属性表示值已填写**且**正确。`isComplete` 和 `complete` 只表示已填写。

| 掩码 | `valid` |
| --- | --- |
| `date`、`datetime` | 日期存在：没有 31.02，29.02 只在闰年存在 |
| `cardExpiry` | 月份为 01–12，且未过期 |
| `card` | 校验位（Luhn 算法） |
| `inn`、`snils`、`ogrn` | 校验和 |
| `phoneAuto` | 号码已按识别出的国家掩码填写完整 |
| 其他 | 与 `complete` 相同 |

```ts
isComplete('31.02.2026', date()); // true —— 数字都已填写
isValid('31.02.2026', date());    // false —— 不存在这个日期
```
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
