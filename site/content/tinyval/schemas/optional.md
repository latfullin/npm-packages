::: ru
Делает значение необязательным. Если значение не передано (`undefined`) или пустая строка (`''`), проверка пропускается, а в результат попадает значение по умолчанию.
:::

::: en
Makes a value optional. If the value is missing (`undefined`) or an empty string (`''`), validation is skipped and the default value is used.
:::

::: zh
使值变为选填。如果值缺失（`undefined`）或为空字符串（`''`），则跳过校验并使用默认值。
:::

## @t(signature)

```ts
function optional<T>(schema: Schema<T>): Schema<T | undefined>
function optional<T>(schema: Schema<T>, default: T | (() => T)): Schema<T>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `schema` | `Schema<T>` | Схема для значения, если оно передано |
| `default` | `T \| (() => T)` | Значение по умолчанию или функция, которая его возвращает |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `schema` | `Schema<T>` | The schema for the value when it is present |
| `default` | `T \| (() => T)` | A default value or a function returning it |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `schema` | `Schema<T>` | 值存在时使用的 Schema |
| `default` | `T \| (() => T)` | 默认值或返回默认值的函数 |
:::

## @t(notes)

::: ru
- `null` **не** считается отсутствием значения — для него есть [`nullable`](~/schemas/nullable). Если допустимо и то, и другое: `optional(nullable(string()))`.
- Без `default` поле в [`object`](~/schemas/object) становится необязательным в типе (`name?: string`) и не попадает в `data`, если его не передали.
- Для массивов и объектов передавайте функцию: `optional(array(string()), () => [])`. Иначе все результаты будут ссылаться на один и тот же массив.
- Оборачивайте `pipe` снаружи: `optional(pipe(string(), email()))`. Наоборот — `pipe(optional(...), email())` — TypeScript не даст, потому что `email` не умеет работать с `undefined`.

## Примеры

### Необязательные поля

```ts
const Profile = object({
  name: string(),
  website: optional(pipe(string(), pattern(/^https?:\/\//))),
  lang: optional(oneOf(['ru', 'en']), 'ru'),
});

validate(Profile, { name: 'Ivan', website: '' }).data; // { name: 'Ivan', lang: 'ru' }
```
:::

::: en
- `null` is **not** a missing value — use [`nullable`](~/schemas/nullable) for it. To allow both: `optional(nullable(string()))`.
- Without `default`, the field in [`object`](~/schemas/object) becomes optional in the type (`name?: string`) and is not added to `data` when missing.
- For arrays and objects pass a function: `optional(array(string()), () => [])`. Otherwise all results share the same array.
- Wrap `pipe` from the outside: `optional(pipe(string(), email()))`. The other way round — `pipe(optional(...), email())` — TypeScript rejects, because `email` can't handle `undefined`.

## Example

### Optional fields

```ts
const Profile = object({
  name: string(),
  website: optional(pipe(string(), pattern(/^https?:\/\//))),
  lang: optional(oneOf(['ru', 'en']), 'en'),
});

validate(Profile, { name: 'Ann', website: '' }).data; // { name: 'Ann', lang: 'en' }
```
:::

::: zh
- `null` **不**被视为缺失 —— 请使用 [`nullable`](~/schemas/nullable)。两者都允许：`optional(nullable(string()))`。
- 没有 `default` 时，[`object`](~/schemas/object) 中的字段在类型上变为可选（`name?: string`），缺失时不会出现在 `data` 中。
- 对于数组和对象请传入函数：`optional(array(string()), () => [])`。否则所有结果会共享同一个数组。
- 在 `pipe` 外层使用：`optional(pipe(string(), email()))`。反过来 —— `pipe(optional(...), email())` —— TypeScript 会报错，因为 `email` 无法处理 `undefined`。

## 示例

### 选填字段

```ts
const Profile = object({
  name: string(),
  website: optional(pipe(string(), pattern(/^https?:\/\//))),
  lang: optional(oneOf(['zh', 'en']), 'zh'),
});

validate(Profile, { name: 'Li', website: '' }).data; // { name: 'Li', lang: 'zh' }
```
:::

## @t(see)

::: ru
- [nullable](~/schemas/nullable)
- [Пустые значения](~/guide/empty-values)
:::

::: en
- [nullable](~/schemas/nullable)
- [Empty values](~/guide/empty-values)
:::

::: zh
- [nullable](~/schemas/nullable)
- [空值](~/guide/empty-values)
:::
