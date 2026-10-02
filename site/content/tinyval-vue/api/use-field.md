::: ru
Одно поле формы — для своих компонентов полей. Даёт значение для `v-model`, ошибку и готовые атрибуты: `name` (нужен для фокуса на ошибке), `id`, `aria-invalid`, `aria-describedby` — экранные дикторы прочитают текст ошибки.
:::

::: en
A single form field — for your own field components. Gives a value for `v-model`, the error and ready-made attributes: `name` (needed to focus errors), `id`, `aria-invalid`, `aria-describedby` — screen readers will read the error text.
:::

::: zh
单个表单字段 —— 用于自定义字段组件。提供 `v-model` 的值、错误以及现成的属性：`name`（聚焦错误时需要）、`id`、`aria-invalid`、`aria-describedby` —— 屏幕阅读器会读出错误文本。
:::

## @t(signature)

```ts
function useField<T>(path: MaybeRefOrGetter<string>): Field<T>
function useField<T>(form: Form, path: MaybeRefOrGetter<string>): Field<T>
```

::: ru
| Возвращает | Описание |
| --- | --- |
| `value` | Значение поля — для `v-model` |
| `error` | Текст ошибки, если её пора показать |
| `touched`, `dirty` | Уходили ли с поля; отличается ли значение от начального |
| `attrs` | `name`, `id`, `aria-invalid`, `aria-describedby`, `onBlur` — для `v-bind` на `<input>` |
| `errorId` | `id` для элемента с текстом ошибки |
| `onBlur` | Отметить поле «тронутым» |

`path` может быть ref или функцией — поле переключится на другой путь.

Без `form` форма берётся из контекста — от `useForm` или `<TvForm>` выше по дереву компонентов.
:::

::: en
| Returns | Description |
| --- | --- |
| `value` | The field value — for `v-model` |
| `error` | The error text, if it should be shown |
| `touched`, `dirty` | Whether the user left the field; whether the value differs from the initial one |
| `attrs` | `name`, `id`, `aria-invalid`, `aria-describedby`, `onBlur` — for `v-bind` on `<input>` |
| `errorId` | `id` for the element with the error text |
| `onBlur` | Mark the field as touched |

`path` can be a ref or a getter — the field switches to another path.

Without `form` the form comes from the context — from `useForm` or `<TvForm>` up the component tree.
:::

::: zh
| 返回值 | 说明 |
| --- | --- |
| `value` | 字段值 —— 用于 `v-model` |
| `error` | 应显示时的错误文本 |
| `touched`、`dirty` | 用户是否离开过该字段；值是否与初始值不同 |
| `attrs` | `name`、`id`、`aria-invalid`、`aria-describedby`、`onBlur` —— 用于 `<input>` 上的 `v-bind` |
| `errorId` | 错误文本元素的 `id` |
| `onBlur` | 将字段标记为已访问 |

`path` 可以是 ref 或 getter —— 字段会切换到另一个路径。

不传 `form` 时，会从上下文获取表单 —— 来自组件树上层的 `useForm` 或 `<TvForm>`。
:::

## @t(example)

```vue
<!-- TextField.vue -->
<script setup lang="ts">
import { useField } from 'tinyval-vue';

const props = defineProps<{ path: string; label: string }>();
const { value, error, attrs, errorId } = useField<string>(() => props.path); // the form comes from the parent
</script>

<template>
  <label :for="attrs.id">{{ label }}</label>
  <input v-model="value" v-bind="attrs" />
  <span v-if="error" :id="errorId" role="alert">{{ error }}</span>
</template>
```

```vue
<form @submit="submit">
  <TextField path="name" label="Name" />
  <TextField path="email" label="Email" type="email" />
</form>
```

## @t(see)

::: ru
- [useForm](~/api/use-form)
- [UI-библиотеки](~/guide/ui-libraries)
:::

::: en
- [useForm](~/api/use-form)
- [UI libraries](~/guide/ui-libraries)
:::

::: zh
- [useForm](~/api/use-form)
- [UI 组件库](~/guide/ui-libraries)
:::
