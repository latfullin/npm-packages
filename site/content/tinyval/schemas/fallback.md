::: ru
Значение, которое подставляется вместо ошибки. Удобно для query-параметров и настроек: `?page=abc` даёт `page: 1`, а не ответ 422.
:::

::: en
A value used instead of an error. Handy for query parameters and settings: `?page=abc` gives `page: 1` instead of a 422 response.
:::

::: zh
出错时使用的替代值。适用于 query 参数和设置：`?page=abc` 得到 `page: 1`，而不是 422 响应。
:::

## @t(signature)

```ts
function fallback<T>(schema: Schema<T>, value: T | ((input: unknown) => T)): Schema<T>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `schema` | `Schema<T>` | Схема значения |
| `value` | `T \| (input) => T` | Значение при ошибке или функция, которая получает исходное значение и возвращает замену |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `schema` | `Schema<T>` | The value schema |
| `value` | `T \| (input) => T` | The value on error, or a function that receives the raw input and returns a replacement |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `schema` | `Schema<T>` | 值的 Schema |
| `value` | `T \| (input) => T` | 出错时的值，或接收原始输入并返回替代值的函数 |
:::

## @t(notes)

::: ru
- Срабатывает на **любую** ошибку схемы, включая пустое значение — поэтому отдельный [`optional`](~/schemas/optional) не нужен.
- Ошибки асинхронных проверок ([`checkAsync`](~/actions/check-async)) не скрываются: к моменту их результата значение уже выбрано.
- Не используйте для данных, где ошибка важна (формы, создание записей) — пользователь не узнает, что ввёл что-то не так.
:::

::: en
- Works for **any** schema error, including an empty value — so a separate [`optional`](~/schemas/optional) is not needed.
- Errors of async checks ([`checkAsync`](~/actions/check-async)) are not hidden: by the time they resolve, the value is already chosen.
- Don't use it for data where errors matter (forms, creating records) — the user won't know they entered something wrong.
:::

::: zh
- 对 Schema 的**任何**错误生效，包括空值 —— 因此不需要另外使用 [`optional`](~/schemas/optional)。
- 不会隐藏异步检查（[`checkAsync`](~/actions/check-async)）的错误：在它们返回结果时，值已经确定。
- 不要用于错误很重要的数据（表单、创建记录）—— 用户将无法得知输入有误。
:::

## @t(example)

```ts
// GET /products?page=abc&limit=1000&sort=price
const Query = object({
  page: fallback(pipe(coerce.number(), integer(), min(1)), 1),
  limit: fallback(pipe(coerce.number(), integer(), min(1), max(100)), 20),
  sort: fallback(oneOf(['date', 'price', 'name']), 'date'),
});

parse(Query, req.query); // { page: 1, limit: 20, sort: 'price' }
```

## @t(see)

::: ru
- [optional](~/schemas/optional) — значение по умолчанию только для пустого значения
- [coerce](~/schemas/coerce)
:::

::: en
- [optional](~/schemas/optional) — a default only for an empty value
- [coerce](~/schemas/coerce)
:::

::: zh
- [optional](~/schemas/optional)：仅在值为空时使用默认值
- [coerce](~/schemas/coerce)
:::
