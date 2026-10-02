::: ru
Состояние формы для Vue 3 на схемах [tinyval](@/tinyval/): значения для `v-model`, ошибки, «трогал ли пользователь поле», отправка, ошибки с сервера и асинхронные проверки.

- ~2 kB gzip поверх схем, ~4 kB со всеми дополнениями и компонентами — в сборку попадает только используемое
- Composable (`useForm`, `useField`, `useFieldArray`) или компоненты (`<TvForm>`, `<TvField>`, `<TvError>`) — как удобнее
- Ошибки показываются, когда пора: после ухода с поля, при вводе или после отправки
- Ответ 422 от Laravel раскладывается по полям автоматически
- Типы: `form.values` — из начальных значений, данные в `handleSubmit` — из схемы
:::

::: en
Vue 3 form state on [tinyval](@/tinyval/) schemas: values for `v-model`, errors, touched fields, submission, server errors and async checks.

- ~2 kB gzip on top of the schemas, ~4 kB with every add-on and component — only what you use is bundled
- Composables (`useForm`, `useField`, `useFieldArray`) or components (`<TvForm>`, `<TvField>`, `<TvError>`) — whichever you prefer
- Errors are shown at the right time: after leaving a field, while typing or after submit
- A Laravel 422 response is spread over the fields automatically
- Types: `form.values` come from the initial values, `handleSubmit` data from the schema
:::

::: zh
基于 [tinyval](@/tinyval/) Schema 的 Vue 3 表单状态：用于 `v-model` 的值、错误、字段是否被访问过、提交、服务端错误和异步检查。

- 在 Schema 之上约 2 kB gzip，包含所有扩展和组件约 4 kB —— 只打包用到的部分
- 可以使用 composable（`useForm`、`useField`、`useFieldArray`）或组件（`<TvForm>`、`<TvField>`、`<TvError>`）
- 在合适的时机显示错误：离开字段后、输入时或提交后
- Laravel 的 422 响应会自动分配到各字段
- 类型：`form.values` 来自初始值，`handleSubmit` 中的数据来自 Schema
:::

::: ru
## Установка
:::

::: en
## Install
:::

::: zh
## 安装
:::

```bash
npm install tinyval tinyval-vue
```

::: ru
## Быстрый старт
:::

::: en
## Quick start
:::

::: zh
## 快速开始
:::

```vue
<script setup lang="ts">
import { object, string, pipe, trim, minLength, email } from 'tinyval';
import { useForm } from 'tinyval-vue';

const Signup = object({
  name: pipe(string(), trim(), minLength(2)),
  email: pipe(string(), email()),
});

const form = useForm(Signup, { initial: { name: '', email: '' } });

const submit = form.handleSubmit(async (data) => {
  await api.post('/signup', data); // data: { name: string; email: string }
});
</script>

<template>
  <form @submit="submit">
    <input v-model="form.values.name" @blur="form.touch('name')" />
    <span v-if="form.errors.name">{{ form.errors.name }}</span>

    <input v-model="form.values.email" @blur="form.touch('email')" />
    <span v-if="form.errors.email">{{ form.errors.email }}</span>

    <button :disabled="form.submitting">Sign up</button>
  </form>
</template>
```

::: ru
Схемы — обычные схемы tinyval: все [правила](@/tinyval/actions/pipe), [сообщения](@/tinyval/guide/messages) и примеры из документации tinyval работают в `useForm` без изменений.
:::

::: en
Schemas are regular tinyval schemas: all [rules](@/tinyval/actions/pipe), [messages](@/tinyval/guide/messages) and examples from the tinyval docs work in `useForm` unchanged.
:::

::: zh
Schema 就是普通的 tinyval Schema：tinyval 文档中的所有[规则](@/tinyval/actions/pipe)、[错误信息](@/tinyval/guide/messages)和示例都可以直接用于 `useForm`。
:::

::: ru
## Попробовать
:::

::: en
## Try it
:::

::: zh
## 试一试
:::

<TinyvalVueDemo />

::: ru
## Что почитать

- [Данные формы](~/guide/data) — `values`, `data`, `changes`, `errors` и как они меняются
- [Поля формы](~/guide/fields) — что отдаёт каждый тип поля и какую схему выбрать
- [Ошибки](~/guide/errors) — когда показываются, ошибки сервера, язык
- [Асинхронные проверки](~/guide/async) — «email не занят» с задержкой при вводе
- [Пошаговые формы](~/guide/steps) — проверка по шагам
- [Редактирование и черновики](~/guide/editing) — PATCH только изменённых полей, черновик, предупреждение об уходе
- [UI-библиотеки](~/guide/ui-libraries) — Element Plus, Vuetify, PrimeVue, свой компонент поля
- [Компоненты](~/api/components) — форма без кода в `<script>`
- [Components](~/api/components) — a form without code in `<script>`
- [API](~/api/use-form) — `useForm`, `useField`, `useFieldArray`, `useDraft`, `useLeaveGuard`
:::

::: en
## Further reading

- [Form data](~/guide/data) — `values`, `data`, `changes`, `errors` and how they change
- [Form fields](~/guide/fields) — what each field type gives and which schema to use
- [Errors](~/guide/errors) — when they are shown, server errors, language
- [Async checks](~/guide/async) — "email is not taken" with a typing delay
- [Multi-step forms](~/guide/steps) — step-by-step validation
- [Editing & drafts](~/guide/editing) — PATCH only changed fields, draft, leave warning
- [UI libraries](~/guide/ui-libraries) — Element Plus, Vuetify, PrimeVue, your own field component
- [API](~/api/use-form) — `useForm`, `useField`, `useFieldArray`, `useDraft`, `useLeaveGuard`
:::

::: zh
## 延伸阅读

- [表单数据](~/guide/data) —— `values`、`data`、`changes`、`errors` 以及它们如何变化
- [表单字段](~/guide/fields) —— 每种字段提供什么值，应选择哪种 Schema
- [错误](~/guide/errors) —— 何时显示、服务端错误、语言
- [异步检查](~/guide/async) —— 输入时带延迟的“邮箱未被占用”检查
- [分步表单](~/guide/steps) —— 按步骤校验
- [编辑与草稿](~/guide/editing) —— 只用 PATCH 提交修改的字段、草稿、离开提醒
- [UI 组件库](~/guide/ui-libraries) —— Element Plus、Vuetify、PrimeVue、自定义字段组件
- [组件](~/api/components) —— 无需在 `<script>` 中编写代码的表单
- [API](~/api/use-form) —— `useForm`、`useField`、`useFieldArray`、`useDraft`、`useLeaveGuard`
:::
