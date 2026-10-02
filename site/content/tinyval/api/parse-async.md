::: ru
Асинхронная версия [`parse`](~/api/parse): возвращает данные или отклоняется с [`ValidationError`](~/api/validation-error). Нужна, если в схеме есть [`checkAsync`](~/actions/check-async).
:::

::: en
The async version of [`parse`](~/api/parse): returns the data or rejects with [`ValidationError`](~/api/validation-error). Required if the schema contains [`checkAsync`](~/actions/check-async).
:::

::: zh
[`parse`](~/api/parse) 的异步版本：返回数据，或以 [`ValidationError`](~/api/validation-error) 拒绝。当 Schema 中包含 [`checkAsync`](~/actions/check-async) 时需要使用。
:::

## @t(signature)

```ts
function parseAsync<S extends Schema>(schema: S, value: unknown, options?: Options): Promise<Infer<S>>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `schema` | `Schema` | Схема, по которой проверяются данные |
| `value` | `unknown` | Любые данные |
| `options` | `Options` | `{ all?: boolean }` — как в [validate](~/api/validate) |

## Возвращает

`Promise` с очищенными данными. Порядок выполнения проверок — как у [`validateAsync`](~/api/validate-async).
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `schema` | `Schema` | The schema to validate against |
| `value` | `unknown` | Any data |
| `options` | `Options` | `{ all?: boolean }` — as in [validate](~/api/validate) |

## Returns

A `Promise` with the cleaned data. Checks run in the same order as in [`validateAsync`](~/api/validate-async).
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `schema` | `Schema` | 用于校验数据的 Schema |
| `value` | `unknown` | 任意数据 |
| `options` | `Options` | `{ all?: boolean }` —— 与 [validate](~/api/validate) 相同 |

## 返回值

包含清洗后数据的 `Promise`。检查的执行顺序与 [`validateAsync`](~/api/validate-async) 相同。
:::

## @t(example)

::: ru
### Обработчик с проверкой в базе

```ts
app.post('/signup', async (req, res, next) => {
  try {
    const data = await parseAsync(Signup, req.body);
    await db.users.create(data);
    res.status(201).end();
  } catch (e) {
    next(e); // ValidationError обработает общий обработчик ошибок
  }
});
```
:::

::: en
### Handler with a database check

```ts
app.post('/signup', async (req, res, next) => {
  try {
    const data = await parseAsync(Signup, req.body);
    await db.users.create(data);
    res.status(201).end();
  } catch (e) {
    next(e); // ValidationError is handled by the error handler
  }
});
```
:::

::: zh
### 带数据库检查的处理函数

```ts
app.post('/signup', async (req, res, next) => {
  try {
    const data = await parseAsync(Signup, req.body);
    await db.users.create(data);
    res.status(201).end();
  } catch (e) {
    next(e); // ValidationError 由统一的错误处理函数处理
  }
});
```
:::

## @t(see)

::: ru
- [parse](~/api/parse)
- [ValidationError](~/api/validation-error) — общий обработчик ошибок
- [validateAsync](~/api/validate-async)
:::

::: en
- [parse](~/api/parse)
- [ValidationError](~/api/validation-error) — a shared error handler
- [validateAsync](~/api/validate-async)
:::

::: zh
- [parse](~/api/parse)
- [ValidationError](~/api/validation-error)：统一的错误处理
- [validateAsync](~/api/validate-async)
:::
