::: ru
Ошибки проверяются при каждом изменении формы, а показываются, когда пора — чтобы не ругать пользователя, пока он ещё печатает.
:::

::: en
Errors are checked on every change but shown when it's time — so the user isn't scolded while still typing.
:::

::: zh
每次修改都会校验错误，但只在合适的时机显示 —— 避免在用户还在输入时就提示错误。
:::

::: ru
## Когда показываются ошибки

| `mode` | Ошибка поля видна |
| --- | --- |
| `'blur'` (по умолчанию) | После ухода с поля (`touch`) |
| `'input'` | Сразу, как только значение поменялось, или после ухода с поля |
| `'submit'` | Только после попытки отправить форму |

После первой попытки отправки (`handleSubmit` или `validate`) видны все ошибки независимо от режима. Все текущие ошибки, даже ещё не показанные, — в `form.allErrors`.
:::

::: en
## When errors are shown

| `mode` | A field error is visible |
| --- | --- |
| `'blur'` (default) | After the user leaves the field (`touch`) |
| `'input'` | As soon as the value changes, or after leaving the field |
| `'submit'` | Only after a submit attempt |

After the first submit attempt (`handleSubmit` or `validate`) all errors are visible regardless of the mode. All current errors, including hidden ones, are in `form.allErrors`.
:::

::: zh
## 何时显示错误

| `mode` | 字段错误何时可见 |
| --- | --- |
| `'blur'`（默认） | 用户离开字段后（`touch`） |
| `'input'` | 值一旦改变，或离开字段后 |
| `'submit'` | 仅在尝试提交之后 |

第一次尝试提交（`handleSubmit` 或 `validate`）之后，无论哪种模式都会显示所有错误。所有当前错误（包括尚未显示的）都在 `form.allErrors` 中。
:::

```ts
const form = useForm(Signup, { initial, mode: 'input' });
```

::: ru
## Ошибки с сервера

Если обработчик отправки выбросил ошибку с ответом 422 от Laravel (axios, ofetch), ошибки сами разложатся по полям — ничего делать не нужно. Ошибка поля исчезнет, как только пользователь изменит это поле; при правке других полей она остаётся.

Другой формат ответа — опция `extractErrors` у [`useForm`](~/api/use-form) или ручной вызов `setErrors`:
:::

::: en
## Server errors

If the submit handler throws an error with a Laravel 422 response (axios, ofetch), the errors are spread over the fields automatically — nothing to do. A field error disappears as soon as the user changes that field; editing other fields keeps it.

For another response format use the `extractErrors` option of [`useForm`](~/api/use-form) or call `setErrors` manually:
:::

::: zh
## 服务端错误

如果提交处理函数抛出带有 Laravel 422 响应的错误（axios、ofetch），错误会自动分配到各字段 —— 无需任何操作。用户修改该字段后错误会消失；修改其他字段时错误保留。

对于其他响应格式，请使用 [`useForm`](~/api/use-form) 的 `extractErrors` 选项或手动调用 `setErrors`：
:::

```ts
// axios / ofetch: 422 is handled automatically
const submit = form.handleSubmit((data) => axios.post('/api/signup', data));

// fetch: no exception on 422 — call setErrors yourself
const submitFetch = form.handleSubmit(async (data) => {
  const res = await fetch('/api/signup', { method: 'POST', body: JSON.stringify(data) });
  if (res.status === 422) {
    const { errors } = await res.json(); // { email: ['The email has already been taken.'] }
    form.setErrors(errors);
    return;
  }
  form.reset();
});
```

::: ru
## Язык и названия полей

Задаются для формы теми же опциями, что у [`validate`](@/tinyval/api/validate). Свои тексты целиком — [свой lang-файл](@/tinyval/guide/custom-lang).
:::

::: en
## Language and field names

Set for the form with the same options as in [`validate`](@/tinyval/api/validate). For fully custom texts see [custom lang file](@/tinyval/guide/custom-lang).
:::

::: zh
## 语言和字段名称

使用与 [`validate`](@/tinyval/api/validate) 相同的选项为表单设置。完全自定义文本见 [自定义语言文件](@/tinyval/guide/custom-lang)。
:::

```ts
import ru from 'tinyval/locales/ru';

const form = useForm(Signup, {
  initial: { name: '', email: '' },
  messages: { ...ru, required: 'Поле «{label}» обязательно' },
  labels: { name: 'Имя', email: 'Почта' },
});
```

::: ru
## Фокус на первой ошибке

При неудачной отправке фокус сам переходит на первое по разметке поле с ошибкой — поиск идёт по атрибуту `name`, поэтому у полей должен быть `name` с путём (`name="email"`, `name="items.0.title"`). [`useField`](~/api/use-field) ставит его сам. Отключается опцией `focusOnError: false`.

Для своей логики есть `onInvalid` — он получает видимые ошибки:
:::

::: en
## Focus the first error

On a failed submit the focus moves to the first field with an error in markup order — fields are found by the `name` attribute, so they need `name` with the path (`name="email"`, `name="items.0.title"`). [`useField`](~/api/use-field) sets it for you. Disable with `focusOnError: false`.

For custom logic there is `onInvalid` — it receives the visible errors:
:::

::: zh
## 聚焦第一个错误

提交失败时，焦点会自动移到页面中第一个有错误的字段 —— 按 `name` 属性查找，因此字段需要设置包含路径的 `name`（`name="email"`、`name="items.0.title"`）。[`useField`](~/api/use-field) 会自动设置。可以通过 `focusOnError: false` 关闭。

如需自定义逻辑，可以使用 `onInvalid` —— 它会收到可见的错误：
:::

```ts
const submit = form.handleSubmit(save, (errors) => {
  toast.error(`Please fix ${Object.keys(errors).length} fields`);
});
```

## @t(see)

::: ru
- [Сообщения и локализация](@/tinyval/guide/messages)
- [useForm](~/api/use-form)
:::

::: en
- [Messages & i18n](@/tinyval/guide/messages)
- [useForm](~/api/use-form)
:::

::: zh
- [错误信息与国际化](@/tinyval/guide/messages)
- [useForm](~/api/use-form)
:::
