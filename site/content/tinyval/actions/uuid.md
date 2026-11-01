::: ru
Строка — UUID любой версии: `550e8400-e29b-41d4-a716-446655440000`.
:::

::: en
The string is a UUID of any version: `550e8400-e29b-41d4-a716-446655440000`.
:::

::: zh
字符串是任意版本的 UUID：`550e8400-e29b-41d4-a716-446655440000`。
:::

## @t(signature)

```ts
function uuid(msg?: Message): Action<string>
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
| `uuid` | Не UUID | Invalid UUID |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `uuid` | Not a UUID | Invalid UUID |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `uuid` | 不是 UUID | Invalid UUID |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(example)

```ts
const Params = object({ id: pipe(string(), uuid()) });
```

## @t(see)

::: ru
- [brand](~/schemas/brand) — отдельный тип для ID
:::

::: en
- [brand](~/schemas/brand) — a separate type for IDs
:::

::: zh
- [brand](~/schemas/brand)：为 ID 定义单独的类型
:::
