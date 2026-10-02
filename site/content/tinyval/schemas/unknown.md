::: ru
Пропускает любое значение без проверки, включая `undefined`. Ошибок не бывает.
:::

::: en
Accepts any value without checks, including `undefined`. Never fails.
:::

::: zh
不做任何检查地接受任意值，包括 `undefined`。永远不会失败。
:::

## @t(signature)

```ts
function unknown(): Schema<unknown>
```

::: ru
## Когда использовать

- Поле с произвольными данными, которые проверяются позже или не проверяются вовсе (метаданные, настройки).
- Чтобы поле не удалялось из `data` объектом с `unknown: 'strip'`.
:::

::: en
## When to use

- A field with arbitrary data that is validated later or not at all (metadata, settings).
- To keep a field in `data` when the object uses `unknown: 'strip'`.
:::

::: zh
## 使用场景

- 包含任意数据、稍后再校验或不校验的字段（元数据、设置）。
- 在使用 `unknown: 'strip'` 的对象中保留某个字段。
:::

## @t(example)

::: ru
### Произвольные метаданные
:::

::: en
### Arbitrary metadata
:::

::: zh
### 任意元数据
:::

```ts
const Event = object({
  type: string(),
  payload: unknown(),
});
```

## @t(see)

::: ru
- [object](~/schemas/object) — режим passthrough для всех лишних полей
:::

::: en
- [object](~/schemas/object) — passthrough mode for all unknown keys
:::

::: zh
- [object](~/schemas/object)：保留所有多余字段的 passthrough 模式
:::
