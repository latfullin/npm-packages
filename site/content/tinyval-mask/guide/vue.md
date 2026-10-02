::: ru
Директива `v-mask` из `tinyval-mask/vue` вешает маску на поле. Сам Vue пакету не нужен: директива — обычный объект, Vue используется только для типов.
:::

::: en
The `v-mask` directive from `tinyval-mask/vue` puts a mask on a field. The package doesn't need Vue at runtime: the directive is a plain object, Vue is used only for types.
:::

::: zh
来自 `tinyval-mask/vue` 的 `v-mask` 指令可以把掩码绑定到字段上。该包运行时不依赖 Vue：指令只是一个普通对象，Vue 仅用于类型。
:::

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { phone, money } from 'tinyval-mask/presets';
import { vMask } from 'tinyval-mask/vue';

// create masks once, not inline in the template
const phoneMask = phone();
const moneyMask = money({ currency: '₽' });

const tel = ref('');
const amount = ref('');
</script>

<template>
  <input v-model="tel" v-mask="phoneMask" />
  <input v-model="amount" v-mask="moneyMask" inputmode="decimal" />
  <input v-mask="'99.99.9999'" />
</template>
```

::: ru
- В `v-model` попадает **отформатированное** значение: `+7 (999) 123-45-67`. Чистое значение — через [`unmask`](~/api/mask) или в схеме, см. [Маски и валидация](~/guide/validation).
- Маску создавайте в `<script>`: выражение вроде `v-mask="phone()"` создаёт новую маску при каждой перерисовке.
- Директиву можно повесить на обёртку — она найдёт `<input>` внутри. Так маска работает с полями UI-библиотек.
- Для глобальной регистрации: `app.directive('mask', vMask)`.
:::

::: en
- `v-model` gets the **formatted** value: `+7 (999) 123-45-67`. Get the clean value with [`unmask`](~/api/mask) or in the schema, see [Masks & validation](~/guide/validation).
- Create masks in `<script>`: an expression like `v-mask="phone()"` creates a new mask on every render.
- The directive can go on a wrapper — it finds the `<input>` inside. That's how masks work with UI library fields.
- Global registration: `app.directive('mask', vMask)`.
:::

::: zh
- `v-model` 得到的是**格式化后**的值：`+7 (999) 123-45-67`。可以通过 [`unmask`](~/api/mask) 或在 Schema 中获取纯值，见 [掩码与校验](~/guide/validation)。
- 请在 `<script>` 中创建掩码：像 `v-mask="phone()"` 这样的表达式会在每次渲染时创建新的掩码。
- 指令可以放在包裹元素上 —— 它会找到内部的 `<input>`。这样掩码就能用于 UI 组件库的字段。
- 全局注册：`app.directive('mask', vMask)`。
:::

::: ru
## С tinyval-vue

`v-mask` работает на [`<TvField>`](@/tinyval-vue/api/components) и на любом поле формы [tinyval-vue](@/tinyval-vue/):
:::

::: en
## With tinyval-vue

`v-mask` works on [`<TvField>`](@/tinyval-vue/api/components) and on any [tinyval-vue](@/tinyval-vue/) form field:
:::

::: zh
## 与 tinyval-vue 一起使用

`v-mask` 可以用于 [`<TvField>`](@/tinyval-vue/api/components) 以及任何 [tinyval-vue](@/tinyval-vue/) 表单字段：
:::

```vue
<script setup lang="ts">
import { object, string, pipe, preprocess, length } from 'tinyval';
import { useForm, TvForm, TvField, TvError } from 'tinyval-vue';
import { unmask } from 'tinyval-mask';
import { phone } from 'tinyval-mask/presets';
import { vMask } from 'tinyval-mask/vue';

const phoneMask = phone();

const Contact = object({
  phone: preprocess((v) => unmask(String(v ?? ''), phoneMask), pipe(string(), length(11))),
});

const form = useForm(Contact, { initial: { phone: '' } });
</script>

<template>
  <TvForm :form="form" @submit="(data) => api.post('/contacts', data)">
    <TvField name="phone" v-mask="phoneMask" inputmode="tel" />
    <TvError name="phone" />
  </TvForm>
</template>
```

::: ru
В поле — `+7 (999) 123-45-67`, в `data` при отправке — `79991234567`.

## UI-библиотеки
:::

::: en
The field shows `+7 (999) 123-45-67`, the submitted `data` has `79991234567`.

## UI libraries
:::

::: zh
字段中显示 `+7 (999) 123-45-67`，提交的 `data` 中为 `79991234567`。

## UI 组件库
:::

```vue
<el-input v-model="tel" v-mask="phoneMask" />
<v-text-field v-model="tel" v-mask="phoneMask" />
```

## @t(see)

::: ru
- [vMask](~/api/v-mask)
- [Маски и валидация](~/guide/validation)
:::

::: en
- [vMask](~/api/v-mask)
- [Masks & validation](~/guide/validation)
:::

::: zh
- [vMask](~/api/v-mask)
- [掩码与校验](~/guide/validation)
:::
