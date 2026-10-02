::: ru
Объект с заданными полями. Проверяет каждое поле своей схемой и собирает ошибки всех полей сразу.
:::

::: en
An object with the given fields. Validates each field with its schema and collects errors of all fields at once.
:::

::: zh
包含指定字段的对象。用各自的 Schema 校验每个字段，并一次性收集所有字段的错误。
:::

## @t(signature)

```ts
function object<S extends Record<string, Schema>>(shape: S, options?: ObjectOptions): Schema<ObjectOut<S>>

interface ObjectOptions {
  unknown?: 'strip' | 'strict' | 'passthrough';
  message?: Message;
}
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `shape` | `Record<string, Schema>` | Поля объекта и их схемы |
| `options.unknown` | `'strip' \| 'strict' \| 'passthrough'` | Что делать с полями, которых нет в `shape`. По умолчанию `strip` |
| `options.message` | `Message` | Своё сообщение, если значение пустое или не объект |

## Лишние поля

| Режим | Что происходит с полями не из `shape` |
| --- | --- |
| `strip` (по умолчанию) | Удаляются из `data`. Защищает от mass assignment: в базу не попадёт `isAdmin: true` из запроса |
| `strict` | Ошибка `unknownKey` на каждом лишнем поле |
| `passthrough` | Остаются в `data` как есть |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `shape` | `Record<string, Schema>` | Object fields and their schemas |
| `options.unknown` | `'strip' \| 'strict' \| 'passthrough'` | What to do with keys not in `shape`. Default: `strip` |
| `options.message` | `Message` | Custom message if the value is empty or not an object |

## Unknown keys

| Mode | What happens to keys not in `shape` |
| --- | --- |
| `strip` (default) | Removed from `data`. Protects from mass assignment: `isAdmin: true` from a request won't reach the database |
| `strict` | An `unknownKey` error for each unknown key |
| `passthrough` | Kept in `data` as is |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `shape` | `Record<string, Schema>` | 对象的字段及其 Schema |
| `options.unknown` | `'strip' \| 'strict' \| 'passthrough'` | 如何处理 `shape` 中没有的字段。默认为 `strip` |
| `options.message` | `Message` | 值为空或不是对象时的自定义信息 |

## 多余字段

| 模式 | 不在 `shape` 中的字段会怎样 |
| --- | --- |
| `strip`（默认） | 从 `data` 中删除。防止批量赋值：请求中的 `isAdmin: true` 不会进入数据库 |
| `strict` | 每个多余字段产生一个 `unknownKey` 错误 |
| `passthrough` | 原样保留在 `data` 中 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `required` | Значение пустое | Required |
| `object` | Не объект (или массив) | Must be an object |
| `unknownKey` | Лишнее поле в режиме `strict` | Unknown field |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `required` | The value is empty | Required |
| `object` | Not an object (or an array) | Must be an object |
| `unknownKey` | An unknown key in `strict` mode | Unknown field |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `required` | 值为空 | Required |
| `object` | 不是对象（或是数组） | Must be an object |
| `unknownKey` | `strict` 模式下的多余字段 | Unknown field |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
- Необязательные поля ([`optional`](~/schemas/optional)) без значения не попадают в `data` вовсе.
- Читаются только собственные поля объекта, не из прототипа. Ключ `__proto__` во входных данных безопасен.
- Ошибки вложенных объектов имеют путь: `address.city`.
:::

::: en
- [`optional`](~/schemas/optional) fields without a value are not added to `data` at all.
- Only own properties are read, never the prototype. A `__proto__` key in the input is safe.
- Errors of nested objects have a path: `address.city`.
:::

::: zh
- 没有值的 [`optional`](~/schemas/optional) 字段根本不会出现在 `data` 中。
- 只读取对象自身的属性，不读取原型。输入中的 `__proto__` 键是安全的。
- 嵌套对象的错误带有路径：`address.city`。
:::

## @t(examples)

::: ru
### Вложенные объекты

```ts
const Order = object({
  customer: object({
    name: string(),
    phone: string(),
  }),
  address: object({
    city: string(),
    street: string(),
  }),
});

validate(Order, { customer: { name: 'Ivan' }, address: {} }).errors;
// { 'customer.phone': 'Required', 'address.city': 'Required', 'address.street': 'Required' }
```

### Строгий API

```ts
const UpdateUser = object({ name: optional(string()) }, { unknown: 'strict' });

validate(UpdateUser, { name: 'Ivan', isAdmin: true }).errors; // { isAdmin: 'Unknown field' }
```
:::

::: en
### Nested objects

```ts
const Order = object({
  customer: object({
    name: string(),
    phone: string(),
  }),
  address: object({
    city: string(),
    street: string(),
  }),
});

validate(Order, { customer: { name: 'Ann' }, address: {} }).errors;
// { 'customer.phone': 'Required', 'address.city': 'Required', 'address.street': 'Required' }
```

### Strict API

```ts
const UpdateUser = object({ name: optional(string()) }, { unknown: 'strict' });

validate(UpdateUser, { name: 'Ann', isAdmin: true }).errors; // { isAdmin: 'Unknown field' }
```
:::

::: zh
### 嵌套对象

```ts
const Order = object({
  customer: object({
    name: string(),
    phone: string(),
  }),
  address: object({
    city: string(),
    street: string(),
  }),
});

validate(Order, { customer: { name: 'Li' }, address: {} }).errors;
// { 'customer.phone': 'Required', 'address.city': 'Required', 'address.street': 'Required' }
```

### 严格的 API

```ts
const UpdateUser = object({ name: optional(string()) }, { unknown: 'strict' });

validate(UpdateUser, { name: 'Li', isAdmin: true }).errors; // { isAdmin: 'Unknown field' }
```
:::

## @t(see)

::: ru
- [array](~/schemas/array)
- [optional](~/schemas/optional) — необязательные поля
- [sameAs](~/actions/same-as) — сравнение полей
- [TypeScript](~/guide/typescript) — тип объекта из схемы
:::

::: en
- [array](~/schemas/array)
- [optional](~/schemas/optional) — optional fields
- [sameAs](~/actions/same-as) — comparing fields
- [TypeScript](~/guide/typescript) — object type from a schema
:::

::: zh
- [array](~/schemas/array)
- [optional](~/schemas/optional)：选填字段
- [sameAs](~/actions/same-as)：比较字段
- [TypeScript](~/guide/typescript)：从 Schema 获取对象类型
:::
