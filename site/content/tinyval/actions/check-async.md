::: ru
Своя асинхронная проверка: запрос в базу, внешний API. Работает только с [`validateAsync`](~/api/validate-async) и [`parseAsync`](~/api/parse-async).
:::

::: en
A custom async check: a database query, an external API. Works only with [`validateAsync`](~/api/validate-async) and [`parseAsync`](~/api/parse-async).
:::

::: zh
自定义异步检查：数据库查询、外部 API。只能与 [`validateAsync`](~/api/validate-async) 和 [`parseAsync`](~/api/parse-async) 一起使用。
:::

## @t(signature)

```ts
function checkAsync<T>(fn: (value: T, info: Info) => Promise<boolean> | boolean, msg?: Message): Action<T>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `fn` | `(value: T, info: Info) => Promise<boolean> \| boolean` | Проверка. `info` — как у [check](~/actions/check) |
| `msg` | `Message` | Своё сообщение об ошибке. Строка с `{параметрами}` или функция |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `fn` | `(value: T, info: Info) => Promise<boolean> \| boolean` | The check. `info` — as in [check](~/actions/check) |
| `msg` | `Message` | Custom error message. A string with `{params}` or a function |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `fn` | `(value: T, info: Info) => Promise<boolean> \| boolean` | 检查函数。`info` 与 [check](~/actions/check) 相同 |
| `msg` | `Message` | 自定义错误信息。可以是带 `{参数}` 的字符串或函数 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `invalid` | `fn` вернула `false` | Invalid value |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `invalid` | `fn` returned `false` | Invalid value |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `invalid` | `fn` 返回 `false` | Invalid value |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
- Запускается **после** всех синхронных правил поля и только если они прошли — в базу не уйдёт запрос с невалидным email.
- Асинхронные проверки разных полей выполняются параллельно.
- [`validate`](~/api/validate) и [`parse`](~/api/parse) с такой схемой бросят ошибку — нужна асинхронная версия.
- Результат не меняет значение: `checkAsync` только проверяет.
:::

::: en
- Runs **after** all synchronous rules of the field and only if they passed — an invalid email never reaches the database.
- Async checks of different fields run in parallel.
- [`validate`](~/api/validate) and [`parse`](~/api/parse) throw for such a schema — use the async version.
- It doesn't change the value: `checkAsync` only checks.
:::

::: zh
- 在该字段所有同步规则**之后**执行，并且只在它们通过时执行 —— 无效的邮箱不会被发送到数据库。
- 不同字段的异步检查并行执行。
- 对于这样的 Schema，[`validate`](~/api/validate) 和 [`parse`](~/api/parse) 会抛出错误 —— 请使用异步版本。
- 不会修改值：`checkAsync` 只做检查。
:::

## @t(example)

::: ru
### Уникальный email

```ts
const Signup = object({
  email: pipe(
    string(),
    trim(),
    toLowerCase(),
    email(),
    checkAsync(async (v) => !(await db.users.exists({ email: v })), 'Email уже зарегистрирован'),
  ),
});

const result = await validateAsync(Signup, req.body);
```
:::

::: en
### Unique email

```ts
const Signup = object({
  email: pipe(
    string(),
    trim(),
    toLowerCase(),
    email(),
    checkAsync(async (v) => !(await db.users.exists({ email: v })), 'Email is already registered'),
  ),
});

const result = await validateAsync(Signup, req.body);
```
:::

::: zh
### 唯一的邮箱

```ts
const Signup = object({
  email: pipe(
    string(),
    trim(),
    toLowerCase(),
    email(),
    checkAsync(async (v) => !(await db.users.exists({ email: v })), '该邮箱已注册'),
  ),
});

const result = await validateAsync(Signup, req.body);
```
:::

## @t(see)

::: ru
- [validateAsync](~/api/validate-async)
- [parseAsync](~/api/parse-async)
- [check](~/actions/check) — синхронная версия
:::

::: en
- [validateAsync](~/api/validate-async)
- [parseAsync](~/api/parse-async)
- [check](~/actions/check) — sync version
:::

::: zh
- [validateAsync](~/api/validate-async)
- [parseAsync](~/api/parse-async)
- [check](~/actions/check)：同步版本
:::
