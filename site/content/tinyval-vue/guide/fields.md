::: ru
Поля формы отдают **строки**, а не числа и даты. Поэтому схема зависит от того, что именно кладёт в значение `v-model`.
:::

::: en
Form fields give **strings**, not numbers or dates. So the schema depends on what exactly `v-model` puts into the value.
:::

::: zh
表单字段提供的是**字符串**，而不是数字或日期。因此 Schema 取决于 `v-model` 实际写入的值。
:::

::: ru
## Что отдаёт каждое поле

| Поле | Что даёт `v-model` | Схема |
| --- | --- | --- |
| `<input>`, `<textarea>` | `'текст'` или `''` | [`string()`](@/tinyval/schemas/string) |
| `<input>` с числом | `'42'` или `''` | [`coerce.number()`](@/tinyval/schemas/coerce) |
| `<input v-model.number>` | `42` или `''` | [`number()`](@/tinyval/schemas/number) |
| `<input type="date">` | `'2026-10-02'` или `''` | [`coerce.date()`](@/tinyval/schemas/coerce) |
| `<input type="checkbox">` | `true` / `false` | [`boolean()`](@/tinyval/schemas/boolean), согласие — [`literal(true)`](@/tinyval/schemas/literal) |
| `<input type="radio">`, `<select>` | значение выбранного варианта | [`oneOf([...])`](@/tinyval/schemas/one-of) |
| `<select multiple>`, группа чекбоксов | массив значений | [`array(oneOf([...]))`](@/tinyval/schemas/array) |

Незаполненное поле даёт `''`, а tinyval считает пустую строку незаполненным значением — см. [Пустые значения](@/tinyval/guide/empty-values). Поэтому обязательные поля и [`optional`](@/tinyval/schemas/optional) работают с инпутами без дополнительных настроек.
:::

::: en
## What each field gives

| Field | What `v-model` gives | Schema |
| --- | --- | --- |
| `<input>`, `<textarea>` | `'text'` or `''` | [`string()`](@/tinyval/schemas/string) |
| `<input>` with a number | `'42'` or `''` | [`coerce.number()`](@/tinyval/schemas/coerce) |
| `<input v-model.number>` | `42` or `''` | [`number()`](@/tinyval/schemas/number) |
| `<input type="date">` | `'2026-10-02'` or `''` | [`coerce.date()`](@/tinyval/schemas/coerce) |
| `<input type="checkbox">` | `true` / `false` | [`boolean()`](@/tinyval/schemas/boolean), consent — [`literal(true)`](@/tinyval/schemas/literal) |
| `<input type="radio">`, `<select>` | the selected option value | [`oneOf([...])`](@/tinyval/schemas/one-of) |
| `<select multiple>`, checkbox group | an array of values | [`array(oneOf([...]))`](@/tinyval/schemas/array) |

An empty field gives `''`, and tinyval treats the empty string as a missing value — see [Empty values](@/tinyval/guide/empty-values). So required fields and [`optional`](@/tinyval/schemas/optional) work with inputs out of the box.
:::

::: zh
## 每种字段提供什么

| 字段 | `v-model` 提供的值 | Schema |
| --- | --- | --- |
| `<input>`、`<textarea>` | `'文本'` 或 `''` | [`string()`](@/tinyval/schemas/string) |
| 输入数字的 `<input>` | `'42'` 或 `''` | [`coerce.number()`](@/tinyval/schemas/coerce) |
| `<input v-model.number>` | `42` 或 `''` | [`number()`](@/tinyval/schemas/number) |
| `<input type="date">` | `'2026-10-02'` 或 `''` | [`coerce.date()`](@/tinyval/schemas/coerce) |
| `<input type="checkbox">` | `true` / `false` | [`boolean()`](@/tinyval/schemas/boolean)，同意条款用 [`literal(true)`](@/tinyval/schemas/literal) |
| `<input type="radio">`、`<select>` | 选中项的值 | [`oneOf([...])`](@/tinyval/schemas/one-of) |
| `<select multiple>`、复选框组 | 值的数组 | [`array(oneOf([...]))`](@/tinyval/schemas/array) |

未填写的字段提供 `''`，而 tinyval 将空字符串视为未填写 —— 见 [空值](@/tinyval/guide/empty-values)。因此必填字段和 [`optional`](@/tinyval/schemas/optional) 无需额外配置即可用于输入框。
:::

::: ru
## Пример: анкета
:::

::: en
## Example: a profile form
:::

::: zh
## 示例：资料表单
:::

```vue
<script setup lang="ts">
import { object, string, optional, pipe, coerce, integer, min, minLength, oneOf, array, literal, check } from 'tinyval';
import { useForm } from 'tinyval-vue';

const Profile = object({
  name: string(),
  age: optional(pipe(coerce.number(), integer(), min(14))),
  birthday: pipe(coerce.date(), check((d) => d < new Date())),
  city: oneOf(['moscow', 'spb', 'other']),
  interests: pipe(array(oneOf(['js', 'php', 'go'])), minLength(1)),
  terms: literal(true),
});

const form = useForm(Profile, {
  initial: { name: '', age: '', birthday: '', city: '', interests: [] as string[], terms: false },
});
</script>

<template>
  <input v-model="form.values.name" @blur="form.touch('name')" />
  <input v-model="form.values.age" inputmode="numeric" @blur="form.touch('age')" />
  <input v-model="form.values.birthday" type="date" @blur="form.touch('birthday')" />

  <select v-model="form.values.city" @blur="form.touch('city')">
    <option value="" disabled>—</option>
    <option value="moscow">Moscow</option>
    <option value="spb">Saint Petersburg</option>
    <option value="other">Other</option>
  </select>

  <label v-for="i in ['js', 'php', 'go']" :key="i">
    <input v-model="form.values.interests" type="checkbox" :value="i" @change="form.touch('interests')" /> {{ i }}
  </label>

  <label>
    <input v-model="form.values.terms" type="checkbox" @change="form.touch('terms')" /> I accept the terms
  </label>
</template>
```

::: ru
В `handleSubmit` придут уже приведённые значения: `age` — число, `birthday` — `Date`.
:::

::: en
`handleSubmit` receives converted values: `age` is a number, `birthday` is a `Date`.
:::

::: zh
`handleSubmit` 收到的是已转换的值：`age` 是数字，`birthday` 是 `Date`。
:::

::: ru
## Вложенные поля и массивы

Пути ошибок совпадают с путями в `values`. Для списков используйте [`useFieldArray`](~/api/use-field-array) — он даёт устойчивые ключи для `v-for` и не путает ошибки строк при удалении:
:::

::: en
## Nested fields and arrays

Error paths match the paths in `values`. For lists use [`useFieldArray`](~/api/use-field-array) — it gives stable keys for `v-for` and doesn't mix up row errors on removal:
:::

::: zh
## 嵌套字段和数组

错误路径与 `values` 中的路径一致。列表请使用 [`useFieldArray`](~/api/use-field-array) —— 它为 `v-for` 提供稳定的键，删除时不会弄混各行的错误：
:::

```vue
<script setup lang="ts">
const items = useFieldArray<{ title: string }>(form, 'items');
</script>

<template>
  <div v-for="field in items.fields.value" :key="field.key">
    <input v-model="field.value.title" :name="`${field.path}.title`" @blur="form.touch(`${field.path}.title`)" />
    <span>{{ form.errors[`${field.path}.title`] }}</span>
    <button type="button" @click="items.remove(field.index)">×</button>
  </div>
  <button type="button" @click="items.append({ title: '' })">+</button>
</template>
```

::: ru
## Маски

Телефоны, карты, суммы и даты удобно вводить с маской — пакет [tinyval-mask](@/tinyval-mask/). Директива `v-mask` работает на `<input>`, на [`<TvField>`](~/api/components) и на полях UI-библиотек, а снять маску перед проверкой можно в схеме — см. [Vue в tinyval-mask](@/tinyval-mask/guide/vue).
:::

::: en
## Masks

Phones, cards, amounts and dates are easier to type with a mask — the [tinyval-mask](@/tinyval-mask/) package. The `v-mask` directive works on `<input>`, on [`<TvField>`](~/api/components) and on UI library fields; the mask can be removed before validation in the schema — see [Vue in tinyval-mask](@/tinyval-mask/guide/vue).
:::

::: zh
## 掩码

电话、银行卡、金额和日期使用掩码输入更方便 —— 请使用 [tinyval-mask](@/tinyval-mask/) 包。`v-mask` 指令可用于 `<input>`、[`<TvField>`](~/api/components) 以及 UI 组件库的字段；可以在 Schema 中先去掉掩码再校验 —— 见 [tinyval-mask 中的 Vue](@/tinyval-mask/guide/vue)。
:::

```vue
<TvField name="phone" v-mask="phoneMask" inputmode="tel" />
```

::: ru
## Файлы

Отдельной схемы для файлов в tinyval пока нет. Файл можно проверить через [`createSchema`](@/tinyval/api/create-schema) или [`check`](@/tinyval/actions/check): `<input type="file">` не работает с `v-model`, поэтому значение кладётся в форму вручную:
:::

::: en
## Files

tinyval has no file schema yet. A file can be checked with [`createSchema`](@/tinyval/api/create-schema) or [`check`](@/tinyval/actions/check). `<input type="file">` doesn't work with `v-model`, so put the value into the form manually:
:::

::: zh
## 文件

tinyval 目前还没有专门的文件 Schema。可以通过 [`createSchema`](@/tinyval/api/create-schema) 或 [`check`](@/tinyval/actions/check) 校验文件。`<input type="file">` 不支持 `v-model`，因此需要手动把值放入表单：
:::

```vue
<script setup lang="ts">
const avatar = pipe(
  unknown(),
  check((f) => f instanceof File, 'Choose a file'),
  check((f) => (f as File).size <= 2 * 1024 * 1024, 'Max 2 MB'),
);
</script>

<template>
  <input type="file" accept="image/*" @change="form.values.avatar = ($event.target as HTMLInputElement).files?.[0] ?? null" />
</template>
```

## @t(see)

::: ru
- [Пустые значения](@/tinyval/guide/empty-values)
- [coerce](@/tinyval/schemas/coerce)
- [Ошибки](~/guide/errors)
:::

::: en
- [Empty values](@/tinyval/guide/empty-values)
- [coerce](@/tinyval/schemas/coerce)
- [Errors](~/guide/errors)
:::

::: zh
- [空值](@/tinyval/guide/empty-values)
- [coerce](@/tinyval/schemas/coerce)
- [错误](~/guide/errors)
:::
