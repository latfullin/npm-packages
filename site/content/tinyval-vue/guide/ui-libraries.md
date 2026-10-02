::: ru
`form.bind(path)` возвращает `modelValue`, `onUpdate:modelValue` и `onBlur` — то, что принимают поля большинства UI-библиотек. Ошибку передайте в свойство компонента для ошибок — у каждой библиотеки оно называется по-своему.
:::

::: en
`form.bind(path)` returns `modelValue`, `onUpdate:modelValue` and `onBlur` — what most UI library fields accept. Pass the error to the component's error prop — each library names it differently.
:::

::: zh
`form.bind(path)` 返回 `modelValue`、`onUpdate:modelValue` 和 `onBlur` —— 大多数 UI 库的输入组件都接受这些属性。请把错误传给组件的错误属性 —— 每个库的命名不同。
:::

### Element Plus

```vue
<el-form-item :error="form.errors.email">
  <el-input v-bind="form.bind('email')" />
</el-form-item>
```

### Vuetify

```vue
<v-text-field v-bind="form.bind('email')" :error-messages="form.errors.email" />
```

### PrimeVue

```vue
<InputText v-bind="form.bind('email')" :invalid="!!form.errors.email" />
<Message v-if="form.errors.email" severity="error">{{ form.errors.email }}</Message>
```

### Naive UI

```vue
<n-form-item :feedback="form.errors.email" :validation-status="form.errors.email ? 'error' : undefined">
  <n-input v-bind="form.bind('email')" />
</n-form-item>
```

::: ru
## Свой компонент поля

Чтобы не повторять разметку, сделайте компонент на [`useField`](~/api/use-field) — он сразу проставит `name` и атрибуты доступности:
:::

::: en
## Your own field component

To avoid repeating markup, build a component on [`useField`](~/api/use-field) — it sets `name` and accessibility attributes for you:
:::

::: zh
## 自定义字段组件

为了避免重复标记，可以基于 [`useField`](~/api/use-field) 创建组件 —— 它会自动设置 `name` 和无障碍属性：
:::

```vue
<!-- FormField.vue -->
<script setup lang="ts">
import { useField, type Form } from 'tinyval-vue';

const props = defineProps<{ form: Form<any, any>; path: string; label: string }>();
const { value, error, attrs, errorId } = useField<string>(props.form, () => props.path);
</script>

<template>
  <label class="field">
    {{ label }}
    <input v-model="value" v-bind="{ ...attrs, ...$attrs }" />
    <span v-if="error" :id="errorId" class="field__error">{{ error }}</span>
  </label>
</template>
```

```vue
<FormField :form="form" path="email" label="Email" type="email" />
```

## @t(see)

::: ru
- [useForm](~/api/use-form) — `bind` и остальные методы
:::

::: en
- [useForm](~/api/use-form) — `bind` and other methods
:::

::: zh
- [useForm](~/api/use-form)：`bind` 及其他方法
:::
