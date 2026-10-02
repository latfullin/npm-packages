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
const vMask: Directive<HTMLElement, MaskInput>
```

::: ru
- Значение — маска, строка-шаблон, массив шаблонов или опции [`createMask`](~/api/create-mask).
- Если значение изменилось (другая страна телефона), маска обновится.
- На обёртке ищет `<input>` внутри — работает с полями UI-библиотек и [`<TvField>`](@/tinyval-vue/api/components).
- При размонтировании маска снимается.
:::

::: en
- The value is a mask, a pattern string, an array of patterns or [`createMask`](~/api/create-mask) options.
- If the value changes (another phone country), the mask is updated.
- On a wrapper it looks for an `<input>` inside — works with UI library fields and [`<TvField>`](@/tinyval-vue/api/components).
- The mask is removed on unmount.
:::

::: zh
- 值可以是掩码、模板字符串、模板数组或 [`createMask`](~/api/create-mask) 的选项。
- 如果值发生变化（例如切换电话国家），掩码会更新。
- 用在包裹元素上时会查找内部的 `<input>` —— 适用于 UI 组件库的字段和 [`<TvField>`](@/tinyval-vue/api/components)。
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
  <input v-model="tel" v-mask="phoneMask" inputmode="tel" />
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
