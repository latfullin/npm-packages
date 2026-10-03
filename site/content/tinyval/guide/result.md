::: ru
Что возвращают [`validate`](~/api/validate), [`parse`](~/api/parse) и остальные функции: из чего состоит результат, что происходит с данными и как устроены ошибки. Все примеры ниже — настоящий вывод tinyval.
:::

::: en
What [`validate`](~/api/validate), [`parse`](~/api/parse) and the other functions return: what the result consists of, what happens to the data and how errors are structured. Every example below is real tinyval output.
:::

::: zh
[`validate`](~/api/validate)、[`parse`](~/api/parse) 等函数返回什么：结果由哪些部分组成、数据会发生什么变化、错误的结构如何。以下所有示例都是 tinyval 的真实输出。
:::

::: ru
## Из чего состоит результат

`validate` и `validateAsync` возвращают объект из четырёх полей:

| Поле | Если данные верны | Если есть ошибки |
| --- | --- | --- |
| `valid` | `true` | `false` |
| `data` | Очищенные данные | `undefined` |
| `errors` | `{}` | Первая ошибка каждого поля: `{ 'items.0.qty': '...' }` |
| `issues` | `[]` | Все ошибки подробно: код, путь, параметры, текст |

`parse` и `parseAsync` возвращают сразу `data` или бросают [`ValidationError`](~/api/validation-error).
:::

::: en
## What the result consists of

`validate` and `validateAsync` return an object with four fields:

| Field | When data is valid | When there are errors |
| --- | --- | --- |
| `valid` | `true` | `false` |
| `data` | Cleaned data | `undefined` |
| `errors` | `{}` | The first error of each field: `{ 'items.0.qty': '...' }` |
| `issues` | `[]` | All errors in detail: code, path, params, text |

`parse` and `parseAsync` return `data` directly or throw [`ValidationError`](~/api/validation-error).
:::

::: zh
## 结果由什么组成

`validate` 和 `validateAsync` 返回一个包含四个字段的对象：

| 字段 | 数据有效时 | 存在错误时 |
| --- | --- | --- |
| `valid` | `true` | `false` |
| `data` | 清洗后的数据 | `undefined` |
| `errors` | `{}` | 每个字段的第一个错误：`{ 'items.0.qty': '...' }` |
| `issues` | `[]` | 全部错误的详细信息：代码、路径、参数、文本 |

`parse` 和 `parseAsync` 直接返回 `data`，或抛出 [`ValidationError`](~/api/validation-error)。
:::

::: ru
## Данные проверены — что в data

`data` — это **не** входные данные, а то, что получилось после схемы. Пример:
:::

::: en
## Data is valid — what's in data

`data` is **not** the input — it's what the schema produced. Example:
:::

::: zh
## 数据有效 —— data 中有什么

`data` **不是**输入数据，而是经过 Schema 处理后的结果。示例：
:::

```ts
const Order = object({
  name: pipe(string(), trim(), minLength(2)),
  email: pipe(string(), trim(), toLowerCase(), email()),
  age: optional(pipe(coerce.number(), min(18))),
  comment: optional(string()),
  middleName: optional(nullable(string())),
  newsletter: optional(coerce.boolean(), false),
  items: array(object({ title: string(), qty: pipe(coerce.number(), min(1)) })),
});

validate(Order, {
  name: '  Ivan ',
  email: ' IVAN@Mail.RU ',
  age: '30',
  comment: '',
  middleName: null,
  items: [{ title: 'Book', qty: '2' }],
  isAdmin: true,
});
```

```json
{
  "valid": true,
  "data": {
    "name": "Ivan",
    "email": "ivan@mail.ru",
    "age": 30,
    "middleName": null,
    "newsletter": false,
    "items": [{ "title": "Book", "qty": 2 }]
  },
  "errors": {},
  "issues": []
}
```

::: ru
| Поле | На входе | В `data` | Почему |
| --- | --- | --- | --- |
| `name` | `'  Ivan '` | `'Ivan'` | [`trim`](~/actions/trim) |
| `email` | `' IVAN@Mail.RU '` | `'ivan@mail.ru'` | [`trim`](~/actions/trim) + [`toLowerCase`](~/actions/to-lower-case) |
| `age` | `'30'` | `30` | [`coerce.number`](~/schemas/coerce) — строка стала числом |
| `comment` | `''` | нет поля | Пустая строка в [`optional`](~/schemas/optional) — «не передано», поле не попадает в `data` |
| `middleName` | `null` | `null` | [`nullable`](~/schemas/nullable) сохраняет `null` |
| `newsletter` | нет | `false` | Значение по умолчанию из `optional(…, false)` |
| `items[0].qty` | `'2'` | `2` | `coerce.number` внутри массива |
| `isAdmin` | `true` | нет поля | Лишнее поле удалено ([`object`](~/schemas/object) в режиме `strip`) |

Итого `data` можно сразу сохранять в базу: типы приведены, лишнего нет, тип TypeScript выведен из схемы.
:::

::: en
| Field | Input | In `data` | Why |
| --- | --- | --- | --- |
| `name` | `'  Ivan '` | `'Ivan'` | [`trim`](~/actions/trim) |
| `email` | `' IVAN@Mail.RU '` | `'ivan@mail.ru'` | [`trim`](~/actions/trim) + [`toLowerCase`](~/actions/to-lower-case) |
| `age` | `'30'` | `30` | [`coerce.number`](~/schemas/coerce) — the string became a number |
| `comment` | `''` | no field | An empty string in [`optional`](~/schemas/optional) means "not provided", the field isn't added to `data` |
| `middleName` | `null` | `null` | [`nullable`](~/schemas/nullable) keeps `null` |
| `newsletter` | missing | `false` | The default from `optional(…, false)` |
| `items[0].qty` | `'2'` | `2` | `coerce.number` inside the array |
| `isAdmin` | `true` | no field | The unknown key is removed ([`object`](~/schemas/object) in `strip` mode) |

So `data` can go straight to the database: types are converted, nothing extra, and its TypeScript type is inferred from the schema.
:::

::: zh
| 字段 | 输入 | `data` 中 | 原因 |
| --- | --- | --- | --- |
| `name` | `'  Ivan '` | `'Ivan'` | [`trim`](~/actions/trim) |
| `email` | `' IVAN@Mail.RU '` | `'ivan@mail.ru'` | [`trim`](~/actions/trim) + [`toLowerCase`](~/actions/to-lower-case) |
| `age` | `'30'` | `30` | [`coerce.number`](~/schemas/coerce) —— 字符串变成了数字 |
| `comment` | `''` | 无此字段 | [`optional`](~/schemas/optional) 中的空字符串表示“未提供”，字段不会出现在 `data` 中 |
| `middleName` | `null` | `null` | [`nullable`](~/schemas/nullable) 保留 `null` |
| `newsletter` | 缺失 | `false` | 来自 `optional(…, false)` 的默认值 |
| `items[0].qty` | `'2'` | `2` | 数组中的 `coerce.number` |
| `isAdmin` | `true` | 无此字段 | 多余字段被删除（[`object`](~/schemas/object) 的 `strip` 模式） |

因此 `data` 可以直接存入数据库：类型已转换，没有多余字段，TypeScript 类型由 Schema 推导。
:::

::: ru
## Есть ошибки — errors и issues
:::

::: en
## There are errors — errors and issues
:::

::: zh
## 存在错误 —— errors 和 issues
:::

```ts
validate(Order, { name: 'I', email: 'bad', age: '15', items: [{ title: 'Book', qty: '0' }, { qty: '1' }] });
```

```js
{
  "valid": false,
  "data": undefined,
  "errors": {
    "name": "Must be at least 2 characters long",
    "email": "Invalid email",
    "age": "Must be at least 18",
    "items.0.qty": "Must be at least 1",
    "items.1.title": "Required"
  },
  "issues": [
    { "code": "minLength", "path": ["name"], "params": { "min": 2 }, "message": "Must be at least 2 characters long" },
    { "code": "email", "path": ["email"], "params": {}, "message": "Invalid email" },
    { "code": "min", "path": ["age"], "params": { "min": 18 }, "message": "Must be at least 18" },
    { "code": "min", "path": ["items", 0, "qty"], "params": { "min": 1 }, "message": "Must be at least 1" },
    { "code": "required", "path": ["items", 1, "title"], "params": {}, "message": "Required" }
  ]
}
```

::: ru
### errors

Объект «путь → текст первой ошибки». Удобен, чтобы показать ошибку рядом с полем: `errors.email`, `errors['items.0.qty']`.

- Путь склеен через точку, индексы массивов — числа: `items.1.title`.
- Ошибка самого значения (схема не объект) — под ключом `''`: `validate(string(), 42).errors` → `{ '': 'Must be a string' }`.
- На каждое поле — одна ошибка, первая по порядку правил в [`pipe`](~/actions/pipe).

### issues

Массив всех ошибок в порядке полей схемы. У каждой:

| Поле | Пример | Зачем |
| --- | --- | --- |
| `code` | `'minLength'` | Код ошибки — для своей логики и перевода. Все коды — в [Сообщениях](~/guide/messages#все-коды-ошибок) |
| `path` | `['items', 0, 'qty']` | Путь массивом: индексы — числа, удобно для вложенных форм |
| `params` | `{ min: 1 }` | Параметры правила — чтобы собрать свой текст на клиенте |
| `message` | `'Must be at least 1'` | Готовый текст с учётом языка, [`label`](~/schemas/label) и своих сообщений |

### Все ошибки поля и формат Laravel

По умолчанию у поля одна ошибка. С опцией `{ all: true }` в `issues` попадают все, а [`flatten`](~/api/flatten) собирает их по полям:
:::

::: en
### errors

An object "path → first error text". Handy to show an error next to its field: `errors.email`, `errors['items.0.qty']`.

- The path is joined with dots, array indexes are numbers: `items.1.title`.
- An error of the value itself (the schema isn't an object) is under the `''` key: `validate(string(), 42).errors` → `{ '': 'Must be a string' }`.
- One error per field — the first one in the order of rules in [`pipe`](~/actions/pipe).

### issues

An array of all errors in the order of schema fields. Each has:

| Field | Example | Why |
| --- | --- | --- |
| `code` | `'minLength'` | The error code — for your own logic and translation. All codes are in [Messages](~/guide/messages#all-error-codes) |
| `path` | `['items', 0, 'qty']` | The path as an array: indexes are numbers, handy for nested forms |
| `params` | `{ min: 1 }` | Rule parameters — to build your own text on the client |
| `message` | `'Must be at least 1'` | Ready text, with language, [`label`](~/schemas/label) and custom messages applied |

### All errors of a field and the Laravel format

By default a field has one error. With the `{ all: true }` option `issues` gets all of them, and [`flatten`](~/api/flatten) groups them by field:
:::

::: zh
### errors

“路径 → 第一个错误文本”的对象。便于在字段旁显示错误：`errors.email`、`errors['items.0.qty']`。

- 路径用点连接，数组索引为数字：`items.1.title`。
- 值本身的错误（Schema 不是对象时）在键 `''` 下：`validate(string(), 42).errors` → `{ '': 'Must be a string' }`。
- 每个字段一个错误 —— 按 [`pipe`](~/actions/pipe) 中规则顺序的第一个。

### issues

按 Schema 字段顺序排列的全部错误数组。每个错误包含：

| 字段 | 示例 | 用途 |
| --- | --- | --- |
| `code` | `'minLength'` | 错误代码 —— 用于自定义逻辑和翻译。全部代码见 [错误信息](~/guide/messages#全部错误代码) |
| `path` | `['items', 0, 'qty']` | 数组形式的路径：索引为数字，便于嵌套表单 |
| `params` | `{ min: 1 }` | 规则参数 —— 用于在客户端生成自定义文本 |
| `message` | `'Must be at least 1'` | 已生成的文本，已应用语言、[`label`](~/schemas/label) 和自定义信息 |

### 字段的全部错误与 Laravel 格式

默认每个字段一个错误。使用 `{ all: true }` 选项时，`issues` 包含全部错误，[`flatten`](~/api/flatten) 会按字段分组：
:::

```ts
const r = validate(object({ password: pipe(string(), minLength(8), email()) }), { password: 'abc' }, { all: true });

r.errors;           // { password: 'Must be at least 8 characters long' }
flatten(r.issues);  // { password: ['Must be at least 8 characters long', 'Invalid email'] }
```

::: ru
## parse и ValidationError

`parse` при ошибке бросает [`ValidationError`](~/api/validation-error) — в нём те же `errors` и `issues`, а `message` собран в одну строку для логов:
:::

::: en
## parse and ValidationError

On error `parse` throws [`ValidationError`](~/api/validation-error) — it has the same `errors` and `issues`, and `message` is joined into one line for logs:
:::

::: zh
## parse 与 ValidationError

出错时 `parse` 会抛出 [`ValidationError`](~/api/validation-error) —— 其中包含相同的 `errors` 和 `issues`，`message` 合并为一行，便于记录日志：
:::

```ts
try {
  parse(Order, { name: 'I' });
} catch (e) {
  e instanceof ValidationError; // true
  e.message; // 'name: Must be at least 2 characters long; email: Required; items: Required'
  e.errors;  // { name: 'Must be at least 2 characters long', email: 'Required', items: 'Required' }
  e.issues;  // [{ code, path, params, message }, …]
}
```

::: ru
## Standard Schema

Через `schema['~standard'].validate` результат в формате [стандарта](~/guide/standard-schema) — `{ value }` или `{ issues }` только с `message` и `path`:
:::

::: en
## Standard Schema

Through `schema['~standard'].validate` the result follows the [standard](~/guide/standard-schema) — `{ value }` or `{ issues }` with only `message` and `path`:
:::

::: zh
## Standard Schema

通过 `schema['~standard'].validate` 得到的是[标准](~/guide/standard-schema)格式的结果 —— `{ value }` 或仅包含 `message` 和 `path` 的 `{ issues }`：
:::

```json
{
  "issues": [
    { "message": "Must be at least 2 characters long", "path": ["name"] },
    { "message": "Required", "path": ["email"] },
    { "message": "Required", "path": ["items"] }
  ]
}
```

::: ru
## Тип результата в TypeScript

`Result<T>` — объединение: после проверки `valid` TypeScript знает, есть ли `data`. Подробнее — [TypeScript](~/guide/typescript).
:::

::: en
## Result type in TypeScript

`Result<T>` is a union: after checking `valid`, TypeScript knows whether `data` exists. More in [TypeScript](~/guide/typescript).
:::

::: zh
## TypeScript 中的结果类型

`Result<T>` 是联合类型：检查 `valid` 之后，TypeScript 就知道 `data` 是否存在。详见 [TypeScript](~/guide/typescript)。
:::

```ts
const r = validate(Order, input);
if (r.valid) r.data.items[0].qty; // number
else r.errors;                    // Record<string, string>
```

## @t(see)

::: ru
- [validate](~/api/validate), [parse](~/api/parse), [flatten](~/api/flatten)
- [Пустые значения](~/guide/empty-values) — почему `''` не попадает в `data`
- [Сообщения и локализация](~/guide/messages) — тексты в `message`
:::

::: en
- [validate](~/api/validate), [parse](~/api/parse), [flatten](~/api/flatten)
- [Empty values](~/guide/empty-values) — why `''` doesn't get into `data`
- [Messages & i18n](~/guide/messages) — the texts in `message`
:::

::: zh
- [validate](~/api/validate)、[parse](~/api/parse)、[flatten](~/api/flatten)
- [空值](~/guide/empty-values)：为什么 `''` 不会进入 `data`
- [错误信息与国际化](~/guide/messages)：`message` 中的文本
:::
