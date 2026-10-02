::: ru
Задаёт название поля для параметра `{label}` в сообщениях об ошибках — как `:attribute` в Laravel.
:::

::: en
Sets the field name for the `{label}` parameter in error messages — like `:attribute` in Laravel.
:::

::: zh
为错误信息中的 `{label}` 参数设置字段名称 —— 类似 Laravel 的 `:attribute`。
:::

## @t(signature)

```ts
function label<T>(schema: Schema<T>, text: string): Schema<T>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `schema` | `Schema<T>` | Схема поля |
| `text` | `string` | Название поля |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `schema` | `Schema<T>` | The field schema |
| `text` | `string` | The field name |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `schema` | `Schema<T>` | 字段的 Schema |
| `text` | `string` | 字段名称 |
:::

## @t(notes)

::: ru
- Встроенные сообщения не используют `{label}` — добавьте его в свои тексты через [`setMessages`](~/api/set-messages) или опцию `messages`.
- Без `label` параметр `{label}` равен имени поля: `email`, `0` для элемента массива.
- Название действует только на ошибки самого поля, а не на вложенные поля.
- Если сайт на нескольких языках, удобнее передавать названия опцией `labels` у [`validate`](~/api/validate) — отдельно для каждого языка.
:::

::: en
- Built-in messages don't use `{label}` — add it to your texts via [`setMessages`](~/api/set-messages) or the `messages` option.
- Without `label`, `{label}` is the field name: `email`, or `0` for an array item.
- The name applies only to errors of the field itself, not to nested fields.
- For a multilingual app it's easier to pass names with the `labels` option of [`validate`](~/api/validate) — separately for each language.
:::

::: zh
- 内置信息不使用 `{label}` —— 请通过 [`setMessages`](~/api/set-messages) 或 `messages` 选项在自己的文本中添加。
- 没有 `label` 时，`{label}` 等于字段名：`email`，数组元素为 `0`。
- 名称只作用于该字段本身的错误，不作用于嵌套字段。
- 对于多语言应用，使用 [`validate`](~/api/validate) 的 `labels` 选项按语言分别传入名称更方便。
:::

## @t(examples)

::: ru
### Названия в схеме
:::

::: en
### Names in the schema
:::

::: zh
### 在 Schema 中设置名称
:::

```ts
const Signup = object({
  email: label(pipe(string(), email()), 'Email'),
  password: label(pipe(string(), minLength(8)), 'Password'),
});

setMessages({ required: '{label} is required', minLength: '{label} must be at least {min} characters' });

validate(Signup, { password: '123' }).errors;
// { email: 'Email is required', password: 'Password must be at least 8 characters' }
```

::: ru
### Названия для разных языков
:::

::: en
### Names for different languages
:::

::: zh
### 不同语言的名称
:::

```ts
const labels = {
  ru: { email: 'Почта', 'address.city': 'Город' },
  en: { email: 'Email', 'address.city': 'City' },
};

validate(Order, body, { messages: locales[lang], labels: labels[lang] });
```

## @t(see)

::: ru
- [Сообщения и локализация](~/guide/messages)
- [validate](~/api/validate) — опции `messages` и `labels`
:::

::: en
- [Messages & i18n](~/guide/messages)
- [validate](~/api/validate) — the `messages` and `labels` options
:::

::: zh
- [错误信息与国际化](~/guide/messages)
- [validate](~/api/validate)：`messages` 和 `labels` 选项
:::
