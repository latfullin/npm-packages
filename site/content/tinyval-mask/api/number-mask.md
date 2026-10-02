::: ru
Маска для чисел и сумм: разделитель тысяч, дробная часть, минус, префикс и суффикс.
:::

::: en
A mask for numbers and amounts: thousands separator, fraction, minus, prefix and suffix.
:::

::: zh
用于数字和金额的掩码：千位分隔符、小数部分、负号、前缀和后缀。
:::

## @t(signature)

```ts
function numberMask(options?: NumberMaskOptions): Mask
```

::: ru
| Опция | По умолчанию | Описание |
| --- | --- | --- |
| `thousands` | `' '` | Разделитель тысяч |
| `decimal` | `','` | Разделитель дробной части. Точка с цифровой клавиатуры тоже принимается |
| `precision` | `2` | Знаков после запятой; `0` — только целые |
| `negative` | `false` | Разрешить минус |
| `prefix`, `suffix` | `''` | Текст до и после числа: `'$'`, `' ₽'`, `' %'` |

Значение без маски — строка в формате JavaScript: `1 234,5` → `'1234.5'`. Превратить в число — `Number(unmask(...))` или [`coerce.number`](@/tinyval/schemas/coerce) в схеме. Лишние нули в начале убираются, `,5` превращается в `0,5`.
:::

::: en
| Option | Default | Description |
| --- | --- | --- |
| `thousands` | `' '` | Thousands separator |
| `decimal` | `','` | Decimal separator. A dot from the numpad is accepted too |
| `precision` | `2` | Digits after the separator; `0` — integers only |
| `negative` | `false` | Allow a minus |
| `prefix`, `suffix` | `''` | Text before and after the number: `'$'`, `' ₽'`, `' %'` |

The unmasked value is a JavaScript-style string: `1 234,5` → `'1234.5'`. To get a number use `Number(unmask(...))` or [`coerce.number`](@/tinyval/schemas/coerce) in a schema. Leading zeros are removed, `,5` becomes `0,5`.
:::

::: zh
| 选项 | 默认值 | 说明 |
| --- | --- | --- |
| `thousands` | `' '` | 千位分隔符 |
| `decimal` | `','` | 小数分隔符。也接受小键盘的句点 |
| `precision` | `2` | 小数位数；`0` 表示只允许整数 |
| `negative` | `false` | 允许负号 |
| `prefix`、`suffix` | `''` | 数字前后的文本：`'$'`、`' ₽'`、`' %'` |

去掉掩码后的值是 JavaScript 格式的字符串：`1 234,5` → `'1234.5'`。如需数字，请使用 `Number(unmask(...))` 或在 Schema 中使用 [`coerce.number`](@/tinyval/schemas/coerce)。开头多余的零会被去掉，`,5` 会变为 `0,5`。
:::

## @t(examples)

```ts
mask('1234567.891', numberMask());                                   // '1 234 567,89'
mask('1234567.5', numberMask({ thousands: ',', decimal: '.' }));     // '1,234,567.5'
mask('-42', numberMask({ negative: true, precision: 0 }));           // '-42'
mask('99', numberMask({ prefix: '$', thousands: ',', decimal: '.' })); // '$99'
unmask('1 500,50 ₽', money({ currency: '₽' }));                      // '1500.50'
```

## @t(see)

::: ru
- [Готовые маски](~/api/presets) — `money`, `percent`
:::

::: en
- [Ready-made masks](~/api/presets) — `money`, `percent`
:::

::: zh
- [预设掩码](~/api/presets)：`money`、`percent`
:::
