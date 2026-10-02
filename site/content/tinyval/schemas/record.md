::: ru
Объект с произвольными ключами — словарь. Все значения проверяются одной схемой, ключи — по желанию тоже.
:::

::: en
An object with arbitrary keys — a dictionary. All values are validated with one schema, and optionally the keys too.
:::

::: zh
具有任意键的对象 —— 字典。所有值使用同一个 Schema 校验，键也可以选择性地校验。
:::

## @t(signature)

```ts
function record<V>(value: Schema<V>, msg?: Message): Schema<Record<string, V>>
function record<K extends string, V>(key: Schema<K>, value: Schema<V>, msg?: Message): Schema<Record<K, V>>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `key` | `Schema<K>` | Необязательная схема ключей: `pipe(string(), pattern(...))`, `oneOf([...])` |
| `value` | `Schema<V>` | Схема значений |
| `msg` | `Message` | Своё сообщение, если значение пустое или не объект |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `key` | `Schema<K>` | Optional key schema: `pipe(string(), pattern(...))`, `oneOf([...])` |
| `value` | `Schema<V>` | Value schema |
| `msg` | `Message` | Custom message if the value is empty or not an object |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `key` | `Schema<K>` | 可选的键 Schema：`pipe(string(), pattern(...))`、`oneOf([...])` |
| `value` | `Schema<V>` | 值的 Schema |
| `msg` | `Message` | 值为空或不是对象时的自定义信息 |
:::

## @t(notes)

::: ru
- Ошибки ключа и значения привязаны к пути этого ключа: `errors.ab`.
- Если схема ключа преобразует его (например, `toLowerCase`), в `data` попадёт преобразованный ключ.
- Читаются только собственные ключи объекта. Ключ `__proto__` из JSON безопасен — он не меняет прототип результата.
:::

::: en
- Key and value errors are attached to that key's path: `errors.ab`.
- If the key schema transforms the key (e.g. `toLowerCase`), `data` gets the transformed key.
- Only own keys are read. A `__proto__` key from JSON is safe — it doesn't change the result's prototype.
:::

::: zh
- 键和值的错误关联到该键的路径：`errors.ab`。
- 如果键的 Schema 会转换键（例如 `toLowerCase`），`data` 中使用转换后的键。
- 只读取对象自身的键。来自 JSON 的 `__proto__` 键是安全的 —— 它不会改变结果的原型。
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `required` | Значение пустое | Required |
| `object` | Не объект (или массив) | Must be an object |
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `required` | The value is empty | Required |
| `object` | Not an object (or an array) | Must be an object |
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `required` | 值为空 | Required |
| `object` | 不是对象（或是数组） | Must be an object |
:::

## @t(examples)

::: ru
### Переводы
:::

::: en
### Translations
:::

::: zh
### 翻译
:::

```ts
const title = record(oneOf(['ru', 'en', 'zh']), pipe(string(), maxLength(200)));
// Record<'ru' | 'en' | 'zh', string>

validate(title, { ru: 'Привет', en: 'Hello' }).valid; // true
validate(title, { de: 'Hallo' }).errors;              // { de: 'Must be one of: ru, en, zh' }
```

::: ru
### Количество товаров по ID
:::

::: en
### Quantities by product ID
:::

::: zh
### 按商品 ID 的数量
:::

```ts
const cart = record(pipe(string(), pattern(/^\d+$/)), pipe(number(), integer(), min(1)));

validate(cart, { '15': 2, '42': 1 }).data; // { '15': 2, '42': 1 }
```

## @t(see)

::: ru
- [object](~/schemas/object) — объект с известными полями
- [oneOf](~/schemas/one-of) — ограничить ключи
:::

::: en
- [object](~/schemas/object) — an object with known fields
- [oneOf](~/schemas/one-of) — restrict the keys
:::

::: zh
- [object](~/schemas/object)：字段已知的对象
- [oneOf](~/schemas/one-of)：限制键
:::
