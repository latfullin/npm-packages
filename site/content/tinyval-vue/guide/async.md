::: ru
Схема с [`checkAsync`](@/tinyval/actions/check-async) — например, «email не занят» — работает в `useForm` без настроек.
:::

::: en
A schema with [`checkAsync`](@/tinyval/actions/check-async) — e.g. "email is not taken" — works in `useForm` out of the box.
:::

::: zh
包含 [`checkAsync`](@/tinyval/actions/check-async) 的 Schema（例如“邮箱未被占用”）无需额外配置即可用于 `useForm`。
:::

::: ru
## Как это работает

- При вводе проверка запускается после паузы `debounce` (по умолчанию 300 мс) — запрос не уходит на каждую букву.
- Пока проверка идёт, `form.validating` равен `true`.
- Ответ устаревшей проверки не перезапишет результат новой: если пользователь успел изменить значение, старый ответ игнорируется.
- Асинхронная проверка поля запускается, только если синхронные правила этого поля прошли — невалидный email не уйдёт на сервер.
- `handleSubmit` и `validate` проверяют сразу, без паузы.
:::

::: en
## How it works

- While typing, the check runs after a `debounce` pause (300 ms by default) — no request per keystroke.
- While it runs, `form.validating` is `true`.
- A stale response never overwrites a newer result: if the user changed the value meanwhile, the old response is ignored.
- A field's async check runs only if its synchronous rules passed — an invalid email never reaches the server.
- `handleSubmit` and `validate` check immediately, without the pause.
:::

::: zh
## 工作方式

- 输入时，检查会在 `debounce` 延迟（默认 300 毫秒）后执行 —— 不会每输入一个字符就发送请求。
- 检查期间 `form.validating` 为 `true`。
- 过期的响应不会覆盖较新的结果：如果用户在此期间修改了值，旧的响应会被忽略。
- 只有字段的同步规则通过后才会执行异步检查 —— 无效的邮箱不会被发送到服务端。
- `handleSubmit` 和 `validate` 会立即检查，没有延迟。
:::

## @t(example)

```vue
<script setup lang="ts">
const Signup = object({
  email: pipe(
    string(),
    email(),
    checkAsync(async (v) => !(await api.get('/email-exists', { params: { email: v } })).data, 'Email is taken'),
  ),
});

const form = useForm(Signup, { initial: { email: '' }, debounce: 500 });
</script>

<template>
  <input v-model="form.values.email" @blur="form.touch('email')" />
  <span v-if="form.validating">Checking…</span>
  <span v-else-if="form.errors.email">{{ form.errors.email }}</span>
</template>
```

## @t(see)

::: ru
- [checkAsync](@/tinyval/actions/check-async)
- [Ошибки](~/guide/errors) — ошибки, которые вернул сервер при отправке
:::

::: en
- [checkAsync](@/tinyval/actions/check-async)
- [Errors](~/guide/errors) — errors returned by the server on submit
:::

::: zh
- [checkAsync](@/tinyval/actions/check-async)
- [错误](~/guide/errors)：提交时服务端返回的错误
:::
