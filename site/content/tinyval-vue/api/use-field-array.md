::: ru
Список полей: позиции заказа, телефоны, участники. Даёт устойчивые ключи для `v-for` и операции над строками. При удалении и перестановке отметки «тронуто» переезжают вместе со строками — ошибка не перескочит на соседнюю строку.
:::

::: en
A list of fields: order items, phones, participants. Gives stable keys for `v-for` and row operations. When rows are removed or reordered, touched marks move with them — an error never jumps to a neighbouring row.
:::

::: zh
字段列表：订单项、电话、参与者。为 `v-for` 提供稳定的键以及行操作。删除或重新排序行时，“已访问”标记会随行移动 —— 错误不会跳到相邻的行。
:::

## @t(signature)

```ts
function useFieldArray<T>(path: string): FieldArray<T>
function useFieldArray<T>(form: Form, path: string): FieldArray<T>
```

::: ru
| Возвращает | Описание |
| --- | --- |
| `fields` | `{ key, index, path, value }[]` — `key` для `v-for`, `path` для ошибок и `touch` |
| `append(value)`, `prepend(value)` | Добавить строку в конец / в начало |
| `insert(index, value)` | Вставить строку |
| `remove(index)` | Удалить строку |
| `move(from, to)`, `swap(a, b)` | Переставить строки |
| `replace(values)` | Заменить весь список |

Без `form` форма берётся из контекста. Если массива в `values` нет, он будет создан. Прямые изменения (`form.values.items.push(...)`) тоже работают — новые строки получат ключи.
:::

::: en
| Returns | Description |
| --- | --- |
| `fields` | `{ key, index, path, value }[]` — `key` for `v-for`, `path` for errors and `touch` |
| `append(value)`, `prepend(value)` | Add a row to the end / start |
| `insert(index, value)` | Insert a row |
| `remove(index)` | Remove a row |
| `move(from, to)`, `swap(a, b)` | Reorder rows |
| `replace(values)` | Replace the whole list |

Without `form` the form comes from the context. If there is no array in `values`, it is created. Direct changes (`form.values.items.push(...)`) work too — new rows get keys.
:::

::: zh
| 返回值 | 说明 |
| --- | --- |
| `fields` | `{ key, index, path, value }[]` —— `key` 用于 `v-for`，`path` 用于错误和 `touch` |
| `append(value)`、`prepend(value)` | 在末尾 / 开头添加行 |
| `insert(index, value)` | 插入行 |
| `remove(index)` | 删除行 |
| `move(from, to)`、`swap(a, b)` | 调整行的顺序 |
| `replace(values)` | 替换整个列表 |

不传 `form` 时从上下文获取表单。如果 `values` 中没有该数组，会自动创建。直接修改（`form.values.items.push(...)`）同样有效 —— 新行会获得键。
:::

## @t(example)

```vue
<script setup lang="ts">
const Order = object({
  items: pipe(array(object({ title: pipe(string(), minLength(2)), qty: pipe(coerce.number(), min(1)) })), minLength(1)),
});

const form = useForm(Order, { initial: { items: [{ title: '', qty: '1' }] } });
const items = useFieldArray<{ title: string; qty: string }>(form, 'items');
</script>

<template>
  <div v-for="field in items.fields.value" :key="field.key">
    <input v-model="field.value.title" :name="`${field.path}.title`" @blur="form.touch(`${field.path}.title`)" />
    <span>{{ form.errors[`${field.path}.title`] }}</span>

    <input v-model="field.value.qty" :name="`${field.path}.qty`" @blur="form.touch(`${field.path}.qty`)" />

    <button type="button" :disabled="field.index === 0" @click="items.move(field.index, field.index - 1)">↑</button>
    <button type="button" @click="items.remove(field.index)">×</button>
  </div>
  <button type="button" @click="items.append({ title: '', qty: '1' })">+</button>
</template>
```

::: ru
Почему не индекс в `:key`: при удалении первой строки все индексы сдвигаются, и Vue переиспользует поля не тех строк — фокус и введённый текст «перепрыгивают».
:::

::: en
Why not the index as `:key`: removing the first row shifts all indexes, and Vue reuses the wrong rows' inputs — focus and typed text "jump".
:::

::: zh
为什么不用索引作为 `:key`：删除第一行后所有索引都会移动，Vue 会复用错误行的输入框 —— 焦点和已输入的文本会“跳动”。
:::

## @t(see)

::: ru
- [Поля формы](~/guide/fields)
- [array](@/tinyval/schemas/array)
:::

::: en
- [Form fields](~/guide/fields)
- [array](@/tinyval/schemas/array)
:::

::: zh
- [表单字段](~/guide/fields)
- [array](@/tinyval/schemas/array)
:::
