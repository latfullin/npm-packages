::: ru
Исключение, которое бросают [`parse`](~/api/parse) и [`parseAsync`](~/api/parse-async), если данные невалидны. Наследуется от `Error`.
:::

::: en
The exception thrown by [`parse`](~/api/parse) and [`parseAsync`](~/api/parse-async) when data is invalid. Extends `Error`.
:::

::: zh
当数据无效时，[`parse`](~/api/parse) 和 [`parseAsync`](~/api/parse-async) 抛出的异常。继承自 `Error`。
:::

## @t(signature)

```ts
class ValidationError extends Error {
  name: 'ValidationError';
  issues: Issue[];
  errors: Record<string, string>;
  message: string;
}
```

::: ru
## Поля

| Поле | Описание |
| --- | --- |
| `errors` | Первая ошибка каждого поля, ключ — путь через точку. Как у [`validate`](~/api/validate) |
| `issues` | Все ошибки: `{ code, message, path }` |
| `message` | Все ошибки одной строкой: `name: Required; email: Invalid email` — удобно для логов |
| `name` | Всегда `'ValidationError'` |
:::

::: en
## Fields

| Field | Description |
| --- | --- |
| `errors` | The first error of each field, keyed by dot path. As in [`validate`](~/api/validate) |
| `issues` | All errors: `{ code, message, path }` |
| `message` | All errors in one line: `name: Required; email: Invalid email` — handy for logs |
| `name` | Always `'ValidationError'` |
:::

::: zh
## 字段

| 字段 | 说明 |
| --- | --- |
| `errors` | 每个字段的第一个错误，键为点分隔路径。与 [`validate`](~/api/validate) 相同 |
| `issues` | 全部错误：`{ code, message, path }` |
| `message` | 所有错误合并为一行：`name: Required; email: Invalid email` —— 便于记录日志 |
| `name` | 始终为 `'ValidationError'` |
:::

## @t(examples)

::: ru
### Общий обработчик ошибок в Express
:::

::: en
### Express error handler
:::

::: zh
### Express 错误处理函数
:::

```ts
import { ValidationError } from 'tinyval';

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(422).json({ message: 'Validation failed', errors: err.errors });
  }
  next(err);
});
```

::: ru
### Формат ответа как в Laravel
:::

::: en
### Laravel-style response
:::

::: zh
### Laravel 风格的响应
:::

```ts
// { "message": "...", "errors": { "email": ["Invalid email"] } }
const errors = {};
for (const issue of err.issues) (errors[issue.path.join('.')] ??= []).push(issue.message);
```

## @t(see)

- [parse](~/api/parse)
- [parseAsync](~/api/parse-async)
