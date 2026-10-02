::: ru
Компоненты делают то же, что composable, но без кода в `<script>`: форму достаточно создать через [`useForm`](~/api/use-form), остальное — в шаблоне. Поля находят форму сами — через `<TvForm>` выше по дереву.
:::

::: en
Components do the same as the composables but without code in `<script>`: create the form with [`useForm`](~/api/use-form), the rest is in the template. Fields find the form themselves — through `<TvForm>` up the tree.
:::

::: zh
组件的功能与 composable 相同，但无需在 `<script>` 中编写代码：只需用 [`useForm`](~/api/use-form) 创建表单，其余都在模板中完成。字段会通过上层的 `<TvForm>` 自动找到表单。
:::

```vue
<script setup lang="ts">
import { useForm, TvForm, TvField, TvError } from 'tinyval-vue';

const form = useForm(Signup, { initial: { name: '', email: '', plan: 'free', terms: false } });
const save = (data) => api.post('/signup', data); // 422 from Laravel is shown at the fields automatically
</script>

<template>
  <TvForm :form="form" @submit="save">
    <TvField name="name" placeholder="Name" />
    <TvError name="name" />

    <TvField name="email" type="email" />
    <TvError name="email" />

    <TvField name="plan" type="radio" value="free" /> Free
    <TvField name="plan" type="radio" value="pro" /> Pro

    <TvField name="terms" type="checkbox" /> I accept the terms

    <button :disabled="form.submitting">Sign up</button>
  </TvForm>
</template>
```

## TvForm

::: ru
Рендерит `<form novalidate>`, отправляет через [`handleSubmit`](~/api/use-form) и передаёт форму вложенным полям.

| Prop / событие | Описание |
| --- | --- |
| `form` | Форма из `useForm`. Обязателен |
| `@submit` | Вызывается с проверенными данными. Если вернёт `Promise` — `form.submitting` будет `true`, пока он не завершится; отклонение с ответом 422 разложится по полям |
| `@invalid` | Вызывается с ошибками, если форма не прошла проверку |

Слот по умолчанию получает `{ form }`.
:::

::: en
Renders `<form novalidate>`, submits through [`handleSubmit`](~/api/use-form) and provides the form to nested fields.

| Prop / event | Description |
| --- | --- |
| `form` | The form from `useForm`. Required |
| `@submit` | Called with validated data. If it returns a `Promise`, `form.submitting` is `true` until it settles; a rejection with a 422 response is spread over the fields |
| `@invalid` | Called with the errors when validation fails |

The default slot receives `{ form }`.
:::

::: zh
渲染 `<form novalidate>`，通过 [`handleSubmit`](~/api/use-form) 提交，并把表单提供给嵌套字段。

| Prop / 事件 | 说明 |
| --- | --- |
| `form` | 由 `useForm` 创建的表单。必填 |
| `@submit` | 以校验后的数据调用。如果返回 `Promise`，在其完成前 `form.submitting` 为 `true`；带 422 响应的拒绝会被分配到各字段 |
| `@invalid` | 校验失败时以错误调用 |

默认插槽接收 `{ form }`。
:::

## TvField

::: ru
Поле, связанное с формой по `name`. Остальные атрибуты (`placeholder`, `class`, `autocomplete`…) передаются на элемент.

| Prop | Описание |
| --- | --- |
| `name` | Путь поля: `email`, `address.city`, `items.0.title` |
| `as` | `'input'` (по умолчанию), `'textarea'`, `'select'` или компонент UI-библиотеки с `v-model` |
| `type` | Тип `<input>`: `checkbox`, `radio`, `file` и любые другие |
| `value` | Значение варианта для `radio` и группы чекбоксов |
| `multiple` | Несколько файлов или вариантов `<select>` |
| `form` | Форма явно — если `<TvForm>` выше по дереву нет |

| Поле | Значение в форме |
| --- | --- |
| `<TvField name="bio" as="textarea" />` | строка |
| `<TvField name="terms" type="checkbox" />` | `true` / `false` |
| `<TvField name="tags" type="checkbox" value="js" />` | массив отмеченных `value` |
| `<TvField name="plan" type="radio" value="pro" />` | `value` выбранной кнопки |
| `<TvField name="city" as="select">` + `<option>` | значение выбранного варианта |
| `<TvField name="langs" as="select" multiple>` | массив значений |
| `<TvField name="avatar" type="file" />` | `File` или `null`; с `multiple` — массив |
| `<TvField name="email" :as="ElInput" />` | `v-model` компонента |

Полностью свою разметку можно отрисовать через слот — он получает `field` (для `v-bind`), `value`, `setValue`, `error`, `errorId`, `touched`, `dirty`:
:::

::: en
A field bound to the form by `name`. Other attributes (`placeholder`, `class`, `autocomplete`…) go to the element.

| Prop | Description |
| --- | --- |
| `name` | Field path: `email`, `address.city`, `items.0.title` |
| `as` | `'input'` (default), `'textarea'`, `'select'` or a UI library component with `v-model` |
| `type` | `<input>` type: `checkbox`, `radio`, `file` and any other |
| `value` | Option value for `radio` and checkbox groups |
| `multiple` | Several files or `<select>` options |
| `form` | The form explicitly — if there is no `<TvForm>` up the tree |

| Field | Value in the form |
| --- | --- |
| `<TvField name="bio" as="textarea" />` | a string |
| `<TvField name="terms" type="checkbox" />` | `true` / `false` |
| `<TvField name="tags" type="checkbox" value="js" />` | an array of checked `value`s |
| `<TvField name="plan" type="radio" value="pro" />` | the `value` of the selected button |
| `<TvField name="city" as="select">` + `<option>` | the selected option value |
| `<TvField name="langs" as="select" multiple>` | an array of values |
| `<TvField name="avatar" type="file" />` | a `File` or `null`; with `multiple` — an array |
| `<TvField name="email" :as="ElInput" />` | the component's `v-model` |

You can render fully custom markup with the slot — it receives `field` (for `v-bind`), `value`, `setValue`, `error`, `errorId`, `touched`, `dirty`:
:::

::: zh
通过 `name` 与表单绑定的字段。其他属性（`placeholder`、`class`、`autocomplete`…）会传递给元素。

| Prop | 说明 |
| --- | --- |
| `name` | 字段路径：`email`、`address.city`、`items.0.title` |
| `as` | `'input'`（默认）、`'textarea'`、`'select'`，或支持 `v-model` 的 UI 组件 |
| `type` | `<input>` 类型：`checkbox`、`radio`、`file` 等 |
| `value` | `radio` 和复选框组的选项值 |
| `multiple` | 多个文件或 `<select>` 多选 |
| `form` | 显式传入表单 —— 当上层没有 `<TvForm>` 时 |

| 字段 | 表单中的值 |
| --- | --- |
| `<TvField name="bio" as="textarea" />` | 字符串 |
| `<TvField name="terms" type="checkbox" />` | `true` / `false` |
| `<TvField name="tags" type="checkbox" value="js" />` | 已勾选 `value` 的数组 |
| `<TvField name="plan" type="radio" value="pro" />` | 选中按钮的 `value` |
| `<TvField name="city" as="select">` + `<option>` | 选中项的值 |
| `<TvField name="langs" as="select" multiple>` | 值的数组 |
| `<TvField name="avatar" type="file" />` | `File` 或 `null`；使用 `multiple` 时为数组 |
| `<TvField name="email" :as="ElInput" />` | 组件的 `v-model` |

可以通过插槽渲染完全自定义的标记 —— 插槽接收 `field`（用于 `v-bind`）、`value`、`setValue`、`error`、`errorId`、`touched`、`dirty`：
:::

```vue
<TvField name="email" v-slot="{ field, error, errorId }">
  <el-form-item :error="error">
    <el-input v-bind="field" />
  </el-form-item>
</TvField>
```

## TvError

::: ru
Текст ошибки поля, если её пора показать. Рендерит `<span role="alert">` с `id`, на который ссылается `aria-describedby` поля.

| Prop | Описание |
| --- | --- |
| `name` | Путь поля |
| `as` | Тег, по умолчанию `span` |
| `form` | Форма явно — если `<TvForm>` выше по дереву нет |

Своя разметка — через слот `{ message, id }`.
:::

::: en
The field's error text, if it should be shown. Renders `<span role="alert">` with the `id` the field's `aria-describedby` points to.

| Prop | Description |
| --- | --- |
| `name` | Field path |
| `as` | Tag, `span` by default |
| `form` | The form explicitly — if there is no `<TvForm>` up the tree |

Custom markup — via the `{ message, id }` slot.
:::

::: zh
应显示时的字段错误文本。渲染 `<span role="alert">`，其 `id` 与字段的 `aria-describedby` 对应。

| Prop | 说明 |
| --- | --- |
| `name` | 字段路径 |
| `as` | 标签，默认为 `span` |
| `form` | 显式传入表单 —— 当上层没有 `<TvForm>` 时 |

自定义标记可使用插槽 `{ message, id }`。
:::

```vue
<TvError name="email" v-slot="{ message, id }">
  <p :id="id" class="text-red-600">⚠ {{ message }}</p>
</TvError>
```

## TvFieldArray

::: ru
Список полей — слот получает всё, что возвращает [`useFieldArray`](~/api/use-field-array): `fields`, `append`, `remove`, `move`…
:::

::: en
A list of fields — the slot receives everything [`useFieldArray`](~/api/use-field-array) returns: `fields`, `append`, `remove`, `move`…
:::

::: zh
字段列表 —— 插槽接收 [`useFieldArray`](~/api/use-field-array) 返回的全部内容：`fields`、`append`、`remove`、`move`…
:::

```vue
<TvFieldArray name="items" v-slot="{ fields, append, remove }">
  <div v-for="f in fields" :key="f.key">
    <TvField :name="`${f.path}.title`" />
    <TvError :name="`${f.path}.title`" />
    <button type="button" @click="remove(f.index)">×</button>
  </div>
  <button type="button" @click="append({ title: '' })">+</button>
</TvFieldArray>
```

## @t(see)

::: ru
- [useField](~/api/use-field) — то же для своих компонентов полей
- [UI-библиотеки](~/guide/ui-libraries)
:::

::: en
- [useField](~/api/use-field) — the same for your own field components
- [UI libraries](~/guide/ui-libraries)
:::

::: zh
- [useField](~/api/use-field)：用于自定义字段组件
- [UI 组件库](~/guide/ui-libraries)
:::
