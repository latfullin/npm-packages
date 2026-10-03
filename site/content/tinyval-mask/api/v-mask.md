::: ru
Директива Vue — [`attach`](~/api/attach) в шаблоне. Импортируется из `tinyval-mask/vue`.
:::

::: en
A Vue directive — [`attach`](~/api/attach) in the template. Imported from `tinyval-mask/vue`.
:::

::: zh
Vue 指令 —— 在模板中使用的 [`attach`](~/api/attach)。从 `tinyval-mask/vue` 导入。
:::

## @t(signature)

```ts
const vMask: Directive<HTMLElement, MaskInput | { mask: MaskInput; placeholder?: string; raw?: boolean; onChange?: (state: MaskState) => void }>
```

::: ru
| Запись | В поле | В `v-model` |
| --- | --- | --- |
| `v-mask="phoneMask"` | `+7 (999) 123-45-67` | `'+7 (999) 123-45-67'` |
| `v-mask.raw="phoneMask"` | `+7 (999) 123-45-67` | `'79991234567'` |
| `v-mask="{ mask: phoneMask, placeholder: '_' }"` | `+7 (999) 12_-__-__` | `'+7 (999) 12'` |
| `v-mask.raw="{ mask: phoneMask, placeholder: '_' }"` | `+7 (999) 12_-__-__` | `'7999912'` |

- Маска — объект маски, строка-шаблон, массив шаблонов или опции [`createMask`](~/api/create-mask).
- Если значение изменилось (другая страна телефона), маска обновится.
- На обёртке ищет `<input>` внутри — работает с полями UI-библиотек и [`<TvField>`](@/tinyval-vue/api/components).
- `onChange` в объекте настроек получает `{ value, raw, complete, valid }` — например, чтобы подсветить поле или включить кнопку. Вызывается только при изменении состояния, поэтому объект можно писать прямо в шаблоне.
- При размонтировании маска снимается.
:::

::: en
| Usage | In the field | In `v-model` |
| --- | --- | --- |
| `v-mask="phoneMask"` | `+7 (999) 123-45-67` | `'+7 (999) 123-45-67'` |
| `v-mask.raw="phoneMask"` | `+7 (999) 123-45-67` | `'79991234567'` |
| `v-mask="{ mask: phoneMask, placeholder: '_' }"` | `+7 (999) 12_-__-__` | `'+7 (999) 12'` |
| `v-mask.raw="{ mask: phoneMask, placeholder: '_' }"` | `+7 (999) 12_-__-__` | `'7999912'` |

- The mask is a mask object, a pattern string, an array of patterns or [`createMask`](~/api/create-mask) options.
- If the value changes (another phone country), the mask is updated.
- On a wrapper it looks for an `<input>` inside — works with UI library fields and [`<TvField>`](@/tinyval-vue/api/components).
- `onChange` in the options object receives `{ value, raw, complete, valid }` — e.g. to highlight the field or enable a button. It's called only when the state changes, so the object can be written inline in the template.
- The mask is removed on unmount.
:::

::: zh
| 写法 | 输入框中 | `v-model` 中 |
| --- | --- | --- |
| `v-mask="phoneMask"` | `+7 (999) 123-45-67` | `'+7 (999) 123-45-67'` |
| `v-mask.raw="phoneMask"` | `+7 (999) 123-45-67` | `'79991234567'` |
| `v-mask="{ mask: phoneMask, placeholder: '_' }"` | `+7 (999) 12_-__-__` | `'+7 (999) 12'` |
| `v-mask.raw="{ mask: phoneMask, placeholder: '_' }"` | `+7 (999) 12_-__-__` | `'7999912'` |

- 掩码可以是掩码对象、模板字符串、模板数组或 [`createMask`](~/api/create-mask) 的选项。
- 如果值发生变化（例如切换电话国家），掩码会更新。
- 用在包裹元素上时会查找内部的 `<input>` —— 适用于 UI 组件库的字段和 [`<TvField>`](@/tinyval-vue/api/components)。
- 选项对象中的 `onChange` 接收 `{ value, raw, complete, valid }` —— 例如用于高亮输入框或启用按钮。只在状态变化时调用，因此可以直接在模板中写对象。
- 卸载时会移除掩码。
:::

## @t(example)

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { phone, type PhoneCountry } from 'tinyval-mask/presets';
import { vMask } from 'tinyval-mask/vue';

const country = ref<PhoneCountry>('ru');
const phoneMask = computed(() => phone(country.value));
const tel = ref('');
</script>

<template>
  <select v-model="country">
    <option value="ru">RU</option>
    <option value="by">BY</option>
  </select>
  <input v-model="tel" v-mask.raw="{ mask: phoneMask, placeholder: '_' }" inputmode="tel" />
  <!-- tel: '79991234567' -->
</template>
```

::: ru
### Правильно ли заполнено поле
:::

::: en
### Is the field filled correctly
:::

::: zh
### 输入框是否填写正确
:::

```vue
<script setup lang="ts">
const cardMask = card();
const cardOk = ref(false);
</script>

<template>
  <input v-model="number" v-mask.raw="{ mask: cardMask, onChange: (s) => (cardOk = s.valid) }" :class="{ error: number && !cardOk }" />
  <button :disabled="!cardOk">Pay</button>
</template>
```

## @t(see)

::: ru
- [Vue](~/guide/vue)
- [attach](~/api/attach)
:::

::: en
- [Vue](~/guide/vue)
- [attach](~/api/attach)
:::

::: zh
- [Vue](~/guide/vue)
- [attach](~/api/attach)
:::
