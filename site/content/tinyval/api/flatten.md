::: ru
Собирает **все** сообщения об ошибках по полям — в формате Laravel: `{ email: ['...', '...'] }`. Удобно для ответа API, если фронтенд уже умеет показывать ошибки Laravel.
:::

::: en
Collects **all** error messages by field — in Laravel format: `{ email: ['...', '...'] }`. Handy for API responses when the frontend already shows Laravel errors.
:::

::: zh
按字段收集**全部**错误信息 —— Laravel 格式：`{ email: ['...', '...'] }`。如果前端已经支持显示 Laravel 错误，这在 API 响应中很方便。
:::

## @t(signature)

```ts
function flatten(issues: Issue[]): Record<string, string[]>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `issues` | `Issue[]` | `result.issues` из [`validate`](~/api/validate) или `error.issues` из [`ValidationError`](~/api/validation-error) |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `issues` | `Issue[]` | `result.issues` from [`validate`](~/api/validate) or `error.issues` from [`ValidationError`](~/api/validation-error) |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `issues` | `Issue[]` | 来自 [`validate`](~/api/validate) 的 `result.issues`，或来自 [`ValidationError`](~/api/validation-error) 的 `error.issues` |
:::

## @t(notes)

::: ru
- Ключ — путь через точку, как в `errors`: `address.city`, `items.0.title`. Ошибка самого значения — под ключом `''`.
- По умолчанию на каждое поле приходится одна ошибка. Чтобы получить все, передайте `{ all: true }` в [`validate`](~/api/validate) или [`parse`](~/api/parse).
:::

::: en
- The key is a dot path, as in `errors`: `address.city`, `items.0.title`. An error of the value itself is under `''`.
- By default there is one error per field. To get all of them, pass `{ all: true }` to [`validate`](~/api/validate) or [`parse`](~/api/parse).
:::

::: zh
- 键为点分隔路径，与 `errors` 相同：`address.city`、`items.0.title`。值本身的错误在键 `''` 下。
- 默认每个字段只有一个错误。要获取全部错误，请向 [`validate`](~/api/validate) 或 [`parse`](~/api/parse) 传入 `{ all: true }`。
:::

## @t(example)

```ts
import { parse, flatten, ValidationError } from 'tinyval';

app.post('/users', (req, res) => {
  try {
    const user = parse(CreateUser, req.body, { all: true });
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(422).json({ message: 'The given data was invalid.', errors: flatten(e.issues) });
      // { "errors": { "password": ["Must be at least 8 characters long", "Invalid format"] } }
    }
    throw e;
  }
});
```

## @t(see)

::: ru
- [validate](~/api/validate) — поле `errors` с первой ошибкой каждого поля
- [ValidationError](~/api/validation-error)
:::

::: en
- [validate](~/api/validate) — the `errors` field with the first error of each field
- [ValidationError](~/api/validation-error)
:::

::: zh
- [validate](~/api/validate)：`errors` 字段包含每个字段的第一个错误
- [ValidationError](~/api/validation-error)
:::
