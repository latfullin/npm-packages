::: ru
Маски ввода без зависимостей: телефоны, банковские карты, даты, суммы, документы РФ и свои шаблоны.

- ~1 kB gzip для своего шаблона, ~1.6 kB с телефоном и привязкой к полю
- Курсор не прыгает, Backspace проходит через скобки и дефисы, вставка из буфера в любом формате
- Чистые функции `mask` / `unmask` работают и на сервере — например, чтобы привести телефоны к одному виду
- Директива `v-mask` для Vue
:::

::: en
Zero-dependency input masks: phones, bank cards, dates, amounts, documents and custom patterns.

- ~1 kB gzip for a custom pattern, ~1.6 kB with a phone mask and field binding
- The caret doesn't jump, Backspace goes through brackets and dashes, pasting works in any format
- Pure `mask` / `unmask` functions work on the server too — e.g. to normalize phone numbers
- A `v-mask` directive for Vue
:::

::: zh
零依赖的输入掩码：电话、银行卡、日期、金额、证件以及自定义模板。

- 自定义模板约 1 kB gzip，包含电话掩码和输入框绑定约 1.6 kB
- 光标不会跳动，Backspace 可以越过括号和短横线，可粘贴任意格式的内容
- 纯函数 `mask` / `unmask` 也可以在服务端使用 —— 例如统一电话号码格式
- 用于 Vue 的 `v-mask` 指令
:::

::: ru
## Установка
:::

::: en
## Install
:::

::: zh
## 安装
:::

```bash
npm install tinyval-mask
```

::: ru
## Попробовать
:::

::: en
## Try it
:::

::: zh
## 试一试
:::

<TinyvalMaskDemo />

::: ru
## Быстрый старт
:::

::: en
## Quick start
:::

::: zh
## 快速开始
:::

```ts
import { mask, unmask, attach } from 'tinyval-mask';
import { phone, card } from 'tinyval-mask/presets';

mask('89991234567', phone());          // '+7 (999) 123-45-67'
unmask('+7 (999) 123-45-67', phone()); // '79991234567'
mask('4276123456789012', card());      // '4276 1234 5678 9012'
mask('12ab34', '99-99');               // '12-34' — your own pattern

attach(document.querySelector('#phone'), phone()); // a mask on an <input>
```

```vue
<script setup lang="ts">
import { phone } from 'tinyval-mask/presets';
import { vMask } from 'tinyval-mask/vue';

const phoneMask = phone();
</script>

<template>
  <input v-model="form.phone" v-mask="phoneMask" />
</template>
```

::: ru
## Что почитать

- [Готовые маски](~/api/presets) — телефоны, карты, даты, документы, суммы
- [Шаблоны](~/guide/patterns) — свои маски: токены, необязательные части, несколько вариантов
- [Что возвращают маски](~/guide/values) — значение в поле, в `v-model` и в данных
- [Поле ввода](~/guide/browser) — как работает курсор, Backspace и вставка
- [Vue](~/guide/vue) — `v-mask`, `v-model`, tinyval-vue и UI-библиотеки
- [Маски и валидация](~/guide/validation) — проверка значения через [tinyval](@/tinyval/)
:::

::: en
## Further reading

- [Ready-made masks](~/api/presets) — phones, cards, dates, documents, amounts
- [Patterns](~/guide/patterns) — your own masks: tokens, optional parts, several variants
- [What masks return](~/guide/values) — the value in the field, in `v-model` and in data
- [Input field](~/guide/browser) — how the caret, Backspace and pasting work
- [Vue](~/guide/vue) — `v-mask`, `v-model`, tinyval-vue and UI libraries
- [Masks & validation](~/guide/validation) — validating the value with [tinyval](@/tinyval/)
:::

::: zh
## 延伸阅读

- [预设掩码](~/api/presets) —— 电话、银行卡、日期、证件、金额
- [模板](~/guide/patterns) —— 自定义掩码：令牌、可选部分、多个变体
- [掩码返回什么](~/guide/values) —— 输入框、`v-model` 和数据中的值
- [输入框](~/guide/browser) —— 光标、Backspace 和粘贴如何工作
- [Vue](~/guide/vue) —— `v-mask`、`v-model`、tinyval-vue 和 UI 组件库
- [掩码与校验](~/guide/validation) —— 使用 [tinyval](@/tinyval/) 校验值
:::
