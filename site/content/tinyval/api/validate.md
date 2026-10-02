::: ru
Проверяет данные по схеме и возвращает результат: валидны ли они, очищенные данные и ошибки. Никогда не бросает исключение из-за невалидных данных.
:::

::: en
Validates data against a schema and returns the result: whether it is valid, the cleaned data and the errors. Never throws because of invalid data.
:::

::: zh
按 Schema 校验数据并返回结果：是否有效、清洗后的数据和错误。不会因为数据无效而抛出异常。
:::

## @t(signature)

```ts
function validate<S extends Schema>(schema: S, value: unknown, options?: Options): Result<Infer<S>>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `schema` | `Schema` | Схема, по которой проверяются данные |
| `value` | `unknown` | Любые данные: объект из формы, `req.body`, строка… |
| `options` | `Options` | Необязательные опции, см. ниже |

### Опции

| Опция | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `all` | `boolean` | `false` | Собирать все ошибки поля в `issues`, а не останавливаться на первой. В `errors` всё равно попадает первая |

## Возвращает

| Поле | Тип | Описание |
| --- | --- | --- |
| `valid` | `boolean` | `true`, если ошибок нет |
| `data` | `T \| undefined` | Очищенные данные: применены `trim`, `coerce`, значения по умолчанию, лишние поля удалены. При ошибке — `undefined` |
| `errors` | `Record<string, string>` | Первая ошибка каждого поля. Ключ — путь через точку: `name`, `address.city`, `items.0.title`. Ошибка самого значения — под ключом `''` |
| `issues` | `Issue[]` | Все ошибки по порядку: `{ code, message, path }`, где `path` — массив (`['items', 0, 'title']`) |

Если в схеме есть [`checkAsync`](~/actions/check-async), `validate` бросит ошибку — используйте [`validateAsync`](~/api/validate-async).
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `schema` | `Schema` | The schema to validate against |
| `value` | `unknown` | Any data: a form object, `req.body`, a string… |
| `options` | `Options` | Optional settings, see below |

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `all` | `boolean` | `false` | Collect all errors of a field in `issues` instead of stopping at the first one. `errors` still holds the first |

## Returns

| Field | Type | Description |
| --- | --- | --- |
| `valid` | `boolean` | `true` if there are no errors |
| `data` | `T \| undefined` | Cleaned data: `trim`, `coerce` and defaults applied, unknown keys removed. `undefined` on error |
| `errors` | `Record<string, string>` | The first error of each field. The key is a dot path: `name`, `address.city`, `items.0.title`. An error of the value itself is under `''` |
| `issues` | `Issue[]` | All errors in order: `{ code, message, path }`, where `path` is an array (`['items', 0, 'title']`) |

If the schema contains [`checkAsync`](~/actions/check-async), `validate` throws — use [`validateAsync`](~/api/validate-async).
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `schema` | `Schema` | 用于校验数据的 Schema |
| `value` | `unknown` | 任意数据：表单对象、`req.body`、字符串… |
| `options` | `Options` | 可选设置，见下文 |

### 选项

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `all` | `boolean` | `false` | 在 `issues` 中收集字段的全部错误，而不是在第一个错误处停止。`errors` 中仍为第一个错误 |

## 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `valid` | `boolean` | 没有错误时为 `true` |
| `data` | `T \| undefined` | 清洗后的数据：已应用 `trim`、`coerce` 和默认值，多余字段已删除。出错时为 `undefined` |
| `errors` | `Record<string, string>` | 每个字段的第一个错误。键为点分隔路径：`name`、`address.city`、`items.0.title`。值本身的错误在键 `''` 下 |
| `issues` | `Issue[]` | 按顺序排列的全部错误：`{ code, message, path }`，其中 `path` 为数组（`['items', 0, 'title']`） |

如果 Schema 中包含 [`checkAsync`](~/actions/check-async)，`validate` 会抛出错误 —— 请使用 [`validateAsync`](~/api/validate-async)。
:::

## @t(examples)

::: ru
### Форма в браузере
:::

::: en
### A browser form
:::

::: zh
### 浏览器表单
:::

```ts
const Login = object({
  email: pipe(string(), trim(), email()),
  password: pipe(string(), minLength(8)),
});

const result = validate(Login, { email: 'bad', password: '123' });

result.valid;  // false
result.errors; // { email: 'Invalid email', password: 'Must be at least 8 long' }
```

::: ru
### Успешная проверка

```ts
const result = validate(Login, { email: ' Ivan@Mail.ru ', password: '12345678', remember: 'on' });

result.valid; // true
result.data;  // { email: 'Ivan@Mail.ru', password: '12345678' } — пробелы обрезаны, лишнее поле удалено
```

### Все ошибки поля
:::

::: en
### Successful validation

```ts
const result = validate(Login, { email: ' Ivan@Mail.ru ', password: '12345678', remember: 'on' });

result.valid; // true
result.data;  // { email: 'Ivan@Mail.ru', password: '12345678' } — trimmed, unknown key removed
```

### All errors of a field
:::

::: zh
### 校验成功

```ts
const result = validate(Login, { email: ' Li@Mail.cn ', password: '12345678', remember: 'on' });

result.valid; // true
result.data;  // { email: 'Li@Mail.cn', password: '12345678' } —— 已去除空格，多余字段已删除
```

### 字段的全部错误
:::

```ts
const Code = pipe(string(), length(6), pattern(/^\d+$/));

validate(Code, 'abc').issues.length;                // 1
validate(Code, 'abc', { all: true }).issues.length; // 2
```

## @t(see)

::: ru
- [validateAsync](~/api/validate-async) — то же для асинхронных проверок
- [parse](~/api/parse) — возвращает данные или бросает исключение
- [TypeScript](~/guide/typescript) — сужение типа результата
:::

::: en
- [validateAsync](~/api/validate-async) — the same for async checks
- [parse](~/api/parse) — returns data or throws
- [TypeScript](~/guide/typescript) — narrowing the result
:::

::: zh
- [validateAsync](~/api/validate-async)：用于异步检查
- [parse](~/api/parse)：返回数据或抛出异常
- [TypeScript](~/guide/typescript)：收窄结果类型
:::
