::: ru
Номер банковской карты с верной контрольной цифрой (алгоритм Луна), 12–19 цифр.
:::

::: en
A bank card number with a valid check digit (Luhn algorithm), 12–19 digits.
:::

::: zh
校验位正确（Luhn 算法）的银行卡号，12–19 位。
:::

## @t(signature)

```ts
function luhn(msg?: Message): Action<string>
function isLuhn(value: string): boolean
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `msg` | `Message` | Своё сообщение об ошибке |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `msg` | `Message` | Custom error message |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `msg` | `Message` | 自定义错误信息 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `luhn` | Неверная контрольная сумма или формат | Invalid card number |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `luhn` | Invalid checksum or format | Invalid card number |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `luhn` | 校验位或格式错误 | Invalid card number |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
Ловит опечатки и случайные цифры. Не проверяет срок действия, существование карты и платёжную систему — для системы есть `cardBrand` в tinyval-mask.

- Пробелы и дефисы допускаются: можно проверять значение с маской.
- Функция `isLuhn` доступна отдельно — для проверки без схемы.
- Ввод удобно оформить маской из [tinyval-mask](@/tinyval-mask/api/presets).
:::

::: en
Catches typos and random digits. Doesn't check expiry, whether the card exists or the brand — tinyval-mask has `cardBrand` for that.

- Spaces and dashes are allowed: a masked value can be validated.
- The `isLuhn` function is available separately — for checks without a schema.
- Format the input with a mask from [tinyval-mask](@/tinyval-mask/api/presets).
:::

::: zh
可以发现输入错误和随意的数字。不检查有效期、卡是否存在以及卡组织 —— 卡组织可以用 tinyval-mask 的 `cardBrand` 判断。

- 允许空格和短横线：可以直接校验带掩码的值。
- 也可以单独使用 `isLuhn` 函数 —— 无需 Schema 即可检查。
- 可以使用 [tinyval-mask](@/tinyval-mask/api/presets) 的掩码格式化输入。
:::

## @t(example)

```ts
const Payment = object({ card: pipe(string(), luhn()) });

isLuhn('4111 1111 1111 1111'); // true
```

## @t(see)

::: ru
- [pattern](~/actions/pattern)
- [check](~/actions/check) — свои проверки
:::

::: en
- [pattern](~/actions/pattern)
- [check](~/actions/check) — custom checks
:::

::: zh
- [pattern](~/actions/pattern)
- [check](~/actions/check)：自定义检查
:::
