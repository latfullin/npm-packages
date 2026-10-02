::: ru
Длинную форму удобно разбить на шаги. Одна схема и одна форма на все шаги, а `form.validate(paths)` проверяет только поля текущего шага — ошибки следующих шагов пользователь не увидит раньше времени.
:::

::: en
A long form is easier to split into steps. One schema and one form for all steps, and `form.validate(paths)` checks only the current step's fields — the user won't see errors from later steps too early.
:::

::: zh
较长的表单适合拆分为多个步骤。所有步骤共用一个 Schema 和一个表单，`form.validate(paths)` 只检查当前步骤的字段 —— 用户不会过早看到后续步骤的错误。
:::

## @t(example)

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { object, string, pipe, email, minLength, coerce, literal } from 'tinyval';
import { useForm } from 'tinyval-vue';

const Order = object({
  name: pipe(string(), minLength(2)),
  email: pipe(string(), email()),
  city: string(),
  address: string(),
  date: coerce.date(),
  terms: literal(true),
});

const steps = [['name', 'email'], ['city', 'address'], ['date', 'terms']];
const step = ref(0);

const form = useForm(Order, {
  initial: { name: '', email: '', city: '', address: '', date: '', terms: false },
});

async function next() {
  if (await form.validate(steps[step.value])) step.value++;
}

const submit = form.handleSubmit((data) => api.post('/orders', data));
</script>

<template>
  <form @submit="submit">
    <template v-if="step === 0">
      <input v-model="form.values.name" name="name" />
      <input v-model="form.values.email" name="email" />
    </template>
    <!-- … -->
    <button v-if="step > 0" type="button" @click="step--">Back</button>
    <button v-if="step < steps.length - 1" type="button" @click="next">Next</button>
    <button v-else :disabled="form.submitting">Place order</button>
  </form>
</template>
```

::: ru
- `validate(paths)` отмечает поля шага «тронутыми» — их ошибки становятся видны — и возвращает `true`, если в этих полях нет ошибок.
- Путь может указывать на вложенный объект или массив: `validate(['address'])` проверит `address.city`, `address.street` и т.д.
- На последнем шаге `handleSubmit` проверяет всю форму — если пользователь вернулся назад и что-то сломал, это не пропустится.
:::

::: en
- `validate(paths)` marks the step's fields as touched — their errors become visible — and returns `true` if those fields have no errors.
- A path can point to a nested object or array: `validate(['address'])` checks `address.city`, `address.street` and so on.
- On the last step `handleSubmit` validates the whole form — if the user went back and broke something, it won't slip through.
:::

::: zh
- `validate(paths)` 会把该步骤的字段标记为已访问（使其错误可见），如果这些字段没有错误则返回 `true`。
- 路径可以指向嵌套对象或数组：`validate(['address'])` 会检查 `address.city`、`address.street` 等。
- 在最后一步，`handleSubmit` 会校验整个表单 —— 如果用户返回修改时引入了错误，也不会被遗漏。
:::

## @t(see)

::: ru
- [useForm](~/api/use-form) — `validate`
- [Редактирование и черновики](~/guide/editing) — сохранить введённое между шагами при перезагрузке
:::

::: en
- [useForm](~/api/use-form) — `validate`
- [Editing & drafts](~/guide/editing) — keep the input between steps across reloads
:::

::: zh
- [useForm](~/api/use-form)：`validate`
- [编辑与草稿](~/guide/editing)：刷新页面后保留各步骤已输入的内容
:::
