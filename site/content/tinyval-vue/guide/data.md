::: ru
В форме три «версии» данных и два набора ошибок. Здесь — что где лежит и как меняется по ходу заполнения. Все значения ниже — настоящий вывод tinyval-vue.
:::

::: en
A form has three "versions" of the data and two sets of errors. Here is what lives where and how it changes while the form is filled in. Every value below is real tinyval-vue output.
:::

::: zh
表单中有三种“版本”的数据和两组错误。本页说明它们分别是什么，以及在填写过程中如何变化。以下所有值都是 tinyval-vue 的真实输出。
:::

```ts
const Signup = object({
  name: pipe(string(), trim(), minLength(2)),
  email: pipe(string(), email()),
  age: optional(pipe(coerce.number(), min(18))),
});

const form = useForm(Signup, { initial: { name: '', email: '', age: '' } });
```

::: ru
## values, data и changes

| Поле | Что внутри | Пример | Для чего |
| --- | --- | --- | --- |
| `form.values` | То, что ввёл пользователь, как есть | `{ name: ' Ivan ', email: 'ivan@mail.ru', age: '30' }` | `v-model` |
| `form.data` | Проверенные данные после схемы: `trim`, `coerce`, без лишних полей. `undefined`, пока есть ошибки | `{ name: 'Ivan', email: 'ivan@mail.ru', age: 30 }` | Предпросмотр, вычисления |
| данные в `handleSubmit` | То же, что `form.data`, в момент отправки | `{ name: 'Ivan', email: 'ivan@mail.ru', age: 30 }` | Отправка на сервер |
| `form.changes` | Только изменённые поля, **как ввёл пользователь** (из `values`) | `{ email: 'petr@mail.ru' }` | `PATCH` — см. [Редактирование](~/guide/editing) |

Тип `values` берётся из `initial` (в инпутах — строки), тип `data` — из схемы (`age: number`).

## errors и allErrors

| Поле | Что внутри |
| --- | --- |
| `form.allErrors` | Все текущие ошибки схемы и сервера — сразу, даже до того, как пользователь что-то ввёл |
| `form.errors` | Только те, что пора показать: с полей, которые пользователь покинул, после отправки — все. Плюс ошибки сервера |

Формат — как `errors` в tinyval: путь через точку → текст первой ошибки. Подробнее о путях и текстах — [Результат проверки](@/tinyval/guide/result).
:::

::: en
## values, data and changes

| Field | What's inside | Example | Used for |
| --- | --- | --- | --- |
| `form.values` | What the user typed, as is | `{ name: ' Ivan ', email: 'ivan@mail.ru', age: '30' }` | `v-model` |
| `form.data` | Validated data after the schema: `trim`, `coerce`, no unknown keys. `undefined` while there are errors | `{ name: 'Ivan', email: 'ivan@mail.ru', age: 30 }` | Preview, calculations |
| data in `handleSubmit` | The same as `form.data`, at submit time | `{ name: 'Ivan', email: 'ivan@mail.ru', age: 30 }` | Sending to the server |
| `form.changes` | Only the changed fields, **as typed** (from `values`) | `{ email: 'petr@mail.ru' }` | `PATCH` — see [Editing](~/guide/editing) |

The type of `values` comes from `initial` (strings in inputs), the type of `data` from the schema (`age: number`).

## errors and allErrors

| Field | What's inside |
| --- | --- |
| `form.allErrors` | All current schema and server errors — right away, even before the user typed anything |
| `form.errors` | Only those that should be shown: for fields the user has left, all of them after submit. Plus server errors |

The format is the same as `errors` in tinyval: dot path → text of the first error. More about paths and texts in [Validation result](@/tinyval/guide/result).
:::

::: zh
## values、data 和 changes

| 字段 | 内容 | 示例 | 用途 |
| --- | --- | --- | --- |
| `form.values` | 用户输入的原始内容 | `{ name: ' Ivan ', email: 'ivan@mail.ru', age: '30' }` | `v-model` |
| `form.data` | 经过 Schema 校验后的数据：`trim`、`coerce`、无多余字段。存在错误时为 `undefined` | `{ name: 'Ivan', email: 'ivan@mail.ru', age: 30 }` | 预览、计算 |
| `handleSubmit` 中的数据 | 与 `form.data` 相同，取提交时的值 | `{ name: 'Ivan', email: 'ivan@mail.ru', age: 30 }` | 发送到服务端 |
| `form.changes` | 只包含修改过的字段，**保持输入原样**（来自 `values`） | `{ email: 'petr@mail.ru' }` | `PATCH` —— 见 [编辑](~/guide/editing) |

`values` 的类型来自 `initial`（输入框中是字符串），`data` 的类型来自 Schema（`age: number`）。

## errors 和 allErrors

| 字段 | 内容 |
| --- | --- |
| `form.allErrors` | Schema 和服务端的全部当前错误 —— 立即可用，甚至在用户输入之前 |
| `form.errors` | 只包含应显示的错误：用户离开过的字段，提交后则全部显示。另外还包括服务端错误 |

格式与 tinyval 的 `errors` 相同：点分隔路径 → 第一个错误的文本。路径和文本的详细说明见 [校验结果](@/tinyval/guide/result)。
:::

::: ru
## Как меняется состояние

Пользователь заполняет форму регистрации:

| Шаг | `errors` | `allErrors` | `valid` | `dirty` | `submitted` | `submitCount` | `submitSucceeded` | `data` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1. Форма открыта | `{}` | `name`, `email`: Required | `false` | `false` | `false` | `0` | `false` | `undefined` |
| 2. Ввёл в имя `' I'` | `{}` | `name`: Must be at least 2 long, `email`: Required | `false` | `true` | `false` | `0` | `false` | `undefined` |
| 3. Ушёл с поля имени | `name`: Must be at least 2 long | как на шаге 2 | `false` | `true` | `false` | `0` | `false` | `undefined` |
| 4. Нажал «Отправить» | `name`, `email` — все ошибки видны | как на шаге 2 | `false` | `true` | `true` | `1` | `false` | `undefined` |
| 5. Исправил, сервер ответил 422 | `email`: The email has already been taken. | то же | `false` | `true` | `true` | `2` | `false` | `{ name: 'Ivan', … }` |
| 6. Сменил email, отправил | `{}` | `{}` | `true` | `false` | `true` | `3` | `true` | `{ name: 'Ivan', email: 'petr@mail.ru', age: 30 }` |

Что видно из таблицы:

- **Ошибки считаются сразу** (`allErrors` на шаге 1), а **показываются**, когда пользователь ушёл с поля или нажал «Отправить».
- **Ошибка сервера** попадает в `errors` и делает `valid` ложным, но `data` остаётся — данные-то прошли проверку схемы. Ошибка исчезнет, когда пользователь изменит это поле.
- **После успешной отправки** `dirty` снова `false`, а `changes` пустой: текущие значения считаются сохранёнными.
:::

::: en
## How the state changes

A user fills in a sign-up form:

| Step | `errors` | `allErrors` | `valid` | `dirty` | `submitted` | `submitCount` | `submitSucceeded` | `data` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1. Form opened | `{}` | `name`, `email`: Required | `false` | `false` | `false` | `0` | `false` | `undefined` |
| 2. Typed `' I'` into name | `{}` | `name`: Must be at least 2 long, `email`: Required | `false` | `true` | `false` | `0` | `false` | `undefined` |
| 3. Left the name field | `name`: Must be at least 2 long | as in step 2 | `false` | `true` | `false` | `0` | `false` | `undefined` |
| 4. Clicked "Submit" | `name`, `email` — all errors visible | as in step 2 | `false` | `true` | `true` | `1` | `false` | `undefined` |
| 5. Fixed it, the server answered 422 | `email`: The email has already been taken. | same | `false` | `true` | `true` | `2` | `false` | `{ name: 'Ivan', … }` |
| 6. Changed the email, submitted | `{}` | `{}` | `true` | `false` | `true` | `3` | `true` | `{ name: 'Ivan', email: 'petr@mail.ru', age: 30 }` |

What the table shows:

- **Errors are computed right away** (`allErrors` in step 1) but **shown** when the user leaves a field or clicks "Submit".
- **A server error** goes into `errors` and makes `valid` false, but `data` stays — the data did pass the schema. The error disappears when the user changes that field.
- **After a successful submit** `dirty` is `false` again and `changes` is empty: the current values count as saved.
:::

::: zh
## 状态如何变化

用户填写注册表单：

| 步骤 | `errors` | `allErrors` | `valid` | `dirty` | `submitted` | `submitCount` | `submitSucceeded` | `data` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1. 打开表单 | `{}` | `name`、`email`：Required | `false` | `false` | `false` | `0` | `false` | `undefined` |
| 2. 在姓名中输入 `' I'` | `{}` | `name`：Must be at least 2 long，`email`：Required | `false` | `true` | `false` | `0` | `false` | `undefined` |
| 3. 离开姓名字段 | `name`：Must be at least 2 long | 同步骤 2 | `false` | `true` | `false` | `0` | `false` | `undefined` |
| 4. 点击“提交” | `name`、`email` —— 全部错误可见 | 同步骤 2 | `false` | `true` | `true` | `1` | `false` | `undefined` |
| 5. 修正后服务端返回 422 | `email`：The email has already been taken. | 相同 | `false` | `true` | `true` | `2` | `false` | `{ name: 'Ivan', … }` |
| 6. 修改邮箱后提交 | `{}` | `{}` | `true` | `false` | `true` | `3` | `true` | `{ name: 'Ivan', email: 'petr@mail.ru', age: 30 }` |

从表中可以看出：

- **错误会立即计算**（步骤 1 的 `allErrors`），但只在用户离开字段或点击“提交”时**显示**。
- **服务端错误**会进入 `errors` 并使 `valid` 为 false，但 `data` 仍然存在 —— 数据已通过 Schema 校验。用户修改该字段后错误会消失。
- **成功提交后** `dirty` 重新变为 `false`，`changes` 为空：当前值被视为已保存。
:::

::: ru
## Что приходит в handleSubmit

Только если форма прошла проверку, и только проверенные данные — после `trim` и `coerce`:
:::

::: en
## What handleSubmit receives

Only if the form is valid, and only the validated data — after `trim` and `coerce`:
:::

::: zh
## handleSubmit 收到什么

只有在表单校验通过时才会调用，且只包含校验后的数据 —— 已经过 `trim` 和 `coerce`：
:::

```ts
// form.values: { name: ' Ivan ', email: 'petr@mail.ru', age: '30' }
const submit = form.handleSubmit((data) => {
  data; // { name: 'Ivan', email: 'petr@mail.ru', age: 30 }
});
```

::: ru
Ошибки в `onInvalid` — видимые ошибки (`form.errors`) на момент отправки, то есть все.

## Остальные поля

| Поле | Значение |
| --- | --- |
| `touched` | Поля, с которых уходили: `{ name: true }`. Путь как в `errors` |
| `validating` | `true`, пока идёт асинхронная проверка |
| `submitting` | `true`, пока выполняется обработчик `handleSubmit` |
| `id` | Основа для `id` полей |

Полный список — [useForm](~/api/use-form).
:::

::: en
The errors passed to `onInvalid` are the visible errors (`form.errors`) at submit time, i.e. all of them.

## Other fields

| Field | Value |
| --- | --- |
| `touched` | Fields the user has left: `{ name: true }`. Paths as in `errors` |
| `validating` | `true` while an async check is running |
| `submitting` | `true` while the `handleSubmit` handler is running |
| `id` | Base for field `id`s |

Full list — [useForm](~/api/use-form).
:::

::: zh
传给 `onInvalid` 的错误是提交时的可见错误（`form.errors`），也就是全部错误。

## 其他字段

| 字段 | 值 |
| --- | --- |
| `touched` | 用户离开过的字段：`{ name: true }`。路径格式与 `errors` 相同 |
| `validating` | 异步检查进行中时为 `true` |
| `submitting` | `handleSubmit` 处理函数执行期间为 `true` |
| `id` | 字段 `id` 的前缀 |

完整列表见 [useForm](~/api/use-form)。
:::

## @t(see)

::: ru
- [useForm](~/api/use-form)
- [Результат проверки](@/tinyval/guide/result) — формат ошибок и данных в tinyval
:::

::: en
- [useForm](~/api/use-form)
- [Validation result](@/tinyval/guide/result) — the error and data format in tinyval
:::

::: zh
- [useForm](~/api/use-form)
- [校验结果](@/tinyval/guide/result)：tinyval 中错误和数据的格式
:::
