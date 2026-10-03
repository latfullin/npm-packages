::: ru
Строка — ИНН с верной контрольной суммой: 10 цифр у организации, 12 — у физлица и ИП.
:::

::: en
The string is a Russian tax ID (INN) with a valid checksum: 10 digits for companies, 12 for individuals.
:::

::: zh
字符串是校验位正确的俄罗斯税号（ИНН）：机构 10 位，个人 12 位。
:::

## @t(signature)

```ts
function inn(msg?: Message): Action<string>
function isInn(value: string): boolean
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
| `inn` | Неверная контрольная сумма или формат | Invalid INN |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `inn` | Invalid checksum or format | Invalid INN |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `inn` | 校验位或格式错误 | Invalid INN |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
Проверяется контрольная сумма по алгоритму ФНС — опечатка в одной цифре почти всегда будет найдена. Существует ли такая организация, правило не проверяет.

- Пробелы и дефисы допускаются: можно проверять значение с маской.
- Функция `isInn` доступна отдельно — для проверки без схемы.
- Ввод удобно оформить маской из [tinyval-mask](@/tinyval-mask/api/presets).
:::

::: en
The checksum is verified by the tax service algorithm — a single-digit typo is almost always caught. Whether such a company exists is not checked.

- Spaces and dashes are allowed: a masked value can be validated.
- The `isInn` function is available separately — for checks without a schema.
- Format the input with a mask from [tinyval-mask](@/tinyval-mask/api/presets).
:::

::: zh
按税务局算法校验校验位 —— 单个数字的输入错误几乎总能被发现。不检查该机构是否真实存在。

- 允许空格和短横线：可以直接校验带掩码的值。
- 也可以单独使用 `isInn` 函数 —— 无需 Schema 即可检查。
- 可以使用 [tinyval-mask](@/tinyval-mask/api/presets) 的掩码格式化输入。
:::

## @t(example)

```ts
const Company = object({ inn: pipe(string(), inn()) });

isInn('7707083893'); // true
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
