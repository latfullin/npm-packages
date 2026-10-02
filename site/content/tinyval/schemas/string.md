::: ru
Строка. Пустая строка `''` считается незаполненным значением.
:::

::: en
A string. The empty string `''` is treated as a missing value.
:::

::: zh
字符串。空字符串 `''` 被视为未填写。
:::

## @t(signature)

```ts
function string(msg?: Message): Schema<string>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `msg` | `Message` | Своё сообщение. Заменяет сообщения по умолчанию для всех ошибок этой схемы |

## Пропускает

Любую непустую строку. Числа не приводятся к строке — для этого есть [`coerce.string`](~/schemas/coerce).

Пустыми считаются `undefined`, `null` и `''` — подробнее в разделе [Пустые значения](~/guide/empty-values).
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `msg` | `Message` | Custom message. Replaces the default messages for all errors of this schema |

## Accepts

Any non-empty string. Numbers are not converted to strings — use [`coerce.string`](~/schemas/coerce) for that.

`undefined`, `null` and `''` are treated as empty — see [Empty values](~/guide/empty-values).
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `msg` | `Message` | 自定义信息。替换该 Schema 所有错误的默认信息 |

## 接受的值

任意非空字符串。数字不会被转换为字符串 —— 请使用 [`coerce.string`](~/schemas/coerce)。

`undefined`、`null` 和 `''` 都被视为空值 —— 详见 [空值](~/guide/empty-values)。
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `required` | Значение пустое | Required |
| `string` | Не строка | Must be a string |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `required` | The value is empty | Required |
| `string` | Not a string | Must be a string |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `required` | 值为空 | Required |
| `string` | 不是字符串 | Must be a string |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
Строка из пробелов `'   '` проходит проверку. Чтобы её запретить: `pipe(string(), trim(), minLength(1))`.

Чтобы разрешить пустую строку как значение: `optional(string(), '')`.

## Примеры

### Обязательное поле с правилами

```ts
const name = pipe(string('Введите имя'), trim(), minLength(2), maxLength(50));

validate(name, '');      // Введите имя
validate(name, ' Ян ');  // valid, data: 'Ян'
```
:::

::: en
A whitespace-only string `'   '` passes. To reject it: `pipe(string(), trim(), minLength(1))`.

To allow an empty string as a value: `optional(string(), '')`.

## Example

### Required field with rules

```ts
const name = pipe(string('Please enter your name'), trim(), minLength(2), maxLength(50));

validate(name, '');       // Please enter your name
validate(name, ' Ann ');  // valid, data: 'Ann'
```
:::

::: zh
只包含空格的字符串 `'   '` 可以通过校验。要拒绝它：`pipe(string(), trim(), minLength(1))`。

要允许空字符串作为值：`optional(string(), '')`。

## 示例

### 带规则的必填字段

```ts
const name = pipe(string('请输入姓名'), trim(), minLength(2), maxLength(50));

validate(name, '');        // 请输入姓名
validate(name, ' 李雷 ');  // 有效，data: '李雷'
```
:::

## @t(see)

::: ru
- [pipe](~/actions/pipe) — добавить правила
- [coerce.string](~/schemas/coerce) — приведение чисел к строке
- [Пустые значения](~/guide/empty-values)
:::

::: en
- [pipe](~/actions/pipe) — add rules
- [coerce.string](~/schemas/coerce) — numbers to strings
- [Empty values](~/guide/empty-values)
:::

::: zh
- [pipe](~/actions/pipe)：添加规则
- [coerce.string](~/schemas/coerce)：把数字转换为字符串
- [空值](~/guide/empty-values)
:::
