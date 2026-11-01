::: ru
Строка — СНИЛС с верным контрольным числом: `112-233-445 95`.
:::

::: en
The string is a Russian SNILS number with a valid check number: `112-233-445 95`.
:::

::: zh
字符串是校验码正确的俄罗斯 SNILS 号码：`112-233-445 95`。
:::

## @t(signature)

```ts
function snils(msg?: Message): Action<string>
function isSnils(value: string): boolean
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
| `snils` | Неверная контрольная сумма или формат | Invalid SNILS |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `snils` | Invalid checksum or format | Invalid SNILS |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `snils` | 校验位或格式错误 | Invalid SNILS |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
Последние две цифры — контрольное число от первых девяти.

- Пробелы и дефисы допускаются: можно проверять значение с маской.
- Функция `isSnils` доступна отдельно — для проверки без схемы.
- Ввод удобно оформить маской из [tinyval-mask](@/tinyval-mask/api/presets).
:::

::: en
The last two digits are a check number computed from the first nine.

- Spaces and dashes are allowed: a masked value can be validated.
- The `isSnils` function is available separately — for checks without a schema.
- Format the input with a mask from [tinyval-mask](@/tinyval-mask/api/presets).
:::

::: zh
最后两位是由前九位计算出的校验码。

- 允许空格和短横线：可以直接校验带掩码的值。
- 也可以单独使用 `isSnils` 函数 —— 无需 Schema 即可检查。
- 可以使用 [tinyval-mask](@/tinyval-mask/api/presets) 的掩码格式化输入。
:::

## @t(example)

```ts
const Employee = object({ snils: pipe(string(), snils()) });

isSnils('112-233-445 95'); // true
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
