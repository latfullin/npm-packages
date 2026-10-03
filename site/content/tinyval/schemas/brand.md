::: ru
Тип с «меткой». Строки `UserId` и `OrderId` выглядят одинаково, но TypeScript не даст передать одно вместо другого.
:::

::: en
A type with a "tag". `UserId` and `OrderId` strings look the same, but TypeScript won't let you pass one instead of the other.
:::

::: zh
带“标签”的类型。`UserId` 和 `OrderId` 字符串看起来一样，但 TypeScript 不允许把其中一个传给另一个。
:::

## @t(signature)

```ts
function brand<T, B extends string>(schema: Schema<T>, name: B): Schema<T & Brand<B>>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `schema` | `Schema<T>` | Схема значения, когда оно передано |
| `name` | `string` | Имя метки |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `schema` | `Schema<T>` | The value schema when it is provided |
| `name` | `string` | Tag name |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `schema` | `Schema<T>` | 值存在时使用的 Schema |
| `name` | `string` | 标签名称 |
:::

## @t(notes)

::: ru
Метка есть только в типах — во время работы значение не меняется. Получить значение с меткой можно только через проверку схемой: это гарантирует, что каждый `UserId` в коде когда-то прошёл проверку.
:::

::: en
The tag exists only in types — at runtime the value is unchanged. A tagged value can only be obtained through schema validation: every `UserId` in the code has passed validation at some point.
:::

::: zh
标签只存在于类型中 —— 运行时值不变。只能通过 Schema 校验获得带标签的值：这保证了代码中的每个 `UserId` 都经过了校验。
:::

## @t(example)

```ts
const UserId = brand(pipe(string(), uuid()), 'UserId');
const OrderId = brand(pipe(string(), uuid()), 'OrderId');
type UserId = Infer<typeof UserId>;
type OrderId = Infer<typeof OrderId>;

function getUser(id: UserId) { /* … */ }

const orderId = parse(OrderId, req.params.id);
getUser(orderId);                 // TypeScript error
getUser('550e8400-…');            // TypeScript error too
getUser(parse(UserId, req.params.id)); // ok
```

## @t(see)

::: ru
- [uuid](~/actions/uuid)
- [TypeScript](~/guide/typescript)
:::

::: en
- [uuid](~/actions/uuid)
- [TypeScript](~/guide/typescript)
:::

::: zh
- [uuid](~/actions/uuid)
- [TypeScript](~/guide/typescript)
:::
