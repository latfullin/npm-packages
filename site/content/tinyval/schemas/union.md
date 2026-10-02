::: ru
Первая подходящая схема из списка — «или»: значение может быть числом **или** строкой, `'auto'` **или** числом и т.п.
:::

::: en
The first matching schema from a list — an "or": a value can be a number **or** a string, `'auto'` **or** a number, etc.
:::

::: zh
列表中第一个匹配的 Schema —— 即“或”：值可以是数字**或**字符串、`'auto'` **或**数字等。
:::

## @t(signature)

```ts
function union<const T extends readonly Schema[]>(options: T, msg?: Message): Schema<Infer<T[number]>>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `options` | `Schema[]` | Схемы, которые проверяются по порядку |
| `msg` | `Message` | Своё сообщение, если не подошла ни одна схема |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `options` | `Schema[]` | Schemas checked in order |
| `msg` | `Message` | Custom message if no schema matches |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `Schema[]` | 按顺序检查的 Schema |
| `msg` | `Message` | 没有任何 Schema 匹配时的自定义信息 |
:::

## @t(notes)

::: ru
- Схемы проверяются по порядку, возвращается результат первой подошедшей — вместе с её преобразованиями.
- Если не подошла ни одна — одна ошибка `union`, без подробностей по каждой схеме. Для объектов с полем-признаком (`type`) используйте [`variant`](~/schemas/variant): он покажет ошибки конкретного варианта.
- Пустое значение даёт `required`, если среди схем нет [`optional`](~/schemas/optional).
- Тип результата — объединение типов схем: `union([number(), literal('auto')])` → `number | 'auto'`.
:::

::: en
- Schemas are checked in order; the result of the first matching one is returned, with its transforms.
- If none matches, there is a single `union` error without details for each schema. For objects with a tag field (`type`) use [`variant`](~/schemas/variant): it shows the errors of the specific variant.
- An empty value gives `required` unless one of the schemas is [`optional`](~/schemas/optional).
- The result type is a union of the schema types: `union([number(), literal('auto')])` → `number | 'auto'`.
:::

::: zh
- 按顺序检查 Schema，返回第一个匹配的结果（包括它的转换）。
- 如果都不匹配，只产生一个 `union` 错误，不包含每个 Schema 的详细信息。对于带有标识字段（`type`）的对象，请使用 [`variant`](~/schemas/variant)：它会显示具体变体的错误。
- 空值会产生 `required`，除非其中有 [`optional`](~/schemas/optional)。
- 结果类型是各 Schema 类型的联合：`union([number(), literal('auto')])` → `number | 'auto'`。
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `required` | Значение пустое | Required |
| `union` | Не подошла ни одна схема | Does not match any allowed type |
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `required` | The value is empty | Required |
| `union` | No schema matches | Does not match any allowed type |
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `required` | 值为空 | Required |
| `union` | 没有任何 Schema 匹配 | Does not match any allowed type |
:::

## @t(examples)

::: ru
### ID — число или slug
:::

::: en
### ID — a number or a slug
:::

::: zh
### ID —— 数字或 slug
:::

```ts
const id = union([pipe(coerce.number(), integer()), pipe(string(), pattern(/^[a-z0-9-]+$/))]);

validate(id, '42').data;        // 42
validate(id, 'my-post').data;   // 'my-post'
validate(id, 'My Post').errors; // { '': 'Does not match any allowed type' }
```

::: ru
### «auto» или число
:::

::: en
### "auto" or a number
:::

::: zh
### “auto” 或数字
:::

```ts
const width = union([literal('auto'), pipe(number(), min(0))]); // 'auto' | number
```

## @t(see)

::: ru
- [variant](~/schemas/variant) — объекты с полем-признаком, понятные ошибки
- [oneOf](~/schemas/one-of) — одно из конкретных значений
:::

::: en
- [variant](~/schemas/variant) — objects with a tag field, clear errors
- [oneOf](~/schemas/one-of) — one of specific values
:::

::: zh
- [variant](~/schemas/variant)：带标识字段的对象，错误更清晰
- [oneOf](~/schemas/one-of)：特定值之一
:::
