::: ru
Создаёт состояние формы по схеме tinyval.
:::

::: en
Creates form state from a tinyval schema.
:::

::: zh
根据 tinyval Schema 创建表单状态。
:::

## @t(signature)

```ts
function useForm<S extends Schema, V extends object>(schema: S, options: FormOptions<V>): Form<V, Infer<S>>
```

::: ru
## Опции

| Опция | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `initial` | `V` | — | Начальные значения полей. Обязательна. Из неё берётся тип `form.values` |
| `mode` | `'blur' \| 'input' \| 'submit'` | `'blur'` | Когда показывать ошибки поля — см. [Ошибки](~/guide/errors) |
| `debounce` | `number` | `300` | Задержка перед асинхронными проверками при вводе, мс |
| `focusOnError` | `boolean` | `true` | При неудачной отправке поставить фокус на первое поле с ошибкой (по атрибуту `name`) |
| `extractErrors` | `(error) => errors` | ответ 422 | Как достать ошибки полей из исключения в `handleSubmit`. По умолчанию понимает 422 от Laravel через axios и ofetch и `ValidationError` из tinyval |
| `id` | `string` | `useId()` | Основа для `id` полей. По умолчанию `useId()` во Vue 3.5+ — совпадает при SSR |
| `messages`, `labels`, `maxDepth` | | | Как у [`validate`](@/tinyval/api/validate): язык и названия полей для этой формы |

## Что возвращает

Реактивный объект. Используйте его целиком (`form.errors.email`), не деструктурируйте — иначе пропадёт реактивность.

Форма передаётся вложенным компонентам: в них `useField('email')`, `useFieldArray('items')`, `useFormContext()` и компоненты [`TvField`](~/api/components) работают без явной передачи формы.

| Поле | Описание |
| --- | --- |
| `values` | Значения полей для `v-model` |
| `errors` | Ошибки, которые пора показать (с учётом `mode`), и ошибки сервера: `{ email: '...', 'items.0.title': '...' }` |
| `allErrors` | Все текущие ошибки, даже ещё не показанные |
| `valid` | Форма валидна и нет ошибок сервера |
| `dirty` | Значения отличаются от начальных |
| `changes` | Только изменённые поля — например, для `PATCH`, см. [Редактирование](~/guide/editing) |
| `touched` | Поля, с которых пользователь уходил: `{ email: true }` |
| `validating` | Идёт асинхронная проверка |
| `submitting` | Идёт отправка (`handleSubmit`) |
| `submitted` | Форму пытались отправить — после этого видны все ошибки |
| `submitCount` | Сколько раз пытались отправить |
| `submitSucceeded` | Последняя отправка прошла успешно |
| `data` | Проверенные данные (после `trim`, `coerce`…) или `undefined` |

| Метод | Описание |
| --- | --- |
| `touch(path)` | Отметить поле как «тронутое» — обычно на `@blur`. `touch('items')` отмечает все вложенные поля |
| `handleSubmit(onValid, onInvalid?)` | Обработчик для `@submit`: отменяет отправку страницы, проверяет форму и вызывает `onValid(data)` с проверенными данными или `onInvalid(errors)` |
| `validate(paths?)` | Проверить форму и показать все ошибки. С путями — только эти поля, см. [Пошаговые формы](~/guide/steps). Возвращает `Promise<boolean>` |
| `isDirty(path)` | Изменилось ли поле |
| `setValue(path, value)`, `setValues(values)` | Задать значение поля / нескольких полей |
| `setErrors(errors)` | Показать ошибки сервера: `{ email: '...' }` или формат Laravel `{ email: ['...'] }` |
| `setFieldError(path, message?)` | Ошибка одного поля; исчезнет при его изменении. Без текста — убрать |
| `clearErrors(path?)` | Скрыть ошибки поля или всей формы до следующего ухода с поля / отправки |
| `setTouched(path, value?)` | Отметить поле «тронутым» или снять отметку |
| `resetField(path, value?)` | Вернуть поле к начальному значению; с `value` — задать новое начальное |
| `validateField(path)` | Проверить одно поле и показать его ошибку |
| `reset(values?)` | Вернуть начальные (или новые) значения и очистить ошибки, `touched`, `submitted`. Новые значения становятся точкой отсчёта для `dirty` |
| `bind(path)` | `modelValue`, `onUpdate:modelValue` и `onBlur` — для [компонентов UI-библиотек](~/guide/ui-libraries) |
:::

::: en
## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `initial` | `V` | — | Initial field values. Required. The type of `form.values` comes from it |
| `mode` | `'blur' \| 'input' \| 'submit'` | `'blur'` | When to show field errors — see [Errors](~/guide/errors) |
| `debounce` | `number` | `300` | Delay before async checks while typing, ms |
| `focusOnError` | `boolean` | `true` | On a failed submit, focus the first field with an error (by the `name` attribute) |
| `extractErrors` | `(error) => errors` | 422 response | How to get field errors from an exception in `handleSubmit`. By default understands Laravel 422 via axios and ofetch, and tinyval's `ValidationError` |
| `id` | `string` | `useId()` | Base for field `id`s. Defaults to `useId()` in Vue 3.5+ — stable with SSR |
| `messages`, `labels`, `maxDepth` | | | As in [`validate`](@/tinyval/api/validate): language and field names for this form |

## What it returns

A reactive object. Use it as a whole (`form.errors.email`) and don't destructure it — reactivity would be lost.

The form is provided to nested components: there `useField('email')`, `useFieldArray('items')`, `useFormContext()` and the [`TvField`](~/api/components) components work without passing the form.

| Field | Description |
| --- | --- |
| `values` | Field values for `v-model` |
| `errors` | Errors that should be shown now (according to `mode`) plus server errors: `{ email: '...', 'items.0.title': '...' }` |
| `allErrors` | All current errors, including ones not shown yet |
| `valid` | The form is valid and there are no server errors |
| `dirty` | Values differ from the initial ones |
| `changes` | Only the changed fields — e.g. for `PATCH`, see [Editing](~/guide/editing) |
| `touched` | Fields the user has left: `{ email: true }` |
| `validating` | An async check is running |
| `submitting` | Submission (`handleSubmit`) is running |
| `submitted` | The form was submitted at least once — after that all errors are shown |
| `submitCount` | How many times submit was attempted |
| `submitSucceeded` | The last submit succeeded |
| `data` | Validated data (after `trim`, `coerce`…) or `undefined` |

| Method | Description |
| --- | --- |
| `touch(path)` | Mark a field as touched — usually on `@blur`. `touch('items')` marks all nested fields |
| `handleSubmit(onValid, onInvalid?)` | A `@submit` handler: prevents the page submit, validates the form and calls `onValid(data)` with validated data or `onInvalid(errors)` |
| `validate(paths?)` | Validate the form and show all errors. With paths — only those fields, see [Multi-step forms](~/guide/steps). Returns `Promise<boolean>` |
| `isDirty(path)` | Whether a field has changed |
| `setValue(path, value)`, `setValues(values)` | Set one field / several fields |
| `setErrors(errors)` | Show server errors: `{ email: '...' }` or Laravel format `{ email: ['...'] }` |
| `setFieldError(path, message?)` | An error for one field; disappears when it changes. Without a message — remove |
| `clearErrors(path?)` | Hide errors of a field or the whole form until the next blur / submit |
| `setTouched(path, value?)` | Mark or unmark a field as touched |
| `resetField(path, value?)` | Restore a field's initial value; with `value` — set a new initial value |
| `validateField(path)` | Validate one field and show its error |
| `reset(values?)` | Restore initial (or new) values and clear errors, `touched`, `submitted`. New values become the baseline for `dirty` |
| `bind(path)` | `modelValue`, `onUpdate:modelValue` and `onBlur` — for [UI library components](~/guide/ui-libraries) |
:::

::: zh
## 选项

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `initial` | `V` | — | 字段初始值。必填。`form.values` 的类型由它决定 |
| `mode` | `'blur' \| 'input' \| 'submit'` | `'blur'` | 何时显示字段错误 —— 见 [错误](~/guide/errors) |
| `debounce` | `number` | `300` | 输入时执行异步检查前的延迟，毫秒 |
| `focusOnError` | `boolean` | `true` | 提交失败时聚焦第一个有错误的字段（按 `name` 属性） |
| `extractErrors` | `(error) => errors` | 422 响应 | 如何从 `handleSubmit` 的异常中提取字段错误。默认支持通过 axios 和 ofetch 返回的 Laravel 422，以及 tinyval 的 `ValidationError` |
| `id` | `string` | `useId()` | 字段 `id` 的前缀。在 Vue 3.5+ 中默认使用 `useId()` —— 在 SSR 下保持一致 |
| `messages`、`labels`、`maxDepth` | | | 与 [`validate`](@/tinyval/api/validate) 相同：该表单的语言和字段名称 |

## 返回值

一个响应式对象。请整体使用它（`form.errors.email`），不要解构 —— 否则会失去响应性。

表单会提供给嵌套组件：在其中 `useField('email')`、`useFieldArray('items')`、`useFormContext()` 以及 [`TvField`](~/api/components) 等组件无需显式传入表单即可使用。

| 字段 | 说明 |
| --- | --- |
| `values` | 用于 `v-model` 的字段值 |
| `errors` | 当前应显示的错误（取决于 `mode`）以及服务端错误：`{ email: '...', 'items.0.title': '...' }` |
| `allErrors` | 所有当前错误，包括尚未显示的 |
| `valid` | 表单有效且没有服务端错误 |
| `dirty` | 值与初始值不同 |
| `changes` | 只包含修改过的字段 —— 例如用于 `PATCH`，见 [编辑](~/guide/editing) |
| `touched` | 用户已离开过的字段：`{ email: true }` |
| `validating` | 正在进行异步检查 |
| `submitting` | 正在提交（`handleSubmit`） |
| `submitted` | 表单至少提交过一次 —— 之后显示所有错误 |
| `submitCount` | 尝试提交的次数 |
| `submitSucceeded` | 最近一次提交是否成功 |
| `data` | 校验后的数据（经过 `trim`、`coerce`…）或 `undefined` |

| 方法 | 说明 |
| --- | --- |
| `touch(path)` | 将字段标记为已访问 —— 通常在 `@blur` 时调用。`touch('items')` 会标记所有嵌套字段 |
| `handleSubmit(onValid, onInvalid?)` | `@submit` 处理函数：阻止页面提交，校验表单，并用校验后的数据调用 `onValid(data)`，或调用 `onInvalid(errors)` |
| `validate(paths?)` | 校验表单并显示所有错误。传入路径时只校验这些字段，见 [分步表单](~/guide/steps)。返回 `Promise<boolean>` |
| `isDirty(path)` | 字段是否被修改 |
| `setValue(path, value)`、`setValues(values)` | 设置单个字段 / 多个字段的值 |
| `setErrors(errors)` | 显示服务端错误：`{ email: '...' }` 或 Laravel 格式 `{ email: ['...'] }` |
| `setFieldError(path, message?)` | 单个字段的错误；字段修改后消失。不传文本则移除 |
| `clearErrors(path?)` | 隐藏字段或整个表单的错误，直到下次离开字段 / 提交 |
| `setTouched(path, value?)` | 将字段标记或取消标记为已访问 |
| `resetField(path, value?)` | 恢复字段的初始值；传入 `value` 时设置新的初始值 |
| `validateField(path)` | 校验单个字段并显示其错误 |
| `reset(values?)` | 恢复初始（或新的）值，并清除错误、`touched`、`submitted`。新值会成为 `dirty` 的基准 |
| `bind(path)` | `modelValue`、`onUpdate:modelValue` 和 `onBlur` —— 用于 [UI 组件库](~/guide/ui-libraries) |
:::

## @t(see)

::: ru
- [useField](~/api/use-field), [useFieldArray](~/api/use-field-array)
- [useDraft](~/api/use-draft), [useLeaveGuard](~/api/use-leave-guard)
:::

::: en
- [useField](~/api/use-field), [useFieldArray](~/api/use-field-array)
- [useDraft](~/api/use-draft), [useLeaveGuard](~/api/use-leave-guard)
:::

::: zh
- [useField](~/api/use-field)、[useFieldArray](~/api/use-field-array)
- [useDraft](~/api/use-draft)、[useLeaveGuard](~/api/use-leave-guard)
:::
